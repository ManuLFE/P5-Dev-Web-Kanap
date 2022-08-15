
let url= new URL(window.location.href);
let params = new URLSearchParams(url.search);
let product_id = params.get('id');

// Defining cart functions

// Save the cart in the localStorage

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function getCart() {
    let cart = localStorage.getItem("cart");
    if (cart == null) {
        return [];
    } else {
        return JSON.parse(cart);
    }
}

function addCart(currentProduct) {
    let cart = getCart();
    let duplicateProductId = cart.find(p => p.id === currentProduct.id);
    let duplicateProductColor = cart.find(e =>e.color === currentProduct.color);

    if (duplicateProductId !== undefined && duplicateProductColor !== undefined) {

        // define a new product quantity, using the previous quantity in the localstorage and the new one defined by the user on the page.
        let newProductQuantity = parseFloat(duplicateProductColor.quantity) + parseFloat(currentProduct.quantity);
        console.log(newProductQuantity);
        duplicateProductColor.quantity = newProductQuantity;

        // utilisation d'une boucle pour loop dans l'objet JS "cart" afin de sélectionner l'objet que nous sommes en train de visualiser et récupérer l'ancienne quantité de ce dernier.
        let parsedCart = JSON.parse(localStorage.getItem("cart"))

        for (let cartProducts of parsedCart) {
            if (cartProducts.id === product_id) {
                cartProducts.quantity += 100;
            }
        }

    } else {

        cart.push(currentProduct);

    }
    saveCart(cart);
}


(async () => {
    const result = await fetch("http://localhost:3000/api/products");
    const value = await result.json();

    const imgParentEl = document.getElementsByClassName('item__img')[0]
    const titleEl = document.getElementById("title")
    const priceEl = document.getElementById("price")
    const descriptionEl = document.getElementById('description')
    const colorsEl = document.getElementById("colors")
    const quantityEl = document.getElementById("quantity")


    // Loops through the API response to dynamically display the product information matching the ID in the webpage URL //
    for (let i = 0; i < value.length; i++) {
    if (product_id === value[i]._id) {

        document.querySelector('title').textContent =  `${value[i].name}`;

        const productImage = document.createElement('img');
        productImage.src = `/back/images/kanap0${i+1}.jpeg`;
        productImage.alt = `${value[i].altTxt}`;
        imgParentEl.appendChild(productImage)

        titleEl.innerText = `${value[i].name}`
        priceEl.innerText = `${value[i].price}`
        descriptionEl.innerText = `${value[i].description}`

        // Loop for iterating over the colors array in the API response //
        for (let color of value[i].colors) {
            const productColors = document.createElement('option');
            productColors.innerText = `${color}`;
            productColors.value = `${color}`;
            colorsEl.appendChild(productColors);
            console.log(color);
        }
    } else {
        console.log('error')
    }
    }


    // Adding behavior to the addToCart button
    const buttonEl = document.getElementById("addToCart");
    buttonEl.addEventListener("click", function() {
        addCart({
            id: product_id,
            color: document.getElementById("colors").value,
            quantity: document.getElementById("quantity").value
        });
    })

})();
