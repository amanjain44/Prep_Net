import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';

import reducer from './reducers';
import './index.css';
import App from './App';

const store = configureStore({ reducer });

const root = createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId="9908693983-qu38jb7fi6h4cqqst95as9vvbdidr6gu.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </Provider>
);
