
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
  const tooltipRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const speechHelper = useRef<SpeechHelper>(new SpeechHelper());
  
  const handleStateHover = (stateId: string, event: React.MouseEvent) => {
    const state = indianStates.find(s => s.id === stateId);
    if (!state) return;
    
    setActiveState(state);
    
    // Position the tooltip
    if (tooltipRef.current && mapContainerRef.current) {
      const mapRect = mapContainerRef.current.getBoundingClientRect();
      const x = event.clientX - mapRect.left;
      const y = event.clientY - mapRect.top;
      
      setTooltipPosition({ x, y });
      
      // Make tooltip visible
      tooltipRef.current.classList.add('visible');
    }
  };
  
  const handleStateLeave = () => {
    if (tooltipRef.current) {
      tooltipRef.current.classList.remove('visible');
    }
  };
  
  const handleSpeak = () => {
    if (!activeState) return;
    
    // Stop any ongoing speech
    speechHelper.current.stop();
    
    // Find a suitable voice for the state's language
    const voices = speechHelper.current.getVoices();
    const voice = findVoiceByLang(voices, activeState.officialLanguageCode);
    
    // Speak the sample text
    speechHelper.current.speak({
      text: activeState.sampleText,
      voice: voice || undefined,
      onStart: () => setSpeaking(true),
      onEnd: () => setSpeaking(false)
    });
  };
  
  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (speechHelper.current) {
        speechHelper.current.stop();
      }
    };
  }, []);
  
  return (
    <section id="map" className="py-16 px-4 md:px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Linguistic Map of India</h2>
          <p className="text-muted-foreground mt-2">
            Explore the diverse languages across Indian states
          </p>
        </div>
        
        <div className="relative india-card p-0 overflow-hidden" ref={mapContainerRef}>
          {/* This would be an interactive SVG map of India */}
          <div className="bg-gray-100 p-6 text-center h-[500px] flex items-center justify-center">
            <div className="max-w-lg mx-auto">
              <h3 className="text-xl mb-4">Interactive India Map</h3>
              <p className="mb-6">This would be an SVG map of India where each state is interactive. Hover over a state to see its language details.</p>
              
              {/* Example state buttons for demonstration */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {indianStates.slice(0, 12).map((state) => (
                  <button
                    key={state.id}
                    className="text-sm p-2 border rounded hover:bg-gray-200 focus:outline-none"
                    onMouseEnter={(e) => handleStateHover(state.id, e)}
                    onMouseLeave={handleStateLeave}
                  >
                    {state.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* State Info Tooltip */}
          <div 
            ref={tooltipRef} 
            className="map-tooltip"
            style={{
              left: `${tooltipPosition.x + 10}px`,
              top: `${tooltipPosition.y + 10}px`
            }}
          >
            {activeState && (
              <div className="space-y-2">
                <h3 className="font-bold text-lg">{activeState.name}</h3>
                <div className="grid grid-cols-2 gap-x-4 text-sm">
                  <span className="font-medium">Official Language:</span>
                  <span>{activeState.officialLanguage}</span>
                  
                  <span className="font-medium">Other Languages:</span>
                  <span>{activeState.otherLanguages.join(', ')}</span>
                </div>
                <p className="text-sm mt-2">{activeState.culturalNote}</p>
                <div className="mt-3">
                  <Button
                    size="sm"
                    onClick={handleSpeak}
                    disabled={speaking}
                    className="w-full bg-indiangreen hover:bg-indiangreen/90"
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
