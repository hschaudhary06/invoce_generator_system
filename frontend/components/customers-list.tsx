"use client"

import type React from "react"

import { useCallback, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Users, Plus, Mail, Phone, MapPin, PenSquareIcon, Trash2, User } from "lucide-react"
import { invoiceStorage} from "@/lib/invoice-storage"
import { toast, Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2'
import { LucideIcon } from 'lucide-react';
import { AxiosError } from "axios"

interface FieldInputProps {
  label: string;
  name: string;
  value: string;
  icon: LucideIcon; // Type for the Lucide icon component
  placeholder: string;
  type?: 'text' | 'email' | 'tel' | 'password'; 
  readOnly?: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const FieldInput = ({ 
  label, 
  name, 
  value, 
  icon: Icon, 
  placeholder, 
  type = 'text', 
  readOnly = false, 
  handleChange 
}: FieldInputProps) => (
  <div className="flex flex-col space-y-2">
    <label htmlFor={name} className="text-sm font-medium text-gray-700">{label}</label>
    <div className="relative rounded-lg shadow-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Icon className="h-5 w-5 text-purple-400" aria-hidden="true" />
      </div>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={handleChange}
        readOnly={readOnly}
        placeholder={placeholder}
        required
        className={`
          block w-full rounded-lg border-gray-300 py-3 pl-10 pr-4 
          focus:ring-purple-500 focus:border-purple-500 text-sm transition duration-150 ease-in-out
          ${readOnly ? 'bg-purple-50 text-purple-800 cursor-not-allowed' : 'bg-white text-gray-900'}
        `}
      />
    </div>
  </div>
);

interface PhoneInputProps {
  phone: string;
  loading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

// PhoneInput Component - Moved outside App
const PhoneInput = ({ phone, loading, handleChange }: PhoneInputProps) => (
  <div className="flex flex-col space-y-2">
    <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</label>
    <div className="flex space-x-2">
      {/* Country Code Field (Read-only as per image) */}
      <div className="w-1/4 flex-shrink-0">
        <div className="relative rounded-lg shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Phone className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            value="+91"
            readOnly
            className="block w-full rounded-lg border-gray-300 py-3 pl-10 pr-4 bg-gray-100 text-gray-600 text-sm cursor-not-allowed"
          />
        </div>
      </div>

      {/* Phone Number Input Field (The main search trigger) */}
      <div className="w-3/4 flex-grow">
        <input
          type="tel"
          name="phone"
          id="phone"
          value={phone}
          onChange={handleChange} 
          required
          placeholder="e.g., 9876543210"
          className={`
            block w-full rounded-lg border-gray-300 py-3 px-4 
            focus:ring-purple-500 focus:border-purple-500 text-sm transition duration-150 ease-in-out
          `}
          aria-describedby="phone-status"
        />
      </div>
    </div>
  </div>
);
// ${loading ? 'animate-pulse bg-yellow-50' : 'bg-white text-gray-900'}
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

  const [loading, setLoading] = useState(false);


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
    try{
      let customer = await invoiceStorage.saveCustomer(formData);
      toast.error("Customer Successfully Saved.");
      setFormData({ name: "", email: "", phone: "", address: "" })
      setIsDialogOpen(false)
      loadCustomers()
    }
    catch (error){
      const axiosError = error as AxiosError<{ message: string }>;

      if (axiosError.response && axiosError.response.data && axiosError.response.data.message) {
        // 1. EXTRACT THE MESSAGE: Access the message from the server response data
        const serverMessage = axiosError.response.data.message;
        toast.error(serverMessage);
        
        console.error("Server Validation Error:", serverMessage);
        
      } else if (axiosError.message) {
        // 2. Handle generic errors (e.g., "Network Error", "Timeout")
        toast.error(`An error occurred: ${axiosError.message}`);
        console.error("Client/Network Error:", axiosError.message);
        
      } else {
        // 3. Handle unexpected/unknown errors
        toast.error("An unexpected error occurred. Check your connection.");
        console.error("Unknown Error:", error);
      }
    }
    
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      let customerUpdate = await invoiceStorage.updateCustomer(currentCustomerId, editFormData);
      toast.success('Customer Updated!');
      setEditFormData({ name: "", email: "", phone: "", address: "" });
      setIsEditDialogOpen(false)
      loadCustomers()
    }
    catch(error) {
      const axiosError = error as AxiosError<{ message: string }>;

      if (axiosError.response && axiosError.response.data && axiosError.response.data.message) {
        // 1. EXTRACT THE MESSAGE: Access the message from the server response data
        const serverMessage = axiosError.response.data.message;
        toast.error(serverMessage);
        
        console.error("Server Validation Error:", serverMessage);
        
      } else if (axiosError.message) {
        // 2. Handle generic errors (e.g., "Network Error", "Timeout")
        toast.error(`An error occurred: ${axiosError.message}`);
        console.error("Client/Network Error:", axiosError.message);
        
      } else {
        // 3. Handle unexpected/unknown errors
        toast.error("An unexpected error occurred. Check your connection.");
        console.error("Unknown Error:", error);
      }
    }
    
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if(formData.name != "" && formData.email != "" && formData.phone != "" && formData.address != "")
      setLoading(true);
    else
      setLoading(false);

  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

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
                  <FieldInput
                    label="Customer Name"
                    name="name"
                    value={formData.name}
                    handleChange={handleChange}
                    icon={User}
                    placeholder="Enter Customer's full name"
                  />
            
                </div>
                <div>
                  <FieldInput
                    label="Email"
                    name="email"
                    value={formData.email}
                    handleChange={handleChange}
                    icon={Mail}
                    placeholder="Enter Customer's email address"
                  />
                </div>
                <div>
                  
                  <PhoneInput 
                    phone={formData.phone} 
                    loading={loading} 
                    handleChange={handleChange}
                  />
                </div>
                <div>
                 <label htmlFor="address" className="text-sm font-medium text-gray-700">Address</label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 pt-3 self-start">
                      <MapPin className="h-5 w-5 text-purple-400" aria-hidden="true" />
                    </div>
                    {/* Note: The textarea also uses the properly typed handleChange */}
                    <textarea
                      name="address"
                      id="address"
                     
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter Customer's address"
                      className="block w-full rounded-lg border-gray-300 py-3 pl-10 pr-4 focus:ring-purple-500 focus:border-purple-500 text-sm transition duration-150 ease-in-out resize-y"
                    />
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <Button
                    onClick={() => console.log('Final Data:', formData)}
                    className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                    disabled={!loading}
                  >
                    {loading ? 'Save Customer' : 'Disabled'}
                  </Button>
                </div>
               
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
                                
                                const changedPhone = customer.phone.replace(/^\+91\s?/, "");
                                setEditFormData({
                                  name: customer.customer_name,
                                  email: customer.email,
                                  phone: changedPhone,
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
                              <FieldInput
                                label="Customer Name"
                                name="name"
                                value={editFormData.name}
                                handleChange={handleEditChange}
                                icon={User}
                                placeholder="Enter Customer's full name"
                              />
                        
                            </div>
                            <div>
                              <FieldInput
                                label="Email"
                                name="email"
                                value={editFormData.email}
                                handleChange={handleEditChange}
                                icon={Mail}
                                placeholder="Enter Customer's email address"
                              />
                            </div>
                            <div>
                              
                              <PhoneInput 
                                phone={editFormData.phone} 
                                loading={loading} 
                                handleChange={handleEditChange}
                              />
                            </div>
                            <div>
                              <label htmlFor="address" className="text-sm font-medium text-gray-700">Address</label>
                              <div className="relative rounded-lg shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 pt-3 self-start">
                                  <MapPin className="h-5 w-5 text-purple-400" aria-hidden="true" />
                                </div>
                                {/* Note: The textarea also uses the properly typed handleChange */}
                                <textarea
                                  name="address"
                                  id="address"
                                  
                                  value={editFormData.address}
                                  onChange={handleEditChange}
                                  placeholder="Enter Customer's address"
                                  className="block w-full rounded-lg border-gray-300 py-3 pl-10 pr-4 focus:ring-purple-500 focus:border-purple-500 text-sm transition duration-150 ease-in-out resize-y"
                                />
                              </div>
                            </div>
                            <div className="mt-8 flex justify-end">
                              <Button
                                onClick={() => console.log('Final Data:', editFormData)}
                                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                                
                              >
                                Update Customer
                              </Button>
                            </div>
                            
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


