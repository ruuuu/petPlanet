const buttons = document.querySelectorAll('.store__category-button');


const changeActiveBtn = (evt) => {
    const target = evt.target; // нажатая кнопка

    buttons.forEach((button) => {
        button.classList.remove('store__category-button--active');
    });

    target.classList.add('store__category-button--active');
};



buttons.forEach((button) => {
    button.addEventListener('click', changeActiveBtn);
});