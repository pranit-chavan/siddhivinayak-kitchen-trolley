import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "@/components/erp/Auth/ProtectedRoute";
import { Lock, User, ArrowRight, ShieldCheck } from "lucide-react";
import { FIRM_NAME } from "@/data/constants";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const from = location.state?.from?.pathname || "/admin";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded mock security for frontend UI phase
    if (password === "sachin123") {
      authService.login();
      navigate(from, { replace: true });
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Brand Header */}
        <div className="text-center mb-8">
           <div className="w-24 h-24 flex items-center justify-center mx-auto mb-4 drop-shadow-xl">
              <img src="/images/logo.png" alt="SVK Logo" className="w-full h-full object-contain" />
           </div>
           <h1 className="text-3xl font-display font-bold text-foreground">ERP Portal</h1>
           <p className="text-muted-foreground mt-2">{FIRM_NAME}</p>
        </div>

        {/* Login Box */}
        <div className="bg-background rounded-3xl p-8 border border-border shadow-2xl relative overflow-hidden">
           {/* Decorative elements */}
           <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
           
           <h2 className="text-xl font-bold mb-6">Secure Access Needed</h2>
           
           <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Admin Username</label>
                 <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input 
                      disabled
                      value="admin"
                      className="w-full h-12 bg-muted/20 rounded-xl pl-12 pr-4 text-sm font-bold border border-transparent text-muted-foreground outline-none cursor-not-allowed" 
                    />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Master Password</label>
                 <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input 
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full h-12 bg-muted/40 rounded-xl pl-12 pr-4 text-sm font-bold border focus:outline-none transition-all ${error ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-primary'}`} 
                      autoFocus
                    />
                 </div>
                 {error && <p className="text-xs text-red-500 font-bold ml-1 mt-1">Incorrect master password.</p>}
              </div>

              <button 
                type="submit"
                className="w-full h-14 bg-primary text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-xl shadow-primary/20 mt-4 group"
              >
                 Unlock System
                 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </form>
           
           <div className="mt-8 pt-6 border-t border-border/50 text-center">
              <p className="text-xs text-muted-foreground italic">Restricted strictly for internal staff. Hint: `sachin123`.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
