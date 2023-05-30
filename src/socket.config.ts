import { io } from 'socket.io-client';
// import { hostedAt } from './util.fns';
socket = io('wss://tolbel-express-server-production.up.railway.app', { transports: ['websocket'] });
//const socket = io('ws://localhost:8000', { transports: ['websocket'] }); // local
export default socket;
