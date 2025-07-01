const electron = require('electron');
const ipc = electron.ipcRenderer;
const $ = require('jquery');
let sheet = [
    ["hello", "world"],
    ["goodbye", "world"],
    ["", "world"]
];
const table = $('<table>');
for(let row=0;row<sheet.length;row++){
    console.log(row);
    const rowJ = $('<tr>');
    for(let cell=0;cell<sheet[row].length;cell++){
        const cellJ = $(`<td>${sheet[row][cell]}</td>`);
        rowJ.append(cellJ);
    }
    table.append(rowJ);

}


$("#editor").append(table);
