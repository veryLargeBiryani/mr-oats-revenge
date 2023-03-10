import { sendCommand } from './sendCommand';

//get basic form fields
let form = {
    guild: document.getElementById('guild'),
    skip: document.getElementById('skip'),
    play: document.getElementById('play'),
    queued: document.getElementById('queued'),
    url: document.getElementById('url'),
    urlLabel: document.getElementById('urlLabel')
};

//dynamically create/hide additional fields
form.play.addEventListener("input", ()=>{
    form.url.hidden = false;
    form.urlLabel.hidden = false;
});
form.skip.addEventListener("input", ()=>{
    form.url.hidden = true;
    form.urlLabel.hidden = true;
});
form.queued.addEventListener("input", ()=>{
    form.url.hidden = true;
    form.urlLabel.hidden = true;
});

//create submission button
let btn = document.createElement("button");
btn.id = 'submit'
btn.textContent = "Submit";
btn.addEventListener("click", sendCommand);
document.body.appendChild(btn);