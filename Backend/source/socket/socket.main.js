

class SocketMain {
    constructor(server) {
        const io = require('socket.io')(server, {
            cors: {
              origin: "http://localhost:5000",
              methods: ["GET", "POST"],
              transports: ['websocket', 'polling'],
              credentials: true
            },
            allowEIO3: true
        })
        this.io = io;
        this.activeUsers = new Set();
        this.core();
    }

    core() {
        this.io.on("connection", (socket) => {
            console.log("Made socket connection");

            socket.on("new user", (data) => {
                socket.userId = data;
                this.activeUsers.add(data);
                this.io.emit("new user", [...this.activeUsers]);
            });

            socket.on("disconnect", () => {
                this.activeUsers.delete(socket.userId);
                this.io.emit("user disconnected", socket.userId);
            });

            socket.on("chat message", (data) => {
                console.log(socket.userId)
                this.io.emit("chat message", data);
            });

            socket.on("typing", (data) => {
                socket.broadcast.emit("typing", data);
            });

            // You can add more event handlers as needed
        });
    }
}

module.exports = SocketMain;
