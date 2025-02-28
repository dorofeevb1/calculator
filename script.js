class Item {
    constructor(length, width, height, weight, cost, boxQuantity, fragile) {
        this.length = length; // Длина товара в см
        this.width = width; // Ширина товара в см
        this.height = height; // Высота товара в см
        this.weight = weight; // Вес одной коробки в кг
        this.cost = cost; // Стоимость одной коробки в рублях
        this.boxQuantity = boxQuantity || 1; // Количество коробок (по умолчанию 1)
        this.fragile = fragile || false; // Хрупкость товара (по умолчанию не хрупкий)
    }

    // Метод для расчета объема товара в м³
    getVolume() {
        // Объем = (длина * ширина * высота) / 1 000 000 (перевод из см³ в м³) * количество коробок
        return (this.length * this.width * this.height) / 1e6 * this.boxQuantity;
    }

    // Метод для расчета общего веса товара
    getTotalWeight() {
        // Общий вес = вес одной коробки * количество коробок
        return this.weight * this.boxQuantity;
    }

    // Метод для расчета общей стоимости товара
    getTotalCost() {
        // Общая стоимость = стоимость одной коробки * количество коробок
        return this.cost * this.boxQuantity;
    }
}

class ItemManager {
    constructor() {
        this.items = []; // Массив для хранения всех товаров
    }

    // Метод для добавления товара в массив
    addItem(item) {
        this.items.push(item);
    }

    // Метод для удаления товара из массива по индексу
    removeItem(index) {
        this.items.splice(index, 1);
    }

    // Метод для расчета общих параметров всех товаров
    calculateTotal() {
        let totalCost = 0; // Общая стоимость всех товаров
        let totalVolume = 0; // Общий объем всех товаров
        let totalWeight = 0; // Общий вес всех товаров

        // Проходим по всем товарам и суммируем их параметры
        this.items.forEach(item => {
            totalCost += item.getTotalCost();
            totalVolume += item.getVolume();
            totalWeight += item.getTotalWeight();
        });

        // Рассчитываем плотность (вес на единицу объема)
        const density = totalVolume > 0 ? totalWeight / totalVolume : 0;

        // Возвращаем результаты с округлением до 2 знаков после запятой
        return {
            totalCost: totalCost.toFixed(2),
            totalVolume: totalVolume.toFixed(2),
            totalWeight: totalWeight.toFixed(2),
            density: density.toFixed(2),
        };
    }
}

class Modal {
    constructor(modalElement, openButton, closeButton, itemManager) {
        this.modalElement = modalElement; // Элемент модального окна
        this.openButton = openButton; // Кнопка открытия модального окна
        this.closeButton = closeButton; // Кнопка закрытия модального окна
        this.itemManager = itemManager; // Экземпляр ItemManager для управления товарами

        // Назначаем обработчики событий
        this.openButton.onclick = () => this.open();
        this.closeButton.onclick = () => this.close();
        window.onclick = (event) => this.handleClickOutside(event);

        // Обработчик для кнопки добавления товара
        document.getElementById('addItemBtn').onclick = () => this.addItem();
    }

    // Метод для открытия модального окна
    open() {
        this.modalElement.style.display = "block";
    }

    // Метод для закрытия модального окна
    close() {
        this.modalElement.style.display = "none";
    }

    // Метод для закрытия модального окна при клике вне его области
    handleClickOutside(event) {
        if (event.target == this.modalElement) {
            this.close();
        }
    }

    // Метод для добавления нового товара в интерфейс
    addItem() {
        const itemsContainer = document.getElementById('items-container'); // Контейнер для товаров
        const newItemIndex = itemsContainer.children.length; // Индекс нового товара

        // Создаем HTML-структуру для нового товара
        const newItem = document.createElement('div');
        newItem.classList.add('item');
        newItem.innerHTML = `
            <h3 style="color: #60598C;">Товар ${newItemIndex + 1}</h3>
            <button class="remove-item-btn" data-index="${newItemIndex}">Удалить</button>

            <label for="item-name-${newItemIndex}">Название товара</label>
            <input type="text" id="item-name-${newItemIndex}" class="item-name" placeholder="Введите название товара">
            <p>Скорее всего это <span style="color: #60598C;"> линия "Одежда"</span></p>

            <h4>Введите транспортировочные данные</h4>
            <div class="transport-data">
                <div>
                    <label for="length-${newItemIndex}">Длина, см</label>
                    <input type="number" id="length-${newItemIndex}" class="length" placeholder="Длина">
                </div>
                <div>
                    <label for="width-${newItemIndex}">Ширина, см</label>
                    <input type="number" id="width-${newItemIndex}" class="width" placeholder="Ширина">
                </div>
                <div>
                    <label for="height-${newItemIndex}">Высота, см</label>
                    <input type="number" id="height-${newItemIndex}" class="height" placeholder="Высота">
                </div>  
                <p>или</p>
                <div>
                    <label for="volume-${newItemIndex}">Введите объем, м³</label>
                    <input type="number" id="volume-${newItemIndex}" class="volume" placeholder="Объем">
                </div>
            </div>

            <label for="box-weight-${newItemIndex}">Вес коробки, кг</label>
            <input type="number" id="box-weight-${newItemIndex}" class="box-weight" placeholder="Введите вес коробки">

            <label for="box-quantity-${newItemIndex}">Введите количество коробок</label>
            <input type="number" id="box-quantity-${newItemIndex}" class="box-quantity" placeholder="Введите кол-во коробок">

            <label for="item-cost-${newItemIndex}">Стоимость товара, ₽</label>
            <input type="number" id="item-cost-${newItemIndex}" class="item-cost" placeholder="Введите общую стоимость всего товара">
            <div class="fragile-div">
                <input type="checkbox" id="fragile-${newItemIndex}" class="fragile">
                <p>Хрупкий товар</p>
            </div>
        `;

        // Добавляем новый товар в контейнер
        itemsContainer.appendChild(newItem);

        // Обработчик для кнопки удаления товара
        newItem.querySelector('.remove-item-btn').onclick = () => this.removeItem(newItemIndex);

        // Обработчики для пересчета итогов при изменении данных
        newItem.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => this.calculateTotal());
        });
    }

    // Метод для удаления товара
    removeItem(index) {
        const itemsContainer = document.getElementById('items-container');
        itemsContainer.removeChild(itemsContainer.children[index]); // Удаляем товар из интерфейса
        this.itemManager.removeItem(index); // Удаляем товар из менеджера
        this.calculateTotal(); // Пересчитываем итоги
    }

    // Метод для расчета общих параметров всех товаров
    calculateTotal() {
        const items = document.querySelectorAll('.item'); // Получаем все товары
        this.itemManager.items = []; // Очищаем список товаров в менеджере

        // Проходим по каждому товару и добавляем его в менеджер
        items.forEach((item, index) => {
            const length = parseFloat(item.querySelector('.length').value) || 0;
            const width = parseFloat(item.querySelector('.width').value) || 0;
            const height = parseFloat(item.querySelector('.height').value) || 0;
            const volume = parseFloat(item.querySelector('.volume').value) || 0;
            const weight = parseFloat(item.querySelector('.box-weight').value) || 0;
            const cost = parseFloat(item.querySelector('.item-cost').value) || 0;
            const boxQuantity = parseFloat(item.querySelector('.box-quantity').value) || 1;
            const fragile = item.querySelector('.fragile').checked;

            // Если объем указан, пересчитываем длину, ширину и высоту
            const dimensions = volume ? this.calculateDimensions(volume) : { length, width, height };

            // Создаем новый товар и добавляем его в менеджер
            const newItem = new Item(dimensions.length, dimensions.width, dimensions.height, weight, cost, boxQuantity, fragile);
            this.itemManager.addItem(newItem);
        });

        // Получаем общие параметры и обновляем интерфейс
        const { totalCost, totalVolume, totalWeight, density } = this.itemManager.calculateTotal();
        document.getElementById('totalCost').value = totalCost;
        document.getElementById('totalVolume').value = totalVolume;
        document.getElementById('totalWeight').value = totalWeight;
        document.getElementById('totalDensity').value = density;
    }

    // Метод для расчета размеров коробки на основе объема
    calculateDimensions(volume) {
        // Предполагаем, что коробка имеет форму куба
        const side = Math.cbrt(volume * 1e6); // Переводим объем из м³ в см³
        return {
            length: side,
            width: side,
            height: side
        };
    }

    // Метод для пересчета итогов с учетом упаковки
    calculatePackagedTotals() {
        const packagingSelect = document.getElementById('packagingSelect');
        const packagingType = packagingSelect.value;

        let packagingWeight, packagingVolume;

        // Определяем вес и объем упаковки
        if (packagingType === 'box') {
            packagingWeight = 2; // Вес коробки в кг
            packagingVolume = 0.01; // Объем коробки в м³
        } else if (packagingType === 'pallet') {
            packagingWeight = 20; // Вес паллеты в кг
            packagingVolume = 0.1; // Объем паллеты в м³
        }

        // Получаем общие данные о товарах
        const totalWeight = parseFloat(document.getElementById('totalWeight').value) || 0;
        const totalVolume = parseFloat(document.getElementById('totalVolume').value) || 0;

        // Пересчитываем с учетом упаковки
        const packagedWeight = totalWeight + packagingWeight;
        const packagedVolume = totalVolume + packagingVolume;
        const packagedDensity = packagedVolume > 0 ? packagedWeight / packagedVolume : 0;

        // Обновляем значения на странице
        document.getElementById('packagedWeight').value = packagedWeight.toFixed(2);
        document.getElementById('packagedVolume').value = packagedVolume.toFixed(2);
        document.getElementById('packagedDensity').value = packagedDensity.toFixed(2);
    }
    // Отправка  на бэк (вывод в консоль)
    finalizeOrder() {
        try {
            // Проверяем, есть ли товары в заказе
            if (this.itemManager.items.length === 0) {
                throw new Error("Добавьте хотя бы один товар для оформления заказа.");
            }
    
            // Проверяем, заполнены ли все обязательные поля
            const items = document.querySelectorAll('.item');
            items.forEach((item, index) => {
                const length = parseFloat(item.querySelector('.length').value) || 0;
                const width = parseFloat(item.querySelector('.width').value) || 0;
                const height = parseFloat(item.querySelector('.height').value) || 0;
                const volume = parseFloat(item.querySelector('.volume').value) || 0;
                const weight = parseFloat(item.querySelector('.box-weight').value) || 0;
                const cost = parseFloat(item.querySelector('.item-cost').value) || 0;
    
                if ((length === 0 && width === 0 && height === 0 && volume === 0) || weight === 0 || cost === 0) {
                    throw new Error(`Заполните все поля для товара ${index + 1}.`);
                }
            });
    
            // Собираем данные о товарах
            const orderItems = this.itemManager.items.map(item => ({
                length: item.length,
                width: item.width,
                height: item.height,
                weight: item.weight,
                cost: item.cost,
                boxQuantity: item.boxQuantity,
                fragile: item.fragile,
            }));
    
            // Собираем данные об упаковке
            const packagingSelect = document.getElementById('packagingSelect');
            const packagingType = packagingSelect.value;
    
            // Получаем итоговые данные
            const totalWeight = parseFloat(document.getElementById('totalWeight').value) || 0;
            const totalVolume = parseFloat(document.getElementById('totalVolume').value) || 0;
            const totalCost = parseFloat(document.getElementById('totalCost').value) || 0;
            const packagedWeight = parseFloat(document.getElementById('packagedWeight').value) || 0;
            const packagedVolume = parseFloat(document.getElementById('packagedVolume').value) || 0;
            const packagedDensity = parseFloat(document.getElementById('packagedDensity').value) || 0;
    
            // Формируем объект заказа
            const orderData = {
                items: orderItems,
                packaging: {
                    type: packagingType,
                    weight: packagedWeight - totalWeight, // Вес упаковки
                    volume: packagedVolume - totalVolume, // Объем упаковки
                },
                totals: {
                    totalWeight: packagedWeight,
                    totalVolume: packagedVolume,
                    totalCost: totalCost,
                    density: packagedDensity,
                },
            };
    
            // Выводим данные в консоль (в реальном проекте здесь будет отправка на сервер)
            console.log("Данные заказа:", orderData);
    
            // Уведомляем пользователя об успешном оформлении заказа
            alert("Заказ успешно оформлен! Данные переданы на обработку.");
        } catch (error) {
            // Обрабатываем ошибки и выводим сообщение пользователю
            console.error("Ошибка при оформлении заказа:", error.message);
            alert(`Ошибка: ${error.message}`);
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    const modalElement = document.getElementById('modal');
    const openButton = document.getElementById('openModalBtn');
    const closeButton = document.getElementsByClassName('close')[0];

    const itemManager = new ItemManager();
    const modal = new Modal(modalElement, openButton, closeButton, itemManager);

    // Пересчет итогов при изменении значений ввода
    modalElement.addEventListener('input', () => modal.calculateTotal());

    // Пересчет с учетом упаковки
    document.getElementById('packagingSelect').addEventListener('change', () => modal.calculatePackagedTotals());
    document.getElementById('emptyBoxBtn').addEventListener('click', () => {
        document.getElementById('packagingSelect').value = 'box';
        modal.calculatePackagedTotals();
    });
    document.getElementById('palletBtn').addEventListener('click', () => {
        document.getElementById('packagingSelect').value = 'pallet';
        modal.calculatePackagedTotals();
    });

    // Обработчик для кнопки "Оформить заказ"
    document.getElementById('finalizeBtn').addEventListener('click', () => modal.finalizeOrder());
});