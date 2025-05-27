import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const navigate = useNavigate();
  const userToken = useSelector((state) => state.auth.token);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* <Sidebar /> */}
      <main className="flex-1 min-h-screen overflow-y-auto overflow-x-hidden flex flex-col items-center md:items-start justify-start px-4 py-8 md:px-8">
        <div className="w-full max-w-xl text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Welcome to Your Dashboard</h1>
          <p className="text-base md:text-lg text-gray-600 mb-6">
            Here you can manage your tasks, track your progress, and stay organized with ease.
            Explore the features below to enhance your productivity and streamline your daily activities.
          </p>
          <hr className="mb-6"/>
          <div className="flex flex-col gap-4 md:flex-row md:gap-4 w-full justify-center md:justify-start">
            <button
              onClick={() => navigate('/todo-list')}
              className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full md:w-auto"
            >
              View Tasks
            </button>
          </div>
          <p className="mt-4 text-xs md:text-sm text-gray-500 break-all">
            Your token: <span className="font-mono text-xs">{userToken}</span>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;