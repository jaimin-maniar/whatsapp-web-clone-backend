let io;

function initSocket(server) {
  const socketio = require('socket.io');
  io = socketio(server, {
    cors: {
      origin: "*",  // Set your frontend URL in production
      methods: ["GET", "POST"]
    }
  });
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    socket.on('disconnect', () => console.log(`Disconnected: ${socket.id}`));
  });
}
function getIO() {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
}
module.exports = { initSocket, getIO };
