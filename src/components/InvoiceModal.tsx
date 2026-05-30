/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { Printer, X, Download, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { Order } from '../lib/models';

interface InvoiceModalProps {
  order: Order;
  onClose: () => void;
}

export default function InvoiceModal({ order, onClose }: InvoiceModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML;
    const windowUrl = 'about:blank';
    const uniqueName = new Date().getTime();
    const windowName = `Print_${uniqueName}`;
    const prtWindow = window.open(windowUrl, windowName, 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    
    if (prtWindow) {
      prtWindow.document.write(`
        <html>
          <head>
            <title>Invoice Receipt ${order.id}</title>
            <style>
              body { font-family: 'Courier New', Courier, monospace; color: #1e293b; padding: 20px; text-transform: uppercase; }
              .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 15px; margin-bottom: 15px; }
              .title { font-size: 20px; font-weight: bold; letter-spacing: 2px; }
              .meta-table, .items-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
              .items-table th, .items-table td { border-bottom: 1px dashed #000; padding: 8px; text-align: left; }
              .totals { text-align: right; margin-top: 20px; font-weight: bold; }
              .alert-paid { color: #16a34a; border: 1px solid #16a34a; display: inline-block; padding: 5px 10px; font-size: 14px; margin-top: 10px; }
              .alert-due { color: #dc2626; border: 1px dashed #dc2626; display: inline-block; padding: 5px 10px; font-size: 14px; margin-top: 10px; }
              .footer { text-align: center; margin-top: 40px; font-size: 11px; color: #64748b; }
            </style>
          </head>
          <body>
            ${printContent}
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() { window.close(); }, 500);
              }
            </script>
          </body>
        </html>
      `);
      prtWindow.document.close();
      prtWindow.focus();
    } else {
      alert("Popup blocker active! Please enable popups or use standard print screens.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 z-[999] p-4 transition-all duration-200 backdrop-blur-xs font-sans">
      <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full shadow-2xl flex flex-col max-h-[90vh]">
         
        {/* Modal Toolbar */}
        <div className="flex justify-between items-center bg-slate-50 px-4 py-3 border-b border-slate-200 rounded-t-xl">
          <span className="text-xs font-mono font-bold text-slate-700 flex items-center space-x-2">
            <span className="font-sans px-2.5 py-1 bg-blue-50 text-blue-605 text-blue-600 rounded bg-blue-50 border border-blue-100 text-[10px]">TRANSACTION INVOICE LEDGER</span>
            <span className="text-slate-300">/</span>
            <span className="font-bold text-slate-800">{order.id}</span>
          </span>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-505 hover:bg-blue-500 text-white rounded-lg text-xs font-extrabold transition flex items-center space-x-1.5 cursor-pointer shadow-sm"
            >
              <Printer size={13} />
              <span>Print Invoice</span>
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-800 transition cursor-pointer"
              title="Close Panel"
            >
              <X size={16} />
            </button>
          </div>
        </div>
 
        {/* Invoice Page Visualizer inside Modal */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100 font-mono text-xs text-slate-600">
          
          {/* Printable container start */}
          <div 
            ref={printRef} 
            className="bg-white text-slate-900 p-6 rounded-lg border border-slate-200 shadow-sm mx-auto" 
            style={{ maxWidth: '440px', fontFamily: 'Courier New, monospace' }}
          >
            <div className="text-center border-b-2 border-dashed border-slate-400 pb-4 mb-4">
              <h2 className="text-lg font-bold tracking-widest text-slate-900 uppercase">
                ENTERPRISE ERP CORP
              </h2>
              <p className="text-[10px] text-slate-500 mt-0.5 uppercase">
                High Performance Business Systems
              </p>
              <p className="text-[9px] text-slate-400 mt-0.5">
                Reg No: TS-2026-991A // Tel: +1 (555) 505-1212
              </p>
            </div>

            {/* Meta Parameters */}
            <div className="space-y-1 mb-4 pb-4 border-b border-dashed border-slate-300 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">INVOICE NO:</span>
                <span className="font-bold">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ORDER DATE:</span>
                <span>{order.date.toLocaleDateString()} {order.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">BILLED TO:</span>
                <span className="font-bold text-right">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">CLIENT TAX ID:</span>
                <span>TX-{order.customerId}</span>
              </div>
            </div>

            {/* Ordered Item Information */}
            <div className="mb-4">
              <table className="w-full text-left text-[11px] border-b border-dashed border-slate-300">
                <thead>
                  <tr className="border-b border-slate-300 font-bold">
                    <th className="pb-1">ITEM DESCRIPTION</th>
                    <th className="pb-1 text-center">QTY</th>
                    <th className="pb-1 text-right">UNIT</th>
                    <th className="pb-1 text-right">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2.5 max-w-[140px] truncate">{order.productName}</td>
                    <td className="text-center py-2.5">{order.quantity}</td>
                    <td className="text-right py-2.5">৳{order.pricePerUnit.toFixed(2)}</td>
                    <td className="text-right py-2.5 font-bold">৳{order.totalAmount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Grand Total, Pay and Due matrix */}
            <div className="space-y-1.5 text-right font-bold text-[11px] mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500 font-normal">GROSS TOTAL:</span>
                <span>৳{order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span className="font-normal text-slate-500">CASH PAID:</span>
                <span>-৳{order.paidAmount.toFixed(2)}</span>
              </div>
              <div className={`flex justify-between border-t border-slate-900 pt-1.5 text-xs ${order.dueAmount > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                <span>OUTSTANDING DUE:</span>
                <span>৳{order.dueAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Visual Stamp Status */}
            <div className="text-center mt-6">
              {order.dueAmount === 0 ? (
                <div className="inline-block border-2 border-emerald-600 rounded px-3 py-1 font-extrabold text-[12px] text-emerald-600 tracking-wider">
                  ★★★ PAID IN FULL ★★★
                </div>
              ) : (
                <div className="inline-block border-2 border-dashed border-red-600 rounded px-3 py-1 font-extrabold text-[12px] text-red-600 tracking-wider">
                  ⚠️ NOTIFICATION: DUE BALANCE
                </div>
              )}
            </div>

            {/* Disclaimer & Footer */}
            <div className="text-center mt-6 pt-4 border-t border-dashed border-slate-300 text-[9px] text-slate-400 space-y-1 leading-normal">
              <p>Thank you for your business!</p>
              <p>Computers processed invoice signature verified.</p>
              <p className="font-bold text-slate-500">OPERATOR: SECURE ERP MACHINE</p>
            </div>
          </div>
          {/* Printable container end */}

        </div>

        {/* Close Button Footer */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 rounded-b-xl flex justify-end text-xs">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-bold transition cursor-pointer font-sans"
          >
            Collapse View
          </button>
        </div>

      </div>
    </div>
  );
}
