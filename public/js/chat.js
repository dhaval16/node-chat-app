const socket = io()
// Elements
const $messageForm = document.querySelector('#myform')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#sendlocation')

const $messages = document.querySelector('#message');
//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;

const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// options
const { username,room } =Qs.parse(location.search,{ignoreQueryPrefix:true})
 
const autoscroll = () =>{
    // new message 
    const $newMessage = $messages.lastElementChild
    
    // height of the new msg
    const newMsgStyle = getComputedStyle($newMessage);
    const newMsgMargin = parseInt(newMsgStyle.marginBottom);
    const newMsgHeight = $newMessage.offsetHeight + newMsgMargin;
    //console.log(newMsg);
    //visible height
    const visibleHeight = $messages.offsetHeight;

    //height of messsages cotainer
    const containerHeight = $messages.scrollHeight;

    // how far scroller
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if(containerHeight - newMsgHeight <= scrollOffset){

        $messages.scrollTop = $messages.scrollHeight;
    }
}


socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt: moment(message.createdAt).format('H:mm A')
    });
    $messages.insertAdjacentHTML('beforeend',html);
    autoscroll()
})

socket.on('locationMessage',(message)=>{
    console.log(message);
    const html = Mustache.render(locationTemplate,{
        username:message.username,
        url:message.url,
        createdAt: moment(message.createdAt).format('H:mm A')
    });
    $messages.insertAdjacentHTML('beforeend',html);
    autoscroll()
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value;
    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();

        if (error) {
            return console.log(error)
        }
        console.log('Message delivered!')
    })
})

socket.on('roomData',({room,users})=>{
    // console.log(room);
    // console.log(users);
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html;
})
socket.on('removeData',({room,users})=>{
    // console.log(room);
    // console.log(users);
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html;
})

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!')  
        })
    })
})



socket.emit('join',{username,room},(error)=>{
    if(error)
    {
        alert(error);
        location.href='/'
    }
});
// const socket = io();
// //elements
// const $messageform = document.querySelector('#myform');
// const $messageformInput = document.querySelector('input');
// const $messageformButton = document.querySelector('button');
// const $messageButton = document.querySelector('#sendlocation');
// socket.on('message',(msg)=>{
//     console.log(msg);
// })
// $messageform.addEventListener('submit',(e)=>{
//     e.preventDefault();
//     $messageformButton.setAttribute('disabled','disabled');
//     const message = e.target.elements.msg.value;
//     socket.emit('sendMessage',message,(error)=>{
//         $messageformButton.removeAttribute('disabled');
//         $messageformInput.value = '';
//         $messageformInput.focus()

//         if(error)
//         return console.log(error);
//         console.log('msg deliverd')
//     });
// })
// $messageButton.addEventListener('click',(e)=>{
//     // e.preventDefault();
//     // const message = e.target.elements.msg.value;
//     if(!navigator.geolocation){
//         return alert('Your Browser Not Supported Geo Location');
//     }
//     $messageButton.setAttribute('disabled','disabled');
//     navigator.geolocation.getCurrentPosition((position)=>{
//         //console.log(position);
//         socket.emit('sendLocation',{latitude:position.coords.latitude,longitude:position.coords.longitude});  
//     },()=>{

//         console.log('location shared');
//         $messageButton.removeAttribute('disabled');
//     })
//     //socket.emit('sendMessage',message);
// })

// // socket.on('countUpdated',(count)=>{
// //     console.log('count has been updated !!',count);
// // })

// // document.querySelector('#inc').addEventListener('click',()=>{
// //     console.log('clicked');
// //     socket.emit('increment');
// // });

