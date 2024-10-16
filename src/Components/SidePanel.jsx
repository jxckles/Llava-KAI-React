import React, { useState } from 'react';
import { History, Settings, User, X } from 'lucide-react';
import './SidePanel.css';

function SidePanel({ isDarkMode, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('history');

  return (
    <div className={`side-panel ${isDarkMode ? 'dark' : ''} ${isOpen ? 'open' : ''}`}>
      <div className="panel-header">
        <h2>Menu</h2>
        <button onClick={onClose} className="close-button">
          <X size={24} />
        </button>
      </div>
      <div className="tab-buttons">
        <button
          onClick={() => setActiveTab('history')}
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
        >
          <History size={20} />
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
        >
          <Settings size={20} />
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
        >
          <User size={20} />
        </button>
      </div>
      <div className="panel-content">
        {activeTab === 'history' && <HistoryPanel isDarkMode={isDarkMode} />}
        {activeTab === 'settings' && <SettingsPanel isDarkMode={isDarkMode} />}
        {activeTab === 'profile' && <ProfilePanel isDarkMode={isDarkMode} />}
      </div>
    </div>
  );
}

function HistoryPanel() {
  return <div className="panel">History Panel</div>;
}

function SettingsPanel() {
  return <div className="panel">Settings Panel</div>;
}

function ProfilePanel() {
  return <div className="panel">Profile Panel</div>;
}

export default SidePanel;
