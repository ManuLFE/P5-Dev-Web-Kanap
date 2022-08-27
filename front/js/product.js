
let url= new URL(window.location.href);
let params = new URLSearchParams(url.search);
let product_id = params.get('id');

// Defining cart functions

// Save the cart in the localStorage
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Return the cart
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
        duplicateProductColor.quantity = JSON.stringify(newProductQuantity);

    } else {

        cart.push(currentProduct);

    }
    saveCart(cart);

}


(async () => {
    const result = await fetch("http://localhost:3000/api/products/" + product_id);
    const value = await result.json();

    const imgParentEl = document.getElementsByClassName('item__img')[0]
    const titleEl = document.getElementById("title")
    const priceEl = document.getElementById("price")
    const descriptionEl = document.getElementById('description')
    const colorsEl = document.getElementById("colors")
    const quantityEl = document.getElementById("quantity")


        document.querySelector('title').textContent =  `${value.name}`;

        const productImage = document.createElement('img');
        productImage.src = `${value.imageUrl}`;
        productImage.alt = `${value.altTxt}`;
        imgParentEl.appendChild(productImage)

        titleEl.innerText = `${value.name}`
        priceEl.innerText = `${value.price}`
        descriptionEl.innerText = `${value.description}`

        // Loop for iterating over the colors array in the API response //
        for (let color of value.colors) {
            const productColors = document.createElement('option');
            productColors.innerText = `${color}`;
            productColors.value = `${color}`;
            colorsEl.appendChild(productColors);
        }


    // Adding behavior to the addToCart button
    const buttonEl = document.getElementById("addToCart");
    buttonEl.addEventListener("click", function() {
        addCart({
            id: product_id,
            name: value.name,
            color: document.getElementById("colors").value,
            quantity: document.getElementById("quantity").value,
            imageUrl: value.imageUrl,
            imageAlt: value.altTxt
        });

        if (quantityEl.value === '1') {
            alert(`Vous avez ajouté ${quantityEl.value} canapé ${value.name} à votre panier`);
            console.log("singulier")
        } else {
            alert(`Vous avez ajouté ${quantityEl.value} canapés ${value.name} à votre panier`);
            console.log("pluriel")
        }
    })

})();
