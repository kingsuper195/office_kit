const electron = require('electron');
const ipc = electron.ipcRenderer;
const $ = require('jquery');

const quill = new Quill('#editor', {
    theme: 'snow'
});

function closeApp(e) {
    ipc.send('close');

}

$("#closeBtn").on("click", closeApp);

$("#fileButton").on("click", () => {
    if (document.getElementById("fileMenu").style.display == "none") {
        document.getElementById("fileMenu").style.display = "block";
    } else {
        document.getElementById("fileMenu").style.display = "none";
    }

});

$("#saveFileButton").on("click", () => {
    ipc.send('saveFileDialog', quill.getSemanticHTML());
});

$("#openFileButton").on("click", async () => {
    let data = await ipc.invoke("openFileDialog");
    console.log(data);
    quill.root.innerHTML=data;
});

