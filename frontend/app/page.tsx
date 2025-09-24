"use client"

import { useEffect, useState } from "react"
import { InvoiceForm } from "@/components/invoice-form"
import { InvoicePreview } from "@/components/invoice-preview"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { invoiceStorage } from "@/lib/invoice-storage"
import { BarChart3 } from "lucide-react"


export interface InvoiceItem {
  id: string
  name: string
  description: string
  quantity: number
  price: number
}

export interface InvoiceData {
  invoiceNumber: any
  date: string
  dueDate: string
  businessName: string
  businessAddress: string
  businessPhone: string
  businessEmail: string
  clientName: string
  clientAddress: string
  clientPhone: string
  clientEmail: string 
  items: InvoiceItem[]
  notes: string
  taxRate: number
}




export default function InvoiceGenerator() {

  const [lastInvoiceNum, setLastInvoiceNum] = useState(String);

  useEffect(() => {
    if (lastInvoiceNum) {
      setInvoiceData(prev => ({ ...prev, invoiceNumber: lastInvoiceNum }));
    }
  }, [lastInvoiceNum]);

  useEffect(() => {
      getInvoiceNumber();
  }, [])

  

  const getInvoiceNumber = async () => {
  
    try {
      
      const data = await invoiceStorage.getInvoiceNumber();

      const numPart = data.split("-")[1];
      const nextInvoice = parseInt(numPart, 10) + 1;
      const nextInvoicePadded = String(nextInvoice).padStart(3, '0');

      const finalNextInvoice = 'INV-'+nextInvoicePadded;

      setLastInvoiceNum(finalNextInvoice);

    } catch (e) {
      console.error("Error loading customers:", e);
    }   
  }

  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: lastInvoiceNum,
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    businessName: "Nazaf Parfumerie",
    businessAddress: "Near Marigold restaturant, Ahmedabad, 382350",
    businessPhone: "+91 95373 23720",
    businessEmail: "nazafparfumerie@gmail.com",
    clientName: "",
    clientAddress: "",
    clientPhone: "",
    clientEmail: "",
    items: [],
    notes: "Thank you for your business! Payment is due within 30 days.",
    taxRate: 20,
  })

  const saveInvoice = async () => {
    if (!invoiceData.clientName || !invoiceData.clientPhone || invoiceData.items.length === 0) {
      alert("Please fill in client information and add at least one item before saving.")
      return
    }

    // Save or find customer
    let customer = await invoiceStorage.getCustomerById(invoiceData.clientPhone);

    if (customer.length == 0) {
      customer = invoiceStorage.saveCustomer({
        name: invoiceData.clientName,
        email: invoiceData.clientEmail,
        phone: invoiceData.clientPhone,
        address: invoiceData.clientAddress,
      })
    }

    // Calculate totals
    const subtotal = invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
    const total = subtotal

    // Save invoice
    const savedInvoice = invoiceStorage.saveInvoice({
      invoiceNumber: invoiceData.invoiceNumber,
      customerId: customer._id,
      items: invoiceData.items.map((item) => ({
        name : item.name,
        description: item.description,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price,
      })),
      total,
      date: invoiceData.date,
      dueDate: invoiceData.dueDate,
      notes: invoiceData.notes,
      paymentStatus: "pending",
    })

    alert(`Invoice ${invoiceData.invoiceNumber} saved successfully!`)

    // Generate new invoice number for next invoice
    setInvoiceData((prev) => ({
      ...prev,
      invoiceNumber: `INV-${Date.now()}`,
      clientName: "",
      clientAddress: "",
      clientPhone: "",
      clientEmail: "",
      items: [],
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
      
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-rose-200 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200 rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 left-1/4 w-28 h-28 bg-pink-200 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto p-6 grid">
        <div className="flex justify-end mb-4">
          <Button
            onClick={() => (window.location.href = "/dashboard")}
            variant="outline"
            className="border-rose-200 text-rose-600 hover:bg-rose-50"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            View Dashboard
          </Button>
        </div>

        <div className="text-center mb-12 justify-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full mr-3 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-rose-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Nazaf Parfumerie
            </h1>
            <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full ml-3 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <p className="text-gray-600 text-xl font-light tracking-wide">
            Create exquisite invoices for your luxury fragrance collection
          </p>
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-rose-300 rounded-full"></div>
              <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
              <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="p-8 bg-white/80 backdrop-blur-sm border-rose-100 shadow-xl shadow-rose-100/20">
            <div className="flex items-center mb-6">
              <div className="w-6 h-6 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full mr-3 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Invoice Details</h2>
            </div>
            <InvoiceForm invoiceData={invoiceData} setInvoiceData={setInvoiceData} />

            <div className="mt-6 pt-6 border-t border-rose-100">
              <Button
                onClick={saveInvoice}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold"
                size="lg"
              >
                Save Invoice & Customer Data
              </Button>
            </div>
          </Card>

          <Card className="p-8 bg-white/80 backdrop-blur-sm border-purple-100 shadow-xl shadow-purple-100/20">
            <div className="flex items-center mb-6">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-3 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Preview & Download</h2>
            </div>
            <InvoicePreview invoiceData={invoiceData} />
          </Card>
        </div>
      </div>
    </div>
  )
}
