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

  return (
    <div className="w-full">
      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-gray-800 rounded-lg backdrop-blur-sm border border-gray-700"
        >
          {message}
        </motion.div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-700 backdrop-blur-sm bg-gray-900/50">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Title</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Description</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Due Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {tasks.map((task) => (
              <motion.tr 
                key={task._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
              >
                {editingId === task._id ? (
                  <>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        className="w-full bg-gray-700 border-0 rounded-md text-white px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        name="title"
                        value={editFormData.title}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        className="w-full bg-gray-700 border-0 rounded-md text-white px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        name="description"
                        value={editFormData.description}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td className="px-4 py-3">
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
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="date"
                        className="w-full bg-gray-700 border-0 rounded-md text-white px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        name="dueDate"
                        value={editFormData.dueDate.split('T')[0]}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-md text-white text-sm hover:from-green-600 hover:to-emerald-700"
                        onClick={handleSaveClick}
                      >
                        Save
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1 bg-gray-600 rounded-md text-white text-sm hover:bg-gray-700"
                        onClick={handleCancelClick}
                      >
                        Cancel
                      </motion.button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 text-gray-300">{task.title}</td>
                    <td className="px-4 py-3 text-gray-300">{task.description}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        task.status === 'Completed' ? 'bg-green-500/20 text-green-300' :
                        task.status === 'In Progress' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md text-white text-sm hover:from-blue-600 hover:to-purple-700"
                        onClick={() => handleEditClick(task)}
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-600 rounded-md text-white text-sm hover:from-red-600 hover:to-pink-700"
                        onClick={() => handleDeleteClick(task._id)}
                      >
                        Delete
                      </motion.button>
                    </td>
                  </>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TaskTable;