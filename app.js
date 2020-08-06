
if(localStorage.getItem('notes') !== null) {
    let list = document.querySelector('.items');
    const notes = JSON.parse(localStorage.getItem('notes'));
    notes.forEach((note) => {
        addItemInList(note);
    });
    dynamicEventListener();
}

// Conunt of notes
let counter = localStorage.getItem('counter') === null 
            ? 0 : localStorage.getItem('counter');

// Add elements vars
const title = document.getElementById('title');
const textArea = document.getElementById('text');
const idArea = document.querySelector('#note-edit-id');

// General events
document.getElementById('save').addEventListener('click', saveNote);

document.getElementById('new').addEventListener('click', clearNoteArea);

function dynamicEventListener() {
    document.querySelectorAll('.edit').forEach((editBtn) => {
        editBtn.addEventListener('click', editNote);
    });

    document.querySelectorAll('.remove').forEach((removeBtn) => {
        removeBtn.addEventListener('click', removeNote);
    });
}

function clearNoteArea() {
    title.value = '';
    textArea.value = '';
    idArea.innerText = '';
}

function saveNote() {
    let id = idArea.innerText;
    let note = {
        title: title.value.trim(),
        text: textArea.value.trim(),
        lastChange: currentDate()
    };

    if(note.title == '') {
        alert('Ошибка: Пожалуйста введите название заметки');
        return -1;
    }

    if(id === '') {
        // Обработка данных заметки
        counter++;
        note.id = counter; 
        addItemInList(note);
        addItemInLS(note);
        idArea.innerText = 'ID:' + counter;
    } else {
        note.id = id.split(':')[1];
        editItemInLS(note);
        editNoteInLi(note);
    }

    dynamicEventListener();
}

function editNote(e) { 
    const note = getNoteFromLi(e.target.parentElement);
    idArea.innerText = 'ID:' + note.id;
    title.value = note.title;
    textArea.value = note.text;
}

function removeNote(e) { 
    const li = e.target.parentElement;
    const note = getNoteFromLi(li);
    if(confirm('Вы действительно хотите безвозвратно удалить новость: ' + '"' + note.title + '" ?')) {
        removeNoteFromLS(note.id);
        li.remove();
        // Если заметка находится в режиме редактирования => очистить поля ввода
        if(note.id == idArea.innerText.split(':')[1]) clearNoteArea();
    }
}

// Output: "dd.mm.yyyy hh:mm"
function currentDate() {
    let dateNow = new Date(Date.now());
    return dateNow.getDate() + '.' + (dateNow.getMonth() + 1) + '.' + dateNow.getFullYear() 
                        + ' ' + dateNow.getHours() + ':' + dateNow.getMinutes();
}
// Добавляем заметку в список
function addItemInList(note) {
    let item = document.createElement('li');
    item.className = "item";
    item.innerHTML = `
        <details>
            <summary class="note-title">${note.title}</summary>
            <em>Дата последнего изменения: <span class="note-date-change">${note.lastChange}</span></em><br>  
            <em class="note-id">ID:${note.id}</em>
            <div class="note-text">${note.text}</div>
            <button class="edit">Редактировать</button>
            <button class="remove">Удалить</button>
            <br>
        </details>
        `;
    document.querySelector('.items').appendChild(item);
}

function getNoteFromLi(li) {
    return {
        id: li.querySelector('.note-id').innerText.split(':')[1],
        title: li.querySelector('summary').innerText,
        text: li.querySelector('div').innerText,
        lastChange: li.querySelector('span').innerText
    };
}

function editNoteInLi(note) {
    let ul = document.querySelector('.items').childNodes;
    ul.forEach((elm) => {
        if(elm.nodeName == 'LI') {
            if(elm.querySelector('.note-id').innerText.split(':')[1] == note.id) {
                elm.querySelector('.note-title').innerText = note.title;
                elm.querySelector('.note-text').innerText = note.text;
                elm.querySelector('.note-date-change').innerText = currentDate();
            }
        }
    });
}

// Добавляем заметку в локальное хранилище
function addItemInLS(note) {
    // Записывем текущий индекс в локальное хранилище
    localStorage.setItem('counter', counter);

    let notes = localStorage.getItem('notes') === null ? [] : 
                            JSON.parse(localStorage.getItem('notes'));

    notes.push(note);

    localStorage.setItem('notes', JSON.stringify(notes));
}

function editItemInLS(newNote) {
    let notes = localStorage.getItem('notes') === null ? [] : 
                            JSON.parse(localStorage.getItem('notes'));

    notes.forEach(function(note, index){
        if(note.id == newNote.id) {
            note.title = newNote.title;
            note.text = newNote.text;
            note.lastChange = newNote.lastChange;
        }
    });

    localStorage.setItem('notes', JSON.stringify(notes));
}

// Поиск по заметкам в локальном хранилице
// Ввод: id заметки
// Вывод: Заметка найдена => объект заметки
//        Заметка не найдена или нет заметок => -1
function getNoteFromLS(id) {
    if(localStorage.getItem('notes') !== null)
    {
        JSON.parse(localStorage.getItem('notes')).forEach((note) => {
            if(note.id === id) return note;
        });
    }
    return -1;                    
}

function removeNoteFromLS(id) {
    let notes = localStorage.getItem('notes') === null ? [] : 
                            JSON.parse(localStorage.getItem('notes'));

    notes.forEach(function(note, index){
        if(note.id == id) {
            notes.splice(index, 1);
        }
    });

    localStorage.setItem('notes', JSON.stringify(notes));
}