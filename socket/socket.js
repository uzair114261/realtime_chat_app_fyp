const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const httpServer = http.createServer()

const sessionsMap = {};
const io = new Server(httpServer, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
    },
});

io.on("connection", (socket) => {

    socket.on("join:email", (email) => {
        sessionsMap[email] = socket.id;

    });
    socket.on("message:send", (data) => {
        const { sender, receiver, message } = data;
        const receiverId = sessionsMap[receiver];
        console.log(receiverId)
        io.to(receiverId).emit("message:receive", data);
    })
    socket.on("message:delete", (data) => {
        const { receiver, messageId } = data;
        const receiverId = sessionsMap[receiver];

        io.to(receiverId).emit("message:delete", data);
    })
    socket.on("call:incoming", (data) => {
        const { from, to, callType } = data;
        const callTo = sessionsMap[to];

        io.to(callTo).emit("call:incoming", data);
    })

    socket.on("active:users", (otherUseremail) => {
            const { rooms } = io.sockets.adapter;
            const room = rooms.get(otherUseremail);
            if (room) {
                if (room.size > 0) {
                    io.to(socket.id).emit("active:user:list", true);
                    return;
                }
            }
            io.to(socket.id).emit("active:user:list", false);

        })
        //@ts-ignore
    socket.on("room:join", (data) => {
        const { email, room } = data;
        //@ts-ignore
        const { rooms } = io.sockets.adapter;
        const myRoom = rooms.get(room);
        if (myRoom === undefined) {
            socket.join(room);
        } else if (myRoom.size === 1) {
            console.log("run");
            // room.size == 1 when one person is inside the room.
            io.to(room).emit("user:joined", { email, id: socket.id });
            socket.join(room);
        } else {
            // when there are already two people inside the room.
            socket.emit("full");
        }

    });


    socket.on("user:call", ({ to, offer }) => {
        io.to(to).emit("incomming:call", { from: socket.id, offer });
    });

    socket.on("call:accepted", ({ to, ans }) => {
        io.to(to).emit("call:accepted", { from: socket.id, ans });
    });

    socket.on("peer:nego:needed", ({ to, offer }) => {
        io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
    });

    socket.on("peer:nego:done", ({ to, ans }) => {
        io.to(to).emit("peer:nego:final", { from: socket.id, ans });
    });

    socket.on("call:end", async({ room, to }) => {

        const callTo = sessionsMap[to];

        io.to(callTo).emit("call:cancelled");

        const sockets = await io.in(room).fetchSockets();
        sockets.forEach((s) => {
            s.leave(room);
        });
    });

    socket.on("disconnect", async() => {
        console.log("remove", socket.id);
        const sockets = await io.in(socket.id).fetchSockets();
        sockets.forEach((s) => {
            s.leave(socket.id);
        });
    });

});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Socket.io server is running on port ${PORT}`);
});