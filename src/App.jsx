import React, { useState } from 'react';
import { Sun, Moon, Menu } from 'lucide-react';
import SidePanel from './Components/SidePanel';
import ChatInterface from './Components/ChatInterface';
import CameraInterface from './Components/CameraInterface';
import './App.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeMode, setActiveMode] = useState('chat');
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidePanel = () => {
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  const handleImageCapture = (imageSrc) => {
    setCapturedImage(imageSrc);
  };

  const handleLlavaQuery = async (prompt) => {
    if (!capturedImage) {
      console.error('No image captured');
      return 'Please capture an image first before asking a question about it.';
    }

    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llava',
          prompt: prompt,
          images: [capturedImage.split(',')[1]], // Remove the data:image/jpeg;base64, part
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error querying Llava:', error);
      return 'Error: Unable to process the image query.';
    }
  };

  return (
    <div className={`app-container ${isDarkMode ? 'dark' : 'light'}`}>
      <SidePanel isDarkMode={isDarkMode} isOpen={isSidePanelOpen} onClose={toggleSidePanel} />
      <div className="main-content">
        <div className="container">
          <div className="content-wrapper">
            <div className="header">
              <div className="header-left">
                <button onClick={toggleSidePanel} className="menu-button">
                  <Menu size={24} />
                </button>
                <h1 className="app-title">K.A.I 3.0</h1>
              </div>
              <div className="theme-toggle">
                <button onClick={toggleTheme} className="theme-button">
                  {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
                </button>
              </div>
            </div>
            <div className="mode-switcher">
              <button
                onClick={() => setActiveMode('chat')}
                className={`mode-button ${activeMode === 'chat' ? 'active' : ''}`}
              >
                Chat Mode
              </button>
              <button
                onClick={() => setActiveMode('stream')}
                className={`mode-button ${activeMode === 'stream' ? 'active' : ''}`}
              >
                Stream Mode
              </button>
            </div>
            {activeMode === 'chat' ? (
              <ChatInterface 
                isDarkMode={isDarkMode} 
                onImageCapture={handleImageCapture}
                onLlavaQuery={handleLlavaQuery}
              />
            ) : (
              <CameraInterface 
                isDarkMode={isDarkMode} 
                onImageCapture={handleImageCapture}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;