const express = require('express')
const app = express()
const socketio = require('socket.io')

let namespaces = require('./data/namespaces')

app.use(express.static(__dirname + '/public'))
const expressServer = app.listen(5000)
const io = socketio(expressServer)
const admin = io.of('/admin') // admin namespace

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
    // console.log(namespace)
    let thisNs = io.of(namespace.endpoint)
    thisNs.on('connect', (nsSocket)=>{
        console.log(`${nsSocket.id} has joined ${namespace.endpoint}`)
        // a socket has connected to one one of our chatgroup ns
        // send that ns grp info back
        nsSocket.emit('nsRoomLoad', namespaces[0].rooms)
    })
})