import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TextToSpeech from '@/components/TextToSpeech';
import VoiceTranslator from '@/components/VoiceTranslator';
import CulturalTabs from '@/components/CulturalTabs';
import VoicesOfFreedom from '@/components/VoicesOfFreedom';
import IndiaMap from '@/components/IndiaMap';
import ProjectSynopsis from '@/components/ProjectSynopsis';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [browserSupport, setBrowserSupport] = useState({
    speechSynthesis: false,
    speechRecognition: false
  });
  const { toast } = useToast();
  
  useEffect(() => {
    const supportCheck = {
      speechSynthesis: 'speechSynthesis' in window,
      speechRecognition: 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
    };
    
    setBrowserSupport(supportCheck);
    
    if (!supportCheck.speechSynthesis || !supportCheck.speechRecognition) {
      toast({
        title: "Browser Compatibility Warning",
        description: "Some features may not work in your browser. For best experience, use Chrome, Edge, or Safari.",
        duration: 6000,
      });
    }

    if ('speechSynthesis' in window) {
      speechSynthesis.getVoices();
    }
  }, [toast]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <style>{`
        .map-tooltip {
          position: absolute;
          background-color: white;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          max-width: 320px;
          z-index: 50;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
        }
        
        .map-tooltip.visible {
          opacity: 1;
          visibility: visible;
        }
        
        .visualizer-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3px;
          height: 60px;
          background-color: rgba(0, 0, 0, 0.02);
          border-radius: 8px;
          padding: 0 10px;
          overflow: hidden;
          position: relative;
        }
        
        .visualizer-container::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(255, 153, 51, 0.5), rgba(19, 136, 8, 0.5), transparent);
        }
        
        .visualizer-bar {
          background: linear-gradient(to top, #FF9933, #138808);
          width: 5px;
          height: 3px;
          border-radius: 2px 2px 0 0;
          transition: height 0.1s ease-out;
          will-change: height;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .visualizer-bar {
            transition: none;
          }
        }
      `}</style>
      
      <Header />
      
      <section className="bg-gradient-to-b from-slate-50 to-softbeige py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-8 lg:mb-0 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-saffron">Speak</span> in the language of{" "}
                <span className="text-indiangreen">India</span>
              </h1>
              <p className="text-lg mb-8 text-gray-700 max-w-lg mx-auto lg:mx-0">
                Experience the rich linguistic diversity of India with Vaani's text-to-speech and voice translation technology.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <a href="#tts" className="saffron-button">
                  Start Speaking
                </a>
                <a href="#translator" className="green-button">
                  Translate Voice
                </a>
              </div>
              
              {(!browserSupport.speechSynthesis || !browserSupport.speechRecognition) && (
                <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
                  <p className="font-medium">Browser Compatibility Warning</p>
                  <ul className="mt-2 list-disc list-inside">
                    {!browserSupport.speechSynthesis && (
                      <li>Speech synthesis is not supported in your browser.</li>
                    )}
                    {!browserSupport.speechRecognition && (
                      <li>Speech recognition is not supported in your browser.</li>
                    )}
                    <li className="mt-1">
                      For the best experience, please use Chrome, Edge, or Safari.
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-saffron/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indiangreen/20 rounded-full blur-3xl"></div>
                <div className="relative bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <div className="flex items-center space-x-4 mb-6">
                    <span className="w-3 h-3 bg-red-400 rounded-full"></span>
                    <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                    <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                    <div className="flex-1 h-8 bg-slate-100 rounded flex items-center justify-center text-sm text-slate-400">
                      Vaani Speech Interface
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded border border-slate-100">
                      <p className="text-sm font-medium mb-1">English</p>
                      <p className="text-gray-700">Welcome to Vaani, your Indian language companion.</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded border border-slate-100">
                      <p className="text-sm font-medium mb-1">Hindi</p>
                      <p className="font-devanagari text-gray-700">वाणी में आपका स्वागत है, आपका भारतीय भाषा साथी।</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded border border-slate-100">
                      <p className="text-sm font-medium mb-1">Bengali</p>
                      <p className="font-bangla text-gray-700">ভানি-তে আপনাকে স্বাগতম, আপনার ভারতীয় ভাষার সঙ্গী।</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <TextToSpeech />
      <VoiceTranslator />
      <CulturalTabs />
      <VoicesOfFreedom />
      <IndiaMap />
      <ProjectSynopsis />
      <Footer />
    </div>
  );
};

export default Index;
