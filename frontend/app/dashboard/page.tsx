"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardStats } from "@/components/dashboard-stats"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InvoicesList } from "@/components/invoices-list"
import { CustomersList } from "@/components/customers-list"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const handleCreateInvoice = () => {
    window.location.href = "/"
  }

  return (
    
    <DashboardLayout onCreateInvoice={handleCreateInvoice}>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/70 backdrop-blur-sm">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <DashboardStats />
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <InvoicesList />
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <CustomersList />
        </TabsContent>
      </Tabs>

    </DashboardLayout>
  )
}
