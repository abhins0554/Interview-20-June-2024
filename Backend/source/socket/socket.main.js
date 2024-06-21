let ioInstance = null;


const { default: mongoose } = require('mongoose');
const authMiddleware = require('../middleware/authMiddleware');

const ChatModel = require('../model/chat.schema');

class SocketMain {
    constructor(server) {
        const io = require('socket.io')(server, {
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"],
                transports: ['websocket', 'polling'],
                credentials: true
            },
            allowEIO3: true
        });
        this.io = io;
        ioInstance = io;  // Set the global ioInstance
        this.activeUsers = new Set();
        this.usersData = [];
        this.core();
    }

    core() {
        this.io.on("connection", async (socket) => {
            console.log("Made socket connection");

            socket.on("auth", async (data) => {
                try {
                    const { token } = JSON.parse(data);
                    const auth = await authMiddleware.authenticateSocket(token);
                    if (auth) {
                        socket.userId = auth._id;
                        this.activeUsers.add(auth._id);
                        this.usersData = [...this.usersData, auth];
                        this.io.emit("new user", [...this.activeUsers]);
                    } else {
                        socket.disconnect(true);
                    }
                } catch (error) {
                    socket.disconnect(true);
                }
            });


            socket.on("disconnect", () => {
                this.activeUsers.delete(socket.userId);
                this.usersData = this.usersData.filter(i => i._id !== socket.userId);
                this.io.emit("user disconnected", socket.userId);
            });

            socket.on("chat message", async (data) => {
                if (!socket.userId) socket.disconnect(true);
                console.log(data.message, socket.userId);
                // 
                let chatD = await new ChatModel({
                    message: data.message,
                    createdBy: new mongoose.Types.ObjectId(socket.userId),
                    time: Date.now(),
                }).save();
                let formatData = await ChatModel.aggregate([
                    {
                        $match: {
                            _id: new mongoose.Types.ObjectId(chatD._id)
                        }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'createdBy',
                            foreignField: '_id',
                            as: 'createdBy'
                        }
                    },
                    {
                        $unwind: "$createdBy"
                    },
                    {
                        $project: {
                            _id: 1,
                            message: 1,
                            time: 1,
                            createdAt: 1,
                            "createdBy._id": 1,
                            "createdBy.fullname": 1,
                            "createdBy.email": 1,
                            "createdBy.username": 1,
                        }
                    }
                ]);
                this.io.emit("chat message", formatData[0]);
            });

            socket.on("chat message user connected", () => {
                if (!socket.userId) socket.disconnect(true);
                this.io.emit("chat message user connected", JSON.stringify(this.usersData));
            });

            socket.on("poll_added", (data) => {
                if (!socket.userId) socket.disconnect(true);
                this.io.emit("chat message", data);
            });

            socket.on("typing", (data) => {
                if (!socket.userId) return socket.disconnect(true);
                socket.broadcast.emit("typing", data);
            });
        });
    }
}

const getIoInstance = () => ioInstance;

module.exports = { SocketMain, getIoInstance };
