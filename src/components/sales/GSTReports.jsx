import { useState } from 'react';
import { Download, FileText, Calculator, Filter, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const GSTReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedTaxSlab, setSelectedTaxSlab] = useState('all');

  const gstData = [
    {
      hsnCode: '30049099',
      description: 'Paracetamol & other analgesics',
      taxRate: 12,
      taxableValue: 45000,
      cgst: 2700,
      sgst: 2700,
      igst: 0,
      totalTax: 5400
    },
    {
      hsnCode: '30041000',
      description: 'Antibiotics',
      taxRate: 12,
      taxableValue: 38000,
      cgst: 2280,
      sgst: 2280,
      igst: 0,
      totalTax: 4560
    },
    {
      hsnCode: '30049099',
      description: 'Vitamins & Supplements',
      taxRate: 5,
      taxableValue: 22000,
      cgst: 550,
      sgst: 550,
      igst: 0,
      totalTax: 1100
    },
    {
      hsnCode: '90189099',
      description: 'Medical Devices',
      taxRate: 18,
      taxableValue: 18000,
      cgst: 1620,
      sgst: 1620,
      igst: 0,
      totalTax: 3240
    }
  ];

  const taxSlabSummary = [
    { rate: 5, taxableValue: 22000, tax: 1100 },
    { rate: 12, taxableValue: 83000, tax: 9960 },
    { rate: 18, taxableValue: 18000, tax: 3240 }
  ];

  const totalTaxableValue = gstData.reduce((sum, item) => sum + item.taxableValue, 0);
  const totalTax = gstData.reduce((sum, item) => sum + item.totalTax, 0);

  const handleExportGSTR1 = () => {
    console.log('Exporting GSTR-1 format...');
  };

  const handleExportGSTR3B = () => {
    console.log('Exporting GSTR-3B format...');
  };

  const handleExportExcel = () => {
    console.log('Exporting to Excel...');
  };

  return (
    <div className="gst-reports">
      <div className="gst-header">
        <div className="header-info">
          <h2>GST Reports & Compliance</h2>
          <p>Generate GST-compliant reports for tax filing and compliance</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={handleExportGSTR1}>
            <FileText size={16} />
            Export GSTR-1
          </button>
          <button className="btn btn-outline" onClick={handleExportGSTR3B}>
            <Calculator size={16} />
            Export GSTR-3B
          </button>
          <button className="btn btn-secondary" onClick={handleExportExcel}>
            <Download size={16} />
            Export Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="gst-filters">
        <div className="filter-group">
          <label>Period:</label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="period-select"
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Tax Slab:</label>
          <select
            value={selectedTaxSlab}
            onChange={(e) => setSelectedTaxSlab(e.target.value)}
            className="tax-select"
          >
            <option value="all">All Tax Rates</option>
            <option value="5">5% GST</option>
            <option value="12">12% GST</option>
            <option value="18">18% GST</option>
            <option value="28">28% GST</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="gst-summary">
        <div className="summary-card">
          <div className="summary-label">Total Taxable Value</div>
          <div className="summary-value">₹{totalTaxableValue.toLocaleString()}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Total GST Collected</div>
          <div className="summary-value">₹{totalTax.toLocaleString()}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">CGST</div>
          <div className="summary-value">₹{(totalTax / 2).toLocaleString()}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">SGST</div>
          <div className="summary-value">₹{(totalTax / 2).toLocaleString()}</div>
        </div>
      </div>

      {/* Tax Slab Summary */}
      <div className="tax-slab-summary">
        <h3>Tax Slab Summary</h3>
        <div className="slab-cards">
          {taxSlabSummary.map((slab) => (
            <div key={slab.rate} className="slab-card">
              <div className="slab-rate">{slab.rate}% GST</div>
              <div className="slab-details">
                <div className="slab-item">
                  <span>Taxable Value:</span>
                  <span>₹{slab.taxableValue.toLocaleString()}</span>
                </div>
                <div className="slab-item">
                  <span>Tax Amount:</span>
                  <span>₹{slab.tax.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HSN-wise GST Report */}
      <div className="hsn-report">
        <h3>HSN-wise GST Report</h3>
        <div className="hsn-table-container">
          <table className="hsn-table">
            <thead>
              <tr>
                <th>HSN Code</th>
                <th>Description</th>
                <th>Tax Rate</th>
                <th>Taxable Value</th>
                <th>CGST</th>
                <th>SGST</th>
                <th>IGST</th>
                <th>Total Tax</th>
              </tr>
            </thead>
            <tbody>
              {gstData.map((item, index) => (
                <tr key={index}>
                  <td className="hsn-code">{item.hsnCode}</td>
                  <td className="description">{item.description}</td>
                  <td className="tax-rate">{item.taxRate}%</td>
                  <td className="amount">₹{item.taxableValue.toLocaleString()}</td>
                  <td className="amount">₹{item.cgst.toLocaleString()}</td>
                  <td className="amount">₹{item.sgst.toLocaleString()}</td>
                  <td className="amount">₹{item.igst.toLocaleString()}</td>
                  <td className="amount total">₹{item.totalTax.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="total-row">
                <td colSpan="3"><strong>Total</strong></td>
                <td className="amount"><strong>₹{totalTaxableValue.toLocaleString()}</strong></td>
                <td className="amount"><strong>₹{(totalTax / 2).toLocaleString()}</strong></td>
                <td className="amount"><strong>₹{(totalTax / 2).toLocaleString()}</strong></td>
                <td className="amount"><strong>₹0</strong></td>
                <td className="amount total"><strong>₹{totalTax.toLocaleString()}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Compliance Checklist */}
      <div className="compliance-checklist">
        <h3>GST Compliance Checklist</h3>
        <div className="checklist-items">
          <div className="checklist-item completed">
            <div className="checkbox checked"></div>
            <div className="item-text">All invoices have valid HSN codes</div>
          </div>
          <div className="checklist-item completed">
            <div className="checkbox checked"></div>
            <div className="item-text">Tax rates are correctly applied</div>
          </div>
          <div className="checklist-item completed">
            <div className="checkbox checked"></div>
            <div className="item-text">CGST/SGST split is accurate</div>
          </div>
          <div className="checklist-item pending">
            <div className="checkbox"></div>
            <div className="item-text">Monthly GSTR-1 filing pending</div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="export-options">
        <h3>Export Options</h3>
        <div className="export-buttons">
          <button className="export-btn">
            <FileText size={20} />
            <div className="export-info">
              <div className="export-title">GSTR-1 Format</div>
              <div className="export-desc">For monthly/quarterly filing</div>
            </div>
          </button>
          <button className="export-btn">
            <Calculator size={20} />
            <div className="export-info">
              <div className="export-title">GSTR-3B Format</div>
              <div className="export-desc">Summary return format</div>
            </div>
          </button>
          <button className="export-btn">
            <Download size={20} />
            <div className="export-info">
              <div className="export-title">Excel Report</div>
              <div className="export-desc">Detailed analysis format</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GSTReports;
