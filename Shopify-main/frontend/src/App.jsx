import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import { Calendar, DollarSign, Users, ShoppingCart, LogOut, Package, Store, Eye, EyeOff, Sparkles, User, Lock, ArrowRight } from 'lucide-react';

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

// Auth Page Component
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

  const isFormValid = username && password;

  return (
    <div className="min-h-screen bg-[#1a1c1e] text-white font-grotesk flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-[#FF7139]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 max-w-md w-full mx-4">
        <div className="bg-[#1a1c1e]/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10 animate-fadeInUp">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#FF7139] to-[#FF7139]/80 rounded-2xl mb-4">
              <Store className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-3xl font-bold tracking-wide mb-2">Shopify Insights</h1>
            <p className="text-white/60 text-sm">Sign in to view your store analytics</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Username</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/30 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#FF7139]/50 focus:border-[#FF7139]/30 transition-all duration-200"
                  placeholder="Enter your username"
                  disabled={loading}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FF7139]/60">
                  <User className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-black/30 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#FF7139]/50 focus:border-[#FF7139]/30 transition-all duration-200"
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FF7139]/60">
                  <Lock className="w-5 h-5" />
                </div>
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
              <div className="text-red-400 text-sm text-center bg-red-400/10 border border-red-400/20 rounded-lg p-3 animate-shake">
                <div className="flex items-center justify-center gap-2">
                  <span>{error}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !isFormValid}
              className={`w-full group font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                isFormValid && !loading
                ? 'bg-gradient-to-r from-[#FF7139] to-[#FF7139]/90 text-black hover:scale-[1.02] active:scale-95 hover:shadow-[#FF7139]/20'
                : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              )}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <button
              onClick={() => setShowDemo(!showDemo)}
              className="w-full flex items-center justify-center text-white/60 hover:text-white transition-colors duration-300 text-sm"
            >
              <Sparkles className="w-4 h-4 mr-2 text-[#FF7139]" />
              {showDemo ? 'Hide' : 'Show'} Demo Credentials
            </button>
            
            {showDemo && (
              <div className="mt-4 space-y-2 animate-fadeIn">
                <p className="text-xs text-white/50 text-center mb-3">Click any credential to auto-fill:</p>
                {demoCredentials.map((cred, index) => (
                  <div
                    key={index}
                    onClick={() => handleDemoLogin(cred)}
                    className="bg-black/20 border border-white/10 rounded-lg p-3 cursor-pointer hover:bg-black/40 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white text-sm font-medium">{cred.username}</p>
                        <p className="text-white/50 text-xs">{cred.description}</p>
                      </div>
                      <div className="text-white/50 text-xs font-mono">
                        {cred.password}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="text-center mt-6 text-white/40 text-sm">
          <p>Start your analytics journey today</p>
        </div>
      </div>
    </div>
  );
};

// Dashboard Stats Card Component - NEW DESIGN
// eslint-disable-next-line no-unused-vars
const StatsCard = ({ title, value, icon: Icon }) => {
  return (
    <div className="bg-[#1a1c1e]/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-white/60 text-sm font-medium mb-2 group-hover:text-white/80 transition-colors">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className="bg-gradient-to-br from-[#FF7139] to-[#FF7139]/80 p-3 rounded-xl shadow-lg transform group-hover:rotate-6 transition-transform duration-300">
          <Icon className="w-7 h-7 text-black" />
        </div>
      </div>
    </div>
  );
};

// Dashboard Component - NEW DESIGN
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (dateFrom && dateTo) loadData(); }, [dateFrom, dateTo, token, user.tenantId]);

  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1c1e] flex items-center justify-center text-white/80">
        <div className="text-center font-grotesk">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-[#FF7139] mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading Dashboard...</p>
          <p className="text-white/50 text-sm mt-1">Preparing your analytics</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1a1c1e] flex items-center justify-center text-center p-4">
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md border border-red-500/30">
          <h2 className="text-xl font-semibold text-red-400 mb-4">Error Loading Dashboard</h2>
          <p className="text-white/70 mb-6">{error}</p>
          <button 
            onClick={loadData} 
            className="group bg-gradient-to-r from-[#FF7139] to-[#FF7139]/90 text-black font-semibold py-2 px-6 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return <div className="min-h-screen bg-[#1a1c1e] flex items-center justify-center text-white/80">No data found.</div>;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1c1e]/90 backdrop-blur-xl rounded-xl p-4 shadow-2xl border border-white/10">
          <p className="label text-white/80">{formatDate(label)}</p>
          <p className="intro text-white font-bold">{`${payload[0].name}: ${
            payload[0].name === 'Revenue' ? formatCurrency(payload[0].value) : payload[0].value
          }`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#1a1c1e] text-white font-grotesk">
      <header className="sticky top-0 z-30 bg-[#1a1c1e]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-[#FF7139] to-[#FF7139]/80 p-2.5 rounded-xl shadow-lg">
              <Store className="w-7 h-7 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Analytics for {user.shopDomain}
              </h1>
              <p className="text-white/60 text-sm">Welcome back, <span className="font-semibold text-[#FF7139]">{user.username}</span>!</p>
            </div>
          </div>
          <button 
            onClick={onLogout} 
            className="flex items-center px-4 py-2 text-white/80 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </button>
        </div>
      </header>
      
      <main className="p-6 space-y-6">
        <div className="bg-[#1a1c1e]/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 flex flex-wrap items-center gap-4 border border-white/10">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-[#FF7139] mr-3" />
            <span className="text-white/80 font-semibold">Date Range:</span>
          </div>
          <input 
            type="date" 
            value={dateFrom} 
            onChange={(e) => setDateFrom(e.target.value)} 
            className="px-3 py-2 border border-white/20 rounded-xl focus:ring-2 focus:ring-[#FF7139]/50 focus:border-transparent transition-all duration-300 bg-black/30"
          />
          <span className="text-white/50 font-medium">to</span>
          <input 
            type="date" 
            value={dateTo} 
            onChange={(e) => setDateTo(e.target.value)} 
            className="px-3 py-2 border border-white/20 rounded-xl focus:ring-2 focus:ring-[#FF7139]/50 focus:border-transparent transition-all duration-300 bg-black/30"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Total Customers" value={Number(data.totalCustomers).toLocaleString()} icon={Users} />
          <StatsCard title="Total Products" value={Number(data.totalProducts).toLocaleString()} icon={Package} />
          <StatsCard title="Total Orders" value={Number(data.totalOrders).toLocaleString()} icon={ShoppingCart} />
          <StatsCard title="Total Revenue" value={formatCurrency(data.totalRevenue)} icon={DollarSign} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#1a1c1e]/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <div className="w-1.5 h-6 bg-[#FF7139] rounded-full mr-3"></div>
              Orders Over Time
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.ordersByDate}>
                <defs>
                  <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF7139" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#FF7139" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="date" tickFormatter={formatDate} stroke="rgba(255, 255, 255, 0.4)" fontSize={12} />
                <YAxis stroke="rgba(255, 255, 255, 0.4)" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  name="Orders"
                  stroke="#FF7139" 
                  strokeWidth={2}
                  fill="url(#orderGradient)"
                  dot={{ fill: '#FF7139', strokeWidth: 0, r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-[#1a1c1e]/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
               <div className="w-1.5 h-6 bg-cyan-400 rounded-full mr-3"></div>
              Revenue Over Time
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.revenueByDate}>
                 <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="date" tickFormatter={formatDate} stroke="rgba(255, 255, 255, 0.4)" fontSize={12} />
                <YAxis stroke="rgba(255, 255, 255, 0.4)" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" name="Revenue" fill="url(#revenueGradient)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#1a1c1e]/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center">
            <div className="w-1.5 h-6 bg-emerald-400 rounded-full mr-3"></div>
            Top 5 Customers by Spend
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 font-semibold text-white/60">Customer</th>
                  <th className="text-center py-3 px-4 font-semibold text-white/60">Orders</th>
                  <th className="text-right py-3 px-4 font-semibold text-white/60">Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {data.topCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold">{customer.firstName} {customer.lastName}</div>
                      <div className="text-xs text-white/50">{customer.email}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="bg-[#FF7139]/10 text-[#FF7139] px-3 py-1 rounded-full font-medium">
                        {customer.orderCount}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-emerald-400">
                      {formatCurrency(customer.totalSpent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-[#1a1c1e]/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center">
             <div className="w-1.5 h-6 bg-indigo-400 rounded-full mr-3"></div>
            Recently Added Products
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.recentProducts.map((product) => (
              <div key={product.id} className="bg-black/30 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors">
                <h4 className="font-semibold text-white truncate mb-1">{product.title}</h4>
                <p className="text-sm text-white/60">by <span className="font-medium text-indigo-400">{product.vendor}</span></p>
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
    const savedUser = localStorage.getItem('shopify_user');
    const savedToken = localStorage.getItem('shopify_token');
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      // eslint-disable-next-line no-unused-vars
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
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
        
        .font-grotesk {
          font-family: 'Space Grotesk', sans-serif;
        }

        /* Custom dark date picker */
        input[type="date"] {
          color-scheme: dark;
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          background-color: #FF7139;
          border-radius: 4px;
          cursor: pointer;
          padding: 2px;
          filter: invert(1);
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

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
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
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