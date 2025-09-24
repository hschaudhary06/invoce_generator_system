"use client"

import { Button } from "@/components/ui/button"
import { Download, Sparkles } from "lucide-react"
import type { InvoiceData } from "@/app/page"
import { generatePDF } from "@/lib/pdf-generator"

interface InvoicePreviewProps {
  invoiceData: InvoiceData
}

export function InvoicePreview({ invoiceData }: InvoicePreviewProps) {
  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  // const taxAmount = subtotal * (invoiceData.taxRate / 100)
  // const total = subtotal + taxAmount

  const handleDownloadPDF = async () => {
    try {
      await generatePDF(invoiceData)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    }
  }

  return (
    <div className="space-y-6">
      {/* Preview Card */}
      <div className="bg-white border-2 border-rose-100 rounded-xl p-8 shadow-xl shadow-rose-100/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-rose-300 to-pink-300 rounded-full blur-2xl"></div>
          <div className="absolute bottom-8 left-8 w-16 h-16 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 right-1/3 w-12 h-12 bg-gradient-to-br from-rose-200 to-purple-200 rounded-full blur-lg"></div>
        </div>

        {/* Header with Enhanced Floral Design */}
        <div className="relative mb-8">
          <div className="absolute top-0 right-0 opacity-15">
            <svg width="140" height="140" viewBox="0 0 140 140" className="text-rose-400">
              <g>
                {/* Main flower */}
                <path
                  d="M70 30c-10 0-18 4-24 10-6-6-14-10-24-10-18 0-24 15-24 24 0 30 48 62 48 62s48-32 48-62c0-9-6-24-24-24z"
                  fill="currentColor"
                />
                {/* Petals */}
                <circle cx="45" cy="45" r="4" fill="currentColor" opacity="0.7" />
                <circle cx="95" cy="50" r="3" fill="currentColor" opacity="0.6" />
                <circle cx="80" cy="35" r="3.5" fill="currentColor" opacity="0.8" />
                <circle cx="60" cy="25" r="2.5" fill="currentColor" opacity="0.5" />
                {/* Leaves */}
                <ellipse cx="25" cy="65" rx="8" ry="4" fill="currentColor" opacity="0.4" transform="rotate(45 25 65)" />
                <ellipse
                  cx="115"
                  cy="70"
                  rx="6"
                  ry="3"
                  fill="currentColor"
                  opacity="0.3"
                  transform="rotate(-30 115 70)"
                />
              </g>
            </svg>
          </div>

          <div className="flex justify-between items-start relative z-10">
            <div>
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full mr-3 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  {invoiceData.businessName}
                </h1>
              </div>
              <div className="text-sm text-gray-600 whitespace-pre-line ml-11">{invoiceData.businessAddress}</div>
              <div className="text-sm text-gray-600 mt-1 ml-11">
                {invoiceData.businessPhone} • {invoiceData.businessEmail}
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-800">INVOICE</h2>
              <div className="text-sm text-gray-500 mt-1">#{invoiceData.invoiceNumber}</div>
              <div className="w-16 h-0.5 bg-gradient-to-r from-rose-400 to-pink-400 mt-2 ml-auto"></div>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-3">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-2"></div>
              <h3 className="font-semibold text-gray-800">Bill To:</h3>
            </div>
            <div className="text-sm ml-6">
              <div className="font-medium text-gray-800">{invoiceData.clientName}</div>
              <div className="text-gray-600 whitespace-pre-line mt-1">{invoiceData.clientAddress}</div>
              <div className="text-gray-600 mt-1">{invoiceData.clientPhone}</div>
              <div className="text-gray-600">{invoiceData.clientEmail}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="space-y-2 text-sm">
              <div className="flex justify-end items-center">
                <span className="text-gray-500 mr-2">Date:</span>
                <span className="text-gray-800 font-medium">{new Date(invoiceData.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-end items-center">
                <span className="text-gray-500 mr-2">Due Date:</span>
                <span className="text-gray-800 font-medium">{new Date(invoiceData.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        {invoiceData.items.length > 0 && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 mb-4">
              <div className="flex items-center mb-2">
                <svg className="w-4 h-4 text-rose-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                <span className="font-semibold text-rose-800">Perfume Collection</span>
              </div>
            </div>

            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-rose-100">
                  <th className="text-left py-4 text-sm font-semibold text-gray-800">Item</th>
                  <th className="text-center py-4 text-sm font-semibold text-gray-800">Qty</th>
                  <th className="text-right py-4 text-sm font-semibold text-gray-800">Price</th>
                  <th className="text-right py-4 text-sm font-semibold text-gray-800">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`${index % 2 === 0 ? "bg-rose-50/30" : "bg-white"} hover:bg-rose-50/50 transition-colors`}
                  >
                    <td className="py-4">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full mr-3"></div>
                        <div>
                          <div className="font-medium text-gray-800">{item.name}</div>
                          <div className="text-sm text-gray-600">{item.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-4 text-gray-800 font-medium">{item.quantity}</td>
                    <td className="text-right py-4 text-gray-800">₹{item.price.toFixed(2)}</td>
                    <td className="text-right py-4 text-gray-800 font-semibold">
                      ₹{(item.quantity * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-72 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-6 border border-rose-100">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-800 font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              {/* <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax ({invoiceData.taxRate}%):</span>
                <span className="text-gray-800 font-medium">₹{taxAmount.toFixed(2)}</span>
              </div> */}
              <div className="border-t-2 border-rose-200 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Total:</span>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full mr-2"></div>
                    <span className="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                      ₹{subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoiceData.notes && (
          <div className="border-t-2 border-rose-100 pt-6">
            <div className="flex items-center mb-3">
              <svg className="w-4 h-4 text-rose-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="font-semibold text-gray-800">Notes:</h3>
            </div>
            <p className="text-sm text-gray-600 whitespace-pre-line ml-6">{invoiceData.notes}</p>
          </div>
        )}

        {/* Footer with Enhanced Floral Elements */}
        <div className="mt-8 pt-6 border-t-2 border-rose-100 relative">
          <div className="absolute bottom-0 left-0 right-0 opacity-10">
            <svg width="100%" height="50" viewBox="0 0 400 50" className="text-rose-300">
              <path
                d="M0 25c20-15 40-15 60 0 20-15 40-15 60 0 20-15 40-15 60 0 20-15 40-15 60 0 20-15 40-15 60 0 20-15 40-15 60 0"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="60" cy="20" r="2" fill="currentColor" />
              <circle cx="140" cy="20" r="1.5" fill="currentColor" />
              <circle cx="220" cy="20" r="2" fill="currentColor" />
              <circle cx="300" cy="20" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <div className="text-center text-sm text-gray-500 relative z-10">
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full mr-2"></div>
              <span>Thank you for choosing {invoiceData.businessName}</span>
              <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full ml-2"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={handleDownloadPDF}
          className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg shadow-rose-200"
          disabled={invoiceData.items.length === 0}
          size="lg"
        >
          <Download className="w-5 h-5 mr-2" />
          Download Beautiful PDF
        </Button>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-rose-50 p-6 rounded-xl border border-purple-100">
        <div className="flex items-center mb-3">
          <Sparkles className="w-5 h-5 text-purple-500 mr-2" />
          <h3 className="font-semibold text-purple-800">Invoice Summary</h3>
        </div>
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-2"></div>
            <span className="text-purple-600">Items: </span>
            <span className="text-purple-800 font-semibold ml-1">{invoiceData.items.length}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full mr-2"></div>
            <span className="text-purple-600">Total Amount: </span>
            <span className="text-purple-800 font-bold ml-1">₹{subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
