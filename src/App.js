import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Clubs from './pages/Clubs';
import Navbar from './components/Navbar';
import Evenements from './pages/Evenements';
import Seances from './pages/Seances';
import Reussites from './pages/Reussites';
import Membres from './pages/Membres';
import ClubDetail from './pages/ClubDetail';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      {token && <Navbar />}
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/clubs" element={token ? <Clubs /> : <Navigate to="/login" />} />
        <Route path="/clubs/:id" element={token ? <ClubDetail /> : <Navigate to="/login" />} />
        <Route path="/evenements" element={token ? <Evenements /> : <Navigate to="/login" />} />
        <Route path="/seances" element={token ? <Seances /> : <Navigate to="/login" />} />
        <Route path="/reussites" element={token ? <Reussites /> : <Navigate to="/login" />} />
        <Route path="/membres" element={token ? <Membres /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;