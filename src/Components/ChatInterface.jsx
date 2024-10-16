import React, { useState, useRef } from 'react';
import { Mic, MicOff, Send, Camera } from 'lucide-react';
import './ChatInterface.css';

function ChatInterface({ isDarkMode }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [history, setHistory] = useState([]);
  const inputRef = useRef(null);

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const handleSubmit = async () => {
    if (transcript.trim() === '') return;
    const newResponse = `Llava: You said "${transcript}"`;
    setResponse(newResponse);
    setHistory([...history, { prompt: transcript, response: newResponse }]);
    setTranscript('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleCameraClick = () => {
    // Implement camera functionality
  };

  return (
    <div className="chat-interface">
      <div className="input-group">
        <input
          ref={inputRef}
          type="text"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          onKeyPress={handleKeyPress}
          className={`chat-input ${isDarkMode ? 'dark' : ''}`}
          placeholder="Type or speak your prompt..."
        />
        <button
          onClick={toggleListening}
          className={`action-button mic-button ${isListening ? 'active' : ''}`}
        >
          {isListening ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
        <button
          onClick={handleCameraClick}
          className="action-button camera-button"
        >
          <Camera size={24} />
        </button>
        <button
          onClick={handleSubmit}
          className="action-button send-button"
        >
          <Send size={24} />
        </button>
      </div>

      <div className={`response-area ${isDarkMode ? 'dark' : ''}`}>
        <p>{response}</p>
      </div>
    </div>
  );
}

export default ChatInterface;