import { useState } from 'react';
import { Calendar, Download, Mail, Printer, DollarSign, Receipt, Package, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

const DailySummary = () => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const summaryData = {
    openingStock: 2450000,
    grossSales: 45280,
    discounts: 2140,
    gstCollected: 5434,
    netCashReceived: 25600,
    netUPIReceived: 15200,
    netCardReceived: 7620,
    totalInvoices: 127,
    closingStock: 2445000,
    returns: 850
  };

  const handleEmailReport = () => {
    console.log('Emailing daily summary...');
  };

  const handlePrintReport = () => {
    console.log('Printing daily summary...');
  };

  const handleDownloadPDF = () => {
    console.log('Downloading PDF...');
  };

  return (
    <div className="daily-summary">
      <div className="summary-header">
        <div className="header-info">
          <h2>Daily Sales Summary</h2>
          <p>Comprehensive daily closing report for accounting and management</p>
        </div>
        <div className="header-actions">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-picker"
          />
          <button className="btn btn-outline" onClick={handleEmailReport}>
            <Mail size={16} />
            Email Report
          </button>
          <button className="btn btn-outline" onClick={handlePrintReport}>
            <Printer size={16} />
            Print
          </button>
          <button className="btn btn-secondary" onClick={handleDownloadPDF}>
            <Download size={16} />
            Download PDF
          </button>
        </div>
      </div>

      <div className="summary-content">
        <div className="summary-section">
          <h3>Financial Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <div className="item-label">Opening Stock Value</div>
              <div className="item-value">₹{summaryData.openingStock.toLocaleString()}</div>
            </div>
            <div className="summary-item">
              <div className="item-label">Gross Sales</div>
              <div className="item-value positive">₹{summaryData.grossSales.toLocaleString()}</div>
            </div>
            <div className="summary-item">
              <div className="item-label">Total Discounts</div>
              <div className="item-value negative">₹{summaryData.discounts.toLocaleString()}</div>
            </div>
            <div className="summary-item">
              <div className="item-label">GST Collected</div>
              <div className="item-value">₹{summaryData.gstCollected.toLocaleString()}</div>
            </div>
            <div className="summary-item">
              <div className="item-label">Net Revenue</div>
              <div className="item-value highlight">₹{(summaryData.grossSales - summaryData.discounts).toLocaleString()}</div>
            </div>
            <div className="summary-item">
              <div className="item-label">Closing Stock Value</div>
              <div className="item-value">₹{summaryData.closingStock.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="summary-section">
          <h3>Payment Breakdown</h3>
          <div className="payment-summary">
            <div className="payment-item">
              <div className="payment-method">Cash Received</div>
              <div className="payment-amount">₹{summaryData.netCashReceived.toLocaleString()}</div>
              <div className="payment-percentage">56.6%</div>
            </div>
            <div className="payment-item">
              <div className="payment-method">UPI Received</div>
              <div className="payment-amount">₹{summaryData.netUPIReceived.toLocaleString()}</div>
              <div className="payment-percentage">33.6%</div>
            </div>
            <div className="payment-item">
              <div className="payment-method">Card Received</div>
              <div className="payment-amount">₹{summaryData.netCardReceived.toLocaleString()}</div>
              <div className="payment-percentage">16.8%</div>
            </div>
          </div>
        </div>

        <div className="summary-section">
          <h3>Transaction Summary</h3>
          <div className="transaction-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <Receipt size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{summaryData.totalInvoices}</div>
                <div className="stat-label">Total Invoices</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <DollarSign size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">₹{Math.round(summaryData.grossSales / summaryData.totalInvoices)}</div>
                <div className="stat-label">Average Sale</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <TrendingUp size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">₹{summaryData.returns.toLocaleString()}</div>
                <div className="stat-label">Returns/Refunds</div>
              </div>
            </div>
          </div>
        </div>

        <div className="summary-section">
          <h3>Auto-Email Settings</h3>
          <div className="email-settings">
            <div className="setting-item">
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked />
                <span className="checkmark"></span>
                Auto-email daily summary to admin
              </label>
            </div>
            <div className="setting-item">
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked />
                <span className="checkmark"></span>
                Auto-email to accountant
              </label>
            </div>
            <div className="email-list">
              <div className="email-item">
                <span>admin@sathyapharmacy.com</span>
                <button className="btn-small">Remove</button>
              </div>
              <div className="email-item">
                <span>accounts@sathyapharmacy.com</span>
                <button className="btn-small">Remove</button>
              </div>
            </div>
            <button className="btn btn-outline">Add Email Address</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailySummary;
