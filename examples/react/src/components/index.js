import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  RouterProvider,
} from "react-router-dom";

import './index.css';
import { Router } from './routes'

import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={Router} />
  </React.StrictMode>
);
reportWebVitals();
