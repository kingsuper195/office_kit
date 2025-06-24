const ipc = require('electron').ipcRenderer;

const quill = new Quill('#editor', {
    theme: 'snow'
});

function closeApp(e) {
    ipc.send('close');

}

document.getElementById("closeBtn").addEventListener("click", closeApp);
