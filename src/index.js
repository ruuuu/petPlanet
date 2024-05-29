
const API_URL = "https://burly-inquisitive-pisces.glitch.me"; // сервер выложили на glitch
// const API_URL = "https://sharp-torpid-prune.glitch.me";
//  http://localhost:3000
const buttons = document.querySelectorAll('.store__category-button');
const productList = document.querySelector('.store__list');
const cartButton = document.querySelector('.store__cart-button');
const modalOverlay = document.querySelector('.modal-overlay');
const сartItemsList = document.querySelector('.modal__cart-items'); // ul
const modalCloseButton = document.querySelector('.modal-overlay__close-button');
const cartCount = cartButton.querySelector('.store__cart-count');
const totalPriceElem = document.querySelector('.modal__cart-price');
const cartForm = document.querySelector('.modal__cart-form');



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



const renderProducts = (products) => {

    productList.textContent = ''; // очищам старый список

    products.forEach((product) => {
        const productCard = createProductCard(product);
        productList.append(productCard);
    }); 
};



const fetchProductByCategory = async (category) => {

    try{
        const response = await fetch(`${API_URL}/api/products/category/${category}`);

        if(!response.ok){
            throw new Error(response.status);
        }

        const products = await response.json();
      
        renderProducts(products); // отрисовка товаров
    }
    catch(error){
        console.error(`Ошибка запроса товаров: ${error}`);
    }
};



const fetchCartItems = async (ids) => {

    try{
        const response = await fetch(`${API_URL}/api/products/list/${ids.join(",")}`);  // join(",") из массива делаем строку с рзделителем запятая
        
        if(!response.ok){
            throw new Error(response.status);
        }

        const products = await response.json();
        return  products; // [ {id, name, price, photoUrl}, {} ]
    }
    catch(error){
        console.error(`Ошибка запроса товаров: ${error}`);
        return [];
    }
};



// начало отсюда:
const changeCategory = (evt) => { // переключение кнопок категорий
    const target = evt.target; // нажатая кнопка
    
    const category = target.textContent;

    buttons.forEach((button) => { // у всех удаляем класс
        button.classList.remove('store__category-button--active');
    });

    target.classList.add('store__category-button--active');
    fetchProductByCategory(category);
};



buttons.forEach((button) => {
    button.addEventListener('click', changeCategory);

    if(button.classList.contains('store__category-button--active')){
        fetchProductByCategory(button.textContent);
    }
});



const calculateTotalPrice = (cartItems, products) => {

    let total = 0;
    products.forEach(({ photoUrl, name, price, id }) => {

        const cartItem = cartItems.find((item) => item.id === id);  

         total = cartItems.reduce((acc, item) => {  // [ {id, count}, {} ]
            return acc + price * item.count;
        }, 0); // acc = 0

    });

    return total;
};




const renderCartItems = async() => { // отрисовка товаров Корзины
 
    сartItemsList.textContent = '';  // очистка перед наполненем
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || "[]");            // товары Корзины [{id, count},{},{}]
    const products = JSON.parse(localStorage.getItem('cartProductDetails') || "[]");            // тоже товары корзины[{ id, categories, price, photoUrl }, {}]. Если товар из корины удляем, то в products он останется
    
    //                      деструктурировали объект
    products.forEach(({ photoUrl, name, price, id }) => {
        const cartItem = cartItems.find((item) => item.id === id);                 // вернет элемент котрый подхоит по условию
        console.log('cartItem ', cartItem)
        
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

    const totalPrice = calculateTotalPrice(cartItems, products);
    totalPriceElem.innerHTML = `${totalPrice}&nbsp;₽`;  // не textContent,  с ним не будет рабоать &nbsp;

};



cartButton.addEventListener('click', async() => { // нажатие на иконку корзины

    modalOverlay.style.display = 'flex';

    const cartItems = JSON.parse(localStorage.getItem('cartItems') || "[]");                // товары Корзины [{id, count},{},{}]

    const ids = cartItems.map((item) => {           // вернет [id, id, id] 
        return item.id;
    });

    if(ids.length === 0){
        const listItem = document.createElement('li');
        listItem.textContent = 'Корзина пуста';
        сartItemsList.append(listItem);
        return;  // выход из метода
    }
    else{
        const products = await fetchCartItems(ids); // запрос на сервер, товары Корзины
        console.log('products ', products)  // [ {}, {} ]
        localStorage.setItem('cartProductDetails', JSON.stringify(products)); // при удалении товара, он из cartItems удалится, а из products нет
        renderCartItems();

        updatCartCount();
    }
});



// закрытие модалки:                 либо { target }
modalOverlay.addEventListener('click', (evt) => {
    const target = evt.target;
    //console.log('target ', target)

    if(target === modalOverlay || target.closest('.modal-overlay__close-button')){ // closest: если у target или  у его родителя есть указанный класс, то вернет этот элемент. Если внутри кнопки есть svg, span, используетс closest()  
        modalOverlay.style.display = 'none';
    } 
});



const updatCartCount = () => {

  const cartItems = JSON.parse(localStorage.getItem('cartItems') || "[]");
  cartCount.textContent = cartItems.length;
};



// товары Корзины хранятся в LocalStorage
const addToCart = (productId) => { 
   
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


//                                     { target } - деструкририровали evt
productList.addEventListener('click', (evt) => { // событие навешиваем не на кнопку Заказать,  а на весь список(это делегирование)
    const target = evt.target;
    //console.log('evt ', evt)
   
    if(target.closest('.product__btn-add-cart')){   // если у target есть указанный класс, то вернет элемент(кнопку Заказать)
        const productId = target.dataset.id;  // извлекаем data-id у нажатой кнопки(target)
        addToCart(productId);
    }
});



updatCartCount(); 
 


// localStorage.setItem('cartItems', JSON.stringify(['1', '2', '3'])) // в хранилище хранятся строки