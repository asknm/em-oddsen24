import React from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App';
import { initializeApp } from 'firebase/app';
import Home from './LoggedIn/Home';

const firebaseConfig = require('./firebase-config.json').result.sdkConfig;
initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Home />
);