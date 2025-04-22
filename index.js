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

    function getWordForm(n, forms) {
        const mod10 = n % 10;
        const mod100 = n % 100;

        if (mod10 === 1 && mod100 !== 11) return forms[0];     // 1 напиток
        if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1]; // 2-4 напитка
        return forms[2]; // 5+ напитков
    }

    // Открытие модального окна по кнопке "Готово"
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const beverages = form.querySelectorAll('.beverage');
        const count = beverages.length;
        const wordForm = getWordForm(count, ['напиток', 'напитка', 'напитков']);

        let tableRows = '';
        beverages.forEach((bev) => {
            const drink = bev.querySelector('select').selectedOptions[0].textContent;
            const milk = bev.querySelector('input[type="radio"]:checked').nextElementSibling.textContent;
            const additions = [...bev.querySelectorAll('input[type="checkbox"]:checked')]
                .map(cb => cb.nextElementSibling.textContent)
                .join(', ');

            tableRows += `
            <tr>
              <td>${drink}</td>
              <td>${milk}</td>
              <td>${additions || ''}</td>
            </tr>
        `;
        });

        const modalContent = document.getElementById('modal-content');
        modalContent.innerHTML = `
        <p>Вы заказали ${count} ${wordForm}.</p>
        <table class="order-table">
          <thead>
            <tr>
              <th>Напиток</th>
              <th>Молоко</th>
              <th>Дополнительно</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
    `;

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
