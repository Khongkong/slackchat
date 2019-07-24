function joinNs(endpoint){
    nsSocket = io(`http://localhost:5000${endpoint}`)
    nsSocket.on('nsRoomLoad', (nsRooms)=> {
        // console.log(nsRooms)
        let roomList = document.querySelector('.room-list')
        roomList.innerHTML = ''
        nsRooms.forEach((room)=>{
            let glyph
            if(room.privateRoom){
                glyph = 'lock'
            }else{
                glyph = 'globe'
            }
            roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"/> ${room.roomTitle}</li>`
        })
        // Add a click listener for each room
        let roomNodes = document.getElementsByClassName('room')
        Array.from(roomNodes).forEach((element)=>{
            element.addEventListener('click', (e)=>{
                console.log(e.target.innerHTML)
            })
        })
        // add room automatically
        const topRoom = document.querySelector('.room')
        const topRoomName = topRoom.innerText
        // console.log(topRoomName)
        joinRoom(topRoomName)
    })
    nsSocket.on('msgToClient', (msg)=>{
        // console.log(msg)
        document.querySelector('#messages').innerHTML += `<li>${msg.text}</li>`
    })
    document.querySelector('.message-form').addEventListener('submit', (event)=>{
        event.preventDefault()
        const newMessage = document.querySelector('#user-message').value
        socket.emit('newMsgToServer', {text: newMessage})
    })
}