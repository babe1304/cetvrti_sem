function getCart() {
    //INSERT CODE HERE - Zadatak
    if (localStorage.getItem("cart-items")) return JSON.parse(localStorage.getItem("cart-items"));
   //END INSERT CODE - Zadatak
}

 let refreshCart = async function () {
    let cart = getCart();
    if(cart){
        let ids = Object.keys(cart);
        if(ids.length < 1) return;
        let container = document.querySelector('.cart');
        container.innerHTML = "";

        let cartHeaderTemplate = document.querySelector('#cart-template-header');
        let cartHeader = cartHeaderTemplate.content.cloneNode(true);
        container.appendChild(cartHeader);
        
        //INSERT CODE HERE - Zadatak
        let response = await fetch("https://web1lab2.herokuapp.com/products");
        //END INSERT CODE - Zadatak
        
        let data = await response.json();
        let cartItemTemplate = document.querySelector('#cart-template-item');
        for(const id of ids){
            let product = data.find(p => p.id == id);
            
            let cartItem = cartItemTemplate.content.cloneNode(true);
            
            cartItem.querySelector(".cart-item").dataset.id = id;
            let title = cartItem.querySelector('.cart-item-title');
            title.textContent = product.name;
            let quantity = cartItem.querySelector('.cart-item-quantity');
            quantity.value = cart[id];
                
            //INSERT CODE HERE - Zadatak
            let cijena = cartItem.querySelector('.cart-item-price');
            cijena.textContent = product.price + " kn";
            //END INSERT CODE - Zadatak

            container.appendChild(cartItem);
        }
    }
}

refreshCart();