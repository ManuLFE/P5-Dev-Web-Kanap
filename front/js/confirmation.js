let url= new URL(window.location.href);
let params = new URLSearchParams(url.search);
let order_id = params.get('id');

let orderIdSpan = document.getElementById('orderId')
orderIdSpan.innerText = order_id

localStorage.removeItem('cart')