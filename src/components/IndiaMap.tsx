import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SpeechHelper } from '@/lib/speechUtils';
import { indianStates, IndianState } from '@/data/indiaMapData';
import { findVoiceByLang } from '@/data/languageData';
import { Volume2 } from 'lucide-react';

const IndiaMap = () => {
  const [activeState, setActiveState] = useState<IndianState | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [speaking, setSpeaking] = useState<boolean>(false);
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);
  
  const tooltipRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const speechHelper = useRef<SpeechHelper>(new SpeechHelper());
  
  const handleStateHover = (stateId: string, event: React.MouseEvent) => {
    const state = indianStates.find(s => s.id === stateId);
    if (!state) return;
    
    setActiveState(state);
    
    if (tooltipRef.current && mapContainerRef.current) {
      const mapRect = mapContainerRef.current.getBoundingClientRect();
      const x = event.clientX - mapRect.left;
      const y = event.clientY - mapRect.top;
      
      setTooltipPosition({ x, y });
      setTooltipVisible(true);
    }
  };
  
  const handleStateLeave = () => {
    if (!tooltipRef.current?.contains(document.activeElement)) {
      setTimeout(() => {
        if (!tooltipRef.current?.matches(':hover')) {
          setTooltipVisible(false);
        }
      }, 300);
    }
  };
  
  const handleTooltipMouseEnter = () => {
    setTooltipVisible(true);
  };
  
  const handleTooltipMouseLeave = () => {
    setTooltipVisible(false);
  };
  
  const handleSpeak = () => {
    if (!activeState) return;
    
    speechHelper.current.stop();
    
    const voices = speechHelper.current.getVoices();
    const voice = findVoiceByLang(voices, activeState.officialLanguageCode);
    
    speechHelper.current.speak({
      text: activeState.sampleText,
      voice: voice || undefined,
      onStart: () => setSpeaking(true),
      onEnd: () => setSpeaking(false)
    });
  };
  
  useEffect(() => {
    return () => {
      if (speechHelper.current) {
        speechHelper.current.stop();
      }
    };
  }, []);
  
  return (
    <section id="map" className="py-16 px-4 md:px-6 bg-gradient-to-b from-slate-50 to-softbeige">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">
            <span className="text-saffron">Linguistic</span>{" "}
            <span className="text-black">Map of</span>{" "}
            <span className="text-indiangreen">India</span>
          </h2>
          <p className="text-muted-foreground mt-2">
            Explore the diverse languages across Indian states
          </p>
        </div>
        
        <div className="relative india-card p-6 bg-white/80 backdrop-blur-sm shadow-xl rounded-xl border border-gray-100" ref={mapContainerRef}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {indianStates.map((state) => (
              <button
                key={state.id}
                className="relative p-3 border-2 border-gray-100 rounded-lg transition-all duration-300 
                         hover:border-indiangreen hover:shadow-md hover:scale-105 
                         focus:outline-none focus:ring-2 focus:ring-saffron
                         bg-gradient-to-br from-white to-gray-50"
                onMouseEnter={(e) => handleStateHover(state.id, e)}
                onMouseLeave={handleStateLeave}
              >
                <span className="block text-sm font-medium">{state.name}</span>
                <span className="block text-xs text-gray-500 mt-1">{state.officialLanguage}</span>
              </button>
            ))}
          </div>
          
          <div 
            ref={tooltipRef} 
            className={`map-tooltip ${tooltipVisible ? 'visible' : ''} bg-white/95 backdrop-blur-sm border-2 border-gray-100`}
            style={{
              left: `${tooltipPosition.x + 10}px`,
              top: `${tooltipPosition.y + 10}px`
            }}
            onMouseEnter={handleTooltipMouseEnter}
            onMouseLeave={handleTooltipMouseLeave}
          >
            {activeState && (
              <div className="space-y-3">
                <h3 className="font-bold text-lg bg-gradient-to-r from-saffron to-indiangreen bg-clip-text text-transparent">
                  {activeState.name}
                </h3>
                <div className="grid grid-cols-2 gap-x-4 text-sm">
                  <span className="font-medium text-gray-600">Official Language:</span>
                  <span className="text-gray-900">{activeState.officialLanguage}</span>
                  
                  <span className="font-medium text-gray-600">Other Languages:</span>
                  <span className="text-gray-900">{activeState.otherLanguages.join(', ')}</span>
                </div>
                <p className="text-sm mt-2 text-gray-700 italic">{activeState.culturalNote}</p>
                <div className="mt-3">
                  <Button
                    size="sm"
                    onClick={handleSpeak}
                    disabled={speaking}
                    className="w-full bg-gradient-to-r from-saffron to-indiangreen hover:opacity-90 transition-opacity"
                  >
                    <Volume2 className="mr-1 h-4 w-4" />
                    {speaking ? 'Speaking...' : 'Hear Sample'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            India is home to 22 officially recognized languages and hundreds of dialects.
            <br />
            Hover over a state to learn about its linguistic heritage.
          </p>
        </div>
      </div>
    </section>
  );
};

export default IndiaMap;
