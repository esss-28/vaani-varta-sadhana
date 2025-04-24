
interface SpeechOption {
  text: string;
  voice?: SpeechSynthesisVoice;
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onPause?: () => void;
  onResume?: () => void;
}

class SpeechHelper {
  private synth: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;
  private isPlaying = false;
  private isPaused = false;
  
  constructor() {
    this.synth = window.speechSynthesis;
  }
  
  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }
  
  getVoices(): SpeechSynthesisVoice[] {
    return this.synth.getVoices();
  }
  
  speak(options: SpeechOption): void {
    this.stop();
    
    const utterance = new SpeechSynthesisUtterance(options.text);
    
    if (options.voice) utterance.voice = options.voice;
    if (options.rate !== undefined) utterance.rate = options.rate;
    if (options.pitch !== undefined) utterance.pitch = options.pitch;
    
    utterance.onstart = () => {
      this.isPlaying = true;
      this.isPaused = false;
      if (options.onStart) options.onStart();
    };
    
    utterance.onend = () => {
      this.isPlaying = false;
      this.isPaused = false;
      if (options.onEnd) options.onEnd();
    };
    
    utterance.onpause = () => {
      this.isPaused = true;
      if (options.onPause) options.onPause();
    };
    
    utterance.onresume = () => {
      this.isPaused = false;
      if (options.onResume) options.onResume();
    };
    
    this.utterance = utterance;
    this.synth.speak(utterance);
  }
  
  pause(): void {
    if (this.isPlaying && !this.isPaused) {
      this.synth.pause();
      this.isPaused = true;
    }
  }
  
  resume(): void {
    if (this.isPlaying && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
    }
  }
  
  stop(): void {
    this.synth.cancel();
    this.isPlaying = false;
    this.isPaused = false;
  }
  
  getStatus(): { isPlaying: boolean; isPaused: boolean } {
    return { isPlaying: this.isPlaying, isPaused: this.isPaused };
  }
  
  downloadSpeech(text: string, voice: SpeechSynthesisVoice | null, rate: number, pitch: number): void {
    // This is a simplified version - in reality browser APIs don't directly support
    // downloading TTS content. This would typically require a backend service.
    // For demo purposes, we'll just create a text file with the speech parameters.
    const element = document.createElement('a');
    const params = {
      text,
      voice: voice ? voice.name : 'default',
      rate,
      pitch
    };
    
    const file = new Blob([JSON.stringify(params, null, 2)], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'vaani-speech-text.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    alert('In a full implementation, this would download an audio file.\nFor this demo, we\'ve downloaded the speech parameters as a text file.');
  }
}

class SpeechRecognitionHelper {
  private recognition: any; // Type is any because the API isn't standardized yet
  private isListening = false;
  
  constructor() {
    if (this.isSupported()) {
      // @ts-ignore: webkitSpeechRecognition is not recognized in TypeScript
      this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
    }
  }
  
  isSupported(): boolean {
    // @ts-ignore: webkitSpeechRecognition is not recognized in TypeScript
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }
  
  startListening(language: string, onResult: (text: string, isFinal: boolean) => void, onEnd: () => void): void {
    if (!this.recognition) return;
    
    this.recognition.lang = language;
    
    this.recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const text = event.results[last][0].transcript;
      const isFinal = event.results[last].isFinal;
      onResult(text, isFinal);
    };
    
    this.recognition.onend = () => {
      this.isListening = false;
      onEnd();
    };
    
    this.recognition.start();
    this.isListening = true;
  }
  
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
  
  getStatus(): { isListening: boolean } {
    return { isListening: this.isListening };
  }
}

// Simple helper for LibreTranslate API
async function translateText(text: string, sourceLang: string, targetLang: string): Promise<string> {
  try {
    const response = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang
      })
    });
    
    if (!response.ok) {
      throw new Error('Translation failed');
    }
    
    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return 'Translation error occurred. Please try again.';
  }
}

// Helper for simulating audio visualization
class AudioVisualizer {
  private container: HTMLElement;
  private bars: HTMLElement[] = [];
  private animationId: number | null = null;
  
  constructor(container: HTMLElement, barCount: number = 20) {
    this.container = container;
    this.createBars(barCount);
  }
  
  private createBars(count: number): void {
    this.container.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
      const bar = document.createElement('div');
      bar.className = 'visualizer-bar';
      this.container.appendChild(bar);
      this.bars.push(bar);
    }
  }
  
  start(): void {
    if (this.animationId) return;
    
    const animate = () => {
      this.bars.forEach(bar => {
        const height = Math.floor(Math.random() * 40) + 5; // Random height between 5-45px
        bar.style.height = `${height}px`;
      });
      
      this.animationId = requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  stop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
      
      // Reset all bars to minimal height
      this.bars.forEach(bar => {
        bar.style.height = '3px';
      });
    }
  }
  
  isActive(): boolean {
    return this.animationId !== null;
  }
}

export { 
  SpeechHelper, 
  SpeechRecognitionHelper, 
  AudioVisualizer,
  translateText 
};
