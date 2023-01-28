import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Router } from 'react-router-dom';
import history from 'lib/history';
import Routes from 'components/Routes';
import { QueryClientProvider } from 'react-query';
import { queryClient } from 'lib/queryClient';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';

ReactDOM.render(
  <React.StrictMode>
    <Router history={history}>
      <QueryClientProvider client={queryClient}>
        <Routes />
        <ToastContainer position="bottom-center" hideProgressBar />
      </QueryClientProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
