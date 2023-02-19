const express = require('express');
const next = require('next');
const http = require('http');
const socketIo = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const {v4} = require('uuid')

app.prepare()
  .then(() => {
    const server = express();
    const httpServer = http.createServer(server);
    const io = socketIo(httpServer);

    const val = v4();
    // Set up a route handler for the root URL
    server.get('/', (req, res) => {
      // Render the index page using the default Next.js engine
      res.redirect(`/room/${val}`)
    });

    server.get('/room/:id', (req, res) => {
        app.render(req, res, '/room', {id: val})
    })

    // Set up a catch-all route handler for all other URLs
    server.get('*', (req, res) => {
      return handle(req, res);
    });

    io.on('connection', (socket) => {
      console.log('A user connected');

      socket.on('message', (data) => {
        console.log('Received message:', data);
        io.emit('message', data);
      });

      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });

    // Start the server on port 3000
    httpServer.listen(3000, () => {
      console.log('Server listening on http://localhost:3000');
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
