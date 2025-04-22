// index.js (исправленный)
const addButton = document.querySelector('.add-button');
const submitButton = document.querySelector('.submit-button');
const form = document.querySelector('form');
let beverageCount = document.querySelectorAll('.beverage').length;

function updateBeverageNumbers() {
    document.querySelectorAll('.beverage').forEach((fieldset, index) => {
        fieldset.querySelector('.beverage-count').textContent = `Напиток №${index + 1}`;
    });
}

function highlightUrgent(text) {
    const keywords = [/срочно/gi, /быстрее|побыстрее/gi, /скорее|поскорее/gi, /очень нужно/gi];
    return keywords.reduce((acc, regex) => acc.replace(regex, match => `<b>${match}</b>`), text);
}

function attachNoteField(container) {
    const old = container.querySelector('.note-field');
    if (old) old.remove();

    const noteLabel = document.createElement('label');
    noteLabel.textContent = 'И еще вот что:';
    noteLabel.className = 'note-label';

    const textarea = document.createElement('textarea');
    textarea.rows = 3;
    textarea.className = 'note-textarea';

    const notePreview = document.createElement('div');
    notePreview.className = 'note-preview';
    notePreview.innerHTML = '&nbsp;';

    textarea.addEventListener('input', () => {
        notePreview.innerHTML = highlightUrgent(textarea.value) || '&nbsp;';
    });

    const fieldDiv = document.createElement('div');
    fieldDiv.className = 'field note-field';
    fieldDiv.append(noteLabel, textarea, notePreview);
    container.append(fieldDiv);
}

function createBeverageElement() {
    const template = document.querySelector('.beverage');
    const newBeverage = template.cloneNode(true);
    beverageCount++;

    // Сброс значений клона:
    // Сброс select
    const select = newBeverage.querySelector('select');
    select.selectedIndex = 0;
    // Сброс радио к дефолтному (usual)
    newBeverage.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.name = `milk-${beverageCount}`;
        radio.checked = radio.value === 'usual';
    });
    // Сброс всех чекбоксов
    newBeverage.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);

    // Кнопка удаления
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.textContent = '✖';
    closeButton.className = 'remove-button';
    closeButton.addEventListener('click', () => {
        if (document.querySelectorAll('.beverage').length > 1) {
            newBeverage.remove();
            updateBeverageNumbers();
        }
    });
    newBeverage.prepend(closeButton);

    // Поле заметок
    attachNoteField(newBeverage);

    form.insertBefore(newBeverage, addButton.parentElement);
    updateBeverageNumbers();
}

addButton.addEventListener('click', createBeverageElement);

document.querySelectorAll('.beverage').forEach(bev => attachNoteField(bev));

function getMilkText(value) {
    switch (value) {
        case 'usual':    return 'обычное';
        case 'no-fat':   return 'обезжиренное';
        case 'soy':      return 'соевое';
        case 'coconut':  return 'кокосовое';
        default:         return '';
    }
}

function declOfNum(n, text_forms) {
    n = Math.abs(n) % 100;
    const n1 = n % 10;
    if (n > 10 && n < 20) return text_forms[2];
    if (n1 > 1 && n1 < 5) return text_forms[1];
    if (n1 == 1) return text_forms[0];
    return text_forms[2];
}

function createModal(orderInfo) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'modal-window';

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✖';
    closeBtn.className = 'modal-close';
    closeBtn.addEventListener('click', () => overlay.remove());

    const countText = `Вы заказали ${orderInfo.length} ${declOfNum(orderInfo.length, ['напиток', 'напитка', 'напитков'])}`;
    const countElem = document.createElement('p');
    countElem.textContent = countText;

    const table = document.createElement('table');
    table.className = 'order-table';

    const header = document.createElement('tr');
    ['Напиток', 'Молоко', 'Дополнительно', 'Пожелания'].forEach(h => {
        const th = document.createElement('th'); th.textContent = h; header.appendChild(th);
    });
    table.appendChild(header);

    orderInfo.forEach(order => {
        const row = document.createElement('tr');
        [order.beverage, order.milk, order.options.join(', '), order.note].forEach(text => {
            const td = document.createElement('td');
            td.innerHTML = highlightUrgent(text || '');
            row.appendChild(td);
        });
        table.appendChild(row);
    });

    const timeLabel = document.createElement('label');
    timeLabel.textContent = 'Выберите время заказа:';
    const timeInput = document.createElement('input');
    timeInput.type = 'time';
    timeInput.className = 'time-input';

    const finalizeButton = document.createElement('button');
    finalizeButton.textContent = 'Оформить';
    finalizeButton.className = 'submit-order';
    finalizeButton.addEventListener('click', () => {
        const now = new Date();
        const [h, m] = timeInput.value.split(':').map(Number);
        const selected = new Date(now);
        selected.setHours(h, m, 0, 0);
        if (selected < now) {
            timeInput.classList.add('invalid-time');
            alert('Мы не умеем перемещаться во времени. Выберите время позже, чем текущее');
        } else overlay.remove();
    });

    modal.append(closeBtn, countElem, table, timeLabel, timeInput, finalizeButton);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}

submitButton.addEventListener('click', e => {
    e.preventDefault();
    const beverages = document.querySelectorAll('.beverage');
    const orders = Array.from(beverages).map(bev => ({
        beverage: bev.querySelector('select').value,
        milk: getMilkText(bev.querySelector('input[type="radio"]:checked').value),
        options: Array.from(bev.querySelectorAll('input[type="checkbox"]:checked')).map(opt => opt.nextElementSibling.textContent.trim()),
        note: bev.querySelector('textarea').value
    }));
    createModal(orders);
});