// Defining variables to store the order id in a variable by getting it from the URL
let url= new URL(window.location.href);
let params = new URLSearchParams(url.search);
let order_id = params.get('id');

// Displays the unique order_id in the required paragraph.
let orderIdSpan = document.getElementById('orderId');
orderIdSpan.innerHTML = '<br>' + order_id;

// Remove the item "cart" from the local storage without clearing the localStorage entirely.
localStorage.removeItem('cart')