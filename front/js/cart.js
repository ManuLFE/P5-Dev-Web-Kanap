
// Async function to retrieve API response and iterate over each object
(async () => {
    let value;
    const res = await fetch('http://localhost:3000/api/products')
    value = await res.json();

    function saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // SORT CART WITH LOCALCOMPARE or SORT ?
    function getCart() {
        let cart = localStorage.getItem("cart");
        if (cart == null) {
            return [];
        } else {
            return JSON.parse(cart);
        }
    }

    let cart = getCart()
    const mainParentElement = document.getElementById("cart__items")

    for (let elements of cart) {
        const elementsInCartId = [];
        elementsInCartId.push(elements.id);
        console.log(elementsInCartId);

        const newArticle = document.createElement('article');
        newArticle.dataset.id = elements.id
        newArticle.dataset.color = elements.color
        newArticle.classList.add("cart__item")
        mainParentElement.appendChild(newArticle)

        const divImg = document.createElement('div')
        divImg.classList.add("cart__item__img")
        newArticle.appendChild(divImg);

        for (let elementsAPI of value)
        if (elements.id === elementsAPI._id) {

            // creating elements requiring API information (img, prices)
            const image = document.createElement('img')
            image.src = elementsAPI.imageUrl
            image.alt = elementsAPI.altTxt
            divImg.appendChild(image)

            const divContent = document.createElement('div')
            divContent.classList.add('cart__item__content')
            newArticle.appendChild(divContent)

            const divDescription = document.createElement('div')
            divDescription.classList.add('cart__item__content__description')
            divContent.appendChild(divDescription)

            const descriptionTitle = document.createElement('h2')
            descriptionTitle.innerText = elementsAPI.name
            divDescription.appendChild(descriptionTitle)

            const descriptionColor = document.createElement('p')
            descriptionColor.innerText = elements.color
            divDescription.appendChild(descriptionColor)

            const descriptionPrice = document.createElement('p')
            descriptionPrice.innerText = `${elementsAPI.price}€`
            divDescription.appendChild(descriptionPrice)

            const divContentSettings = document.createElement('div')
            divContentSettings.classList.add('cart__item__content__settings')
            newArticle.appendChild(divContentSettings)

            const divContentSettingsQuantity = document.createElement('div')
            divContentSettingsQuantity.classList.add('cart__item__content__settings__quantity')
            divContentSettings.appendChild(divContentSettingsQuantity)

            const quantityParagraph = document.createElement('p')
            quantityParagraph.innerText = `Qté: ${elements.quantity}`
            divContentSettingsQuantity.appendChild(quantityParagraph)

            const quantityInput = document.createElement('input')
            quantityInput.type = 'number'
            quantityInput.classList.add('itemQuantity')
            quantityInput.name = 'itemQuantity'
            quantityInput.min = '1'
            quantityInput.max = '100'
            quantityInput.value = elements.quantity
            divContentSettings.appendChild(quantityInput)

            // Event listener 'change'
            quantityInput.addEventListener('change', function() {
                elements.quantity = quantityInput.value
                quantityParagraph.innerText = `Qté: ${JSON.parse(elements.quantity)}`

                let productPrice
                productPrice = elementsAPI.price * elements.quantity;
                // totalProductPrice renders the totalPricing of the selected product
                console.log('prix total du produit cliqué: ' + productPrice)
                console.log(cart);
                // stringify JSONed cart and replace the previous cart in the localStorage ---UTILISER UNE FONCTION--
                localStorage.setItem("cart", JSON.stringify(cart));

                // copied code to recalculate total quantity
                let totalItemsQuantity = 0;
                for (let i = 0; i < cart.length; i++) {
                    totalItemsQuantity += parseInt(JSON.parse(localStorage.getItem("cart"))[i].quantity)
                    console.log('quantité totale de produits dans le panier:' + totalItemsQuantity)
                    // get span totalQuantity to display number of articles in the cart
                    document.getElementById('totalQuantity').innerHTML = JSON.stringify(totalItemsQuantity)
                }

                // copied code to recalculate pricing
                let elementPrice = 0;
                let totalPricing = [];
                elementPrice = elementsAPI.price * elements.quantity
                totalPricing.push(elementPrice)
                const initialPricing = 0;
                const finalPricing = totalPricing.reduce((previousValue, currentValue) => previousValue + currentValue, initialPricing)
                document.getElementById('totalPrice').innerText = finalPricing

            })

            // Delete div + delete clickable 'p'
            const settingsDelete = document.createElement('div')
            settingsDelete.classList.add('cart__item__content__settings__delete')
            divContentSettings.appendChild(settingsDelete)

            const deleteItemEl = document.createElement('p')
            deleteItemEl.classList.add('deleteItem')
            deleteItemEl.innerText = 'supprimer'
            settingsDelete.appendChild(deleteItemEl)

            let deleteItemBtn = document.querySelectorAll('.deleteItem')
            console.log(deleteItemBtn)


            // function to console log total price of each product including its quantity
            // get span totalPrice to display cart total price
            renderPricing = () => {
                let elementPrice = 0;
                let totalPricing = [];
                elementPrice = elementsAPI.price * elements.quantity
                totalPricing.push(elementPrice)
                const initialPricing = 0;
                let finalPricing = totalPricing.reduce((previousValue, currentValue) => previousValue + currentValue, initialPricing)
                document.getElementById('totalPrice').innerText = finalPricing
            }
        }
        renderPricing()
    }


    // loop with "i" to add all products quantities --- REMPLACER PAR UNE FONCTION ? ---
    let totalItemsQuantity = 0
    for (let i = 0; i < cart.length; i++) {
        totalItemsQuantity += parseInt(JSON.parse(localStorage.getItem("cart"))[i].quantity)
        console.log('quantité totale de produits dans le panier:' + totalItemsQuantity)
        // get span totalQuantity to display number of articles in the cart
        document.getElementById('totalQuantity').innerHTML = JSON.stringify(totalItemsQuantity)
    }

})();

// Same as above but without async / await, using .then
  /*  fetch("http://localhost:3000/api/products")
        .then((response) => response.json())
        .then((data) => console.log(data))*/


// product.js:
// - remplacer api global par API produit en ajoutant '+product+id' à la fin de l'URL
// - changer la loop avec la variable i par value.name / value.url etc
// - enlever boucle for dans product.js ?

// general:
// Ajouter alert + nom + qté quand clic sur "ajouter au panier"
// Trier panier par ordre alphabétique (remplacer 0 1 2 dans le panier par nom du canapé + couleur et trier par nom de l'index afin de faire un tri alphabétique général)
// let totalPrice = 0; totalPrice += elements.quantity * elementsAPI.price
// totalPricing = []       totalPrice = totalPricing.reduce((previous, next) => previous + next, totalPrice)
// Quand commande validée PUIS réponse API, localStorage.clear() OU clear uniquement clé "cart"




