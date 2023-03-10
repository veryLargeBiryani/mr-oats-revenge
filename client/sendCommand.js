function sendCommand(){
    let cmd = document.querySelector('input[name="command"]:checked').value;
    let guild = document.getElementById("guild").value;
    let textChannel = 909609510656692254;
    let voiceChannel = 143574023417233408;
    let author = 138151052099846144;
    let url = document.getElementById("url").value
    window.fetch(`localhost:3001/api/${guild}/${cmd}?` + new URLSearchParams({
        author: author,
        textChannel: textChannel,
        voiceChannel: voiceChannel,
        url: url
    }));
}

export { sendCommand };