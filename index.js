import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import { v4 as uuidV4 } from 'uuid';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to={`/docs/${uuidV4()}`} />} />
      <Route path="/docs/:id" element={<App />} />
    </Routes>
  </BrowserRouter>
);
