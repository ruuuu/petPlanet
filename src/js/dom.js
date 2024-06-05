import { API_URL } from "./api.js";
import { calculateTotalPrice } from "./cart.js";


// работа с dom элементами:
const productList = document.querySelector('.store__list');
//const сartItemsList = document.querySelector('.modal__cart-items'); // ul
const totalPriceElem = document.querySelector('.modal__cart-price');



export const createOrderMessage = (orderId) => {
    const orderMessageElement = document.createElement('div');
    orderMessageElement.classList.add('order-message');

    const orderMessageText = document.createElement('p');
    orderMessageText.classList.add('order-message__text');
    orderMessageText.textContent = `ваш заказ ${orderId} оформлен`;

    const orderMessageCloseButton = document.createElement('button');
    orderMessageCloseButton.classList.add('order-message__close-button');

    orderMessageCloseButton.textContent = 'Закрыть';
    orderMessageElement.append(orderMessageText, orderMessageCloseButton);

    orderMessageCloseButton.addEventListener('click', () => {
        orderMessageElement.remove(); // удаляет элемент
    });

    return orderMessageElement;
};




//                      деструктурировали объект product
const createProductCard = ({ photoUrl, name, price, id }) => {

    const productCard = document.createElement('li');
    productCard.classList.add('store__item');
    productCard.innerHTML = `
        <article class="store__product product">
            <img class="product__image" src="${API_URL}${photoUrl}" width="388" height="261"  alt="${name}">
            <h3 class="product__title">${name}</h3>
            <p class="product__price"> ${price}&nbsp;₽ </p>
            <button class="product__btn-add-cart" data-id="${id}"> Заказать </button> <!-- добавили кнопке data атрибут -->
        </article>
    `
    // console.log('productCard ', productCard)
    return productCard;
};



export const renderProducts = (products) => {

    productList.textContent = ''; // очищам старый список

    products.forEach((product) => {
        const productCard = createProductCard(product);
        productList.append(productCard);
    }); 
};



// отрисовка товаров Корзины:
export const renderCartItems = async(сartItemsList, cartItems, products) => { 
 
    сartItemsList.textContent = '';  // очистка перед наполненем
    // const cartItems = JSON.parse(localStorage.getItem('cartItems') || "[]");            // товары Корзины [{id, count},{},{}]
    // const products = JSON.parse(localStorage.getItem('cartProductDetails') || "[]");            // тоже товары корзины[{ id, categories, price, photoUrl }, {}]. Если товар из корины удляем, то в products он останется
    
    //                      деструктурировали объект
    products.forEach(({ photoUrl, name, price, id }) => {  // 
        const cartItem = cartItems.find((item) => item.id === id);                 // вернет элемент котрый подхоит по условию
        //console.log('cartItem ', cartItem)
        
        if(!cartItem){
            return; // выход из метода
        }
        
        const li = document.createElement('li');
        li.classList.add('modal__cart-item');

        li.innerHTML = `
            <img class="modal__cart-item-image" src="${API_URL}${photoUrl}" alt="${name}">

            <h3 class="title">${name}</h3>

            <div class="modal__cart-item-count">
                <button class="modal__btn modal__minus" data-id=${id}>-</button>
                <span class="modal__count">${cartItem.count}</span>
                <button class="modal__btn modal__plus" data-id=${id}>+</button>
            </div>

            <p class="modal__cart-item-price">${price * cartItem.count}&nbsp;₽</p>
        `;

        сartItemsList.append(li);
    });

    
};