function joinRoom(roomName){
    //send this name to the server
    nsSocket.emit('joinRoom',roomName, (newNumberOfMember)=>{
        // update the room member total that just been joined
        document.querySelector('.curr-room-num-users').innerHTML = `${newNumberOfMember}<span class="glyphicon glyphicon-user"></span>`
    })
    nsSocket.on('historyCatchUp', (history)=>{
        // console.log(history)
        const messageUl = document.querySelector('#messages')
        messageUl.innerHTML =''
        history.forEach((msg)=>{
            const newMsg = buildHTML(msg)
            const currentMsgs = messageUl.innerHTML
            messageUl.innerHTML = currentMsgs + newMsg
        })
        messageUl.scrollTo(0, messageUl.scrollHeight)
    })
    nsSocket.on('updateMembers', (numMembers)=> {
        document.querySelector('.curr-room-num-users').innerHTML = `${numMembers}<span class="glyphicon glyphicon-user"></span>`
        document.querySelector('.curr-room-text').innerText = `${roomName}`
    })

    let searchBox = document.querySelector('#search-box')
    searchBox.addEventListener('input', (e)=>{
        let msgs = Array.from(document.getElementsByClassName('message-text'))
        msgs.forEach((msg)=>{
            if(msg.innerText.toLowercase().indexOf(e.target.value.toLowercase()) === -1){
                msg.style.display = 'none'
            }else{
                msg.style.display = 'block'
            }
        })
    })
}