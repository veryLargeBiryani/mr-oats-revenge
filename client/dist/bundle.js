(()=>{"use strict";let e={guild:document.getElementById("guild"),skip:document.getElementById("skip"),play:document.getElementById("play"),queued:document.getElementById("queued"),url:document.getElementById("url"),urlLabel:document.getElementById("urlLabel")};e.play.addEventListener("input",(()=>{e.url.hidden=!1,e.urlLabel.hidden=!1})),e.skip.addEventListener("input",(()=>{e.url.hidden=!0,e.urlLabel.hidden=!0})),e.queued.addEventListener("input",(()=>{e.url.hidden=!0,e.urlLabel.hidden=!0}));let t=document.createElement("button");t.id="submit",t.textContent="Submit",t.addEventListener("click",(function(){let e=document.querySelector('input[name="command"]:checked').value,t=document.getElementById("guild").value,d=document.getElementById("url").value;fetch(`http://localhost:3001/api/${t}/${e}?`+new URLSearchParams({author:0x1eacfa661c20000,textChannel:0xc9f9507d7025000,voiceChannel:0x1fe13d048c20000,url:d}))})),document.body.appendChild(t)})();