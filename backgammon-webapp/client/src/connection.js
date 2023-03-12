import io from 'socket.io-client'

const URL = 'http://localhost:3001'

const socket = io(URL)

// Handle the "disconnect" event
socket.on('disconnect', () => {
    // Reconnect when the user navigates to another page
    socket.connect();
});

export {
    socket
}