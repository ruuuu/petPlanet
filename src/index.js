import { fetchProductByCategory } from "./js/api.js";
import { renderProducts } from "./js/dom.js";
import { addToCart } from "./js/cart.js";



const buttons = document.querySelectorAll('.store__category-button');
const productList = document.querySelector('.store__list');



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



buttons.forEach((button) => {
    button.addEventListener('click', changeCategory);

    if(button.classList.contains('store__category-button--active')){
        fetchProductByCategory(button.textContent);
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






// localStorage.setItem('cartItems', JSON.stringify(['1', '2', '3'])) // в хранилище хранятся строки, поэтому делаем  JSON.stringify