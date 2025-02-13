import React, { useState, useEffect } from "react";
import "./index.css";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { motion } from 'framer-motion';
import axios from "axios";
import TaskTable from "./components/TaskTable";
import TaskForm from "./components/TaskForm";
import AuthPage from "./components/Auth/AuthPage";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/auth" />;
  }
  return children;
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // PWA Installation
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('PWA installation prompt available');
    const installButton = document.createElement('button');
    installButton.textContent = 'Install App';
    installButton.style.position = 'fixed';
    installButton.style.bottom = '20px';
    installButton.style.right = '20px';
    installButton.style.zIndex = '1000';
    document.body.appendChild(installButton);

    installButton.addEventListener('click', () => {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        deferredPrompt = null;
      });
    });
  });

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('https://taskmanager-backend-six.vercel.app/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/auth';
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchTasks();
    } else {
      setIsLoading(false);
    }
  }, []);

  const addTask = async (newTask) => {
    try {
      await axios.post('https://taskmanager-backend-six.vercel.app/tasks', newTask);
      await fetchTasks(); // Fetch all tasks after adding
      return "Task added successfully!";
    } catch (error) {
      console.error("Error adding task:", error);
      throw error;
    }
  };

  const updateTask = async (id, updatedTask) => {
    try {
      await axios.put(`https://taskmanager-backend-six.vercel.app/tasks/${id}`, updatedTask);
      await fetchTasks(); // Fetch all tasks after updating
      return "Task updated successfully!";
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`https://taskmanager-backend-six.vercel.app/tasks/${id}`);
      await fetchTasks(); // Fetch all tasks after deleting
      return "Task deleted successfully!";
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  };

  const MainLayout = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none" />
      
      <div className="relative z-10">
        <motion.nav 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="sticky top-0 backdrop-blur-md bg-gray-900/80 border-b border-gray-700 shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Task Manager
              </Link>
              <div className="flex items-center space-x-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/add" className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
                    Add Task
                  </Link>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/auth';
                  }}
                  className="px-4 py-2 bg-red-500/20 rounded-lg text-red-300 hover:bg-red-500/30 transition-all duration-200"
                >
                  Logout
                </motion.button>
              </div>
            </div>
          </div>
        </motion.nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="text-blue-400">Loading tasks...</div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Routes>
                <Route path="/" element={<TaskTable tasks={tasks} onUpdateTask={updateTask} onDeleteTask={deleteTask} />} />
                <Route path="/add" element={<TaskForm onAddTask={addTask} />} />
              </Routes>
            </motion.div>
          )}
        </main>

        <footer className="mt-auto py-6 text-center text-gray-400">
          <p className="text-sm">Task Manager © {new Date().getFullYear()} | Built by Nithin</p>
        </footer>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;