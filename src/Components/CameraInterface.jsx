import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Camera, CameraOff, RefreshCw, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import './CameraInterface.css';

function CameraInterface({ isDarkMode, onImageCapture }) {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [facingMode, setFacingMode] = useState('user');
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [transcriptHistory, setTranscriptHistory] = useState([]);
  const [capturedImage, setCapturedImage] = useState(null);
  
  const webcamRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const silenceTimeoutRef = useRef(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onresult = handleSpeechResult;
      recognitionRef.current.onerror = handleSpeechError;
    }

    return cleanup;
  }, []);

  const handleSpeechResult = (event) => {
    const current = event.resultIndex;
    const transcriptText = event.results[current][0].transcript;
    setTranscript(transcriptText);
    
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    
    silenceTimeoutRef.current = setTimeout(() => {
      if (event.results[current].isFinal) {
        setTranscriptHistory(prev => [...prev, transcriptText]);
        setTranscript('');
        recognitionRef.current?.stop();
      }
    }, 1500);

    processVoiceCommand(transcriptText);
  };

  const handleSpeechError = (event) => {
    console.error('Speech recognition error:', event.error);
    setIsListening(false);
  };

  const cleanup = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
  };

  const processVoiceCommand = (command) => {
    command = command.toLowerCase().trim();
    if (command.includes('switch camera')) {
      switchCamera();
    } else if (command.includes('turn off camera')) {
      setIsCameraOn(false);
    } else if (command.includes('turn on camera')) {
      setIsCameraOn(true);
    } else if (command.includes('capture image')) {
      captureImage();
    }
  };

  const toggleCamera = () => setIsCameraOn(!isCameraOn);
  const switchCamera = () => setFacingMode(facingMode === 'user' ? 'environment' : 'user');
  const toggleMute = () => setIsMuted(!isMuted);
  
  const startListening = () => {
    try {
      recognitionRef.current?.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
    }
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    onImageCapture(imageSrc);
  };

  return (
    <div className="camera-interface">
      <div className="camera-container">
        {isCameraOn ? (
          <Webcam
            ref={webcamRef}
            audio={false}
            facingMode={facingMode}
            className="webcam"
            screenshotFormat="image/jpeg"
          />
        ) : (
          <div className="camera-off">
            <CameraOff className="camera-off-icon" />
          </div>
        )}
      </div>

      <div className="camera-controls">
        <button onClick={toggleCamera} className="control-button">
          {isCameraOn ? <CameraOff size={24} /> : <Camera size={24} />}
        </button>
        
        {isCameraOn && (
          <>
            <button onClick={switchCamera} className="control-button">
              <RefreshCw size={24} />
            </button>
            <button onClick={captureImage} className="control-button">
              <Camera size={24} />
            </button>
          </>
        )}

        <button
          onClick={startListening}
          className={`control-button ${isListening ? 'active' : ''}`}
        >
          {isListening ? <Mic size={24} /> : <MicOff size={24} />}
        </button>

        <button onClick={toggleMute} className="control-button">
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </div>

      <div className="speech-display">
        <div className="current-speech">
          <div className="speech-label">Current Speech</div>
          <div className="speech-content">
            {transcript || 'Listening...'}
          </div>
        </div>
        
        <div className="speech-history">
          <div className="speech-label">Speech History</div>
          <div className="history-list">
            {transcriptHistory.map((text, index) => (
              <div key={index} className="history-item">
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {capturedImage && (
        <div className="captured-image">
          <img src={capturedImage} alt="Captured" />
        </div>
      )}
    </div>
  );
}

export default CameraInterface;