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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidePanel = () => {
    setIsSidePanelOpen(!isSidePanelOpen);
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
              <ChatInterface isDarkMode={isDarkMode} />
            ) : (
              <CameraInterface isDarkMode={isDarkMode} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;