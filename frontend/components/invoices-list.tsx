"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Download, CheckCircle, Clock, AlertCircle, FileText } from "lucide-react"
import { invoiceStorage} from "@/lib/invoice-storage"
import { generatePDF } from "@/lib/pdf-generator"
import { generatePDFById } from "@/lib/pdf-generator-by-invoice";

export function InvoicesList() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "paid" | "pending" | "overdue">("all");
  const [invoice_by_id, setInvoiceById] = useState<any[]>([]);

  useEffect(() => {
    loadInvoices();
  }, [])

  const loadInvoices = async () => {
    try {
      const data = await invoiceStorage.getInvoices();
      setInvoices(data || []);
    } catch (err) {
      console.error("Error loading invoices:", err);
      setInvoices([]);
    }
  };

  const filteredInvoices = invoices.filter((invoice) => {
    if (filter === "all") return true
    return invoice.status === filter
  })

  const updatePaymentStatus = async (id: string, status: "pending" | "paid") => {
    await invoiceStorage.updateInvoicePaymentStatus(id, status);
    loadInvoices()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "pending":
        return <Clock className="w-4 h-4 text-orange-500" />
      // case "overdue":
      //   return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="text-orange-600">
            Pending
          </Badge>
        )
      // case "overdue":
      //   return <Badge variant="destructive">Overdue</Badge>
      default:
        return null
    }
  }

  const handleDownloadPDF = async (invoice_id: string) => {
    try {
      const InvoiceByID = await invoiceStorage
        .getInvoiceById(invoice_id)

      console.log(InvoiceByID)
      
      if (!InvoiceByID) {
        throw new Error("Invoice not found");
      }
      
      await generatePDFById(InvoiceByID)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    }
  }

  return (
    <Card className="border-rose-200 bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900">Invoice Records</CardTitle>
          <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Invoices</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              {/* <SelectItem value="overdue">Overdue</SelectItem> */}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No invoices found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice._id}>
                  <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{invoice.customer.customer_name}</div>
                      <div className="text-sm text-gray-500">{invoice.customer.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">₹{invoice.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(invoice.status)}
                      {getStatusBadge(invoice.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Select
                        value={invoice.status}
                        onValueChange={(value: any) => updatePaymentStatus(invoice._id, value)}
                      >
                        <SelectTrigger className="w-24 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          {/* <SelectItem value="overdue">Overdue</SelectItem> */}
                        </SelectContent>
                      </Select>
                      {/* <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button> */}
                      <Button variant="outline" size="sm" onClick={() => { handleDownloadPDF(invoice._id); }}>
                        <Download className="w-4 h-4"  />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
