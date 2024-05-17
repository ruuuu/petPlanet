const API_URL='https://burly-inquisitive-pisces.glitch.me'; // сервер выложили на glitch
const buttons = document.querySelectorAll('.store__category-button');
const productList = document.querySelector('.store__list');
const cartButton = document.querySelector('.store__cart-button');
const modalOverlay = document.querySelector('.modal__overlay');





const changeActiveBtn = (evt) => { // переключение кнопок категорий
    const target = evt.target; // нажатая кнопка

    buttons.forEach((button) => {
        button.classList.remove('store__category-button--active');
    });

    target.classList.add('store__category-button--active');
};



buttons.forEach((button) => {
    button.addEventListener('click', changeActiveBtn);
});



const createProductCard = (product) => {

    const productCard = document.createElement('li');
    productCard.classList.add('store__item');
    productCard.innerHTML = `
        <article class="store__product product">
            <img class="product__image" src="${API_URL}${product.photoUrl}" width="388" height="261"  alt="${product.name}">
            <h3 class="product__title"> ${product.name} </h3>
            <p class="product__price"> ${product.price}&nbsp;₽ </p>
            <button class="product__btn-add-cart"> Заказать</button>
        </article>
    `
    // console.log('productCard ', productCard)
    return productCard;
}



const renderProducts = (products) => {

    productList.textContent = '';

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
        console.log('products ', products);

        renderProducts(products); // отрисовка товаров
    }
    catch(error){
        console.error(`Ошибка запроса товаров: ${error}`);
    }
}


cartButton.addEventListener = () => {

}


fetchProductByCategory('Домики');