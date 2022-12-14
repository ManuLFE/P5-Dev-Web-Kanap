//---------------- CART FUNCTIONS ----------------//

// Saves the cart to localStorage
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Compares the property name "name_color" of an object and sort them alphabetically
function compare( a, b ) {
    if ( a.name_color < b.name_color ){
        return -1;
    }
    if ( a.name_color > b.name_color ){
        return 1;
    }
    return 0;
}

// Returns the cart item from the localStorage in alphabetical order, if empty, returns an empty array.
function getCart() {
    let cart = localStorage.getItem("cart");
    if (cart == null) {
        return [];
    } else {
        let cartToSort = JSON.parse(cart);
        return cartToSort.sort(compare);
    }
}

//---------------- CART FUNCTIONS - END ----------------//


//---------------- GLOBAL VARIABLES ----------------//

let cart = getCart()
const mainParentElement = document.getElementById("cart__items")
const elementsInCartId = [];

//---------------- GLOBAL VARIABLES - END ----------------//


//---------------- DOM ELEMENT CREATION ----------------//

// Iterates through the cart to create all the elements in the DOM to display the products. Also pushes each product id to the array "elementsInCartId" as it will be required later for the POST request to the API.
for (let elements of cart) {
    elementsInCartId.push(elements.id);

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
    divDescription.setAttribute(`class`,`itemDiv`);
    divContent.appendChild(divDescription)

    const descriptionTitle = document.createElement('h2')
    descriptionTitle.innerText = elements.name
    divDescription.appendChild(descriptionTitle)

    const descriptionColor = document.createElement('p')
    descriptionColor.innerText = elements.color
    divDescription.appendChild(descriptionColor)

    const descriptionPrice = document.createElement('p')
    descriptionPrice.setAttribute('id', 'itemPricing_' + elements.id + "_" + elements.color)
    divDescription.appendChild(descriptionPrice)

    const divContentSettings = document.createElement('div')
    divContentSettings.classList.add('cart__item__content__settings')
    newArticle.appendChild(divContentSettings)

    const divContentSettingsQuantity = document.createElement('div')
    divContentSettingsQuantity.classList.add('cart__item__content__settings__quantity')
    divContentSettings.appendChild(divContentSettingsQuantity)

    const quantityParagraph = document.createElement('p')
    quantityParagraph.innerText = `Qt??: ${elements.quantity}`
    divContentSettingsQuantity.appendChild(quantityParagraph)

    const quantityInput = document.createElement('input')
    quantityInput.type = 'number'
    quantityInput.classList.add('itemQuantity')
    quantityInput.name = 'itemQuantity'
    quantityInput.min = '1'
    quantityInput.max = '100'
    quantityInput.value = elements.quantity
    divContentSettings.appendChild(quantityInput)

    // Adds the possibility to change a product quantity and save it in the cart by using the input type "number"
    quantityInput.addEventListener('change', function() {
            elements.quantity = quantityInput.value
            quantityParagraph.innerText = `Qt??: ${JSON.parse(elements.quantity)}`

        saveCart(cart)
        renderPricing()
        renderQuantity()
    })

    // Creates a clickable "p" element to delete any selected product
    const settingsDelete = document.createElement('div')
    settingsDelete.classList.add('cart__item__content__settings__delete')
    divContentSettings.appendChild(settingsDelete)

    const deleteItemEl = document.createElement('p')
    deleteItemEl.classList.add('deleteItem')
    deleteItemEl.innerText = 'supprimer'
    settingsDelete.appendChild(deleteItemEl)

    // Adds a function to delete a displayed product and saves the cart, also recalculate final pricing and final quantity.
    deleteItemEl.addEventListener('click', function () {
        let cart = getCart();
        cart = cart.filter(p => p.id !== elements.id) && cart.filter(e => e.color  !== elements.color)
        mainParentElement.removeChild(newArticle)

        saveCart(cart);
        renderPricing();
        renderQuantity();
    })

}

//---------------- DOM ELEMENT CREATION - END ----------------//


//---------------- RENDER FUNCTIONS ----------------//

// Render pricing for each product before reducing it to display the final pricing
renderPricing = () => {
    let cart = getCart();
    let elementPrice = 0;
    const initialPricing = 0;
    let totalPricing = [];
    let finalPricing = 0;
    document.getElementById('totalPrice').innerText = '0'

    for (let elements of cart) {
        let elementQuantity = elements.quantity

        fetch('http://localhost:3000/api/products/' + elements.id)
            .then((response) => response.json())
            .then((data) => {
                let localPrice = document.getElementById('itemPricing_' + elements.id + "_" + elements.color);
                localPrice.innerText = data.price + " ???";
                // Set the final pricing by adding all the product prices together
                elementPrice = data.price * elementQuantity
                totalPricing.push(elementPrice)
                finalPricing = totalPricing.reduce((previousValue, currentValue) => previousValue + currentValue, initialPricing)
                document.getElementById('totalPrice').innerText = finalPricing

            })

    }
}

// Gets quantity from each product in cart, reduce it to display the total quantity
renderQuantity = () => {
    let cart = getCart();
    let totalQuantity = [];
    let finalQuantity = 0;
    let finalQuantityEl = document.getElementById('totalQuantity');
    finalQuantityEl.innerText = '0';

    for (let elements of cart) {
        let productQuantity = elements.quantity
        totalQuantity.push(productQuantity)
        finalQuantity = totalQuantity.reduce((preValue, curValue) => parseInt(preValue) + parseInt(curValue))
        document.getElementById('totalQuantity').innerHTML = finalQuantity
    }

    if (finalQuantityEl.innerText === '0') {
        document.getElementsByTagName('h1')[0].innerHTML += '<br> (vide, malheureusement...)'
    }

    saveCart(cart);
}

//---------------- RENDER FUNCTIONS - END ----------------//


// Initialize pricing and quantity at page load
renderPricing()
renderQuantity()


//---------------- REGEX - FORM ----------------//

// Define an object containing the output from the tested regex.
//---------------- REGEX - FORM ----------------//

// Define an object containing the output from the tested regex.
let regexChecker = {
    is_firstName_valid: false,
    is_lastName_valid: false,
    is_address_valid: false,
    is_city_valid: false,
    is_email_valid: false
};

function validateRegex(id, regex) {
    let value = document.getElementById(id).value;
    let answerTest = regex.test(value);

    console.log(id);
    if (answerTest === false) {
        document.getElementById(id).style.border = '3px solid red'
        document.getElementById(id + 'ErrorMsg').innerText = id + ' Invalide'
        document.getElementById(id + 'ErrorMsg').style.display = 'block';
        document.getElementById(id + 'ErrorMsg').style.fontWeight = '600';
        regexChecker["is_"+ id +"_valid"] = false;
    } else if (answerTest === true) {
        document.getElementById(id).style.border = '3px solid limegreen'
        document.getElementById(id + 'ErrorMsg').style.display = 'none';
        regexChecker["is_"+ id +"_valid"] = true;
    }

    return answerTest;
}

let regexRules = {
    'common': /^[a-zA-Z??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? '-]+$/u,
    'address': /^(\d+) ([a-zA-Z??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? '-]+) [ -_+]?(\w{0,8})/,
    'email': /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g

}

document.getElementById('lastName').addEventListener('change', function () {
    validateRegex('lastName', regexRules.common);
})
document.getElementById('firstName').addEventListener('change', function () {
    validateRegex('firstName', regexRules.common);
})
document.getElementById('address').addEventListener('change', function () {
    validateRegex('address', regexRules.address);
})
document.getElementById('city').addEventListener('change', function () {
    validateRegex('city', regexRules.common);
})
document.getElementById('email').addEventListener('change', function () {
    validateRegex('email', regexRules.email);
})

//---------------- REGEX FORM - END ----------------//



//---------------- SUBMIT BUTTON BEHAVIOR ----------------//

// Asynchronous function awaiting fetch answer from the API. Creates an object userData containing required information necessary in the POST request for the API to reply with an unique order_id. Only triggers the sending if all the regex have been passed successfully (checked by using the variable "regexResult").
sendForm = async() => {

    if (cart.length === 0) {
        alert('panier vide')
    } else if (cart.length !== 0) {
        const regexResult = Object.values(regexChecker).every(
            value => value === true
        );
        let userData = {};
        if (regexResult === true) {

            let productID = [];
            for (let elements of getCart()) {
                productID.push(elements.id);
            }

            userData = {
                "contact": {
                    firstName: document.getElementById('firstName').value,
                    lastName: document.getElementById('lastName').value,
                    address: document.getElementById('address').value,
                    city: document.getElementById('city').value,
                    email: document.getElementById('email').value
                },
                "products": productID
            }

            // POST request to API
            let response = await fetch('http://localhost:3000/api/products/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(userData)
            });

            let result = await response.json();
            let orderId = result.orderId;
            location.href = '../html/confirmation.html?id=' + orderId;
            alert('Nous vous remercions de votre commande ! Celle ci porte le n?? ' + orderId + ', vous recevrez bient??t un e-mail de confirmation.');

        } else {
            alert('Error, please try again')
        }
    }
}

let orderButtonEl = document.getElementById('order')
orderButtonEl.addEventListener('click', function (e) {
    e.preventDefault();
    sendForm();
});
//---------------- SUBMIT BUTTON BEHAVIOR - END ----------------//




