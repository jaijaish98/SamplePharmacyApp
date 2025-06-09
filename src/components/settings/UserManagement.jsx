import { useState } from 'react';
import { Users, Shield, Eye, Edit, Lock, Check, X, Plus } from 'lucide-react';

const UserManagement = () => {
  const [selectedRole, setSelectedRole] = useState('admin');

  const roles = [
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Full system access with all permissions',
      users: ['Dr. Sathya', 'Admin User'],
      permissions: {
        // Dashboard & Analytics
        viewDashboard: true,
        viewReports: true,
        viewAnalytics: true,
        
        // Sales & Revenue
        viewSalesData: true,
        viewRevenueReports: true,
        exportSalesData: true,
        
        // Inventory & Stock
        manageInventory: true,
        manageStock: true,
        viewStockReports: true,
        
        // Billing & Customers
        processBilling: true,
        manageCustomers: true,
        viewCustomerData: true,
        
        // System Administration
        manageUsers: true,
        systemSettings: true,
        securitySettings: true,
        
        // Data & Exports
        exportAllData: true,
        scheduleReports: true,
        accessAuditLogs: true
      }
    },
    {
      id: 'manager',
      name: 'Store Manager',
      description: 'Management access with operational permissions',
      users: ['Store Manager', 'Assistant Manager'],
      permissions: {
        // Dashboard & Analytics
        viewDashboard: true,
        viewReports: true,
        viewAnalytics: true,
        
        // Sales & Revenue
        viewSalesData: true,
        viewRevenueReports: true,
        exportSalesData: true,
        
        // Inventory & Stock
        manageInventory: true,
        manageStock: true,
        viewStockReports: true,
        
        // Billing & Customers
        processBilling: true,
        manageCustomers: true,
        viewCustomerData: true,
        
        // System Administration
        manageUsers: false,
        systemSettings: false,
        securitySettings: false,
        
        // Data & Exports
        exportAllData: false,
        scheduleReports: true,
        accessAuditLogs: false
      }
    },
    {
      id: 'pharmacist',
      name: 'Pharmacist',
      description: 'Pharmacy operations with limited administrative access',
      users: ['Pharmacist A', 'Pharmacist B', 'Senior Pharmacist'],
      permissions: {
        // Dashboard & Analytics
        viewDashboard: true,
        viewReports: true,
        viewAnalytics: false,
        
        // Sales & Revenue
        viewSalesData: true,
        viewRevenueReports: false,
        exportSalesData: false,
        
        // Inventory & Stock
        manageInventory: true,
        manageStock: true,
        viewStockReports: true,
        
        // Billing & Customers
        processBilling: true,
        manageCustomers: true,
        viewCustomerData: true,
        
        // System Administration
        manageUsers: false,
        systemSettings: false,
        securitySettings: false,
        
        // Data & Exports
        exportAllData: false,
        scheduleReports: false,
        accessAuditLogs: false
      }
    },
    {
      id: 'cashier',
      name: 'Cashier',
      description: 'Billing and basic operations access only',
      users: ['Cashier 1', 'Cashier 2', 'Part-time Cashier'],
      permissions: {
        // Dashboard & Analytics
        viewDashboard: false,
        viewReports: false,
        viewAnalytics: false,
        
        // Sales & Revenue
        viewSalesData: false,
        viewRevenueReports: false,
        exportSalesData: false,
        
        // Inventory & Stock
        manageInventory: false,
        manageStock: false,
        viewStockReports: false,
        
        // Billing & Customers
        processBilling: true,
        manageCustomers: true,
        viewCustomerData: true,
        
        // System Administration
        manageUsers: false,
        systemSettings: false,
        securitySettings: false,
        
        // Data & Exports
        exportAllData: false,
        scheduleReports: false,
        accessAuditLogs: false
      }
    },
    {
      id: 'assistant',
      name: 'Store Assistant',
      description: 'Basic inventory and customer service access',
      users: ['Store Assistant', 'Helper'],
      permissions: {
        // Dashboard & Analytics
        viewDashboard: false,
        viewReports: false,
        viewAnalytics: false,
        
        // Sales & Revenue
        viewSalesData: false,
        viewRevenueReports: false,
        exportSalesData: false,
        
        // Inventory & Stock
        manageInventory: true,
        manageStock: false,
        viewStockReports: false,
        
        // Billing & Customers
        processBilling: false,
        manageCustomers: true,
        viewCustomerData: true,
        
        // System Administration
        manageUsers: false,
        systemSettings: false,
        securitySettings: false,
        
        // Data & Exports
        exportAllData: false,
        scheduleReports: false,
        accessAuditLogs: false
      }
    }
  ];

  const permissionCategories = {
    'Dashboard & Analytics': ['viewDashboard', 'viewReports', 'viewAnalytics'],
    'Sales & Revenue': ['viewSalesData', 'viewRevenueReports', 'exportSalesData'],
    'Inventory & Stock': ['manageInventory', 'manageStock', 'viewStockReports'],
    'Billing & Customers': ['processBilling', 'manageCustomers', 'viewCustomerData'],
    'System Administration': ['manageUsers', 'systemSettings', 'securitySettings'],
    'Data & Exports': ['exportAllData', 'scheduleReports', 'accessAuditLogs']
  };

  const permissionLabels = {
    viewDashboard: 'View Dashboard',
    viewReports: 'View Reports',
    viewAnalytics: 'View Analytics',
    viewSalesData: 'View Sales Data',
    viewRevenueReports: 'View Revenue Reports',
    exportSalesData: 'Export Sales Data',
    manageInventory: 'Manage Inventory',
    manageStock: 'Manage Stock',
    viewStockReports: 'View Stock Reports',
    processBilling: 'Process Billing',
    manageCustomers: 'Manage Customers',
    viewCustomerData: 'View Customer Data',
    manageUsers: 'Manage Users',
    systemSettings: 'System Settings',
    securitySettings: 'Security Settings',
    exportAllData: 'Export All Data',
    scheduleReports: 'Schedule Reports',
    accessAuditLogs: 'Access Audit Logs'
  };

  const selectedRoleData = roles.find(role => role.id === selectedRole);

  const handlePermissionChange = (permission, value) => {
    console.log(`Changing ${permission} to ${value} for role ${selectedRole}`);
  };

  const handleAddUser = () => {
    console.log(`Adding user to role ${selectedRole}`);
  };

  const handleRemoveUser = (user) => {
    console.log(`Removing user ${user} from role ${selectedRole}`);
  };

  return (
    <div className="user-management">
      <div className="management-header">
        <div className="header-info">
          <h2>User Management & Permissions</h2>
          <p>Manage user roles, permissions, and access control across the entire system</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} />
          Add New User
        </button>
      </div>

      <div className="management-content">
        {/* Role Selection */}
        <div className="roles-section">
          <h3>User Roles</h3>
          <div className="roles-grid">
            {roles.map((role) => (
              <div
                key={role.id}
                className={`role-card ${selectedRole === role.id ? 'selected' : ''}`}
                onClick={() => setSelectedRole(role.id)}
              >
                <div className="role-header">
                  <Shield size={20} />
                  <h4>{role.name}</h4>
                </div>
                <p className="role-description">{role.description}</p>
                <div className="role-users">
                  <span className="user-count">{role.users.length} users</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Role Details */}
        {selectedRoleData && (
          <div className="role-details">
            <div className="role-info">
              <h3>{selectedRoleData.name} Permissions</h3>
              <p>{selectedRoleData.description}</p>
            </div>

            {/* Permissions Matrix by Category */}
            <div className="permissions-matrix">
              <h4>System Permissions</h4>
              {Object.entries(permissionCategories).map(([category, permissions]) => (
                <div key={category} className="permission-category">
                  <h5 className="category-title">{category}</h5>
                  <div className="permissions-list">
                    {permissions.map((permission) => (
                      <div key={permission} className="permission-item">
                        <div className="permission-label">{permissionLabels[permission]}</div>
                        <div className="permission-control">
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={selectedRoleData.permissions[permission]}
                              onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                          <span className={`permission-status ${selectedRoleData.permissions[permission] ? 'allowed' : 'denied'}`}>
                            {selectedRoleData.permissions[permission] ? (
                              <>
                                <Check size={16} />
                                Allowed
                              </>
                            ) : (
                              <>
                                <X size={16} />
                                Denied
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Users in Role */}
            <div className="role-users-section">
              <div className="users-header">
                <h4>Users in this Role</h4>
                <button className="btn btn-outline" onClick={handleAddUser}>
                  <Users size={16} />
                  Add User
                </button>
              </div>
              <div className="users-list">
                {selectedRoleData.users.map((user) => (
                  <div key={user} className="user-item">
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-details">
                        <div className="user-name">{user}</div>
                        <div className="user-role">{selectedRoleData.name}</div>
                      </div>
                    </div>
                    <div className="user-actions">
                      <button className="btn-icon" title="Edit User">
                        <Edit size={16} />
                      </button>
                      <button 
                        className="btn-icon danger" 
                        title="Remove User"
                        onClick={() => handleRemoveUser(user)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
