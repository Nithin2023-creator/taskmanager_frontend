import React, { useState } from 'react';
import { motion } from 'framer-motion';

function TaskTable({ tasks, onUpdateTask, onDeleteTask }) {
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEditClick = (task) => {
    setEditingId(task._id);
    setEditFormData(task);
    setMessage('');
  };

  const handleSaveClick = async () => {
    const msg = await onUpdateTask(editingId, editFormData);
    setMessage(msg);
    setEditingId(null);
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setMessage('Editing cancelled.');
  };

  const handleDeleteClick = async (id) => {
    const msg = await onDeleteTask(id);
    setMessage(msg);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500/20 text-green-300';
      case 'In Progress':
        return 'bg-blue-500/20 text-blue-300';
      default:
        return 'bg-yellow-500/20 text-yellow-300';
    }
  };

  return (
    <div className="w-full space-y-4">
      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gray-800 rounded-lg backdrop-blur-sm border border-gray-700"
        >
          {message}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <motion.div
            key={task._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 transition-colors"
          >
            {editingId === task._id ? (
              // Edit Mode
              <div className="p-4 space-y-4">
                <input
                  type="text"
                  className="w-full bg-gray-700 border-0 rounded-md text-white px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  name="title"
                  value={editFormData.title}
                  onChange={handleInputChange}
                  placeholder="Task Title"
                />
                <textarea
                  className="w-full bg-gray-700 border-0 rounded-md text-white px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  name="description"
                  value={editFormData.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  rows="3"
                />
                <select
                  className="w-full bg-gray-700 border-0 rounded-md text-white px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  name="status"
                  value={editFormData.status}
                  onChange={handleInputChange}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <input
                  type="date"
                  className="w-full bg-gray-700 border-0 rounded-md text-white px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  name="dueDate"
                  value={editFormData.dueDate.split('T')[0]}
                  onChange={handleInputChange}
                />
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-md text-white hover:from-green-600 hover:to-emerald-700"
                    onClick={handleSaveClick}
                  >
                    Save
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-2 bg-gray-600 rounded-md text-white hover:bg-gray-700"
                    onClick={handleCancelClick}
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="flex flex-col h-full">
                <div className="p-4 flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4">{task.description}</p>
                  <div className="text-sm text-gray-400">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="px-4 py-3 bg-gray-800 border-t border-gray-700 flex justify-end space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md text-white text-sm hover:from-blue-600 hover:to-purple-700"
                    onClick={() => handleEditClick(task)}
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-600 rounded-md text-white text-sm hover:from-red-600 hover:to-pink-700"
                    onClick={() => handleDeleteClick(task._id)}
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {tasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-gray-400"
        >
          No tasks found. Click "Add Task" to create one.
        </motion.div>
      )}
    </div>
  );
}

export default TaskTable;