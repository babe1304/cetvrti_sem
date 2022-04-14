function addToCart(id) {
	//-------------------------------------
	let item = JSON.parse(localStorage.getItem("cart-items"));
	if (!item) item = {};
	if (!item[id]) item[id] = 0;
	item[id] += 1;
	localStorage.setItem("cart-items", JSON.stringify(item));
	//-------------------------------------
	refreshCartItems();
}

let getData = async function () {
	let response = await fetch("https://web1lab2.herokuapp.com/products");
	let data = await response.json();
	addCategories(data);
}

let addCategories = async function (data) {

	//-----------------------------labos
	let categoriesFetch = await fetch("https://web1lab2.herokuapp.com/categories");
	let categories = await categoriesFetch.json();
	//-----------------------------labos

	let main = document.querySelector('main');
	let categoryTemplate = document.querySelector('#category-template');

	for (let index = 0; index < categories.length; index++) {
		let category = categoryTemplate.content.cloneNode(true);
		let categoryTitleElement = category.querySelector('.decorated-title > span');
		categoryTitleElement.textContent = categories[index].name;
		
		let products = data.filter(p => p.categoryId ==  categories[index].id);
		//--------------------------------
		let productTemplate = document.querySelector('#product-template');
		let gallery = category.querySelector(".gallery");

		for (let j = 0; j < products.length; j++) {
			let product = productTemplate.content.cloneNode(true);

			let productElement = product.querySelector('.photo-box > .photo-box-image');
			productElement.src = products[j].imageUrl;

			productElement = product.querySelector('.photo-box > .photo-box-title');
			productElement.textContent = products[j].name;

			productElement = product.querySelector('.photo-box');
			productElement.setAttribute("data-id", products[j].id); 
			
			//------------------------------------------labos
			productElement = product.querySelector('#availability-string');

			let quantity;
			let itemCount = JSON.parse(localStorage.getItem("item-storage"));
			if (!itemCount) itemCount = {};
			if (itemCount[products[j].id] == null) {
				quantity = parseInt(Math.random() * 10 + 5);
				itemCount[products[j].id] = quantity;
			} else {
				quantity = itemCount[products[j].id];
			}
			localStorage.setItem("item-storage", JSON.stringify(itemCount));
		
			productElement.textContent = quantity + " Remaining";
			productElement.style.fontSize = "25px";
			productElement.style.padding = "0px 0px 20px 0px";
			

			product.querySelector('.photo-box > .cart-btn').onclick = () => {
				let itemCount = JSON.parse(localStorage.getItem("item-storage"));
				if (itemCount[products[j].id]  > 0) {
					itemCount[products[j].id] = itemCount[products[j].id] - 1; 
					productElement.textContent = itemCount[products[j].id] + " Remaining";			
					localStorage.setItem("item-storage", JSON.stringify(itemCount)); 
					addToCart(products[j].id);	
				}
			}
			//-----------------------------------------labos
	
			
			gallery.appendChild(product);
		}
		category.appendChild(gallery);
		//--------------------------------
		main.appendChild(category);
	}
};
getData();