import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store, Lock, CheckCircle, ArrowRight, AlertCircle } from "lucide-react";
import api from "../services/api";

function LoginPage() {
  const [shopDomain, setShopDomain] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";
      const payload = { shopDomain, password };

      const res = await api.post(endpoint, payload);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("tenantId", res.data.tenantId);
      localStorage.setItem("shopDomain", res.data.shopDomain);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: `
            linear-gradient(135deg, rgba(255, 113, 57, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at top left, rgba(26, 28, 30, 0.9) 0%, transparent 50%),
            linear-gradient(180deg, #0f0f1a 0%, #1a1c1e 50%, #0d0e14 100%)
          `,
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Animated Glow Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10 max-w-md w-full mx-4">
        {/* Main Card */}
        <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 hover:border-orange-500/30 transition-colors duration-300">
          {/* Accent Top Line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent rounded-t-2xl" />

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-4 shadow-lg shadow-orange-500/20">
              <CheckCircle className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-3xl font-bold tracking-wide mb-2 text-white">ShopFlow</h1>
            <p className="text-white/60 text-sm">Manage your Shopify tenant with ease</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shop Domain */}
            <div>
              <label htmlFor="shopDomain" className="block text-sm font-medium text-white/80 mb-2">
                Shop Domain
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="shopDomain"
                  placeholder="mystore.myshopify.com"
                  value={shopDomain}
                  onChange={(e) => setShopDomain(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/20 hover:border-white/40 hover:bg-black/50 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all duration-200"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500/70">
                  <Store className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/20 hover:border-white/40 hover:bg-black/50 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all duration-200"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500/70">
                  <Lock className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <div className="flex items-center justify-center gap-2">
                <span>{isLoading ? 'Processing...' : (isRegistering ? 'Register Tenant' : 'Login to Dashboard')}</span>
                {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />}
              </div>
            </button>

            {/* Toggle Login/Register */}
            <div className="text-center">
              <p className="text-white/60 text-sm">
                {isRegistering ? "Already have an account?" : "No account yet?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError("");
                  }}
                  className="text-orange-500 hover:text-orange-400 font-medium transition-colors duration-200"
                >
                  {isRegistering ? "Login" : "Register"}
                </button>
              </p>
            </div>
          </form>

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/30 rounded-xl flex items-center justify-center shadow-inner">
                  <Store className="w-5 h-5 text-orange-500" />
                </div>
                <span className="text-xs text-white/60">Multi-tenant</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/30 rounded-xl flex items-center justify-center shadow-inner">
                  <Lock className="w-5 h-5 text-orange-500" />
                </div>
                <span className="text-xs text-white/60">Secure</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/30 rounded-xl flex items-center justify-center shadow-inner">
                  <CheckCircle className="w-5 h-5 text-orange-500" />
                </div>
                <span className="text-xs text-white/60">Reliable</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-white/40 text-sm">
          <p>Secure access to your Shopify management dashboard</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
