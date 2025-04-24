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

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

class SpeechRecognitionHelper {
  private recognition: any;
  private isListening = false;
  
  constructor() {
    if (this.isSupported()) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionAPI();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
    }
  }
  
  isSupported(): boolean {
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

async function translateText(text: string, sourceLang: string, targetLang: string): Promise<string> {
  if (sourceLang === targetLang) {
    return text;
  }
  
  const servers = [
    'https://libretranslate.de',
    'https://translate.argosopentech.com',
    'https://translate.terraprint.co'
  ];
  
  let lastError = null;
  
  for (const server of servers) {
    try {
      console.log(`Attempting translation with server: ${server}`);
      
      const response = await fetch(`${server}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          q: text,
          source: sourceLang,
          target: targetLang
        }),
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Translation error (status ${response.status}):`, errorText);
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.translatedText) {
        throw new Error('Invalid response format - missing translatedText field');
      }
      
      console.log('Translation successful');
      return data.translatedText;
    } catch (error) {
      console.error(`Translation error with server ${server}:`, error);
      lastError = error;
    }
  }
  
  console.error('All translation servers failed');
  throw lastError || new Error('Translation failed on all servers');
}

function mockTranslate(text: string, targetLang: string): string {
  const langPrefixes: Record<string, string> = {
    hi: "[हिन्दी] ",
    bn: "[বাংলা] ",
    te: "[తెలుగు] ",
    ta: "[தமிழ்] ",
    mr: "[मराठी] ",
    gu: "[ગુજરાતી] ",
    kn: "[ಕನ್ನಡ] ",
    ml: "[മലയാളം] ",
    pa: "[ਪੰਜਾਬੀ] ",
    en: ""
  };
  
  const prefix = langPrefixes[targetLang] || "";
  return prefix + text;
}

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
        const height = Math.floor(Math.random() * 40) + 5;
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
  translateText,
  mockTranslate
};
