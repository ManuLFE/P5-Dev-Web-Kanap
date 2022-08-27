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

const elementsInCartId = [];
for (let elements of cart) {
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


    const image = document.createElement('img')
    image.src = elements.imageUrl
    image.alt = elements.imageAlt
    divImg.appendChild(image)

    const divContent = document.createElement('div')
    divContent.classList.add('cart__item__content')
    newArticle.appendChild(divContent)

    const divDescription = document.createElement('div')
    divDescription.classList.add('cart__item__content__description')
    divContent.appendChild(divDescription)

    const descriptionTitle = document.createElement('h2')
    descriptionTitle.innerText = elements.name
    divDescription.appendChild(descriptionTitle)

    const descriptionColor = document.createElement('p')
    descriptionColor.innerText = elements.color
    divDescription.appendChild(descriptionColor)


        // PRICING FROM API
        /*const descriptionPrice = document.createElement('p')
        descriptionPrice.innerText = `${elementsAPI.price}€`
        divDescription.appendChild(descriptionPrice)*/
        //

       /* (async () => {
            const result = await fetch("http://localhost:3000/api/products/" + elements.id);
            const elementAPI = await result.json();
            console.log('price from API ' + elementAPI.price)
        })();*/

    const descriptionPrice = document.createElement('p')
    divDescription.appendChild(descriptionPrice)
    fetch('http://localhost:3000/api/products/' + elements.id)
        .then((response) => response.json())
        .then((data) => descriptionPrice.innerText = `${data.price}€`)

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

        renderPricing()
        renderQuantity()
        saveCart(cart)

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
        const initialPricing = 0;
        let totalPricing = [];
        let finalPricing = 0;

        for (elements of cart) {
            let elementQuantity = elements.quantity
            fetch('http://localhost:3000/api/products/' + elements.id)
                .then((response) => response.json())
                .then((data) => {
                    elementPrice = data.price * elementQuantity
                    totalPricing.push(elementPrice)
                    finalPricing = totalPricing.reduce((previousValue, currentValue) => previousValue + currentValue, initialPricing)
                    console.log(finalPricing)
                    document.getElementById('totalPrice').innerText = finalPricing
                })

        }
    }

    renderQuantity = () => {
        let totalQuantity = [];
        let finalQuantity = 0;

        for (elements of cart) {
            let productQuantity = elements.quantity
            totalQuantity.push(productQuantity)
            finalQuantity = totalQuantity.reduce((preValue, curValue) => parseInt(preValue) + parseInt(curValue))
            document.getElementById('totalQuantity').innerHTML = JSON.stringify(finalQuantity)
        }
    }

}

renderPricing()
renderQuantity()








