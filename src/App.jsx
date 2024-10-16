import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Mic, MicOff, Send, Camera, CameraOff, Sun, Moon, History, Edit, Check } from 'lucide-react';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [history, setHistory] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const webcamRef = useRef(null);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
      };
    } else {
      console.log('Speech recognition not supported');
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
    setIsListening(!isListening);
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSubmit = async () => {
    if (transcript.trim() === '') return;
    // Here you would typically send the transcript to your Ollama API
    // and get a response. For now, we'll just echo the transcript.
    const newResponse = `Llava: You said "${transcript}"`;
    setResponse(newResponse);
    setHistory([...history, { prompt: transcript, response: newResponse, isEditing: false }]);
    setTranscript('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const toggleEdit = (index) => {
    const newHistory = [...history];
    newHistory[index].isEditing = !newHistory[index].isEditing;
    setHistory(newHistory);
  };

  const updatePrompt = (index, newPrompt) => {
    const newHistory = [...history];
    newHistory[index].prompt = newPrompt;
    setHistory(newHistory);
  };

  const resubmitPrompt = async (index) => {
    const prompt = history[index].prompt;
    // Here you would typically send the prompt to your Ollama API
    // and get a new response. For now, we'll just echo the prompt.
    const newResponse = `Llava: You said "${prompt}" (Resubmitted)`;
    const newHistory = [...history];
    newHistory[index] = { prompt, response: newResponse, isEditing: false };
    setHistory(newHistory);
    setResponse(newResponse);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} transition-colors duration-300`}>
      <div className="container mx-auto p-4">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6 w-full max-w-2xl mx-auto`}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-blue-600">AI Llava</h1>
            <div className="flex space-x-2">
              <button onClick={toggleCamera} className={`p-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full`}>
                {isCameraOn ? <CameraOff size={24} /> : <Camera size={24} />}
              </button>
              <button onClick={toggleTheme} className={`p-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full`}>
                {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
              </button>
            </div>
          </div>
          
          {isCameraOn && (
            <div className="mb-6">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full rounded-lg"
              />
            </div>
          )}
          
          <div className="flex items-center mb-4">
            <input
              ref={inputRef}
              type="text"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              onKeyPress={handleKeyPress}
              className={`flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
              placeholder="Type or speak your prompt..."
            />
            <button
              onClick={toggleListening}
              className={`p-2 ${isListening ? 'bg-red-500' : 'bg-blue-500'} text-white rounded-none`}
            >
              {isListening ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
            <button
              onClick={handleSubmit}
              className="p-2 bg-green-500 text-white rounded-r-lg"
            >
              <Send size={24} />
            </button>
          </div>
          
          <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg min-h-[100px] mb-4`}>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{response}</p>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <History size={24} className="mr-2" /> Conversation History
            </h2>
            <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg max-h-60 overflow-y-auto`}>
              {history.map((item, index) => (
                <div key={index} className="mb-4 pb-2 border-b border-gray-600">
                  <div className="flex items-center justify-between">
                    {item.isEditing ? (
                      <input
                        type="text"
                        value={item.prompt}
                        onChange={(e) => updatePrompt(index, e.target.value)}
                        className={`flex-grow p-1 mr-2 rounded ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-black'}`}
                      />
                    ) : (
                      <p className="font-semibold flex-grow">You: {item.prompt}</p>
                    )}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleEdit(index)}
                        className={`p-1 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded`}
                      >
                        {item.isEditing ? <Check size={18} /> : <Edit size={18} />}
                      </button>
                      {item.isEditing && (
                        <button
                          onClick={() => resubmitPrompt(index)}
                          className="p-1 bg-blue-500 text-white rounded"
                        >
                          <Send size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.response}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;