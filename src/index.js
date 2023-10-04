// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { CookiesProvider } from "react-cookie";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   <CookiesProvider>   
         <React.StrictMode>
    <HashRouter>
       <App />
    </HashRouter>
 </React.StrictMode>  
      </CookiesProvider>
);

