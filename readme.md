# Task Priority Queue System

A full-stack application demonstrating priority queue implementation for a data structures project. This application allows users to create tasks with different priority levels, visualizes the priority queue data structure, and processes tasks in priority order.

## Features

- **Task Creation**: Add new tasks with title, description, and priority level
- **Priority Queue Implementation**: Backend uses a min-heap priority queue implementation
- **Queue Visualization**: Visual representation of the priority queue as a tree structure
- **Task Processing**: Process tasks in order of priority (highest priority first)

## Technology Stack

### Frontend
- React.js
- Modern CSS with Flexbox and Grid

### Backend
- Node.js
- Express.js
- Custom Priority Queue data structure implementation

## Data Structure Implementation

The core of this application is a priority queue implemented using a binary heap. The implementation includes:

- Min-heap structure where lower priority values represent higher priority tasks
- O(log n) time complexity for adding and removing tasks
- Proper heap maintenance with heapify up and down operations
- Visualization of the heap structure in the frontend

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone this repository

2. Install backend dependencies:
```
cd backend
npm install
```

3. Install frontend dependencies:
```
cd frontend
npm install
```

### Running the Application

1. Start the backend server:
```
cd backend
npm start
```
This will start the server on port 3001.

2. Start the frontend development server:
```
cd frontend
npm start
```
This will start the React application on port 3000.

3. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
task-priority-queue/
├── backend/
│   ├── server.js         # Express server and priority queue implementation
│   └── package.json      # Backend dependencies
└── frontend/
    ├── public/           # Static files
    ├── src/
    │   ├── App.js        # Main React component
    │   ├── App.css       # Application styling
    │   └── index.js      # React entry point
    └── package.json      # Frontend dependencies
```

## Educational Value

This project demonstrates:

1. **Priority Queue Implementation**: A real-world implementation of the priority queue data structure using a binary heap
2. **Heap Operations**: Proper implementation of heapify up and down operations
3. **Data Visualization**: Visual representation of a complex data structure
4. **Full-Stack Development**: Integration of backend data structures with a frontend UI

## Further Enhancements

Some possible extensions to this project:

1. Add user authentication
2. Implement task categories or tags
3. Add persistence with a database
4. Implement task editing and deletion
5. Add task completion history
6. Implement task deadlines with a secondary priority factor
