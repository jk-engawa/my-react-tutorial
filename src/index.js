// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import RedirectPage from './RedirectPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/redirect" element={<RedirectPage />} />
      <Route path="/" element={<App />} />
    </Routes>
  </Router>,
  document.getElementById('root')
);
