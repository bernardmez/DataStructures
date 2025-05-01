// server.js - Express server
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Priority Queue Implementation
class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  // Helper methods for heap operations
  getParentIndex(i) {
    return Math.floor((i - 1) / 2);
  }

  getLeftChildIndex(i) {
    return 2 * i + 1;
  }

  getRightChildIndex(i) {
    return 2 * i + 2;
  }

  hasParent(i) {
    return this.getParentIndex(i) >= 0;
  }

  hasLeftChild(i) {
    return this.getLeftChildIndex(i) < this.heap.length;
  }

  hasRightChild(i) {
    return this.getRightChildIndex(i) < this.heap.length;
  }

  parent(i) {
    return this.heap[this.getParentIndex(i)];
  }

  leftChild(i) {
    return this.heap[this.getLeftChildIndex(i)];
  }

  rightChild(i) {
    return this.heap[this.getRightChildIndex(i)];
  }

  swap(i, j) {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }

  // Add element to the queue
  enqueue(task) {
    this.heap.push(task);
    this.heapifyUp();
    return this.heap;
  }

  // Remove and return the highest priority element
  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    const item = this.heap[0];
    this.heap[0] = this.heap[this.heap.length - 1];
    this.heap.pop();
    this.heapifyDown();
    return item;
  }

  // Check if queue is empty
  isEmpty() {
    return this.heap.length === 0;
  }

  // Get all items in current order (without removing)
  getAllItems() {
    return [...this.heap];
  }

  // Reorganize heap upward after insertion
  heapifyUp() {
    let index = this.heap.length - 1;
    while (
      this.hasParent(index) && 
      this.parent(index).priority > this.heap[index].priority
    ) {
      this.swap(this.getParentIndex(index), index);
      index = this.getParentIndex(index);
    }
  }

  // Reorganize heap downward after removing root
  heapifyDown() {
    let index = 0;
    while (this.hasLeftChild(index)) {
      let smallerChildIndex = this.getLeftChildIndex(index);
      if (
        this.hasRightChild(index) &&
        this.rightChild(index).priority < this.leftChild(index).priority
      ) {
        smallerChildIndex = this.getRightChildIndex(index);
      }

      if (this.heap[index].priority < this.heap[smallerChildIndex].priority) {
        break;
      } else {
        this.swap(index, smallerChildIndex);
      }
      index = smallerChildIndex;
    }
  }
}

// Initialize our priority queue
const taskQueue = new PriorityQueue();

// Provide some initial data
const initialTasks = [
  { id: 1, title: 'Complete project report', description: 'Finish the quarterly report', priority: 2, createdAt: new Date() },
  { id: 2, title: 'Fix login bug', description: 'Users cannot log in on mobile devices', priority: 1, createdAt: new Date() },
  { id: 3, title: 'Update documentation', description: 'Add new API endpoints to docs', priority: 3, createdAt: new Date() },
];

initialTasks.forEach(task => taskQueue.enqueue(task));

// Routes
app.get('/api/tasks', (req, res) => {
  res.json(taskQueue.getAllItems());
});

app.post('/api/tasks', (req, res) => {
  const { title, description, priority } = req.body;
  
  if (!title || !description || priority === undefined) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  const newTask = {
    id: Date.now(), // simple ID generation
    title,
    description,
    priority: parseInt(priority),
    createdAt: new Date()
  };
  
  taskQueue.enqueue(newTask);
  res.status(201).json(taskQueue.getAllItems());
});

app.delete('/api/tasks/next', (req, res) => {
  const task = taskQueue.dequeue();
  if (!task) {
    return res.status(404).json({ error: 'No tasks in queue' });
  }
  res.json({ removedTask: task, remainingTasks: taskQueue.getAllItems() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
