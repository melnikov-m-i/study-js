window.onload = function() {
    var table = new Table('.container');

    table.createTable();
    table.addColumn();
    table.addRow();
    table.insertButtonsForRows();
    table.insertButtonsForColumns();

    table.getTable().ondblclick = table.editCell.bind(table);

    /*
    table.getTable().onclick = function(event) {
        console.log(event.target.cellIndex);
        console.log(event.target.parentElement.rowIndex);
    }
    */

    /*
    var clickTimer = null;

    function touchStart() {
        if (clickTimer == null) {
            clickTimer = setTimeout(function () {
                clickTimer = null;
                alert("single");

            }, 500)
        } else {
            clearTimeout(clickTimer);
            clickTimer = null;
            alert("double");

        }
    }
    */

};

class Table {
    constructor(classElement) {
        if(classElement == '' || classElement === null || classElement === undefined) {
            this.container = document.body;
        } else {
            this.container = document.querySelector(classElement);
        }
    }

    getTable() {
        return this.table;
    }

    createTable() {
        if(this.container === undefined || this.container === null) {
            console.log('Не удалось найти элемент с таким классом');
            return false;
        } else {
            this.table = document.createElement('table');
            this.table.className = 'el-table';
            this.table.insertRow(0).insertCell(0);
            this.container.appendChild(this.table);

            this._startLocalStorage();
        }
    }

    addRow() {
        let table = this.table;

        if(table === undefined || table === null) {
            console.log('Нельзя добавить строку, так как таблицы не существует');
            return false;
        } else {
            let index = table.rows.length;

            table.insertRow(index);

            if(index == 0) {
                table.rows[index].insertCell(0);
            } else {
                let countColumns = table.rows[index - 1].cells.length;

                for(let i = 0; i < countColumns; i++) {
                    table.rows[index].insertCell(i);
                }
            }
        }
    }

    deleteRow() {
        let rows = this.table.rows;

        if(rows.length <= 1) {
            return false;
        }

        let lastRow = rows[rows.length - 1];
        let isEmptyRow = true;
        let isDelRow = true;

        for(let i = 0; i < lastRow.cells.length; i++) {
            if(lastRow.cells[i].innerHTML != '') {
                isEmptyRow = false;
                break;
            }
        }

        if(!isEmptyRow) {
            isDelRow = confirm('Строка содержит данные, всё равно удалить?');
        }

        if(isDelRow) {
            this.table.deleteRow(-1);
        }
    };

    addColumn() {
        let rows = this.table.rows;

        if(rows.length == 0) {
            return false;
        }

        for(let i = 0; i < rows.length; i++) {
            rows[i].insertCell(-1);
        }
    }

    deleteColumn() {
        let rows = this.table.rows;

        if(rows.length == 0 || rows[0].cells.length <= 1) {
            return false;
        }

        let isEmptyColumn = true;
        let isDelColumn = true;

        for(let i = 0; i < rows.length; i++) {
            if(rows[i].cells[rows[i].cells.length - 1].innerHTML != '') {
                isEmptyColumn = false;
                break;
            }
        }

        if(!isEmptyColumn) {
            isDelColumn = confirm('Столбец содержит данные, всё равно удалить?');
        }

        if(isDelColumn) {
            for(let i = 0; i < rows.length; i++) {
                rows[i].deleteCell(-1);
            }
        }
    }

    insertButtonsForRows() {
        let elem, button, btText;

        elem = document.createElement('div');
        elem.className = 'bt-rows-table';

        button = document.createElement('button');
        button.onclick = this.addRow.bind(this);

        btText = document.createTextNode('+');

        button.appendChild(btText);

        elem.appendChild(button);

        button = document.createElement('button');
        button.onclick = this.deleteRow.bind(this);

        btText = document.createTextNode('-');

        button.appendChild(btText);

        elem.appendChild(button);

        this.table.parentElement.insertBefore(elem, this.table.nextElementSibling);
    }

    insertButtonsForColumns() {
        let elem, button, btText;

        elem = document.createElement('div');
        elem.className = 'bt-columns-table';

        button = document.createElement('button');
        button.onclick = this.addColumn.bind(this);

        btText = document.createTextNode('+');

        button.appendChild(btText);
        elem.appendChild(button);

        button = document.createElement('button');
        button.onclick = this.deleteColumn.bind(this);

        btText = document.createTextNode('-');

        button.appendChild(btText);

        elem.appendChild(button);

        this.table.parentElement.insertBefore(elem, this.table.nextElementSibling);
    }

    editCell(event) {
        let target = event.target;

        while (target != this.table) {
            if (target.nodeName == 'TD') {
                if (this.editingTd) {
                    return;
                }

                this._makeTdEditable(target);
                return;
            }

            target = target.parentNode;
        }
    }

    _makeTdEditable(td) {
        this.editingTd = {
            elem: td,
            data: td.innerHTML
        };

        td.classList.add('edit-td');

        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.style.width = td.clientWidth + 'px';
        input.style.height = td.clientHeight + 'px';
        input.className = 'edit-area';

        input.value = td.innerHTML;
        td.innerHTML = '';
        td.appendChild(input);
        input.focus();

        td.insertAdjacentHTML("beforeEnd",
            '<div class="edit-controls"><button class="edit-ok">OK</button><button class="edit-cancel">CANCEL</button></div>'
        );

        let editControls = this.table.querySelector('.edit-controls');
        editControls.onclick = this._handlerEditControlsClick.bind(this, editControls);
    }

    _finishTdEdit(td, isOk) {
        if (isOk) {
            td.innerHTML = td.firstChild.value;
        } else {
            td.innerHTML = this.editingTd.data;
        }

        td.classList.remove('edit-td');
        this.editingTd = null;
    }

    _handlerEditControlsClick(editControls, event) {
        let target = event.target;

        while (target != editControls) {
            if (target.className == 'edit-cancel') {
                this._finishTdEdit(this.editingTd.elem, false);
                return;
            }

            if (target.className == 'edit-ok') {
                this._finishTdEdit(this.editingTd.elem, true);
                return;
            }

            target = target.parentNode;
        }
    }

    _getKeyLocalStorage() {
        return this.keyLocalStorage;
    }

    _startLocalStorage() {
        this.keyLocalStorage = 'el-table-' + Math.random().toString(36).substr(2, 9);

        let data = this._valuesTableToArray();
        data = data ? data : '';

        localStorage.setItem(this._getKeyLocalStorage(), data);
    }

    _valuesTableToArray() {
        let table = this.table;
        let arTable = [];

        if(table === undefined || table === null) {
            console.log('Таблицы не существует');
            return;
        }

        if(table.rows.length == 0 || table.rows[0].cells.length == 0) {
            return
        }

        for(let i = 0; i < table.rows.length; i++) {
            arTable[i] = [];
            for(let j = 0; j < table.rows[i].cells.length; j++) {
                arTable[i][j] = table.rows[i].cells[j].innerHTML;
            }
        }

        arTable = JSON.stringify(arTable);

        return arTable;
    }

}



