"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { FileText, Plus } from "lucide-react"
import { Toaster } from 'react-hot-toast';

interface DashboardLayoutProps {
  children: React.ReactNode
  onCreateInvoice: () => void
}

export function DashboardLayout({ children, onCreateInvoice }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <Toaster />
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                Nazaf Parfumerie
              </h1>
              <p className="text-gray-600">Invoice Management System</p>
            </div>
          </div>
          <Button
            onClick={onCreateInvoice}
            className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </div>

        {children}
      </div>
    </div>
  )
}
