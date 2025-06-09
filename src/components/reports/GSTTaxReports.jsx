import { useState } from 'react';
import { Download, FileText, Calculator, Receipt, Archive } from 'lucide-react';

const GSTTaxReports = () => {
  const [selectedReport, setSelectedReport] = useState('gst-summary');

  // Mock GST data
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

  const totalTaxableValue = gstData.reduce((sum, item) => sum + item.taxableValue, 0);
  const totalTax = gstData.reduce((sum, item) => sum + item.totalTax, 0);

  const reportTypes = [
    { id: 'gst-summary', label: 'GST Summary (CGST, SGST, IGST)', icon: Calculator },
    { id: 'hsn-wise', label: 'HSN Code-wise GST Report', icon: FileText },
    { id: 'gst-by-invoice', label: 'GST by Invoice', icon: Receipt },
    { id: 'export-formats', label: 'Export for Accountant', icon: Archive }
  ];

  const handleExport = (format) => {
    console.log(`Exporting GST report in ${format} format`);
  };

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'gst-summary':
        return (
          <div className="report-content">
            <div className="gst-summary">
              <div className="summary-card primary">
                <div className="summary-icon">
                  <Calculator size={24} />
                </div>
                <div className="summary-content">
                  <div className="summary-value">₹{totalTaxableValue.toLocaleString()}</div>
                  <div className="summary-label">Total Taxable Value</div>
                </div>
              </div>
              <div className="summary-card secondary">
                <div className="summary-icon">
                  <FileText size={24} />
                </div>
                <div className="summary-content">
                  <div className="summary-value">₹{totalTax.toLocaleString()}</div>
                  <div className="summary-label">Total GST Collected</div>
                </div>
              </div>
              <div className="summary-card accent">
                <div className="summary-icon">
                  <Receipt size={24} />
                </div>
                <div className="summary-content">
                  <div className="summary-value">₹{(totalTax / 2).toLocaleString()}</div>
                  <div className="summary-label">CGST</div>
                </div>
              </div>
              <div className="summary-card warning">
                <div className="summary-icon">
                  <Archive size={24} />
                </div>
                <div className="summary-content">
                  <div className="summary-value">₹{(totalTax / 2).toLocaleString()}</div>
                  <div className="summary-label">SGST</div>
                </div>
              </div>
            </div>

            <div className="report-section">
              <h3>Tax Slab Summary</h3>
              <div className="tax-slabs">
                {[5, 12, 18, 28].map(rate => {
                  const slabData = gstData.filter(item => item.taxRate === rate);
                  const slabValue = slabData.reduce((sum, item) => sum + item.taxableValue, 0);
                  const slabTax = slabData.reduce((sum, item) => sum + item.totalTax, 0);
                  
                  return (
                    <div key={rate} className="tax-slab-card">
                      <div className="slab-rate">{rate}% GST</div>
                      <div className="slab-details">
                        <div className="slab-item">
                          <span>Taxable Value:</span>
                          <span>₹{slabValue.toLocaleString()}</span>
                        </div>
                        <div className="slab-item">
                          <span>Tax Amount:</span>
                          <span>₹{slabTax.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'hsn-wise':
        return (
          <div className="report-content">
            <div className="report-section">
              <h3>HSN Code-wise GST Report</h3>
              <div className="report-table-container">
                <table className="report-table">
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
                        <td>{item.description}</td>
                        <td className="tax-rate">{item.taxRate}%</td>
                        <td>₹{item.taxableValue.toLocaleString()}</td>
                        <td>₹{item.cgst.toLocaleString()}</td>
                        <td>₹{item.sgst.toLocaleString()}</td>
                        <td>₹{item.igst.toLocaleString()}</td>
                        <td className="total-tax">₹{item.totalTax.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="total-row">
                      <td colSpan="3"><strong>Total</strong></td>
                      <td><strong>₹{totalTaxableValue.toLocaleString()}</strong></td>
                      <td><strong>₹{(totalTax / 2).toLocaleString()}</strong></td>
                      <td><strong>₹{(totalTax / 2).toLocaleString()}</strong></td>
                      <td><strong>₹0</strong></td>
                      <td><strong>₹{totalTax.toLocaleString()}</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        );

      case 'export-formats':
        return (
          <div className="report-content">
            <div className="report-section">
              <h3>Export Options for Accountant</h3>
              <div className="export-options">
                <div className="export-card">
                  <div className="export-icon">
                    <FileText size={32} />
                  </div>
                  <div className="export-info">
                    <h4>GSTR-1 Format</h4>
                    <p>Monthly/Quarterly return format for outward supplies</p>
                    <button className="btn btn-primary" onClick={() => handleExport('gstr1')}>
                      Export GSTR-1
                    </button>
                  </div>
                </div>

                <div className="export-card">
                  <div className="export-icon">
                    <Calculator size={32} />
                  </div>
                  <div className="export-info">
                    <h4>GSTR-3B Format</h4>
                    <p>Summary return format for monthly filing</p>
                    <button className="btn btn-primary" onClick={() => handleExport('gstr3b')}>
                      Export GSTR-3B
                    </button>
                  </div>
                </div>

                <div className="export-card">
                  <div className="export-icon">
                    <Archive size={32} />
                  </div>
                  <div className="export-info">
                    <h4>Excel Format</h4>
                    <p>Detailed GST data in Excel format for analysis</p>
                    <button className="btn btn-primary" onClick={() => handleExport('excel')}>
                      Export Excel
                    </button>
                  </div>
                </div>

                <div className="export-card">
                  <div className="export-icon">
                    <Receipt size={32} />
                  </div>
                  <div className="export-info">
                    <h4>JSON Format</h4>
                    <p>Machine-readable format for accounting software</p>
                    <button className="btn btn-primary" onClick={() => handleExport('json')}>
                      Export JSON
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="report-content">
            <div className="report-section">
              <h3>Report Coming Soon</h3>
              <p>This report is under development and will be available soon.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="report-container">
      <div className="report-header">
        <div className="header-info">
          <h2>GST & Tax Reports</h2>
          <p>Tax filing and compliance reports</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={() => handleExport('pdf')}>
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="report-types">
        {reportTypes.map((type) => {
          const IconComponent = type.icon;
          return (
            <button
              key={type.id}
              className={`report-type-btn ${selectedReport === type.id ? 'active' : ''}`}
              onClick={() => setSelectedReport(type.id)}
            >
              <IconComponent size={20} />
              <span>{type.label}</span>
            </button>
          );
        })}
      </div>

      {/* Report Content */}
      {renderReportContent()}
    </div>
  );
};

export default GSTTaxReports;
