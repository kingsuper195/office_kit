const electron = require('electron');
const ipc = electron.ipcRenderer;
const $ = require('jquery');

let fEd = 'New File';
let editing = false;
let lastFocus = null;

let saved = true;
$("#fed").text(fEd + (saved ? "" : "*"));

let sheet = [
    ["hello sweet wonderful world", "world"],
    ["goodbye", "world"],
    ["", "world"]
];
function render() {
    $("#mntbl").remove();
    const table = $('<table id="mntbl">');
    for (let row = 0; row < ((sheet.length < 100) ? 100 : sheet.length); row++) {
        const rowJ = $('<tr>');
        if (!sheet[row]) {
            sheet[row] = [""];
        }
        for (let cell = 0; cell < ((sheet[row].length < 100) ? 100 : sheet[row].length); cell++) {
            if (!sheet[row][cell]) {
                sheet[row][cell] = "";
            }
            const cellJ = $(`<td><div class="ininput" id="${row.toString() + "x" + cell.toString()}" contenteditable="true">${sheet[row][cell]}</div></td>`);
            rowJ.append(cellJ);
        }
        table.append(rowJ);

    }
    $("#editor").append(table);

}
render();

function save() {
    for (let row = 0; row < sheet.length; row++) {
        for (let cell = 0; cell < sheet[row].length; cell++) {
            sheet[row][cell] = $(`#${row.toString() + "x" + cell.toString()}`).text();
        }

    }
    return sheet;
}

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

$(".ininput").on("click", (event) => {
    editing = event.target.id;

});

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


$(".ininput").on("focus", (event) => {
    editing = event.target.id;
    lastFocus = event.target;
    $('#edit').val(event.target.textContent);
});

$(".ininput").on("keyup", (event) => {
    $('#edit').val(event.target.textContent);
    saved=false;
    $("#fed").text(fEd + (saved ? "" : "*"));
});

$('#edit').on("keyup", (event) => {
    if (lastFocus) lastFocus.textContent = event.target.value;
    saved=false;
    $("#fed").text(fEd + (saved ? "" : "*"));
});

$("#minBtn").on("click", () => {
    ipc.send('minimize')
});

$("#maxBtn").on("click", () => {
    ipc.send('maximize')
});

$("#saveFileButton").on("click", async () => {
    fEd = await ipc.invoke('saveFileDialog', save());
    saved = true;
    $("#fed").text(fEd + (saved ? "" : "*"));
});

$("#saveFileAsButton").on("click", async () => {
    fEd = await ipc.invoke('saveFileAsDialog', save());
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
    sheet = data.data;
    fEd = data.fed;
    saved = true;
    render();
    $("#fed").text(fEd + (saved ? "" : "*"));
});

$(document).on("keyup", async (e) => {
    if (e.ctrlKey && e.key == "s") {
        fEd = await ipc.invoke('saveFileDialog', save());
        saved = true;
        $("#fed").text(fEd + (saved ? "" : "*"));
    } else if (e.ctrlKey && e.shiftKey && e.key == "s") {
        fEd = await ipc.invoke('saveFileAsDialog', save());
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

$(() => {
    editing = "0x0";
    lastFocus = $("#0x0");
    $("#0x0").focus();
});