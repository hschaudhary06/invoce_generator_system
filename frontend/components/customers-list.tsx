"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Users, Plus, Mail, Phone, MapPin, PenSquareIcon, Trash2 } from "lucide-react"
import { invoiceStorage} from "@/lib/invoice-storage"
import { toast, Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2'


export function CustomersList() {
  const [customers, setCustomers] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentCustomerId, setCurrentCustomerId ] = useState(String);
  const [invoiceCounts, setInvoiceCounts] = useState<Record<string, number>>({})
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });


  useEffect(() => {
    loadCustomers();
  }, [])

  const loadCustomers = async () => {
    try {
      const data = await invoiceStorage.getCustomers();
      setCustomers(data || []);
      fetchInvoiceCounts(data || []);
    } catch (err) {
      console.error("Error loading customers:", err);
      setCustomers([]);
    }
    
    
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await invoiceStorage.saveCustomer(formData)
    setFormData({ name: "", email: "", phone: "", address: "" })
    setIsDialogOpen(false)
    loadCustomers()
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let customerUpdate = await invoiceStorage.updateCustomer(currentCustomerId, editFormData);
    console.log(customerUpdate.message);
    toast.success('Customer Updated!');
    setEditFormData({ name: "", email: "", phone: "", address: "" });
    setIsEditDialogOpen(false)
    loadCustomers()
  }

  const handleDelete = async (id: String) => {
    Swal.fire({
      title: "Are you sure?",
      text: "All invoices associated with this customer will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await invoiceStorage.deleteCustomer(id);
        loadCustomers()
        Swal.fire({
          title: "Deleted!",
          text: "Customer has been deleted.",
          icon: "success"
        });
      }
    });
    
  }

  const fetchInvoiceCounts = async (customers: any[]) => {
    try {

      const data = await invoiceStorage.getInvoices();

      const counts: Record<string, number> = {}
      customers.forEach((customer) => {
        const invoices = data.filter((inv: any) => inv.customer_id === customer._id)
        counts[customer._id] = invoices.length
      })

      setInvoiceCounts(counts)
    } catch (err) {
      console.error("Error fetching invoices:", err)
    }
  }

  return (
    <Card className="border-rose-200 bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          
          <CardTitle className="text-xl font-semibold text-gray-900">Customer Management</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value, })}
                    required
                  />
            
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                >
                  Add Customer
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {customers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No customers found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Invoices</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer._id}>
                  <TableCell>
                    <div className="font-medium">{customer.customer_name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {customer.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="max-w-xs truncate">{customer.address}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{invoiceCounts[customer._id] ?? 0}</span>
                  </TableCell>
                  <TableCell>{new Date(customer.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 text-sm">
                      <Dialog open={isEditDialogOpen && currentCustomerId === customer._id} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                            <PenSquareIcon 
                              className="w-5 h-5 text-green-400 cursor-pointer"
                              onClick={() => {
                                setCurrentCustomerId(customer._id);
                                setEditFormData({
                                  name: customer.customer_name,
                                  email: customer.email,
                                  phone: customer.phone,
                                  address: customer.address,
                                });
                              }}
                            />
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Customer</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                              <Label htmlFor="name">Name</Label>
                              <Input
                                id="name"
                                value={editFormData.name}
                                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                value={editFormData.email}
                                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="phone">Phone</Label>
                              <Input
                                id="phone"
                                value={editFormData.phone}
                                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="address">Address</Label>
                              <Textarea
                                id="address"
                                value={editFormData.address}
                                onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                                required
                              />
                            </div>
                            <Button
                              type="submit"
                              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                            >
                              Update Customer
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                      
                      <Trash2 
                        className="w-5 h-5 text-red-400 cursor-pointer"
                        onClick={() => handleDelete(customer._id)}
                      />
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
