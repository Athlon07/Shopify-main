import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar, DollarSign, Users, ShoppingCart, LogOut, Package, Store, Eye, EyeOff, Sparkles } from 'lucide-react';

// API Configuration - Update this if your backend is deployed elsewhere
const API_BASE = 'https://shopify-c669.onrender.com';

// Demo credentials for testing
const demoCredentials = [
  {
    username: 'admin_tenant1',
    password: 'admin123',
    tenantId: 1,
    description: 'Admin - 14dgk9-my.myshopify.com'
  },
  {
    username: 'manager_tenant1',
    password: 'manager123',
    tenantId: 1,
    description: 'Manager - 14dgk9-my.myshopify.com'
  },
  {
    username: 'admin_tenant2',
    password: 'admin456',
    tenantId: 2,
    description: 'Admin - ukqatr-e0.myshopify.com'
  },
  {
    username: 'staff_tenant2',
    password: 'staff123',
    tenantId: 2,
    description: 'Staff - ukqatr-e0.myshopify.com'
  }
];

// API functions for interacting with the backend
const api = {
  login: async (username, password) => {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Authentication failed');
    }
    
    return response.json();
  },
  getDashboardData: async (tenantId, token, dateFrom, dateTo) => {
    const params = new URLSearchParams({ from: dateFrom, to: dateTo });
    const response = await fetch(`${API_BASE}/api/dashboard/${tenantId}?${params}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }
    
    return response.json();
  }
};

// Auth Page Component with TaskFlow Design
const AuthPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDemo, setShowDemo] = useState(false);

  const handleSubmit = async () => {
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const result = await api.login(username, password);
      onLogin(result.user, result.token);
    } catch (err) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (credentials) => {
    setUsername(credentials.username);
    setPassword(credentials.password);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen text-white flex items-center justify-center" style={{
      background: `
        linear-gradient(135deg, rgba(255, 113, 57, 0.1) 0%, transparent 50%),
        radial-gradient(ellipse at top left, rgba(26, 28, 30, 0.9) 0%, transparent 50%),
        linear-gradient(180deg, #0f0f1a 0%, #1a1c1e 50%, #0d0e14 100%)
      `,
      backgroundAttachment: 'fixed'
    }}>
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10 max-w-md w-full mx-4">
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10 animate-fade-in-up">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-4">
              <Store className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-3xl font-bold tracking-wide mb-2">Shopify Insights</h1>
            <p className="text-white/60 text-sm">Sign in to view your store analytics</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/30 transition-all duration-200"
                placeholder="Enter your username"
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-black/30 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/30 transition-all duration-200"
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <span>⚠</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Sign In</span>
                  <div className="group-hover:translate-x-1 transition-transform duration-200">→</div>
                </div>
              )}
            </button>

            {/* Demo Credentials Section */}
            <div className="mt-6">
              <button
                onClick={() => setShowDemo(!showDemo)}
                className="w-full flex items-center justify-center text-white/60 hover:text-white transition-colors duration-300 text-sm"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {showDemo ? 'Hide' : 'Show'} Demo Credentials
              </button>
              
              {showDemo && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-white/60 text-center mb-3">Click any credential to auto-fill:</p>
                  {demoCredentials.map((cred, index) => (
                    <div
                      key={index}
                      onClick={() => handleDemoLogin(cred)}
                      className="bg-white/5 border border-white/10 rounded-lg p-3 cursor-pointer hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white text-sm font-medium">{cred.username}</p>
                          <p className="text-white/60 text-xs">{cred.description}</p>
                        </div>
                        <div className="text-white/60 text-xs">
                          {cred.password}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-orange-500" />
                </div>
                <span className="text-xs text-white/60">Orders</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-orange-500" />
                </div>
                <span className="text-xs text-white/60">Revenue</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-orange-500" />
                </div>
                <span className="text-xs text-white/60">Customers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-white/40 text-sm">
          <p>Analyze your store performance</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

// Dashboard Stats Card Component with TaskFlow Design
const StatsCard = ({ title, value, icon: Icon, color = "orange" }) => {
  const colorClasses = {
    orange: "from-orange-500 to-orange-600",
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600", 
    purple: "from-purple-500 to-purple-600",
  };

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/10 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-white/60 text-sm font-medium mb-2 group-hover:text-white/80 transition-colors">{title}</p>
          <p className="text-3xl font-bold text-white group-hover:text-white transition-colors">{value}</p>
        </div>
        <div className={`bg-gradient-to-r ${colorClasses[color]} p-4 rounded-2xl shadow-lg group-hover:shadow-xl transform group-hover:rotate-12 transition-all duration-300`}>
          <Icon className="w-8 h-8 text-black" />
        </div>
      </div>
    </div>
  );
};

// Dashboard Component with TaskFlow Design
const Dashboard = ({ user, token, onLogout }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(new Date().setDate(today.getDate() - 30));
    setDateTo(today.toISOString().split('T')[0]);
    setDateFrom(thirtyDaysAgo.toISOString().split('T')[0]);
  }, []);

  const loadData = async () => {
    if (!dateFrom || !dateTo) return;
    setLoading(true);
    setError('');
    try {
      const dashboardData = await api.getDashboardData(user.tenantId, token, dateFrom, dateTo);
      setData(dashboardData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [dateFrom, dateTo, token, user.tenantId]);

  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  if (loading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center" style={{
        background: `
          linear-gradient(135deg, rgba(255, 113, 57, 0.1) 0%, transparent 50%),
          radial-gradient(ellipse at top left, rgba(26, 28, 30, 0.9) 0%, transparent 50%),
          linear-gradient(180deg, #0f0f1a 0%, #1a1c1e 50%, #0d0e14 100%)
        `,
        backgroundAttachment: 'fixed'
      }}>
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto mb-4"></div>
          </div>
          <p className="text-white text-lg font-medium">Loading dashboard...</p>
          <p className="text-white/60 text-sm mt-2">Preparing your analytics</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center" style={{
        background: `
          linear-gradient(135deg, rgba(255, 113, 57, 0.1) 0%, transparent 50%),
          radial-gradient(ellipse at top left, rgba(26, 28, 30, 0.9) 0%, transparent 50%),
          linear-gradient(180deg, #0f0f1a 0%, #1a1c1e 50%, #0d0e14 100%)
        `,
        backgroundAttachment: 'fixed'
      }}>
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md border border-white/10">
          <h2 className="text-xl font-semibold text-red-400 mb-4">Error Loading Dashboard</h2>
          <p className="text-white/80 mb-6">{error}</p>
          <button 
            onClick={loadData} 
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-black px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return <div>No data found.</div>;

  return (
    <div className="min-h-screen text-white" style={{
      background: `
        linear-gradient(135deg, rgba(255, 113, 57, 0.1) 0%, transparent 50%),
        radial-gradient(ellipse at top left, rgba(26, 28, 30, 0.9) 0%, transparent 50%),
        linear-gradient(180deg, #0f0f1a 0%, #1a1c1e 50%, #0d0e14 100%)
      `,
      backgroundAttachment: 'fixed'
    }}>
      <header className="bg-slate-800/80 backdrop-blur-xl border-b border-white/10 px-6 py-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-2 rounded-xl shadow-lg">
              <Store className="w-8 h-8 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Analytics for {user.shopDomain}
              </h1>
              <p className="text-white/60">Welcome back, <span className="font-semibold text-orange-500">{user.username}</span>!</p>
            </div>
          </div>
          <button 
            onClick={onLogout} 
            className="flex items-center px-6 py-3 text-white/60 hover:bg-white/10 rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </button>
        </div>
      </header>
      
      <main className="p-6 space-y-8">
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 flex flex-wrap items-center gap-4 border border-white/10">
          <div className="flex items-center">
            <Calendar className="w-6 h-6 text-orange-500 mr-3" />
            <span className="text-white font-semibold">Date Range:</span>
          </div>
          <input 
            type="date" 
            value={dateFrom} 
            onChange={(e) => setDateFrom(e.target.value)} 
            className="px-4 py-2 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/30 transition-all duration-300 bg-black/30 backdrop-blur-sm text-white"
            style={{colorScheme: 'dark'}}
          />
          <span className="text-white/60 font-medium">to</span>
          <input 
            type="date" 
            value={dateTo} 
            onChange={(e) => setDateTo(e.target.value)} 
            className="px-4 py-2 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/30 transition-all duration-300 bg-black/30 backdrop-blur-sm text-white"
            style={{colorScheme: 'dark'}}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Total Customers" value={Number(data.totalCustomers).toLocaleString()} icon={Users} color="orange" />
          <StatsCard title="Total Products" value={Number(data.totalProducts).toLocaleString()} icon={Package} color="green" />
          <StatsCard title="Total Orders" value={Number(data.totalOrders).toLocaleString()} icon={ShoppingCart} color="blue" />
          <StatsCard title="Total Revenue" value={formatCurrency(data.totalRevenue)} icon={DollarSign} color="purple" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/10 hover:shadow-2xl transition-all duration-500">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <div className="w-2 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full mr-3"></div>
              Orders Over Time
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.ordersByDate}>
                <defs>
                  <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF7139" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FF7139" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" tickFormatter={formatDate} stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  labelFormatter={formatDate}
                  contentStyle={{
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                    color: '#ffffff'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#FF7139" 
                  strokeWidth={3}
                  fill="url(#orderGradient)"
                  dot={{ fill: '#FF7139', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/10 hover:shadow-2xl transition-all duration-500">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <div className="w-2 h-6 bg-gradient-to-b from-green-500 to-green-600 rounded-full mr-3"></div>
              Revenue Over Time
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.revenueByDate}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" tickFormatter={formatDate} stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  labelFormatter={formatDate} 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                    color: '#ffffff'
                  }}
                />
                <Bar dataKey="revenue" fill="url(#revenueGradient)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/10 hover:shadow-2xl transition-all duration-500">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full mr-3"></div>
            Top 5 Customers by Spend
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-4 px-4 font-bold text-white">Customer</th>
                  <th className="text-center py-4 px-4 font-bold text-white">Orders</th>
                  <th className="text-right py-4 px-4 font-bold text-white">Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {data.topCustomers.map((customer, index) => (
                  <tr key={customer.id} className="border-b border-white/10 hover:bg-white/5 transition-all duration-300 group">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${
                          index === 0 ? 'from-yellow-400 to-orange-400' :
                          index === 1 ? 'from-gray-400 to-gray-500' :
                          index === 2 ? 'from-orange-400 to-red-400' :
                          'from-orange-400 to-orange-500'
                        } flex items-center justify-center text-black font-bold mr-4 group-hover:scale-110 transition-transform duration-300`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{customer.firstName} {customer.lastName}</div>
                          <div className="text-sm text-white/60">{customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm font-medium">
                        {customer.orderCount}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-bold text-green-400 text-lg">{formatCurrency(customer.totalSpent)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/10 hover:shadow-2xl transition-all duration-500">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full mr-3"></div>
            Recently Added Products
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.recentProducts.map((product) => (
              <div key={product.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 hover:bg-white/10">
                <div className="flex items-start justify-between mb-3">
                  <Package className="text-orange-500 w-6 h-6 flex-shrink-0" />
                  <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full">NEW</span>
                </div>
                <h4 className="font-semibold text-white truncate mb-2">{product.title}</h4>
                <p className="text-sm text-white/60">by <span className="font-medium text-orange-500">{product.vendor}</span></p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

// Main App Component
const App = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('shopify_user') || 'null');
    const savedToken = localStorage.getItem('shopify_token');
    if (savedUser && savedToken) {
      try {
        setUser(savedUser);
        setToken(savedToken);
      } catch (e) {
        localStorage.clear();
      }
    }
  }, []);

  const handleLogin = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('shopify_user', JSON.stringify(userData));
    localStorage.setItem('shopify_token', authToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  return (
    <div className="App">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb {
          background: #FF7139;
          border-radius: 3px;
        }
        
        /* Custom date input styling */
        input[type="date"] {
          position: relative;
          color-scheme: dark;
        }
        
        input[type="date"]::-webkit-calendar-picker-indicator {
          background-color: #FF7139;
          border-radius: 4px;
          cursor: pointer;
          padding: 2px;
          filter: invert(1);
        }
      `}</style>
      {!user || !token ? (
        <AuthPage onLogin={handleLogin} />
      ) : (
        <Dashboard user={user} token={token} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;