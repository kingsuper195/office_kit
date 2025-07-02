const electron = require('electron');
const ipc = electron.ipcRenderer;
const $ = require('jquery');

let fEd = 'New File';

let saved = true;
$("#fed").text(fEd + (saved ? "" : "*"));

let sheet = [
    ["hello sweet wonderful world", "world"],
    ["goodbye", "world"],
    ["", "world"]
];
function render() {
    const table = $('<table>');
    for (let row = 0; row < sheet.length; row++) {
        console.log(row);
        const rowJ = $('<tr>');
        for (let cell = 0; cell < sheet[row].length; cell++) {
            const cellJ = $(`<td><div class="ininput" id="${row.toString()+"x"+cell.toString()}" contenteditable="true">${sheet[row][cell]}</div></td>`);
            rowJ.append(cellJ);
        }
        table.append(rowJ);

    }
}
render();

$("#editor").append(table);
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

$("#content").on("click", () => {
    document.getElementById("fileMenu").style.display = "none";
})


$("#minBtn").on("click", () => {
    ipc.send('minimize')
});

$("#maxBtn").on("click", () => {
    ipc.send('maximize')
});
$(document).on("keyup", async (e) => {
    if (e.ctrlKey && e.key == "s") {
        fEd = await ipc.invoke('saveFileDialog', quill.getSemanticHTML());
        saved = true;
        $("#fed").text(fEd + (saved ? "" : "*"));
    } else if (e.ctrlKey && e.shiftKey && e.key == "s") {
        fEd = await ipc.invoke('saveFileAsDialog', quill.getSemanticHTML());
        saved = true;
        $("#fed").text(fEd + (saved ? "" : "*"));
    } else if (e.ctrlKey && e.key == "o") {
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
    }
});