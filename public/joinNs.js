function joinNs(endpoint){
    if(nsSocket){
        nsSocket.close()
        // remove the eventlistener before it's added again
        document.querySelector('#user-input').removeEventListener('submit', formSubmssion)
    }

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
            roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"/>${room.roomTitle}</li>`
        })
        // Add a click listener for each room
        let roomNodes = document.getElementsByClassName('room')
        Array.from(roomNodes).forEach((element)=>{
            element.addEventListener('click', (e)=>{
                joinRoom(e.target.innerText)
            })
        })
        // add room automatically
        const topRoom = document.querySelector('.room')
        const topRoomName = topRoom.innerText
        // console.log(topRoomName)
        joinRoom(topRoomName)
    })
    nsSocket.on('msgToClients', (msg)=>{
        // console.log(msg)
        const newMsg = buildHTML(msg)
        document.querySelector('#messages').innerHTML += newMsg
    })
    document.querySelector('.message-form').addEventListener('submit', formSubmssion)
}
function formSubmssion() {
    event.preventDefault()
    const newMessage = document.querySelector('#user-message').value
    nsSocket.emit('newMsgToServer', {text: newMessage})
}


function buildHTML(msg){
    const convertDate = new Date(msg.time).toLocaleString()
    const newHTML = `
    <li>
        <div class="user-image">
            <img src="${msg.avatar}" style="width:30px" />
        </div>
        <div class="user-message">
        <div class="user-name-time">${msg.username}<span>${convertDate}</span></div>
            <div class="message-text">${msg.text}</div>
        </div>
    </li>
    `
    return newHTML
}