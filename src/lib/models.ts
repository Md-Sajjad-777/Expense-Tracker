/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export abstract class Entity {
  protected _id: string;
  protected _createdAt: Date;

  constructor(id: string, createdAt: Date = new Date()) {
    this._id = id;
    this._createdAt = createdAt;
  }

  get id(): string { return this._id; }
  get createdAt(): Date { return this._createdAt; }
}

export class Customer extends Entity {
  private _name: string;
  private _phone: string;
  private _address: string;

  constructor(id: string, name: string, phone: string, address: string, createdAt?: Date) {
    super(id, createdAt || new Date());
    this._name = name;
    this._phone = phone;
    this._address = address;
  }

  get name(): string { return this._name; }
  set name(value: string) {
    if (!value.trim()) throw new Error("Customer name cannot be empty");
    this._name = value.trim();
  }

  get phone(): string { return this._phone; }
  set phone(value: string) {
    if (!value.trim()) throw new Error("Phone number cannot be empty");
    this._phone = value.trim();
  }

  get address(): string { return this._address; }
  set address(value: string) {
    this._address = value.trim();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      phone: this.phone,
      address: this.address,
      createdAt: this.createdAt.toISOString()
    };
  }
}

export class Product extends Entity {
  private _name: string;
  private _quantity: number; // Stock level
  private _price: number;    // Selling price
  private _cost: number;     // Buying/cost price

  constructor(id: string, name: string, quantity: number, price: number, cost: number, createdAt?: Date) {
    super(id, createdAt || new Date());
    this._name = name;
    this._quantity = quantity;
    this._price = price;
    this._cost = cost;
  }

  get name(): string { return this._name; }
  set name(value: string) {
    if (!value.trim()) throw new Error("Product name cannot be empty");
    this._name = value.trim();
  }

  get quantity(): number { return this._quantity; }
  set quantity(value: number) {
    if (value < 0) throw new Error("Stock quantity cannot be negative");
    this._quantity = value;
  }

  get price(): number { return this._price; }
  set price(value: number) {
    if (value < 0) throw new Error("Selling price cannot be negative");
    this._price = value;
  }

  get cost(): number { return this._cost; }
  set cost(value: number) {
    if (value < 0) throw new Error("Cost price cannot be negative");
    this._cost = value;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      quantity: this.quantity,
      price: this.price,
      cost: this.cost,
      createdAt: this.createdAt.toISOString()
    };
  }
}

export class Order extends Entity {
  private _customerId: string;
  private _customerName: string;
  private _productId: string;
  private _productName: string;
  private _quantity: number;
  private _pricePerUnit: number;
  private _costPerUnit: number;
  private _totalAmount: number;
  private _paidAmount: number;
  private _dueAmount: number;
  private _date: Date;

  constructor(
    id: string,
    customerId: string,
    customerName: string,
    productId: string,
    productName: string,
    quantity: number,
    pricePerUnit: number,
    costPerUnit: number,
    paidAmount: number,
    date: Date = new Date(),
    createdAt?: Date
  ) {
    super(id, createdAt || new Date());
    this._customerId = customerId;
    this._customerName = customerName;
    this._productId = productId;
    this._productName = productName;
    this._quantity = quantity;
    this._pricePerUnit = pricePerUnit;
    this._costPerUnit = costPerUnit;
    this._totalAmount = quantity * pricePerUnit;
    this._paidAmount = Math.min(paidAmount, this._totalAmount);
    this._dueAmount = this._totalAmount - this._paidAmount;
    this._date = date;
  }

  get customerId(): string { return this._customerId; }
  get customerName(): string { return this._customerName; }
  get productId(): string { return this._productId; }
  get productName(): string { return this._productName; }
  get quantity(): number { return this._quantity; }
  get pricePerUnit(): number { return this._pricePerUnit; }
  get costPerUnit(): number { return this._costPerUnit; }
  get totalAmount(): number { return this._totalAmount; }
  
  get paidAmount(): number { return this._paidAmount; }
  set paidAmount(value: number) {
    if (value < 0) throw new Error("Paid amount cannot be negative");
    if (value > this._totalAmount) throw new Error("Paid amount cannot exceed total sale amount");
    this._paidAmount = value;
    this._dueAmount = this._totalAmount - value;
  }

  get dueAmount(): number { return this._dueAmount; }
  get date(): Date { return this._date; }

  // Encapsulated Business Formulas
  get profit(): number {
    return this._totalAmount - (this._quantity * this._costPerUnit);
  }

  toJSON() {
    return {
      id: this.id,
      customerId: this.customerId,
      customerName: this.customerName,
      productId: this.productId,
      productName: this.productName,
      quantity: this.quantity,
      pricePerUnit: this.pricePerUnit,
      costPerUnit: this.costPerUnit,
      totalAmount: this.totalAmount,
      paidAmount: this.paidAmount,
      dueAmount: this.dueAmount,
      date: this.date.toISOString(),
      createdAt: this.createdAt.toISOString()
    };
  }
}

export class Expense extends Entity {
  private _category: string;
  private _description: string;
  private _amount: number;
  private _date: Date;

  constructor(id: string, category: string, description: string, amount: number, date: Date = new Date(), createdAt?: Date) {
    super(id, createdAt || new Date());
    this._category = category;
    this._description = description;
    this._amount = amount;
    this._date = date;
  }

  get category(): string { return this._category; }
  set category(value: string) {
    if (!value.trim()) throw new Error("Category cannot be empty");
    this._category = value.trim();
  }

  get description(): string { return this._description; }
  set description(value: string) {
    this._description = value.trim();
  }

  get amount(): number { return this._amount; }
  set amount(value: number) {
    if (value < 0) throw new Error("Expense amount cannot be negative");
    this._amount = value;
  }

  get date(): Date { return this._date; }
  set date(value: Date) {
    this._date = value;
  }

  toJSON() {
    return {
      id: this.id,
      category: this.category,
      description: this.description,
      amount: this.amount,
      date: this.date.toISOString(),
      createdAt: this.createdAt.toISOString()
    };
  }
}

// Polymorphism via Report Generation Base Class
export abstract class Report {
  abstract generate(data: {
    customers: Customer[];
    products: Product[];
    orders: Order[];
    expenses: Expense[];
  }): any;
}

export class FinancialSummaryReport extends Report {
  generate(data: {
    customers: Customer[];
    products: Product[];
    orders: Order[];
    expenses: Expense[];
  }) {
    const totalSales = data.orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalPaid = data.orders.reduce((sum, o) => sum + o.paidAmount, 0);
    const totalDue = data.orders.reduce((sum, o) => sum + o.dueAmount, 0);
    const totalSalesCost = data.orders.reduce((sum, o) => sum + o.quantity * o.costPerUnit, 0);
    const totalExpenses = data.expenses.reduce((sum, e) => sum + e.amount, 0);
    const grossProfitVal = totalSales - totalSalesCost;
    const netProfitVal = grossProfitVal - totalExpenses;

    return {
      totalSales,
      totalPaid,
      totalDue,
      totalSalesCost,
      totalExpenses,
      grossProfit: grossProfitVal,
      netProfit: netProfitVal
    };
  }
}

export class CustomerAnalyticsReport extends Report {
  generate(data: {
    customers: Customer[];
    products: Product[];
    orders: Order[];
    expenses: Expense[];
  }) {
    const customerMap = new Map<string, {
      id: string;
      name: string;
      phone: string;
      totalSpent: number;
      totalPaid: number;
      totalDue: number;
      itemsCount: number;
    }>();

    // Initialize all customers
    data.customers.forEach(v => {
      customerMap.set(v.id, {
        id: v.id,
        name: v.name,
        phone: v.phone,
        totalSpent: 0,
        totalPaid: 0,
        totalDue: 0,
        itemsCount: 0
      });
    });

    // Aggregate orders
    data.orders.forEach(o => {
      const entry = customerMap.get(o.customerId) || {
        id: o.customerId,
        name: o.customerName,
        phone: '',
        totalSpent: 0,
        totalPaid: 0,
        totalDue: 0,
        itemsCount: 0
      };
      entry.totalSpent += o.totalAmount;
      entry.totalPaid += o.paidAmount;
      entry.totalDue += o.dueAmount;
      entry.itemsCount += o.quantity;
      customerMap.set(o.customerId, entry);
    });

    return Array.from(customerMap.values());
  }
}

export class InventoryReport extends Report {
  generate(data: {
    customers: Customer[];
    products: Product[];
    orders: Order[];
    expenses: Expense[];
  }) {
    return data.products.map(p => {
      const productSales = data.orders.filter(o => o.productId === p.id);
      const unitsSold = productSales.reduce((s, o) => s + o.quantity, 0);
      const totalRevenue = productSales.reduce((s, o) => s + o.totalAmount, 0);

      return {
        id: p.id,
        name: p.name,
        currentStock: p.quantity,
        unitsSold,
        totalRevenue,
        stockStatus: p.quantity === 0 ? "Out of Stock" : p.quantity <= 5 ? "Low Stock" : "In Stock"
      };
    });
  }
}
