import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import reducers from './redux/reducers';
import { PersistGate } from 'redux-persist/integration/react'
import configureStore from './redux/configureStore';
import 'roboto-fontface';

const {store, persistor} = configureStore();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <SnackbarProvider>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </SnackbarProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
