import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
import './styles/app.css';
import { FirebaseContext } from './context';
import { firebase, FieldValue } from './lib';

ReactDOM.render(
  <FirebaseContext.Provider value={{ firebase, FieldValue }}>
    <App />
  </FirebaseContext.Provider>,
  document.getElementById('root')
);
