const electron = require('electron');
const ipc = electron.ipcRenderer;
const $ = require('jquery');


let fEd = 'New File';

let saved = true;
$("#fed").text(fEd + (saved ? "" : "*"));

const quill = new Quill('#editor', {
    theme: 'snow'
});

async function closeApp(e) {
    if (!saved) {
        let ans = await prompt("Are you sure you would like to quit, this will lose changes to the current file!");
        if (ans) {
            return false;
        }
    }
    ipc.send('close');

}

let prompt = async function (text) {
    let ans = await ipc.invoke('prompt', text);
    console.log(ans)
    return ans;
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
    saved = true;
    $("#fed").text(fEd + (saved ? "" : "*"));
});

$("#saveFileAsButton").on("click", async () => {
    fEd = await ipc.invoke('saveFileAsDialog', quill.getSemanticHTML());
    saved = true;
    $("#fed").text(fEd + (saved ? "" : "*"));
});

$("#openFileButton").on("click", async () => {

    if (!saved) {
        let ans = await prompt("Are you sure you would like to open another file, this will lose changes to the current file!");
        if (ans) {
            return false;
        }
    }
    let data = await ipc.invoke("openFileDialog");
    console.log(data.data);
    quill.root.innerHTML = data.data;
    fEd = data.fed
    saved = true;
    $("#fed").text(fEd + (saved ? "" : "*"));
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

quill.on('text-change', (delta, oldDelta, source) => {
    if (source == 'api') {
        console.log('An API call triggered this change.');
    } else if (source == 'user') {
        console.log('A user action triggered this change.');
    }
    saved = false;
    $("#fed").text(fEd + (saved ? "" : "*"));

});