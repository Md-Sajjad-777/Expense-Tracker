/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Customer, Product, Order, Expense } from './models';

const STORAGE_KEY = 'sales_expense_db';

export interface DatabaseBackup {
  version: string;
  timestamp: string;
  customers: any[];
  products: any[];
  orders: any[];
  expenses: any[];
}

export class Database {
  private _customers: Customer[] = [];
  private _products: Product[] = [];
  private _orders: Order[] = [];
  private _expenses: Expense[] = [];

  constructor() {
    this.loadFromStorage();
  }

  // --- Persistence Handlers ---
  private loadFromStorage() {
    try {
      // Clear legacy storage containing dummy seed data
      const cleaned = localStorage.getItem('erp_dummy_cleaned_v2');
      if (!cleaned) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem('erp_dummy_cleaned_v2', 'true');
      }

      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const decoded = JSON.parse(stored);
        this.deserialize(decoded);
      } else {
        this.loadSeedData();
        this.save();
      }
    } catch (error) {
      console.error("Database reading error (resetting safety defaults):", error);
      this.loadSeedData();
      this.save();
    }
  }

  public save() {
    try {
      const stateObject = {
        customers: this._customers.map(c => c.toJSON()),
        products: this._products.map(p => p.toJSON()),
        orders: this._orders.map(o => o.toJSON()),
        expenses: this._expenses.map(e => e.toJSON()),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateObject));
    } catch (err) {
      throw new Error(`Critical Database Write failure: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  private deserialize(data: any) {
    this._customers = (data.customers || []).map((c: any) => 
      new Customer(c.id, c.name, c.phone, c.address, new Date(c.createdAt))
    );
    this._products = (data.products || []).map((p: any) => 
      new Product(p.id, p.name, p.quantity, p.price, p.cost, new Date(p.createdAt))
    );
    this._orders = (data.orders || []).map((o: any) => 
      new Order(
        o.id,
        o.customerId,
        o.customerName,
        o.productId,
        o.productName,
        o.quantity,
        o.pricePerUnit,
        o.costPerUnit || (o.pricePerUnit * 0.45), // fallback if cost wasn't specified
        o.paidAmount,
        new Date(o.date),
        new Date(o.createdAt)
      )
    );
    this._expenses = (data.expenses || []).map((e: any) => 
      new Expense(e.id, e.category, e.description, e.amount, new Date(e.date), new Date(e.createdAt))
    );
  }

  private loadSeedData() {
    this._customers = [];
    this._products = [];
    this._expenses = [];
    this._orders = [];
  }

  // --- Getters ---
  get customers(): Customer[] { return [...this._customers]; }
  get products(): Product[] { return [...this._products]; }
  get orders(): Order[] { return [...this._orders]; }
  get expenses(): Expense[] { return [...this._expenses]; }

  // --- Customer Operations ---
  public addCustomer(name: string, phone: string, address: string): Customer {
    if (!name.trim()) throw new Error("Validation Error: Customer name is required.");
    if (!phone.trim()) throw new Error("Validation Error: Phone number is required.");
    
    // Generate auto-incremented Key like standard Database index
    const nextNum = this._customers.length > 0 
      ? Math.max(...this._customers.map(c => parseInt(c.id.split('-')[1]) || 0)) + 1 
      : 1;
    const paddedId = `CUST-${String(nextNum).padStart(3, '0')}`;

    const newCust = new Customer(paddedId, name, phone, address);
    this._customers.push(newCust);
    this.save();
    return newCust;
  }

  public updateCustomer(id: string, name: string, phone: string, address: string): Customer {
    const cust = this._customers.find(c => c.id === id);
    if (!cust) throw new Error(`Exception: Customer details record '${id}' not found.`);
    
    cust.name = name;
    cust.phone = phone;
    cust.address = address;
    
    this.save();
    return cust;
  }

  public deleteCustomer(id: string) {
    const index = this._customers.findIndex(c => c.id === id);
    if (index === -1) throw new Error(`Exception: Customer record '${id}' not found.`);
    
    // Check foreign key dependencies (Standard Database Integrity Rule)
    const hasOrders = this._orders.some(o => o.customerId === id);
    if (hasOrders) {
      throw new Error("Business Integrity Error: Cannot delete a customer records that has associated invoice orders.");
    }

    this._customers.splice(index, 1);
    this.save();
  }

  // --- Product Operations ---
  public addProduct(name: string, quantity: number, price: number, cost: number): Product {
    if (!name.trim()) throw new Error("Validation Error: Product title cannot be blank.");
    if (quantity < 0) throw new Error("Validation Error: Initial Stock quantity cannot be negative.");
    if (price < 0) throw new Error("Validation Error: Sale unit price cannot be negative.");
    if (cost < 0) throw new Error("Validation Error: Direct cost price cannot be negative.");
    if (cost > price) {
      console.warn("Pricing Alert: Item cost price is structurally higher than retail selling price.");
    }

    const nextNum = this._products.length > 0
      ? Math.max(...this._products.map(p => parseInt(p.id.split('-')[1]) || 0)) + 1
      : 1;
    const paddedId = `PROD-${String(nextNum).padStart(3, '0')}`;

    const newProd = new Product(paddedId, name, quantity, price, cost);
    this._products.push(newProd);
    this.save();
    return newProd;
  }

  public updateProduct(id: string, name: string, quantity: number, price: number, cost: number): Product {
    const prod = this._products.find(p => p.id === id);
    if (!prod) throw new Error(`Exception: Product record '${id}' does not exist.`);
    
    prod.name = name;
    prod.quantity = quantity;
    prod.price = price;
    prod.cost = cost;

    this.save();
    return prod;
  }

  public deleteProduct(id: string) {
    const index = this._products.findIndex(p => p.id === id);
    if (index === -1) throw new Error(`Exception: Product record '${id}' does not exist.`);

    // Cascade dependency check
    const hasOrders = this._orders.some(o => o.productId === id);
    if (hasOrders) {
      throw new Error("Business Integrity Error: Refusing database deletion. This product is bound to historic order ledger invoices.");
    }

    this._products.splice(index, 1);
    this.save();
  }

  // --- Sales Order Operations ---
  public placeOrder(customerId: string, productId: string, quantity: number, paidAmount: number, orderDate: Date = new Date()): Order {
    // Assert existence & stock limits
    const customer = this._customers.find(c => c.id === customerId);
    if (!customer) throw new Error("Exception Assertion: Selected customer record is no longer in active registers.");

    const product = this._products.find(p => p.id === productId);
    if (!product) throw new Error("Exception Assertion: Selected stock product has been removed.");

    if (quantity <= 0) throw new Error("Validation Error: Purchase sell count must be at least 1 unit.");
    if (product.quantity < quantity) {
      throw new Error(`Out of Stock Failure: Requested ${quantity} units of '${product.name}', but only ${product.quantity} are stock-available.`);
    }

    // Deduct stock (Automatic Transaction Cascade)
    product.quantity -= quantity;

    const nextNum = this._orders.length > 0
      ? Math.max(...this._orders.map(o => parseInt(o.id.split('-')[1]) || 0)) + 1
      : 1;
    const paddedId = `ORD-${String(nextNum).padStart(3, '0')}`;

    const newOrder = new Order(
      paddedId,
      customer.id,
      customer.name,
      product.id,
      product.name,
      quantity,
      product.price,
      product.cost,
      paidAmount,
      orderDate
    );

    this._orders.push(newOrder);
    this.save();
    return newOrder;
  }

  public deleteOrder(id: string) {
    const orderIndex = this._orders.findIndex(o => o.id === id);
    if (orderIndex === -1) throw new Error(`Exception: Order index record '${id}' not found in active transaction columns.`);

    // Restore stock inventory upon order cancellation (Automatic Cascade reversal)
    const order = this._orders[orderIndex];
    const product = this._products.find(p => p.id === order.productId);
    if (product) {
      product.quantity += order.quantity; // return inventory back
    }

    this._orders.splice(orderIndex, 1);
    this.save();
  }

  public recordPayment(orderId: string, additionalPayment: number) {
    const order = this._orders.find(o => o.id === orderId);
    if (!order) throw new Error(`Exception: Order invoice record '${orderId}' not found.`);

    if (additionalPayment < 0) throw new Error("Validation Error: Incoming payment cannot be negative.");
    
    const newTotalPaid = order.paidAmount + additionalPayment;
    if (newTotalPaid > order.totalAmount) {
      throw new Error(`Overage Error: Deposited amount would exceed the total remaining balance due ($${order.dueAmount.toFixed(2)}).`);
    }

    order.paidAmount = newTotalPaid;
    this.save();
    return order;
  }

  // --- Expenses Tracker ---
  public addExpense(category: string, description: string, amount: number, date: Date = new Date()): Expense {
    if (!category.trim()) throw new Error("Validation Error: Expense ledger category requires a label.");
    if (amount <= 0) throw new Error("Validation Error: Spent expense value must exceed zero.");

    const nextNum = this._expenses.length > 0
      ? Math.max(...this._expenses.map(e => parseInt(e.id.split('-')[1]) || 0)) + 1
      : 1;
    const paddedId = `EXP-${String(nextNum).padStart(3, '0')}`;

    const newExp = new Expense(paddedId, category, description, amount, date);
    this._expenses.push(newExp);
    this.save();
    return newExp;
  }

  public deleteExpense(id: string) {
    const index = this._expenses.findIndex(e => e.id === id);
    if (index === -1) throw new Error(`Exception: Expense entry '${id}' not listed in database records.`);

    this._expenses.splice(index, 1);
    this.save();
  }

  // --- Database Portability (Backups & Restores) ---
  public generateBackup(): string {
    const backup: DatabaseBackup = {
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      customers: this._customers.map(c => c.toJSON()),
      products: this._products.map(p => p.toJSON()),
      orders: this._orders.map(o => o.toJSON()),
      expenses: this._expenses.map(e => e.toJSON()),
    };
    return JSON.stringify(backup, null, 2);
  }

  public restoreBackup(jsonString: string) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.customers || !parsed.products || !parsed.orders || !parsed.expenses) {
        throw new Error("Invalid schema: Essential document matrices are missing in file backup.");
      }
      this.deserialize(parsed);
      this.save();
    } catch (e) {
      throw new Error(`Database Restoration Fail: ${e instanceof Error ? e.message : "Unrecognized backup file markup"}`);
    }
  }

  public purgeAll() {
    this._customers = [];
    this._products = [];
    this._orders = [];
    this._expenses = [];
    this.save();
  }
}

// Singleton Engine Instance
export const db = new Database();
