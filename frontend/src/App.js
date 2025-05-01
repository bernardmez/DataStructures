// App.js - Main React Component
import React, { useState, useEffect } from 'react';
import './App.css';

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(3); // Default priority: Low (3)

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) return;
    
    onAddTask({ title, description, priority: parseInt(priority) });
    
    // Reset form
    setTitle('');
    setDescription('');
    setPriority(3);
  };

  return (
    <div className="task-form">
      <h2>Add New Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="priority">Priority:</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value={1}>High</option>
            <option value={2}>Medium</option>
            <option value={3}>Low</option>
          </select>
        </div>
        
        <button type="submit" className="btn-submit">Add Task</button>
      </form>
    </div>
  );
}

function TaskList({ tasks, onProcessNext }) {
  return (
    <div className="task-list">
      <div className="task-header">
        <h2>Task Queue</h2>
        <button 
          onClick={onProcessNext} 
          className="btn-process" 
          disabled={tasks.length === 0}
        >
          Process Next Task
        </button>
      </div>
      
      {tasks.length === 0 ? (
        <p className="no-tasks">No tasks in queue</p>
      ) : (
        <ul>
          {tasks.map((task, index) => {
            // Determine priority class
            let priorityClass = 'priority-low';
            let priorityText = 'Low';
            
            if (task.priority === 1) {
              priorityClass = 'priority-high';
              priorityText = 'High';
            } else if (task.priority === 2) {
              priorityClass = 'priority-medium';
              priorityText = 'Medium';
            }
            
            return (
              <li key={task.id} className={index === 0 ? 'next-task' : ''}>
                <div className="task-info">
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <div className="task-meta">
                    <span className={`priority-badge ${priorityClass}`}>
                      {priorityText}
                    </span>
                    <span className="task-date">
                      {new Date(task.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                {index === 0 && <div className="next-indicator">Next</div>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function QueueVisualization({ tasks }) {
  if (tasks.length === 0) return null;
  
  return (
    <div className="queue-visualization">
      <h2>Priority Queue Visualization</h2>
      <div className="tree-container">
        {renderTree(tasks, 0, Math.ceil(Math.log2(tasks.length + 1)))}
      </div>
    </div>
  );
}

function renderTree(tasks, index, height) {
  if (index >= tasks.length) return null;
  
  let priorityClass = 'priority-low';
  if (tasks[index].priority === 1) {
    priorityClass = 'priority-high';
  } else if (tasks[index].priority === 2) {
    priorityClass = 'priority-medium';
  }
  
  return (
    <div className="tree-node-container">
      <div className={`tree-node ${priorityClass}`}>
        <div className="node-content">
          <div className="node-title">{tasks[index].title}</div>
          <div className="node-priority">Priority: {tasks[index].priority}</div>
        </div>
      </div>
      <div className="tree-children">
        {renderTree(tasks, 2 * index + 1, height)}
        {renderTree(tasks, 2 * index + 2, height)}
      </div>
    </div>
  );
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // API URL - replace with your actual backend URL
  const API_URL = 'http://localhost:3001/api';
  
  useEffect(() => {
    // Fetch tasks when component mounts
    fetchTasks();
  }, []);
  
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/tasks`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      const data = await response.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError('Error loading tasks. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const addTask = async (newTask) => {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add task');
      }
      
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError('Error adding task. Please try again.');
      console.error(err);
    }
  };
  
  const processNextTask = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks/next`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to process task');
      }
      
      const data = await response.json();
      setTasks(data.remainingTasks);
    } catch (err) {
      setError('Error processing task. Please try again.');
      console.error(err);
    }
  };
  
  return (
    <div className="app">
      <header>
        <h1>Task Priority Queue Manager</h1>
        <p className="subtitle">Data Structures Project Implementation</p>
      </header>
      
      <main>
        {error && <div className="error-message">{error}</div>}
        
        {isLoading ? (
          <div className="loading">Loading tasks...</div>
        ) : (
          <>
            <div className="app-container">
              <TaskForm onAddTask={addTask} />
              <TaskList tasks={tasks} onProcessNext={processNextTask} />
            </div>
            <QueueVisualization tasks={tasks} />
          </>
        )}
      </main>
      
      <footer>
        <p>Priority Queue Implementation - Data Structures Project</p>
      </footer>
    </div>
  );
}

export default App;