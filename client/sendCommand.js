function sendCommand(){
    let cmd = document.querySelector('input[name="command"]:checked').value;
    console.log(cmd);
}

export { sendCommand };