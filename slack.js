const express = require('express')
const app = express()
const socketio = require('socket.io')

let namespaces = require('./data/namespaces')

app.use(express.static(__dirname + '/public'))
const expressServer = app.listen(5000)
const io = socketio(expressServer)

// main namespace
io.on('connect', (socket) => {
    // build an arr to send back w/ the img & endpoint for each NS
    let nsData = namespaces.map((ns)=>{
        return{
            img: ns.img,
            endpoint: ns.endpoint
        }
    })
    // console.log(nsData)
    socket.emit('nsList', nsData)
})

// loop through each namespace and listen for a connection
namespaces.forEach((namespace)=>{
    io.of(namespace.endpoint).on('connect', (nsSocket)=>{
        const username = nsSocket.handshake.query.username
        // a socket has connected to one one of our chatgroup ns
        // send that ns grp info back
        nsSocket.emit('nsRoomLoad', namespace.rooms)
        nsSocket.on('joinRoom', (roomToJoin, numberOfUsersCallback)=>{
            const roomToLeave = Object.keys(nsSocket.rooms)[1]
            nsSocket.leave(roomToLeave)
            updateUserInRoom(namespace, roomToLeave)
            nsSocket.join(roomToJoin)
            
            const nsRoom = namespace.rooms.find((room)=>{
                return room.roomTitle === roomToJoin
            })
            nsSocket.emit('historyCatchUp', nsRoom.history)
            updateUserInRoom(namespace, roomToJoin)
        })


        nsSocket.on('newMsgToServer', (msg)=>{
            const fullMsg = {
                text: msg.text,
                time: Date.now(),
                username: username,
                avatar: 'https://i.imgur.com/MWMwIke.png'
            }
            // console.log(msg)

            // send this msg to all the socket that are in this room
            const roomTitle = Object.keys(nsSocket.rooms)[1]

            // find the room obj for this room
            const nsRoom = namespace.rooms.find((room)=>{
                return room.roomTitle === roomTitle
            })
            nsRoom.addMessage(fullMsg)
            // console.log(nsRoom)
            io.of(namespace.endpoint).to(roomTitle).emit('msgToClients', fullMsg)
        })
    })
})

function updateUserInRoom(namespace, roomToJoin){
    io.of(namespace.endpoint).in(roomToJoin).clients((err, clients)=>{
        console.log(`there are ${clients.length} members in this room`)
        io.of(namespace.endpoint).in(roomToJoin).emit('updateMembers', clients.length)
    })
}