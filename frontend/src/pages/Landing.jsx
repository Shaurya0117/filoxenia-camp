import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Book, Heart } from 'lucide-react';

export default function Landing() {
  return (
    <div 
      className="min-h-screen relative overflow-hidden font-sans text-[#2c3e38]"
      style={{
        backgroundImage: "url('/landing-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#e8f1ec]/80 via-transparent to-[#8faca0]/30 pointer-events-none fixed"></div>
      
      {/* Navigation */}
      <nav className="relative z-10 max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2 font-serif font-bold text-xl tracking-wide text-[#1a2e26]">
          <span className="text-[#d85c5c]">⛺</span> Filoxenia
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-[#1a2e26]">
          <a href="#features" className="hover:text-[#d85c5c] transition-colors">Features</a>
          <a href="#about" className="hover:text-[#d85c5c] transition-colors">About</a>
          <a href="#contact" className="hover:text-[#d85c5c] transition-colors">Contact</a>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-[#1a2e26] hover:text-[#d85c5c] transition-colors">Log In</Link>
          <Link 
            to="/register" 
            className="bg-[#d85c5c] hover:bg-[#c44a4a] text-white px-5 py-2 rounded-full text-sm font-medium shadow-sm transition-transform hover:scale-105"
          >
            Start Your Journey
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-20 pb-32 text-center">
        
        <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight text-[#1a2e26] mb-6 drop-shadow-md">
          Where Adventure Meets<br/>Safety & Creativity.
        </h1>
        
        <p className="text-lg md:text-xl text-[#2c3e38] max-w-2xl mx-auto mb-16 leading-relaxed font-serif italic font-medium drop-shadow-sm">
          In the rush of modern life, imagine a camp that feels like a deep breath — gentle, grounding, and secure. A place where children reconnect with nature and themselves.
        </p>

        {/* 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16 px-4">
          <div className="flex flex-col items-center bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-xl">
            <div className="w-12 h-12 bg-white/70 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Compass className="w-6 h-6 text-[#d85c5c]" />
            </div>
            <h3 className="font-bold text-[#1a2e26] mb-2 font-serif text-lg">Mindful Tools</h3>
            <p className="text-sm text-[#2c3e38] font-medium leading-relaxed">
              State-of-the-art HACCP food management and strict safety protocols ensure total well-being.
            </p>
          </div>
          
          <div className="flex flex-col items-center bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-xl">
            <div className="w-12 h-12 bg-white/70 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Book className="w-6 h-6 text-[#d85c5c]" />
            </div>
            <h3 className="font-bold text-[#1a2e26] mb-2 font-serif text-lg">Creative Space</h3>
            <p className="text-sm text-[#2c3e38] font-medium leading-relaxed">
              Parents can monitor periods, check-ins, and medical records from their own digital sanctuary.
            </p>
          </div>

          <div className="flex flex-col items-center bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-xl">
            <div className="w-12 h-12 bg-white/70 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Heart className="w-6 h-6 text-[#d85c5c]" />
            </div>
            <h3 className="font-bold text-[#1a2e26] mb-2 font-serif text-lg">Gentle Reminders</h3>
            <p className="text-sm text-[#2c3e38] font-medium leading-relaxed">
              Automated notifications, billing (APY), and group management to bring clarity to every day.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6">
          <Link 
            to="/register" 
            className="bg-[#d85c5c] hover:bg-[#c44a4a] text-white px-8 py-3 rounded-full font-medium shadow-xl transition-transform hover:scale-105 flex items-center gap-2"
          >
            Start Your Journey <span>→</span>
          </Link>
          <a href="#features" className="text-[#1a2e26] bg-white/40 hover:bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full font-bold shadow-md transition-all">
            Explore Features
          </a>
        </div>
      </main>
    </div>
  );
}
