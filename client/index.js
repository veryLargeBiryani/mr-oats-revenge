import { sendCommand } from './sendCommand';

// setup submit query
const submitEl = document.createElement("button");
submitEl.addEventListener("click", sendCommand);
submitEl.textContent = "Submit";
document.body.appendChild(submitEl);