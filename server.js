const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);

  // Listen for ALL events from frontend and broadcast to ALL clients (including admin)
  const events = ["user_login", "send_answer", "viewing_photo", "user_open_bag"];

  events.forEach((event) => {
    socket.on(event, (data) => {
      console.log(`📨 [${event}]`, JSON.stringify(data, null, 2));
      // Broadcast to ALL connected clients (so admin page receives it too)
      io.emit(event, data);
    });
  });

  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`\n🚀 Socket.io server running on http://localhost:${PORT}\n`);
  console.log("Waiting for connections...\n");
});
