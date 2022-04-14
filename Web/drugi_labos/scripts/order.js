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
	let response = await fetch("data/lab2.json");
	let data = await response.json();
	addCategories(data);
}

let addCategories = async function (data) {
	let categories = data.categories;
	let main = document.querySelector('main');
	let categoryTemplate = document.querySelector('#category-template');

	for (let index = 0; index < categories.length; index++) {
		let category = categoryTemplate.content.cloneNode(true);
		let categoryTitleElement = category.querySelector('.decorated-title > span');
		categoryTitleElement.textContent = categories[index].name;
		
		let products = data.products.filter(p => p.categoryId ==  categories[index].id);
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

			productElement = product.querySelector('.photo-box > .cart-btn');
			productElement.onclick = function() {
				addToCart(products[j].id);
			}
			
			gallery.appendChild(product);
		}
		category.appendChild(gallery);
		//--------------------------------
		main.appendChild(category);
	}
};
getData();