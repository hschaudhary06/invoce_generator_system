"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, Euro, Clock, CheckCircle, AlertCircle, IndianRupee, IndianRupeeIcon } from "lucide-react"
import { invoiceStorage } from "@/lib/invoice-storage"

export function DashboardStats() {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    pendingAmount: 0,
    overdueAmount: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    overdueInvoices: 0,
  })

  useEffect(() => {
    loadStats()
    
  }, [])

  const loadStats = async () => {
    const stats = await invoiceStorage.getStats();
    console.log(stats)
    setStats(stats); // now it's the actual object
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="border-rose-200 bg-white/70 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total Invoices</CardTitle>
          <FileText className="h-4 w-4 text-rose-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{stats.totalInvoices}</div>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              {stats.paidInvoices} Paid
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {stats.pendingInvoices} Pending
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-pink-200 bg-white/70 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total Customers</CardTitle>
          <Users className="h-4 w-4 text-pink-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</div>
          <p className="text-xs text-gray-500 mt-2">Active customer base</p>
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-white/70 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
          <IndianRupee className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue}</div>
          <p className="text-xs text-green-600 mt-2">From paid invoices</p>
        </CardContent>
      </Card>

      <Card className="border-orange-200 bg-white/70 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Pending Amount</CardTitle>
          <AlertCircle className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">₹{stats.pendingAmount}</div>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="text-xs text-orange-600">
              {stats.pendingInvoices} Pending
            </Badge>
            {stats.overdueInvoices > 0 && (
              <Badge variant="destructive" className="text-xs">
                {stats.overdueInvoices} Overdue
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
