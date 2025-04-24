
import { useState, useEffect } from 'react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);
  
  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled ? 'bg-white/80 backdrop-blur-md shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-tricolor-gradient h-8 w-2 rounded-full"></div>
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-saffron">वा</span>
            <span className="text-foreground">णी</span>
            <span className="text-indiangreen"> | </span>
            <span className="text-royalblue">Vaani</span>
          </h1>
        </div>
        
        <div className="hidden sm:flex space-x-6 items-center">
          {/* Language icons with animation */}
          <div className="relative h-10 w-10">
            <span className="absolute animate-float text-xl">ह</span>
          </div>
          <div className="relative h-10 w-10">
            <span className="absolute animate-float delay-100 text-xl">त</span>
          </div>
          <div className="relative h-10 w-10">
            <span className="absolute animate-float delay-200 text-xl">ਪ</span>
          </div>
          <div className="relative h-10 w-10">
            <span className="absolute animate-float delay-300 text-xl">ବ</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <a 
            href="#tts"
            className="text-sm font-medium hover:text-saffron transition-colors"
          >
            Text to Speech
          </a>
          <a 
            href="#translator"
            className="text-sm font-medium hover:text-saffron transition-colors"
          >
            Voice Translator
          </a>
          <a 
            href="#cultural"
            className="text-sm font-medium hover:text-saffron transition-colors"
          >
            Cultural
          </a>
          <a 
            href="#map"
            className="hidden md:block text-sm font-medium hover:text-saffron transition-colors"
          >
            India Map
          </a>
        </div>
      </div>
      
      <div className="h-1 w-full bg-tricolor-horizontal"></div>
    </header>
  );
};

export default Header;
