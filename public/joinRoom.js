function joinRoom(roomName){
    //send this name to the server
    nsSocket.emit('joinRoom',roomName)
}