
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';

const ProjectSynopsis = () => {
  const handleDownload = () => {
    // Create the document content with proper formatting
    const content = `
VAANI - Indian Language Companion
Project Synopsis

1. Project Overview
Vaani is a web application designed to celebrate and facilitate India's linguistic diversity through interactive language tools and cultural exploration features.

2. Core Features
• Text-to-Speech (TTS): Convert written text to spoken words in various Indian languages
• Voice Translation: Real-time voice-to-voice translation between Indian languages
• Cultural Heritage Explorer: Interactive showcase of literature, scripts, festivals, and proverbs
• Interactive Linguistic Map: Visual exploration of India's language diversity
• Voices of Freedom: Historical content featuring freedom fighters' speeches

3. Technology Stack
• Frontend: React with TypeScript
• Build Tool: Vite
• Styling: Tailwind CSS, Shadcn UI
• Speech Processing: Web Speech API (SpeechSynthesis, SpeechRecognition)
• Translation: LibreTranslate API with fallback mechanisms

4. Key Components
4.1 Text-to-Speech
- Multi-language support with voice selection
- Regional presets for different parts of India
- Rate and pitch control
- Real-time audio visualization

4.2 Voice Translator
- Real-time speech recognition
- Cross-language translation
- Error handling with graceful fallbacks
- Text-to-speech output

4.3 Cultural Heritage Explorer
- Literature samples
- Writing scripts
- Festival information
- Regional proverbs

4.4 Interactive Map
- State-wise language information
- Cultural context
- Audio samples
- Visual representation of linguistic diversity

5. Applications
5.1 Education
- Language learning
- Cultural studies
- Teaching aid

5.2 Tourism
- Tourist communication
- Cultural context
- Audio guides

5.3 Business
- Cross-state communication
- Localization
- Customer service

5.4 Cultural Preservation
- Language documentation
- Cultural archiving
- Awareness promotion

5.5 Accessibility
- Visual impairment assistance
- Cross-language communication
- Generational bridge

6. Technical Implementation
6.1 Architecture
- Component-based structure
- Modular design
- Responsive UI
- Browser API integration

6.2 Performance
- Optimized build process
- Efficient state management
- Graceful degradation
- Fallback mechanisms

7. Future Scope
- Additional language support
- Mobile application
- Offline functionality
- Premium translation services
- User accounts
- Analytics integration

Project By: [Your Name]
Date: ${new Date().toLocaleDateString()}
    `;

    // Create a Blob with the content
    const blob = new Blob([content], { type: 'application/msword' });
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Vaani_Project_Synopsis.doc';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="text-center py-8 px-4">
      <Button 
        onClick={handleDownload}
        className="bg-gradient-to-r from-saffron to-indiangreen text-white hover:opacity-90"
      >
        <FileDown className="mr-2 h-4 w-4" />
        Download Project Synopsis
      </Button>
    </div>
  );
};

export default ProjectSynopsis;
