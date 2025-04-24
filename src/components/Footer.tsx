
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-tricolor-gradient h-6 w-2 rounded-full"></div>
              <h3 className="text-lg font-bold">
                <span className="text-saffron">वा</span>
                <span className="text-foreground">णी</span>
                <span className="text-indiangreen"> | </span>
                <span className="text-royalblue">Vaani</span>
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              Celebrating India's linguistic diversity through the power of speech technology.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#tts" className="hover:text-royalblue transition-colors">Text to Speech</a></li>
              <li><a href="#translator" className="hover:text-royalblue transition-colors">Voice Translator</a></li>
              <li><a href="#cultural" className="hover:text-royalblue transition-colors">Cultural Heritage</a></li>
              <li><a href="#map" className="hover:text-royalblue transition-colors">India Map</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">About</h3>
            <p className="text-sm text-gray-600 mb-2">
              Vaani uses Web Speech API for speech synthesis and recognition, making it completely free and browser-based.
            </p>
            <p className="text-sm text-gray-600">
              This app was created to showcase the beauty and diversity of Indian languages.
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>
            Built with Web Speech API and LibreTranslate. No paid APIs or backends required.
          </p>
          <p className="mt-1">
            © {new Date().getFullYear()} Vaani. Celebrating India's linguistic diversity.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
