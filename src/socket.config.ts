import { io } from 'socket.io-client';
import { hostedAt } from './util.fns';
const socket = io(`ws://${hostedAt()}`, { transports: ['websocket'] });
export default socket;
