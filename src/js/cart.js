import { fetchCartItems } from "./api.js";
import { renderCartItems } from "./dom.js";
import { submitOrder } from "./api.js";
import { createOrderMessage } from "./dom.js";



const cartButton = document.querySelector('.store__cart-button');
const modalOverlay = document.querySelector('.modal-overlay');
const сartItemsList = document.querySelector('.modal__cart-items'); // ul
const modalCloseButton = document.querySelector('.modal-overlay__close-button');
const cartCount = cartButton.querySelector('.store__cart-count');
const totalPriceElem = document.querySelector('.modal__cart-price');
const cartForm = document.querySelector('.modal__cart-form');



// Корзина:
export const calculateTotalPrice = (cartItems, products) => {

    const total = cartItems.reduce((acc, item) => {  // [ {id, count}, {} ]
        const product = products.find((productItem) => productItem.id === item.id); // ищем в products элменты котрые есть в cartItems
        return acc + product.price * item.count;
    }, 0); // нач знач acc = 0

    return total;
};



export const updatCartCount = () => {

    const cartItems = JSON.parse(localStorage.getItem('cartItems') || "[]");
    cartCount.textContent = cartItems.length;
};



// товары Корзины хранятся в LocalStorage:
export const addToCart = (productId) => { 
   
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || "[]");  // превращаем из строки в json когда берем из localStorage
    //console.log(cartItems)

    const item = cartItems.find((item) => item.id === productId);  // вернет элемент
    //console.log('item ', item)

    if(item){
        item.count++;
    }
    else{
        cartItems.push({id: productId, count: 1});
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));  //  JSON.stringify превраащет в строку, обновляем localStorage
    updatCartCount();
};



const updateCartItem = (productId, change) => { // change = 1 или -1

    const cartItems = JSON.parse(localStorage.getItem('cartItems') || "[]");   // [ {id, count}, {} ]
    const itemIndex = cartItems.findIndex((item) => item.id === productId);  // вернет индекс того элемента котрый подходит под условие        

    if(itemIndex !== -1){ // если индекс элемента найден
        cartItems[itemIndex].count += change;

        if(cartItems[itemIndex].count <= 0){
            //delete cartItems[itemIndex];
            cartItems.splice(itemIndex, 1);   // удаляет  из массива 1 элемент начиная с индекса itemIndex
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems)); // обновляем 
        const products = JSON.parse(localStorage.getItem('cartProductDetails') || "[]");
        renderCartItems(сartItemsList, cartItems, products); 
        updatCartCount();
    }

    
};



сartItemsList.addEventListener('click', (evt) => {
    const target = evt.target;
    
    if(target.classList.contains('modal__plus')){ // closest(.modal__plus)
        const productId = target.dataset.id;  // получили id у кнопки
        updateCartItem(productId, 1);
    }

    if(target.classList.contains('modal__minus')){
        const productId = target.dataset.id;  // получили id у кнопки
        updateCartItem(productId, -1);
    }
});



cartButton.addEventListener('click', async() => { // нажатие на иконку корзины

    modalOverlay.style.display = 'flex';

    const cartItems = JSON.parse(localStorage.getItem('cartItems') || "[]");                // товары Корзины [{id, count},{},{}]

    const ids = cartItems.map((item) => {           // вернет [id, id, id] 
        return item.id;
    });

    if(ids.length === 0){
        сartItemsList.textContent = '';
        const listItem = document.createElement('li');
        listItem.textContent = 'Корзина пуста';
        сartItemsList.append(listItem);
        return;  // выход из метода
    }

    const products = await fetchCartItems(ids); // запрос на сервер, товары Корзины
    //console.log('products ', products)  // [ {}, {} ]

    localStorage.setItem('cartProductDetails', JSON.stringify(products)); // при удалении товара, он из cartItems удалится, а из products нет
        
    updatCartCount();

    renderCartItems(сartItemsList, cartItems, products);

    const totalPrice = calculateTotalPrice(cartItems, products);

    totalPriceElem.innerHTML = `${totalPrice}&nbsp;₽`;  // не textContent,  с ним не будет рабоать &nbsp;
});



// закрытие модалки:                 либо { target }
modalOverlay.addEventListener('click', (evt) => {

    const target = evt.target;
    //console.log('target ', target)

    if(target === modalOverlay || target.closest('.modal-overlay__close-button')){ // closest: если у target или  у его родителя есть указанный класс, то вернет этот элемент. Если внутри кнопки есть svg, span, используетс closest()  
        modalOverlay.style.display = 'none';
    } 
});



// отправка данных формы заказа: навесили событие на форму, а не на кнопку Отправить(это делегирование)
cartForm.addEventListener('submit', async(evt) => {

    evt.preventDefault();// станица не будет перезагружатьс после отправки

    const orderAdress = cartForm.store.value;   // где store это name  у выбранного <input type=radio name="store">

    const cartItems = JSON.parse(localStorage.getItem('cartItems') || "[]");   // [ {id, count}, {} ]
   //         либо деструкрировать item { id, count }
    const products = cartItems.map((item) => {            // вернет новый массив [ {id, quantity}, {} ]
        return { id: item.id, quantity: item.count }; 
    });

    // дестурировали ответ:
    const { orderId } = await submitOrder(orderAdress, products); // await тк submitOrder асинхронная

    localStorage.removeItem('cartItems'); // очищаем localStorage
    localStorage.removeItem('cartProductDetails');

    const orderMessageElement = createOrderMessage(orderId);

    
    document.body.append(orderMessageElement);
    modalOverlay.style.display = 'none'; // закрываем модалку
    updatCartCount(); 
    
});


  

updatCartCount(); 