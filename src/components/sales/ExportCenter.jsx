import { useState } from 'react';
import { Download, FileText, Table, Mail, Calendar, Filter } from 'lucide-react';

const ExportCenter = () => {
  const [exportType, setExportType] = useState('sales');
  const [format, setFormat] = useState('excel');
  const [dateRange, setDateRange] = useState('month');

  const exportOptions = [
    {
      id: 'sales',
      title: 'Sales Reports',
      description: 'Complete sales data with customer and payment details',
      formats: ['excel', 'csv', 'pdf']
    },
    {
      id: 'gst',
      title: 'GST Reports',
      description: 'Tax reports in GSTR-1 and GSTR-3B formats',
      formats: ['excel', 'csv', 'gstr1', 'gstr3b']
    },
    {
      id: 'analytics',
      title: 'Analytics Data',
      description: 'Revenue analytics and performance metrics',
      formats: ['excel', 'pdf', 'csv']
    },
    {
      id: 'daily',
      title: 'Daily Summaries',
      description: 'Daily closing reports and summaries',
      formats: ['pdf', 'excel']
    }
  ];

  const handleExport = () => {
    console.log(`Exporting ${exportType} in ${format} format for ${dateRange} period`);
  };

  const handleScheduleExport = () => {
    console.log('Scheduling automatic export...');
  };

  return (
    <div className="export-center">
      <div className="export-header">
        <div className="header-info">
          <h2>Export Center</h2>
          <p>Export sales data in various formats for analysis and compliance</p>
        </div>
      </div>

      <div className="export-content">
        {/* Export Type Selection */}
        <div className="export-section">
          <h3>Select Report Type</h3>
          <div className="export-types">
            {exportOptions.map((option) => (
              <div
                key={option.id}
                className={`export-type ${exportType === option.id ? 'selected' : ''}`}
                onClick={() => setExportType(option.id)}
              >
                <div className="type-title">{option.title}</div>
                <div className="type-description">{option.description}</div>
                <div className="type-formats">
                  Formats: {option.formats.join(', ').toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Configuration */}
        <div className="export-config">
          <div className="config-section">
            <h4>Export Configuration</h4>
            <div className="config-grid">
              <div className="config-item">
                <label>Format:</label>
                <select value={format} onChange={(e) => setFormat(e.target.value)}>
                  {exportOptions.find(opt => opt.id === exportType)?.formats.map(fmt => (
                    <option key={fmt} value={fmt}>{fmt.toUpperCase()}</option>
                  ))}
                </select>
              </div>
              <div className="config-item">
                <label>Date Range:</label>
                <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
            </div>
          </div>

          <div className="export-actions">
            <button className="btn btn-primary" onClick={handleExport}>
              <Download size={16} />
              Export Now
            </button>
            <button className="btn btn-outline" onClick={handleScheduleExport}>
              <Calendar size={16} />
              Schedule Export
            </button>
          </div>
        </div>

        {/* Quick Export Buttons */}
        <div className="quick-exports">
          <h4>Quick Exports</h4>
          <div className="quick-buttons">
            <button className="quick-btn">
              <FileText size={24} />
              <span>Today's Sales (PDF)</span>
            </button>
            <button className="quick-btn">
              <Table size={24} />
              <span>Monthly Report (Excel)</span>
            </button>
            <button className="quick-btn">
              <Mail size={24} />
              <span>Email Summary</span>
            </button>
          </div>
        </div>

        {/* Scheduled Exports */}
        <div className="scheduled-exports">
          <h4>Scheduled Exports</h4>
          <div className="schedule-list">
            <div className="schedule-item">
              <div className="schedule-info">
                <div className="schedule-name">Daily Sales Summary</div>
                <div className="schedule-details">PDF • Every day at 9:00 PM • Email to admin</div>
              </div>
              <div className="schedule-actions">
                <button className="btn-small">Edit</button>
                <button className="btn-small btn-danger">Delete</button>
              </div>
            </div>
            <div className="schedule-item">
              <div className="schedule-info">
                <div className="schedule-name">Monthly GST Report</div>
                <div className="schedule-details">Excel • 1st of every month • Email to accountant</div>
              </div>
              <div className="schedule-actions">
                <button className="btn-small">Edit</button>
                <button className="btn-small btn-danger">Delete</button>
              </div>
            </div>
          </div>
          <button className="btn btn-outline">Add New Schedule</button>
        </div>
      </div>
    </div>
  );
};

export default ExportCenter;
