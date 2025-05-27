import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './App.css';

import Header from './components/Header/Header';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import PageNotFound from './pages/PageNotFound';
import TodoList from './features/todo-list/TodoList';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ProtectedRoute from './components/auth/ProtectedRoute';

const App = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <Router>
      <div className="flex flex-col w-screen items-center">
        <Header onHamburgerClick={() => setSidebarOpen(true)} />
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <main className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/todo-list" element={<TodoList />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
