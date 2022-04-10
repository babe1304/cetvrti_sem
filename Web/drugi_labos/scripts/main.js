function refreshCartItems(){
	//---------------------------------
	let itemCountEl = document.getElementById("cart-items");
	let count = 0;

	for (let i = 0; i < localStorage.length; i++) 
		if (localStorage.getItem(localStorage.key(i))) count += parseInt(localStorage.getItem(localStorage.key(i)));
	
	itemCountEl.textContent = count;
	//---------------------------------
}

refreshCartItems();