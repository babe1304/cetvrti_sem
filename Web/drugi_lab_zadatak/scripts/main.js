function refreshCartItems(){
	//---------------------------------
	let items = JSON.parse(localStorage.getItem("cart-items"));
	let itemCountEl = document.getElementById("cart-items");
	let count = 0;
	
	if (items) for (let item of Object.values(items)) count += parseInt(item); 
	
	itemCountEl.textContent = count;
	//---------------------------------
}

refreshCartItems();