import { fetchProductByCategory } from "./js/api.js";
import { renderProducts } from "./js/dom.js";
import { addToCart } from "./js/cart.js";
import { renderCartItems } from "./js/dom.js";
import { updatCartCount } from "./js/cart.js";


const buttons = document.querySelectorAll('.store__category-button');
const productList = document.querySelector('.store__list');
const сartItemsList = document.querySelector('.modal__cart-items'); // ul


// начало отсюда:
const changeCategory = async(evt) => { // переключение кнопок категорий

    const target = evt.target; // выбранная(нажатая) кнопка
    
    const category = target.textContent;

    buttons.forEach((button) => { // сперва у всех удаляем класс
        button.classList.remove('store__category-button--active');
    });

    target.classList.add('store__category-button--active');

    const products = await fetchProductByCategory(category);
    renderProducts(products); // отрисовка товаров
};



buttons.forEach(async(button) => {
    button.addEventListener('click', changeCategory);

    if(button.classList.contains('store__category-button--active')){
        await fetchProductByCategory(button.textContent);
    }
});



//                                 либо  { target } - деструкририровали evt
productList.addEventListener('click', (evt) => { // событие навешиваем не на кнопку Заказать,  а на весь список(это делегирование)
    const target = evt.target;
    //console.log('evt ', evt)
   
    if(target.closest('.product__btn-add-cart')){   // если у target есть указанный класс, то вернет элемент(кнопку Заказать)
        const productId = target.dataset.id;  // извлекаем data-id у нажатой кнопки(target)
        addToCart(productId);
    }
});



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
    }

    renderCartItems(); 
    updatCartCount();
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


// localStorage.setItem('cartItems', JSON.stringify(['1', '2', '3'])) // в хранилище хранятся строки, поэтому делаем  JSON.stringify