import { io } from 'socket.io-client';
// import { hostedAt } from './util.fns';
const socket = io('wss://tolbel-express-server-production.up.railway.app', { transports: ['websocket'] });
export default socket;
