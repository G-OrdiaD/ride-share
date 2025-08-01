import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getHelloMessage } from './api';
import { connectSocket, disconnectSocket } from './socket';
import './App.css';
import { Provider } from 'react-redux';
import store from './store';
import AuthScreen from './screens/AuthScreen';
import PassengerHomeScreen from './screens/PassengerHomeScreen';
import DriverHomeScreen from './screens/DriverHomeScreen.js';
import RideScreen from './screens/RideScreen';

function App() {
  const [httpMessage, setHttpMessage] = useState('Loading HTTP message...');
  const [socketStatus, setSocketStatus] = useState('Connecting to Socket.IO...');

  useEffect(() => {
    // HTTP Connection Test
    async function fetchMessage() {
      try {
        const message = await getHelloMessage();
        setHttpMessage(message);
      } catch (error) {
        setHttpMessage(`Error: ${error.message}`);
      }
    }
    fetchMessage();

    // Socket.IO Connection Test
    const socket = connectSocket();

    socket.on('connect', () => {
      setSocketStatus('Socket.IO: Connected!');
    });
    
    socket.on('disconnect', () => {
      setSocketStatus('Socket.IO: Disconnected.');
    });
    
    socket.on('connect_error', (err) => {
      setSocketStatus(`Socket.IO Error: ${err.message}`);
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          {/* Connection status banner */}
          <div className="connection-banner">
            <h3>Backend Connection Status</h3>
            <p><strong>HTTP:</strong> {httpMessage}</p>
            <p><strong>Socket.IO:</strong> {socketStatus}</p>
          </div>
          
          {/* Application routes */}
          <Routes>
            <Route path="/" element={<AuthScreen />} />
            <Route path="/passenger" element={<PassengerHomeScreen />} />
            <Route path="/driver" element={<DriverHomeScreen />} />
            <Route path="/ride" element={<RideScreen />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;