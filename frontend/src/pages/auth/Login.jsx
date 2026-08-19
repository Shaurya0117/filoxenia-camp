import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Tent, Loader2 } from 'lucide-react';
import mainBg from '../../assets/main-bg.jpg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await login(email, password);
      if (user.role === 'admin' || user.role === 'staff') {
        navigate('/admin/dashboard');
      } else if (user.role === 'parent') {
        navigate('/parent/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center bg-[#1e293b] overflow-hidden font-sans">
      
      {/* Background illustration overlay (optional subtle pattern) */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url(${mainBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'right center'
        }}
      />

      {/* The organic white blob on the left */}
      <div 
        className="absolute top-[-10%] left-[-20%] w-[120%] h-[120%] md:w-[75%] md:h-[120%] bg-white shadow-2xl transition-all duration-700"
        style={{ borderRadius: '35% 65% 55% 45% / 40% 50% 60% 50%' }}
      />

      {/* Top Right Navigation */}
      <div className="absolute top-8 right-12 z-20 flex items-center gap-2 text-white font-medium text-lg tracking-wide drop-shadow-md">
        <span className="font-bold cursor-pointer">Sign In</span>
        <span className="opacity-50 mx-2">|</span>
        <Link to="/register" className="opacity-70 hover:opacity-100 transition-opacity">Sign Up</Link>
      </div>

      {/* Top Left Logo */}
      <div className="absolute top-8 left-12 z-20 flex items-center gap-2">
        <Tent className="w-8 h-8 text-amber-500" />
        <span className="font-serif font-bold text-xl text-gray-800 tracking-wide">filoxenia</span>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 flex justify-start">
        
        <div className="w-full max-w-md mt-10">
          
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl text-gray-600 font-light mb-1">Hello there,</h1>
            <h2 className="text-4xl md:text-5xl text-[#0f172a] font-bold tracking-tight">welcome to Filoxenia</h2>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100 shadow-sm animate-fade-in-up">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2 relative group">
              <label className="text-xs font-bold tracking-widest text-gray-800 uppercase">Email</label>
              <input 
                type="email" 
                required
                placeholder="Enter your email address"
                className="w-full py-3 bg-transparent border-b-2 border-gray-200 focus:border-[#1e293b] outline-none text-gray-700 placeholder:text-gray-300 transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2 relative group">
              <label className="text-xs font-bold tracking-widest text-gray-800 uppercase">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Set a strong password"
                  className="w-full py-3 bg-transparent border-b-2 border-gray-200 focus:border-[#1e293b] outline-none text-gray-700 placeholder:text-gray-300 transition-colors pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#1e293b] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex justify-end pt-2">
                <a href="#" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Forgot password?</a>
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-bold tracking-widest px-10 py-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-70 flex items-center justify-center min-w-[140px]"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'LOGIN'}
              </button>
            </div>
          </form>

          <div className="mt-16 border-t border-gray-100 pt-8">
            <p className="text-sm text-gray-500 mb-4">Sign in with:</p>
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-orange-50 hover:text-orange-500 transition-colors shadow-sm">
                <span className="font-bold font-serif">G</span>
              </button>
              <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-500 transition-colors shadow-sm">
                <span className="font-bold font-serif">t</span>
              </button>
              <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-700 transition-colors shadow-sm">
                <span className="font-bold font-serif">f</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
