import { io } from 'socket.io-client';
// import { hostedAt } from './util.fns';
const socket = io('ws://tolbel-express-server-production.up.railway.app', { transports: ['websocket'] });
export default socket;
