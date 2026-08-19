import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import registerBg from '../../assets/register-bg.jpg';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('parent');
  const [error, setError] = useState(null);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password, role);
      // Automatically redirect to login after successful registration
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register');
    }
  };

  return (
    <div 
      className="flex h-screen w-full items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${registerBg})` }}
    >
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 shadow-2xl rounded-3xl border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
          <p className="text-muted-foreground mt-2">Sign up for Camp Management</p>
        </div>
        
        {error && <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Full Name</label>
            <input 
              type="text" 
              required
              className="w-full p-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <input 
              type="email" 
              required
              className="w-full p-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Password</label>
            <input 
              type="password" 
              required
              className="w-full p-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Role</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="parent">Parent</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 font-medium transition-colors"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
