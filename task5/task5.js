document.addEventListener("DOMContentLoaded", ready);

function ready() {
    var table = new Table('.container');

    table.createTable();
    table.insertButtonsForRows();
    table.insertButtonsForColumns();

    var tableNode = table.getNode();

    tableNode.addEventListener('dblclick', table.editCell.bind(table));

    var tappedTimer = null;

    tableNode.addEventListener('touchstart', function(event) {
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

    getNode() {
        return this.table;
    }

    createTable() {
        if(this.container === undefined || this.container === null) {
            console.log('Не удалось найти элемент с таким классом');
            return false;
        } else {
            this.table = document.createElement('table');
            this.table.className = 'el-table';
            this.container.appendChild(this.table);
            this.keyLocalStorage = 'el-table';
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
            let countColumns = index === 0 ? 1 : table.rows[index - 1].cells.length;

            table.insertRow(index);
            this.dataLS[index] = [];

            for(let i = 0; i < countColumns; i++) {
                table.rows[index].insertCell(i);
                this.dataLS[index].push('');
            }

            this._save();
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
            this.dataLS.pop();
            this._save();
        }
    };

    addColumn() {
        let rows = this.table.rows;

        if(rows.length == 0) {
            return false;
        }

        for(let i = 0; i < rows.length; i++) {
            rows[i].insertCell(-1);
            this.dataLS[i].push('');
        }

        this._save();
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
                this.dataLS[i].pop();
            }

            this._save();
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
        input.className = 'edit-area';
        input.value = td.innerHTML;
        td.innerHTML = '';
        td.appendChild(input);
        input.focus();

        input.addEventListener('blur', function (event) {
            this._finishTdEdit(this.editingTd.elem, true);
        }.bind(this));

        input.addEventListener('keydown', function (e) {
            e = e || window.event;
            if (e.code == 'Escape' || e.key == 'Escape' || e.keyCode == 27) {
                //проблема с blur(после нажатия срабатывает событие blur, поэтому в LS попадают не те данные)
                this._finishTdEdit(this.editingTd.elem, false);
            }
        }.bind(this));

    }

    _finishTdEdit(td, isOk) {
        if (isOk) {
            td.innerHTML = td.firstChild.value;
            this.dataLS[td.parentElement.rowIndex][td.cellIndex] = td.innerHTML;
            this._save();
        } else {
            td.innerHTML = this.editingTd.data;
        }

        td.classList.remove('edit-td');
        this.editingTd = null;
    }

    _getKeyLocalStorage() {
        return this.keyLocalStorage;
    }

    _startLocalStorage() {
        let LS = localStorage.getItem(this._getKeyLocalStorage());

        if (LS === null || LS === undefined) {
            this.dataLS = [];
            this.addRow();
        } else {
            this.dataLS = JSON.parse(LS);
            if (Array.isArray(this.dataLS) && this.dataLS.length > 0) {
                for (let i = 0; i < this.dataLS.length; i++) {
                    this.table.insertRow(i);
                    for (let j = 0; j < this.dataLS[i].length; j++) {
                        this.table.rows[i].insertCell(j);
                        this.table.rows[i].cells[j].innerHTML = this.dataLS[i][j];
                    }
                }
            }

        }
    }

    _save() {
        localStorage.setItem(this._getKeyLocalStorage(), JSON.stringify(this.dataLS));
    }

}
