import React from 'react';

import AppRoutes from './routes/AppRoutes';
import MainLayout from './components/common/MainLayout';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </Router>
  );
};

export default App;
