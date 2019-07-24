const socket = io('http://localhost:5000')
let nsSocket = ''
socket.on('messageFromServer', (dataFromServer) => {
    console.log(dataFromServer)
    socket.emit('dataToServer', {data: 'data from the client'})
})
socket.on('nsList', (nsData)=>{
    console.log('the list of namespace is arrived')
    let namespaceDiv = document.querySelector('.namespaces')
    namespaceDiv.innerHTML = ''
    nsData.forEach((ns)=>{
        namespaceDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.img}"/></div>`
    })

    // Add a click listener for each namespace
    Array.from(document.getElementsByClassName('namespace')).forEach((element)=>{
        // console.log(element)
        element.addEventListener('click', (e)=>{
            const nsEndpoint = element.getAttribute('ns')
            console.log(nsEndpoint)
        })
    })
    joinNs('/wiki')
})