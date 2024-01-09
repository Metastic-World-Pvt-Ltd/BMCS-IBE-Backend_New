// const cluster = require('cluster');
// const http = require('http');
// const numCPUs = require('os').cpus().length;
//cl
const express = require('express')
const helmet = require('helmet');
const cors = require('cors');

const app = express()
const db = require('./mongoose/mongoose');


app.use(helmet());
app.use(cors())

app.use('/',require('./router/index'))
//Need to change for upload Avtar
//const upload = multer({ dest: 'uploads/' })
// var upload = multer({
//     dest: storageValue,
//     fileFilter: fileFilterValue,
//   });
require('dotenv').config();
const port = process.env.PORT || 4000;
//json input in body
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use('/uploads', express.static('uploads'));
//Home Directory
// 
const http = require('http');
const WebSocket = require('ws');

// const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.get('/', (req, res) => {
  res.send('API response');
});

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Notify clients on status changes
module.exports.notifyStatusChange = async function(projectId, newStatus){
    console.log('inside websocket');
  const message = JSON.stringify({ type: 'status_update', projectId, newStatus });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
      console.log('inside',message);
    }
  });
  
}
// function notifyStatusChange(projectId, newStatus) {
//     console.log('inside websocket');
//   const message = JSON.stringify({ type: 'status_update', projectId, newStatus });
//   wss.clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(message);
//       console.log('inside',message);
//     }
//   });
// }
module.exports.notifyStatusChange;
const PORT = 4001;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

// if (cluster.isMaster) {
//   console.log(`Master ${process.pid} is running`);

//   // Fork workers for each CPU core
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} died`);
//   });
// } else {
//   const server = http.createServer(app);
  
//   server.listen(port, () => {
//     console.log(`Worker ${process.pid} is listening`);
//   });
// }

app.listen(port, () => console.log(`Express Server is listening on port ${port}!`))