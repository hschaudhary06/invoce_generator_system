export async function generatePDFById(invoiceData: any) {

  const total = invoiceData.amount

  const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
        <!-- Tailwind CDN -->
        <script src="https://cdn.tailwindcss.com"></script>
        <!-- Animate.css (if you want animations) -->
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
        />
      <title>Invoice #${invoiceData.invoice_number}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          background: #f9fafb;
          padding: 20px;
          color: #374151;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          border: 2px solid #fce7f3;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          overflow: hidden;
          position: relative;
        }
        
        .bg-decoration {
          position: absolute;
          inset: 0;
          opacity: 0.05;
        }
        
        .bg-circle-1 {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 96px;
          height: 96px;
          background: linear-gradient(to bottom right, #fda4af, #f9a8d4);
          border-radius: 50%;
          filter: blur(32px);
        }
        
        .bg-circle-2 {
          position: absolute;
          bottom: 32px;
          left: 32px;
          width: 64px;
          height: 64px;
          background: linear-gradient(to bottom right, #c084fc, #f9a8d4);
          border-radius: 50%;
          filter: blur(24px);
        }
        
        .header {
          padding: 32px;
          position: relative;
          z-index: 10;
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        
        .business-info {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .flower-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(to right, #fb7185, #f472b6);
          border-radius: 50%;
          margin-right: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 16px;
        }
        
        .business-name {
          font-size: 28px;
          font-weight: 700;
          background: linear-gradient(to right, #e11d48, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: #e11d48;
        }
        
        .business-details {
          font-size: 14px;
          color: #6b7280;
          margin-left: 44px;
        }
        
        .invoice-title {
          text-align: right;
        }
        
        .invoice-title h2 {
          font-size: 24px;
          font-weight: 700;
          color: #374151;
        }
        
        .invoice-number {
          font-size: 14px;
          color: #6b7280;
          margin-top: 4px;
          background: #fce7f3;
          padding: 4px 12px;
          border-radius: 6px;
          display: inline-block;
        }
        
        .content {
          padding: 0 32px 32px 32px;
        }
        
        .bill-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 32px;
        }
        
        .bill-to {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .pink-dot {
          width: 16px;
          height: 16px;
          background: linear-gradient(to right, #c084fc, #f472b6);
          border-radius: 50%;
          margin-right: 8px;
        }
        
        .bill-to h3 {
          font-weight: 600;
          color: #374151;
        }
        
        .client-info {
          margin-left: 24px;
        }
        
        .client-name {
          font-weight: 500;
          color: #374151;
        }
        
        .client-details {
          color: #6b7280;
          margin-top: 4px;
        }
        
        .invoice-dates {
          text-align: right;
        }
        
        .date-row {
          font-size: 14px;
          margin-bottom: 8px;
        }
        
        .date-label {
          color: #6b7280;
          margin-right: 8px;
        }
        
        .date-value {
          color: #374151;
          font-weight: 500;
        }
        
        .items-section {
          margin-bottom: 32px;
        }
        
        .items-header {
          background: linear-gradient(to right, #fdf2f8, #fce7f3);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
        }
        
        .pink-square {
          width: 16px;
          height: 16px;
          background: #ec4899;
          border-radius: 2px;
          margin-right: 8px;
        }
        
        .collection-title {
          font-weight: 600;
          color: #be185d;
        }
        
        .items-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .table-header {
          border-bottom: 2px solid #fce7f3;
        }
        
        .table-header th {
          padding: 16px 0;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }
        
        .table-row {
          background: rgba(253, 242, 248, 0.3);
        }
        
        .table-row:nth-child(even) {
          background: white;
        }
        
        .table-row td {
          padding: 16px 0;
        }
        
        .item-info {
          display: flex;
          align-items: center;
        }
        
        .item-dot {
          width: 8px;
          height: 8px;
          background: linear-gradient(to right, #fb7185, #f472b6);
          border-radius: 50%;
          margin-right: 12px;
        }
        
        .item-name {
          font-weight: 500;
          color: #374151;
        }
        
        .item-description {
          font-size: 14px;
          color: #6b7280;
        }
        
        .totals-section {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 32px;
        }
        
        .totals-box {
          width: 288px;
          background: linear-gradient(to right, #fdf2f8, #fce7f3);
          border-radius: 8px;
          padding: 24px;
          border: 1px solid #fce7f3;
        }
        
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 14px;
        }
        
        .total-label {
          color: #6b7280;
        }
        
        .total-value {
          color: #374151;
          font-weight: 500;
        }
        
        .final-total {
          border-top: 2px solid #fbb6ce;
          padding-top: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .final-total-label {
          font-size: 18px;
          font-weight: 700;
          color: #374151;
        }
        
        .final-total-value {
          display: flex;
          align-items: center;
        }
        
        .total-dot {
          width: 12px;
          height: 12px;
          background: linear-gradient(to right, #fb7185, #f472b6);
          border-radius: 50%;
          margin-right: 8px;
        }
        
        .total-amount {
          font-size: 20px;
          font-weight: 700;
          color: #ec4899;
        }
        
        .notes-section {
          border-top: 2px solid #fce7f3;
          padding-top: 24px;
        }
        
        .notes-header {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .notes-dot {
          width: 16px;
          height: 16px;
          background: #ec4899;
          border-radius: 50%;
          margin-right: 8px;
        }
        
        .notes-title {
          font-weight: 600;
          color: #374151;
        }
        
        .notes-text {
          font-size: 14px;
          color: #6b7280;
          margin-left: 24px;
          line-height: 1.5;
        }
        
        .footer {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 2px solid #fce7f3;
          text-align: center;
          position: relative;
        }
        
        .footer-text {
          font-size: 14px;
          color: #6b7280;
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .footer-dot-1 {
          width: 8px;
          height: 8px;
          background: linear-gradient(to right, #fb7185, #f472b6);
          border-radius: 50%;
          margin-right: 8px;
        }
        
        .footer-dot-2 {
          width: 8px;
          height: 8px;
          background: linear-gradient(to right, #f472b6, #c084fc);
          border-radius: 50%;
          margin-left: 8px;
        }
        
        @media print {
          body { 
            background: white !important; 
            padding: 0 !important; 
          }
          
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="bg-decoration">
          <div class="bg-circle-1"></div>
          <div class="bg-circle-2"></div>
        </div>

        <div class="header">
          <div class="header-content">
          <div class="absolute top-[30px] right-[30px] opacity-15"><svg width="140" height="140" viewBox="0 0 140 140" class="text-rose-400"><g><path d="M70 30c-10 0-18 4-24 10-6-6-14-10-24-10-18 0-24 15-24 24 0 30 48 62 48 62s48-32 48-62c0-9-6-24-24-24z" fill="currentColor"></path><circle cx="45" cy="45" r="4" fill="currentColor" opacity="0.7"></circle><circle cx="95" cy="50" r="3" fill="currentColor" opacity="0.6"></circle><circle cx="80" cy="35" r="3.5" fill="currentColor" opacity="0.8"></circle><circle cx="60" cy="25" r="2.5" fill="currentColor" opacity="0.5"></circle><ellipse cx="25" cy="65" rx="8" ry="4" fill="currentColor" opacity="0.4" transform="rotate(45 25 65)"></ellipse><ellipse cx="115" cy="70" rx="6" ry="3" fill="currentColor" opacity="0.3" transform="rotate(-30 115 70)"></ellipse></g></svg></div>
            <div>
              <div class="business-info">
                <div class="flower-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles w-4 h-4 text-white"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path><path d="M20 3v4"></path><path d="M22 5h-4"></path><path d="M4 17v2"></path><path d="M5 18H3"></path></svg></div>
                <h1 class="business-name">Nazaf Parfumerie</h1>
              </div>
              <div class="business-details">
                Near Marigold restaturant, 
                Ahmedabad, 382350
              </div>
              <div class="business-details">
                +91 95373 23720 • nazafparfumerie@gmail.com
              </div>
            </div>
            <div class="text-right">
              <h2 class="text-2xl font-bold text-gray-800">INVOICE</h2>
              <div class="text-sm text-gray-500 mt-1">#${invoiceData.invoice_number}</div>
              <div class="w-16 h-0.5 bg-gradient-to-r from-rose-400 to-pink-400 mt-2 ml-auto"></div>
            </div>
           
          </div>
        </div>

        <div class="content">
          <div class="bill-section">
            <div>
              <div class="bill-to">
                <div class="pink-dot"></div>
                <h3>Bill To:</h3>
              </div>
              <div class="client-info">
                <div class="client-name">${invoiceData.customer.customer_name}</div>
                <div class="client-details">
                  ${invoiceData.customer.address
                    .split("\n")
                    .map((line: any) => `<div>${line}</div>`)
                    .join("")}
                </div>
                <div class="client-details">${invoiceData.customer.phone}</div>
                <div class="client-details">${invoiceData.customer.email}</div>
              </div>
            </div>
            <div class="invoice-dates">
              <div class="date-row">
                <span class="date-label">Date:</span>
                <span class="date-value">${new Date(invoiceData.date).toLocaleDateString()}</span>
              </div>
              <div class="date-row">
                <span class="date-label">Due Date:</span>
                <span class="date-value">${new Date(invoiceData.due_date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          ${
            invoiceData.items.length > 0
              ? `
          <div class="items-section">
            <div class="items-header">
              <svg class="w-5 h-5 text-rose-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path></svg>
              <span class="collection-title">Perfume Collection</span>
            </div>

            <table class="items-table">
              <thead class="table-header">
                <tr>
                  <th style="text-align: left;">Item</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Price</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${invoiceData.items
                  .map(
                    (item: any, index: any) => `
                <tr class="table-row">
                  <td>
                    <div class="item-info">
                      <div class="item-dot"></div>
                      <div>
                        <div class="item-name">${item.name}</div>
                        <div class="item-description">${item.description}</div>
                      </div>
                    </div>
                  </td>
                  <td style="text-align: center; color: #374151; font-weight: 500;">${item.quantity}</td>
                  <td style="text-align: right; color: #374151;">₹${item.price.toFixed(2)}</td>
                  <td style="text-align: right; color: #374151; font-weight: 600;">₹${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
          `
              : ""
          }

          <div class="totals-section">
            <div class="totals-box">
              <div class="total-row">
                <span class="total-label">Subtotal:</span>
                <span class="total-value">₹${total.toFixed(2)}</span>
              </div>
              
              <div class="final-total">
                <span class="final-total-label">Total:</span>
                <div class="final-total-value">
                  <div class="total-dot"></div>
                  <span class="total-amount">₹${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          ${
            invoiceData.note
              ? `
              <div class="border-t-2 border-rose-100 pt-6">
                <div class="flex items-center mb-3">
                  <svg class="w-4 h-4 text-rose-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                  <h3 class="font-semibold text-gray-800">Notes:</h3>
                </div>
                <p class="text-sm text-gray-600 whitespace-pre-line ml-6">${invoiceData.note}</p>
              </div>
          
          `
              : ""
          }

          <div class="mt-8 pt-6 border-t-2 border-rose-100 relative">
            <div class="absolute bottom-0 left-0 right-0 opacity-10">
              <svg width="100%" height="50" viewBox="0 0 400 50" class="text-rose-300">
                <path d="M0 25c20-15 40-15 60 0 20-15 40-15 60 0 20-15 40-15 60 0 20-15 40-15 60 0 20-15 40-15 60 0 20-15 40-15 60 0" stroke="currentColor" stroke-width="1.5" fill="none"></path>
                <circle cx="60" cy="20" r="2" fill="currentColor"></circle>
                <circle cx="140" cy="20" r="1.5" fill="currentColor"></circle>
                <circle cx="220" cy="20" r="2" fill="currentColor"></circle>
                <circle cx="300" cy="20" r="1.5" fill="currentColor"></circle>
              </svg>
            </div>
            <div class="text-center text-sm text-gray-500 relative z-10">
              <div class="flex items-center justify-center">
                <div class="w-2 h-2 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full mr-2"></div>
                <span>Thank you for choosing Nazaf Parfumerie</span>
                <div class="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full ml-2"></div>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </body>
  </html>
  `

  // Create a new window with the HTML content that matches preview exactly
  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(htmlContent)
    printWindow.document.close()

    // Wait for content to load then trigger print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
      }, 500)
    }
  }
}
