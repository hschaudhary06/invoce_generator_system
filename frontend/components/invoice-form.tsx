"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Trash2, Plus, Sparkles, User } from "lucide-react"
import type { InvoiceData, InvoiceItem } from "@/app/page"
import { invoiceStorage} from "@/lib/invoice-storage"

interface InvoiceFormProps {
  invoiceData: InvoiceData
  setInvoiceData: (data: InvoiceData) => void
}

interface CustomerListItem {
  _id: string;
  customer_name: string;
  phone: string;
}

interface CustomerDropdownProps {
  customers: CustomerListItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

// NEW Component: Customer Dropdown
const CustomerDropdown = ({ customers, selectedId, onSelect }: CustomerDropdownProps) => (
  <div className="flex flex-col space-y-2">
    <label htmlFor="clientNameDropdown" className="text-sm font-medium text-gray-700">Client Name</label>
    <div className="relative rounded-lg shadow-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <User className="h-5 w-5 text-purple-400" aria-hidden="true" />
      </div>
      <select
        id="clientNameDropdown"
        name="clientNameDropdown"
        value={selectedId}
        // Handle select change and pass the ID back to the parent
        onChange={(e) => onSelect(e.target.value)}
        className="block w-full rounded-lg border-gray-300 py-3 pl-10 pr-4 bg-white text-gray-900 text-sm focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out"
      >
        <option value="">-- Select Existing Customer --</option>
        {customers.map((customer) => (
          <option key={customer._id} value={customer._id}>
            {customer.customer_name} ({customer.phone})
          </option>
        ))}
      </select>
    </div>
  </div>
);

export function InvoiceForm({ invoiceData, setInvoiceData }: InvoiceFormProps) {
  const [newItem, setNewItem] = useState<Omit<InvoiceItem, "id">>({
    name: "",
    description: "",
    quantity: 1,
    price: 0,
  })
  
  const [lastInvoiceNum, setLastInvoiceNum] = useState(String);
  const [customerList, setCustomerList] = useState<CustomerListItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');


  useEffect(() => {
    getInvoiceNumber();
    fetchCustomer();
  }, [])

  const updateField = (field: keyof InvoiceData, value: any) => {
    setInvoiceData({ ...invoiceData, [field]: value, invoiceNumber: lastInvoiceNum })
  }

  const addItem = () => {
    if (newItem.name && newItem.price > 0) {
      const item: InvoiceItem = {
        ...newItem,
        id: Date.now().toString(),
      }
      setInvoiceData({
        ...invoiceData,
        items: [...invoiceData.items, item],
      })
      setNewItem({ name: "", description: "", quantity: 1, price: 0 })
    }
  }

  const removeItem = (id: string) => {
    setInvoiceData({
      ...invoiceData,
      items: invoiceData.items.filter((item) => item.id !== id),
    })
  }

  const getInvoiceNumber = async () => {
    try {
      
      const data = await invoiceStorage.getInvoiceNumber();

      const numPart = data.split("-")[1];
      const nextInvoice = parseInt(numPart, 10) + 1;
      const nextInvoicePadded = String(nextInvoice).padStart(3, '0');

      const finalNextInvoice = 'INV-'+nextInvoicePadded;

      setLastInvoiceNum(finalNextInvoice);

      const inv_data = {inv_latest: finalNextInvoice};

    } catch (e) {
      console.error("Error loading customers:", e);
    }   
  }

  const fetchCustomer = async () => {
      try {
        const data = await invoiceStorage.getCustomers();
        setCustomerList(data || []);
      } catch (err) {
        console.error("Error loading customers:", err);
        setCustomerList([]);
      }
  }

  const handleDropdownSelect = async (id: string) => {
    setSelectedCustomerId(id);

    if (id === '') {
        setInvoiceData({ 
            ...invoiceData,
            customerId: "",
            clientName: "",
            clientEmail: "",
            clientPhone: "",
            clientAddress: ""
        })

    } else {

        const customer = await invoiceStorage.getCustomerById(id);
        if (customer) {
          setInvoiceData({ 
            ...invoiceData,
            customerId: customer.data._id,
            clientName: customer.data.customer_name,
            clientEmail: customer.data.email,
            clientPhone: customer.data.phone,
            clientAddress: customer.data.address
          })
            
        }
    }
  };

  return (
    <div className="space-y-8">
      {/* Business Information */}
      {/* <Card className="p-6 bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200">
        <div className="flex items-center mb-4">
          <Sparkles className="w-5 h-5 text-rose-500 mr-2" />
          <h3 className="font-semibold text-rose-800">Business Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="businessName" className="text-rose-700">
              Business Name
            </Label>
            <Input
              id="businessName"
              value={invoiceData.businessName}
              onChange={(e) => updateField("businessName", e.target.value)}
              className="border-rose-200 focus:border-rose-400"
            />
          </div>
          <div>
            <Label htmlFor="businessEmail" className="text-rose-700">
              Email
            </Label>
            <Input
              id="businessEmail"
              type="email"
              value={invoiceData.businessEmail}
              onChange={(e) => updateField("businessEmail", e.target.value)}
              className="border-rose-200 focus:border-rose-400"
            />
          </div>
          <div>
            <Label htmlFor="businessPhone" className="text-rose-700">
              Phone
            </Label>
            <Input
              id="businessPhone"
              value={invoiceData.businessPhone}
              onChange={(e) => updateField("businessPhone", e.target.value)}
              className="border-rose-200 focus:border-rose-400"
            />
          </div>
          <div>
            <Label htmlFor="businessAddress" className="text-rose-700">
              Address
            </Label>
            <Textarea
              id="businessAddress"
              value={invoiceData.businessAddress}
              onChange={(e) => updateField("businessAddress", e.target.value)}
              rows={3}
              className="border-rose-200 focus:border-rose-400"
            />
          </div>
        </div>
      </Card> */}

      {/* Client Information */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <h3 className="font-semibold text-purple-800">Client Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div>
            <CustomerDropdown
                customers={customerList}
                selectedId={selectedCustomerId}
                onSelect={handleDropdownSelect}
            />
          </div>
          {/* <div>
            <Label htmlFor="clientName" className="text-purple-700">
              Client Name
            </Label>
            <Input
              id="clientName"
              value={invoiceData.clientName}
              onChange={(e) => updateField("clientName", e.target.value)}
              className="border-purple-200 focus:border-purple-400"
            />
          </div>
          <div>
            <Label htmlFor="clientEmail" className="text-purple-700">
              Email
            </Label>
            <Input
              id="clientEmail"
              type="email"
              value={invoiceData.clientEmail}
              onChange={(e) => updateField("clientEmail", e.target.value)}
              className="border-purple-200 focus:border-purple-400"
            />
          </div>
          <div>
            <Label htmlFor="clientPhone" className="text-purple-700">
              Phone
            </Label>
            <div style={{display: "flex",width: "100%"}}>
              <Input 
                id="countryCode"
                value={"+91"}
                className="border-purple-200 focus:border-purple-400"
                disabled
                style={{display: "flex",width: "25%",marginRight: "10px"}}
              />
              <Input
                id="clientPhone"
                value={invoiceData.clientPhone}
                onChange={(e) => updateField("clientPhone", e.target.value)}
                className="border-purple-200 focus:border-purple-400"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="clientAddress" className="text-purple-700">
              Address
            </Label>
            <Textarea
              id="clientAddress"
              value={invoiceData.clientAddress}
              onChange={(e) => updateField("clientAddress", e.target.value)}
              rows={3}
              className="border-purple-200 focus:border-purple-400"
            />
          </div> */}
        </div>
      </Card>

      {/* Invoice Details */}
      <Card className="p-6 bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-pink-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          <h3 className="font-semibold text-pink-800">Invoice Details</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="invoiceNumber" className="text-pink-700">
              Invoice Number
            </Label>
            <Input
              id="invoiceNumber"
              value={lastInvoiceNum}
              onChange={(e) => updateField("invoiceNumber", e.target.value)}
              className="border-pink-200 focus:border-pink-400"
              disabled
            />
          </div>
          <div>
            <Label htmlFor="date" className="text-pink-700">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={invoiceData.date}
              onChange={(e) => updateField("date", e.target.value)}
              className="border-pink-200 focus:border-pink-400"
            />
          </div>
          <div>
            <Label htmlFor="dueDate" className="text-pink-700">
              Due Date
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={invoiceData.dueDate}
              onChange={(e) => updateField("dueDate", e.target.value)}
              className="border-pink-200 focus:border-pink-400"
            />
          </div>
        </div>
      </Card>

      {/* Items */}
      <Card className="p-6 bg-gradient-to-r from-rose-50 via-pink-50 to-purple-50 border-rose-200">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-rose-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
          <h3 className="font-semibold text-rose-800">Perfume Collection</h3>
        </div>

        {/* Add New Item */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 p-4 bg-white/60 rounded-lg border border-rose-100">
          <div>
            <Label htmlFor="itemName" className="text-rose-700">
              Perfume Name
            </Label>
            <Input
              id="itemName"
              placeholder="e.g., Rose Elegance"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="border-rose-200 focus:border-rose-400"
            />
          </div>
          <div>
            <Label htmlFor="itemDescription" className="text-rose-700">
              Description
            </Label>
            <Input
              id="itemDescription"
              placeholder="50ml EDT"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className="border-rose-200 focus:border-rose-400"
            />
          </div>
          <div>
            <Label htmlFor="itemQuantity" className="text-rose-700">
              Quantity
            </Label>
            <Input
              id="itemQuantity"
              type="number"
              min="1"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: Number.parseInt(e.target.value) || 1 })}
              className="border-rose-200 focus:border-rose-400"
            />
          </div>
          <div>
            <Label htmlFor="itemPrice" className="text-rose-700">
              Price (₹)
            </Label>
            <Input
              id="itemPrice"
              type="number"
              step="0.01"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: Number.parseFloat(e.target.value) || 0 })}
              className="border-rose-200 focus:border-rose-400"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={addItem}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        {/* Items List */}
        {invoiceData.items.length > 0 && (
          <div className="space-y-3">
            {invoiceData.items.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-white/80 rounded-lg border border-rose-100 shadow-sm"
              >
                <div className="flex-1">
                  <div className="font-semibold text-rose-800 flex items-center">
                    <div className="w-2 h-2 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full mr-2"></div>
                    {item.name}
                  </div>
                  <div className="text-sm text-rose-600 ml-4">{item.description}</div>
                </div>
                <div className="text-right mr-4">
                  <div className="font-semibold text-gray-800">
                    {item.quantity} × ₹{item.price.toFixed(2)} = ₹{(item.quantity * item.price).toFixed(2)}
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                  className="bg-rose-500 hover:bg-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Additional Settings */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-rose-50 border-purple-200">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
          <h3 className="font-semibold text-purple-800">Additional Settings</h3>
        </div>
        <div className="space-y-4">
          {/* <div>
            <Label htmlFor="taxRate" className="text-purple-700">
              Tax Rate (%)
            </Label>
            <Input
              id="taxRate"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={invoiceData.taxRate}
              onChange={(e) => updateField("taxRate", Number.parseFloat(e.target.value) || 0)}
              className="border-purple-200 focus:border-purple-400"
            />
          </div> */}
          <div>
            <Label htmlFor="notes" className="text-purple-700">
              Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Additional notes or payment terms..."
              value={invoiceData.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              rows={3}
              className="border-purple-200 focus:border-purple-400"
            />
          </div>
        </div>
      </Card>
    </div>
  )
}
