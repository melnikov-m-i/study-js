document.addEventListener("DOMContentLoaded", ready);

function ready() {
    var table = new Table('.container');

    table.createTable();
    table.insertButtonsForRows();
    table.insertButtonsForColumns();

    table.getTable().addEventListener('dblclick', table.editCell.bind(table));

    var tappedTimer = null;

    table.getTable().addEventListener('touchstart', function(event) {
        if (tappedTimer === null) {
            tappedTimer = setTimeout(function () {
                tappedTimer = null;
            }, 500)
        } else {
            clearTimeout(tappedTimer);
            tappedTimer = null;
            table.editCell(event);
        }
        event.preventDefault();
    });
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
            let dataLS = localStorage.getItem(this._getKeyLocalStorage());
            dataLS = JSON.parse(dataLS);

            if(!Array.isArray(dataLS)) {
                dataLS = [];
            }

            table.insertRow(index);
            dataLS[index] = [];

            if(index == 0) {
                table.rows[index].insertCell(0);
                dataLS[index][0] = '';
            } else {
                let countColumns = table.rows[index - 1].cells.length;

                for(let i = 0; i < countColumns; i++) {
                    table.rows[index].insertCell(i);
                    dataLS[index].push('');
                }
            }

            this._writeDataInLocalStorage(dataLS);
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

            let dataLS = localStorage.getItem(this._getKeyLocalStorage());
            dataLS = JSON.parse(dataLS);

            if(Array.isArray(dataLS)) {
                dataLS.pop();
                this._writeDataInLocalStorage(dataLS);
            }
        }
    };

    addColumn() {
        let rows = this.table.rows;
        let dataLS = localStorage.getItem(this._getKeyLocalStorage());
        dataLS = JSON.parse(dataLS);

        if(rows.length == 0) {
            return false;
        }

        if(!Array.isArray(dataLS)) {
            dataLS = [];
        }

        for(let i = 0; i < rows.length; i++) {
            rows[i].insertCell(-1);

            if(!Array.isArray(dataLS[i])) {
                dataLS[i] = [];
            }

            dataLS[i].push('');
        }

        this._writeDataInLocalStorage(dataLS);
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
            let dataLS = localStorage.getItem(this._getKeyLocalStorage());
            dataLS = JSON.parse(dataLS);

            for(let i = 0; i < rows.length; i++) {
                rows[i].deleteCell(-1);

                if(Array.isArray(dataLS) && Array.isArray(dataLS[i])) {
                    dataLS[i].pop();
                }
            }

            this._writeDataInLocalStorage(dataLS);
        }
    }

    insertButtonsForRows() {
        let elem, button, btText;

        elem = document.createElement('div');
        elem.className = 'bt-rows-table';

        button = document.createElement('button');
        button.addEventListener('click', this.addRow.bind(this));

        btText = document.createTextNode('+');

        button.appendChild(btText);

        elem.appendChild(button);

        button = document.createElement('button');
        button.addEventListener('click', this.deleteRow.bind(this));

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
        button.addEventListener('click', this.addColumn.bind(this));

        btText = document.createTextNode('+');

        button.appendChild(btText);
        elem.appendChild(button);

        button = document.createElement('button');
        button.addEventListener('click', this.deleteColumn.bind(this));

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

        editControls.addEventListener('click', this._handlerEditControlsClick.bind(this, editControls));
        editControls.addEventListener('touchstart', this._handlerEditControlsClick.bind(this, editControls));
    }

    _finishTdEdit(td, isOk) {
        if (isOk) {
            td.innerHTML = td.firstChild.value;

            let rowIndex = td.parentElement.rowIndex;
            let cellIndex = td.cellIndex;
            let dataLS = localStorage.getItem(this._getKeyLocalStorage());
            dataLS = JSON.parse(dataLS);

            if(Array.isArray(dataLS) && Array.isArray(dataLS[rowIndex])) {
                dataLS[rowIndex][cellIndex] = td.innerHTML;
                this._writeDataInLocalStorage(dataLS);
            }

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

        this._writeDataInLocalStorage(data);
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

        return arTable;
    }

    _writeDataInLocalStorage(data) {
        data = Array.isArray(data) ? JSON.stringify(data) : '';
        localStorage.setItem(this._getKeyLocalStorage(), data);
    }

}



