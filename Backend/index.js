const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')
app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

io.on("connection", (socket) => {

    socket.on("joinRoom", (Data) => {
        socket.join(Data.room)
        io.to(Data.room).emit("user-Connected",Data.username)
    })
    socket.on("send_message", (data) => {
        io.to(data.room).emit("receive_message", data);
    });
    socket.on("disconnect", () => {
        console.log("User closed connection", socket.id)
    })

})

server.listen(8080, () => {
    console.log('listening on 8080')
})