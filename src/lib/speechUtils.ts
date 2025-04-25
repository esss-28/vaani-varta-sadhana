
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
  private voicesLoaded = false;
  
  constructor() {
    this.synth = window.speechSynthesis;
    this.initializeVoices();
  }
  
  private initializeVoices(): void {
    // Try to load voices immediately
    if (this.synth.getVoices().length > 0) {
      this.voicesLoaded = true;
      return;
    }

    // If voices aren't available, set up the event listener
    this.synth.addEventListener('voiceschanged', () => {
      this.voicesLoaded = true;
    });

    // Fallback for some browsers
    setTimeout(() => {
      if (!this.voicesLoaded && this.synth.getVoices().length > 0) {
        this.voicesLoaded = true;
      }
    }, 100);
  }
  
  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }
  
  getVoices(): SpeechSynthesisVoice[] {
    const voices = this.synth.getVoices();
    console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
    return voices;
  }
  
  speak(options: SpeechOption): void {
    this.stop();
    
    const utterance = new SpeechSynthesisUtterance(options.text);
    
    if (options.voice) {
      utterance.voice = options.voice;
      console.log('Using voice:', options.voice.name, options.voice.lang);
    } else {
      console.log('No voice specified, using default');
    }
    
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
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
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
  private analyser: AnalyserNode | null = null;
  private audioContext: AudioContext | null = null;
  private dataArray: Uint8Array | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private isSimulationMode: boolean = true;
  
  constructor(container: HTMLElement, barCount: number = 20) {
    this.container = container;
    this.createBars(barCount);
    
    // Try to initialize audio context if available
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
    } catch (e) {
      console.log('Web Audio API not supported, falling back to simulation mode');
      this.isSimulationMode = true;
    }
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
  
  private connectToAudioSource(): void {
    if (!this.audioContext || !this.analyser) return;
    
    try {
      if (this.source) {
        this.source.disconnect();
      }
      
      // Try to get the audio output stream
      navigator.mediaDevices.getDisplayMedia({ audio: true, video: false })
        .then(stream => {
          this.source = this.audioContext!.createMediaStreamSource(stream);
          this.source.connect(this.analyser);
        })
        .catch(err => {
          console.error('Error accessing audio output:', err);
          this.isSimulationMode = true;
          this.simulateVisualization();
        });
    } catch (err) {
      console.error('Error connecting to audio source:', err);
      this.isSimulationMode = true;
      this.simulateVisualization();
    }
  }
  
  private animateWithAudioData(): void {
    if (!this.analyser || !this.dataArray) return;
    
    this.analyser.getByteFrequencyData(this.dataArray);
    
    const barWidth = Math.floor(this.dataArray.length / this.bars.length);
    
    for (let i = 0; i < this.bars.length; i++) {
      const start = i * barWidth;
      let sum = 0;
      
      for (let j = 0; j < barWidth; j++) {
        sum += this.dataArray[start + j] || 0;
      }
      
      const average = sum / barWidth;
      const height = Math.max(3, Math.floor((average / 255) * 50));
      this.bars[i].style.height = `${height}px`;
    }
    
    this.animationId = requestAnimationFrame(() => this.animateWithAudioData());
  }
  
  private simulateVisualization(): void {
    const animate = () => {
      // Generate more natural-looking patterns for speech
      const time = Date.now() / 1000;
      const barCount = this.bars.length;
      
      for (let i = 0; i < barCount; i++) {
        // Create a wave pattern with different frequencies
        const sinInput = time * 5 + (i / barCount) * Math.PI * 2;
        const sinValue = Math.sin(sinInput) * 0.5 + 0.5; // Range 0-1
        
        // Add some randomness to make it look more natural
        const randomness = Math.random() * 0.3;
        const combinedValue = sinValue * 0.7 + randomness;
        
        // Map to height (minimum 3px, maximum 45px)
        const height = Math.max(3, Math.floor(combinedValue * 42) + 3);
        this.bars[i].style.height = `${height}px`;
      }
      
      this.animationId = requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  start(): void {
    if (this.animationId) return;
    
    if (this.isSimulationMode) {
      this.simulateVisualization();
    } else {
      this.connectToAudioSource();
      this.animateWithAudioData();
    }
  }
  
  stop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
      
      this.bars.forEach(bar => {
        bar.style.height = '3px';
      });
    }
    
    // Disconnect any audio sources
    if (this.source) {
      try {
        this.source.disconnect();
      } catch (e) {
        // Ignore errors on disconnect
      }
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
