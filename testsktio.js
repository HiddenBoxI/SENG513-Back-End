import { io } from 'socket.io-client'

// let socket = io('http://localhost:8000');
let socket = new io('http://localhost:8000');

const data = {
    myName: 'lalala1',
    myID: 1,
};

socket.emit('addUser', data);

socket.on('waitforjoin', () => {
    console.log(lalala);
})
