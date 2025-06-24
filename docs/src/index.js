const electron = require('electron');
const ipc = electron.ipcRenderer;
const $ = require('jquery');


let fEd

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

$("#saveFileButton").on("click", async () => {
    fEd = await ipc.invoke('saveFileDialog', quill.getSemanticHTML());

    $("#fed").text(fEd);
});

$("#saveFileAsButton").on("click", async () => {
    fEd = await ipc.invoke('saveFileAsDialog', quill.getSemanticHTML());

    $("#fed").text(fEd);
});

$("#openFileButton").on("click", async () => {
    let data = await ipc.invoke("openFileDialog");
    console.log(data.data);
    quill.root.innerHTML = data.data;
    fEd = data.fed

    $("#fed").text(fEd);
});

$("#content").on("click", () => {
    document.getElementById("fileMenu").style.display = "none";
})


$("#minBtn").on("click", () => {
    ipc.send('minimize')
});

$("#maxBtn").on("click", () => {
    ipc.send('maximize')
});