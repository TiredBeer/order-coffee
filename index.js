document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const addButton = document.querySelector('.add-button');

    const modal = document.getElementById('modal-overlay');
    const modalClose = document.querySelector('.modal-close');

    // Функция добавления крестика и обработки его клика
    function addRemoveButton(beverage) {
        let removeBtn = document.createElement('button');
        removeBtn.textContent = '✖';
        removeBtn.type = 'button';
        removeBtn.className = 'remove-button';
        removeBtn.style.cssText = `
            float: right;
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
            color: red;
        `;
        beverage.querySelector('.beverage-count').appendChild(removeBtn);

        removeBtn.addEventListener('click', () => {
            const beverages = form.querySelectorAll('.beverage');
            if (beverages.length > 1) {
                beverage.remove();
                updateBeverageTitles();
            }
        });
    }

    // Обновление нумерации напитков
    function updateBeverageTitles() {
        const beverages = form.querySelectorAll('.beverage');
        beverages.forEach((bev, index) => {
            const title = bev.querySelector('.beverage-count');
            title.childNodes[0].textContent = `Напиток №${index + 1}`;
            const radios = bev.querySelectorAll('input[type="radio"]');
            radios.forEach((radio) => {
                radio.name = `milk${index + 1}`;
            });
        });
    }

    // Добавить крестик к уже существующему напитку
    const initialBeverage = form.querySelector('.beverage');
    addRemoveButton(initialBeverage);

    addButton.addEventListener('click', () => {
        const beverages = form.querySelectorAll('.beverage');
        const lastBeverage = beverages[beverages.length - 1];
        const newBeverage = lastBeverage.cloneNode(true);

        // Удалить старый крестик, если есть
        const oldRemove = newBeverage.querySelector('.remove-button');
        if (oldRemove) oldRemove.remove();

        addRemoveButton(newBeverage);

        form.insertBefore(newBeverage, addButton.closest('div'));
        updateBeverageTitles();
    });

    // Открытие модального окна по кнопке "Готово"
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        modal.classList.remove('hidden');
    });

    // Закрытие модального окна
    modalClose.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Закрытие по клику вне окна
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    // Закрытие по клавише Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modal.classList.add('hidden');
        }
    });
});
