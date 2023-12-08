const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use(express.urlencoded())
// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('Client connected');

  // Listen for messages from the client
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
  });

  // Close the WebSocket connection when the client disconnects
  ws.on('close', () => {
    console.log('Client disconnected');
    // clearInterval(interval);
  });
});

app.get('/', (req, res) => res.send('Welcome to IBE Home'))

// API endpoint to create a project
app.post('/createProject', (req, res) => {
  // Add logic to create a new project
  
const {status} = req.body;
  // Notify all connected clients about the new project
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(status);
    }
  });

  res.status(201).json({ message: 'Project created successfully' });
});

// Start the server
const PORT =  5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

