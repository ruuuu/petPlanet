
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



//                      деструктурировали объект product
const createProductCard = ({ photoUrl, name, price }) => {

    const productCard = document.createElement('li');
    productCard.classList.add('store__item');
    productCard.innerHTML = `
        <article class="store__product product">
            <img class="product__image" src="${API_URL}${photoUrl}" width="388" height="261"  alt="${name}">
            <h3 class="product__title">${name}</h3>
            <p class="product__price"> ${price}&nbsp;₽ </p>
            <button class="product__btn-add-cart"> Заказать </button>
        </article>
    `
    // console.log('productCard ', productCard)
    return productCard;
}



const renderProducts = (products) => {

    productList.textContent = ''; // очищам старый список

    products.forEach((product) => {
        const productCard = createProductCard(product);
        productList.append(productCard);
    }); 
}



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
}



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



const renderCartItems = () => {

    сartItemsList.textContent = ''; 
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || "[]"); // товары Корзины [{},{},{}]

    cartItems.forEach((cartItem) => {
        const li = document.createElement('li');
        li.textContent = cartItem;
        //сartItemsList.append(li)
    });
{/* <li class="modal__cart-item">
                        <img src="" alt="">
                        <p class="title"></p>
                        <div class="controller">
                            <button>-</button>
                            <span></span>
                            <button>+</button>
                        </div>
                        <p class="price">7200 ₽</p>
                    </li> */}
};


cartButton.addEventListener('click', () => {

    modalOverlay.style.display = 'flex';
   // renderCartItems(); // отрисует товары Корзины
});



//                                   либо { target }
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
const addToCart = (productName) => { 
   
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || "[]");  // парсим когда берем из localStorage
    // console.log(cartItem)

    //cartItems.push(productName)
    localStorage.setItem('cartItems', JSON.stringify(cartItems));  //  JSON.stringify превраащет в строку

    //updatCartCount();
};



productList.addEventListener('click', (evt) => { // событие навешиваем не на кнопку Заказать,  а на весь список(это делегирование)
    const target = evt.target;
   
    if(target.closest('.product__btn-add-cart')){   //  вернет элемент(кнопку Заказать)
        const productCard = target.closest('.store__product');
        const productName = productCard.querySelector('.product__title');
        addToCart(productName.textContent);
    }
});



updatCartCount(); 
 


// localStorage.setItem('cartItems', JSON.stringify(['1', '2', '3'])) // в хранилище хранятся строки