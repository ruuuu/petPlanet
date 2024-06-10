export const API_URL = "https://burly-inquisitive-pisces.glitch.me"; // сервер выложили на glitch
// const API_URL = "https://sharp-torpid-prune.glitch.me";


const fetchData = async(endpoint, option = {}) => {

    try{
        const response = await fetch(`${API_URL}${endpoint}`, option);

        if(!response.ok){
            throw new Error(response.status);
        }

        return await response.json();
    }
    catch(error){
        console.error(`Ошибка ${error}`)
    }
};



//                                  async
export const fetchProductByCategory = (category) => {

    return fetchData(`/api/products/category/${category}`);

    // try{
    //     const response = await fetch(`${API_URL}/api/products/category/${category}`);

    //     if(!response.ok){
    //         throw new Error(response.status);
    //     }

    //     const products = await response.json();
      
    //     return products;  // [{}, {}]
    // }
    // catch(error){
    //     console.error(`Ошибка запроса товаров: ${error}`);
    // }
};



export const fetchCartItems = (ids) => {

    return fetchData(`/api/products/list/${ids.join(",")}`); // join(",") из массива делаем строку с рзделителем запятая

    // try{
    //     const response = await fetch(`${API_URL}/api/products/list/${ids.join(",")}`);  // join(",") из массива делаем строку с рзделителем запятая
        
    //     if(!response.ok){
    //         throw new Error(response.status);
    //     }

    //     const products = await response.json();
    //     return  products; // [ {id, name, price, photoUrl}, {} ]
    // }
    // catch(error){
    //     console.error(`Ошибка запроса товаров: ${error}`);
    //     return [];
    // }
};




// отправка формы заказа:
export const submitOrder = (orderAdress, products ) => {

   return fetchData(`/api/orders`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ "storeId": orderAdress, "products": products })
    });

    // try{
    //     const response = await fetch(`${API_URL}/api/orders`, {
    //         method: 'POST',
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({ "storeId": orderAdress, "products": products })  
    //     });  
        
    //     if(!response.ok){
    //         throw new Error(response.status);
    //     }

    //     return await response.json(); 
    // }
    // catch(error){
    //     console.error(`Ошибка отправки запроса: ${error}`);
    // }
};
