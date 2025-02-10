import React, { useState, useEffect } from "react";
import "./index.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { motion } from 'framer-motion';
import axios from "axios";
import TaskTable from "./components/TaskTable";
import TaskForm from "./components/TaskForm";

function App() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('https://taskmanager-backend-six.vercel.app/');
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async (newTask) => {
    try {
      const response = await axios.post('https://taskmanager-backend-six.vercel.app/', newTask);
      setTasks([...tasks, response.data]);
      return "Task added successfully!";
    } catch (error) {
      console.error("Error adding task:", error);
      throw error;
    }
  };

  const updateTask = async (id, updatedTask) => {
    try {
      const response = await axios.put(`https://taskmanager-backend-six.vercel.app/${id}`, updatedTask);
      setTasks(tasks.map((task) => (task._id === id ? response.data : task)));
      return "Task updated successfully!";
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`https://taskmanager-backend-six.vercel.app/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
      return "Task deleted successfully!";
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        {/* Background overlay with blur effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none" />
        
        {/* Main content container */}
        <div className="relative z-10">
          {/* Navigation */}
          <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 backdrop-blur-md bg-gray-900/80 border-b border-gray-700 shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <Link 
                  to="/" 
                  className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                >
                  Task Manager
                </Link>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/add" 
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/20"
                  >
                    Add Task
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.nav>

          {/* Main content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <TaskTable 
                        tasks={tasks} 
                        onUpdateTask={updateTask} 
                        onDeleteTask={deleteTask} 
                      />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/add" 
                  element={
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <TaskForm onAddTask={addTask} />
                    </motion.div>
                  } 
                />
              </Routes>
            </motion.div>
          </main>

          {/* Footer */}
          <footer className="mt-auto py-6 text-center text-gray-400">
            <p className="text-sm">
              Task Manager © {new Date().getFullYear()} | Built by Nithin
            </p>
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App;
