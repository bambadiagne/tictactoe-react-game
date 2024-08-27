import { BACKEND_URL } from "./constants";
const urlScheme = (window.location.protocol === "https:" ? "wss://" : "ws://") + BACKEND_URL;
const ws = new WebSocket(urlScheme);
export default ws;
