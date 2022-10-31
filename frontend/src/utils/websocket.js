import {BACKEND_URL} from './constants';
const ws = new WebSocket(`ws://${BACKEND_URL}`);
export default ws;