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