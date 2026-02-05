import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Instagram, 
  Twitter, 
  Github 
} from 'lucide-react';
import logo from '../assets/logo.png';

const LandingPage: React.FC = () => {

  return (
    <div className="bg-black min-h-screen flex items-center justify-center relative selection:bg-brand-500 selection:text-white overflow-hidden">

      {/* Background Liquid Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute filter blur-[60px] z-[-1] opacity-70 rounded-full bg-purple-600 w-96 h-96 top-0 left-[-100px] animate-blob mix-blend-screen opacity-40"></div>
        <div className="absolute filter blur-[60px] z-[-1] opacity-70 rounded-full bg-brand-600 w-96 h-96 bottom-[-100px] right-[-50px] animate-blob animation-delay-2000 mix-blend-screen opacity-40"></div>
        <div className="absolute filter blur-[60px] z-[-1] opacity-70 rounded-full bg-pink-600 w-80 h-80 top-[30%] left-[40%] animate-blob animation-delay-4000 mix-blend-screen opacity-30"></div>
      </div>

      {/* Main Container */}
      <main className="relative z-10 w-full max-w-md px-6">
        
        {/* Glass Card */}
        <div className="glass-panel p-10 rounded-3xl flex flex-col items-center text-center space-y-8 transform transition-all hover:scale-[1.01] duration-500">
          
          {/* Logo Area */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-black rounded-full p-4 ring-1 ring-white/10 w-24 h-24 flex items-center justify-center overflow-hidden">
              <img src={logo} alt="Gossip Logo" className="w-full h-full object-contain filter brightness-110 drop-shadow-md" />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight text-white mb-2">Gossip</h1>
            <p className="text-lg text-gray-300 font-light tracking-wide">
              Where conversations <span className="italic text-brand-400">flow</span> like liquid.
            </p>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto"></div>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-4">
            <Link to="/home" className="group w-full relative flex justify-center py-3.5 px-4 border border-transparent rounded-2xl text-sm font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 ring-offset-black transition-all duration-300 backdrop-blur-md overflow-hidden">
              <div className="absolute inset-0 w-0 bg-gradient-to-r from-brand-500/20 to-purple-500/20 transition-all duration-[250ms] ease-out group-hover:w-full opacity-0 group-hover:opacity-100"></div>
              <span className="relative flex items-center">
                Enter Gossip <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            
            <div className="flex items-center justify-center gap-6 mt-6">
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" aria-label="GitHub" className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div className="mt-8 text-xs text-gray-500 font-light">
            © 2026 Gossip Platform. All rights reserved.
          </div>

        </div>
      </main>

    </div>
  );
};

export default LandingPage;
