import axios from 'axios';

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  createdAt: string
}

export interface InvoiceRecord {
  id: string
  invoiceNumber: string
  customerId: string
  customer: Customer
  items: Array<{
    description: string
    quantity: number
    price: number
    total: number
  }>
  subtotal: number
  tax: number
  total: number
  date: string
  dueDate: string
  notes: string
  paymentStatus: "pending" | "paid" | "overdue"
  createdAt: string
  updatedAt: string
}

class InvoiceStorage {
  private readonly CUSTOMERS_KEY = "perfume_customers"
  private readonly INVOICES_KEY = "perfume_invoices"

  // Customer methods
  async getCustomers() {

    const responce = await fetch("https://invoice-management-system-n1o1.onrender.com/api/customer");
    const data = await responce.json();

    return data ? data : [] ;
  }

  async saveCustomer(customer: any) {

    const customer_name = customer.name;
    const email = customer.email;
    const phone = customer.phone;
    const address = customer.address;

    const customer_data = {customer_name, email, phone, address};
    const newCustomer = await axios.post("https://invoice-management-system-n1o1.onrender.com/api/customer/", customer_data);
    return newCustomer
  }

  async updateCustomer(cust_id: string, customer: any){

    const customer_name = customer.name;
    const email = customer.email;
    const phone = customer.phone;
    const address = customer.address;
    
    const customer_update_data = {cust_id, customer_name, email, phone, address};

    const updated_customer = await axios.put("https://invoice-management-system-n1o1.onrender.com/api/customer/", customer_update_data);

    return updated_customer;
  }

  async deleteCustomer(id: String){

    const deletedCustomer = await axios.delete(`https://invoice-management-system-n1o1.onrender.com/api/customer/${id}`);
    
    return deletedCustomer;
  }

  async getCustomerById(phone: string) {

    const encodedPhone = encodeURIComponent(phone)

    const responce = await fetch(`https://invoice-management-system-n1o1.onrender.com/api/customer/by_phone?phone=${encodedPhone}`);
    const data = await responce.json();

    return data ? data : [] ;
  }

  // Invoice methods
  async getInvoices() {
        
        const responce = await fetch("https://invoice-management-system-n1o1.onrender.com/api/invoice");
        const data = await responce.json();

        return data ? data : [] ;
    
  }

  async saveInvoice(invoice: any) {
    const invoice_number = invoice.invoiceNumber;
    const customer_id = invoice.customerId;
    const items = invoice.items;
    const amount = invoice.total;
    const date = invoice.date;
    const due_date = invoice.dueDate;
    const note = invoice.notes;
    const status = invoice.paymentStatus;

    const invoice_data = {invoice_number, customer_id, date, due_date, items, amount, status, note };

    const newInvoice = await axios.post("https://invoice-management-system-n1o1.onrender.com/api/invoice", invoice_data);

    return newInvoice;
  }

  async updateInvoicePaymentStatus(invoice_id: string, status: "pending" | "paid") {
    
    const paymentStatus_data = {invoice_id , status};

    const updatedPymentStatus = await axios.put("https://invoice-management-system-n1o1.onrender.com/api/invoice/update_status", paymentStatus_data);

    return updatedPymentStatus;
  }

  async getInvoiceById(id: string) {

    const responce = await fetch(`https://invoice-management-system-n1o1.onrender.com/api/invoice/by_id?id=${id}`);
    const data = await responce.json();

    return data ? data : [] ; 
  }

  // Statistics
  async getStats() {
    const invoices = await this.getInvoices()
    const customers = await this.getCustomers()

    const totalRevenue = invoices.filter((i:any) => i.status === "paid").reduce((sum: any, i: any) => sum + i.amount, 0)

    const pendingAmount = invoices.filter((i: any) => i.status === "pending").reduce((sum: any, i: any) => sum + i.amount, 0)
    
    const overdueAmount = invoices.filter((i: any) => i.status === "overdue").reduce((sum: any, i: any) => sum + i.amount, 0)

    return {
      totalInvoices: invoices.length,
      totalCustomers: customers.length,
      totalRevenue,
      pendingAmount,
      overdueAmount,
      paidInvoices: invoices.filter((i: any) => i.status === "paid").length,
      pendingInvoices: invoices.filter((i: any) => i.status === "pending").length,
      overdueInvoices: invoices.filter((i: any) => i.status === "overdue").length,
    }
  }

  async getInvoiceNumber () {
    const responce = await fetch("https://invoice-management-system-n1o1.onrender.com/api/invoice/last_invoice_number");
    const data = await responce.json();
    
    console.log(data);
    return data ? data : [] ;
  }
}

export const invoiceStorage = new InvoiceStorage()
