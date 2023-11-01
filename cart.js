/*----------------------------------------------------------------Add to Cart-------------------------------------------------------------------*/
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let openShopping = document.querySelector('.icon-shopping');
let closeShopping = document.querySelector('.closeShopping');
let body = document.querySelector('body');
let price = document.querySelector('.price');
let quantity = document.querySelector('.quantity');


openShopping.addEventListener('click', () => {
    body.classList.add('active');
})

closeShopping.addEventListener('click', () => {
    body.classList.remove('active');
})

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    cartCount.innerHTML = cartItems.length;
}

function addToCart(bookId) {
    fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apikey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            else
                return response.json();
        })
        .then(data => {
            var books = data;
            if (books) {
                cartItems.push({ books, bookId });
                updateCartCount();
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                const listItem = document.getElementById('li-item');
                const imgtest = books.volumeInfo.imageLinks && books.volumeInfo.imageLinks.smallThumbnail ? books.volumeInfo.imageLinks.smallThumbnail : "Pictures/book1.jpg";
                const author = books.volumeInfo.authors && books.volumeInfo.authors.length > 0 ? books.volumeInfo.authors[0] : 'Unknown Author';
                listItem.innerHTML +=
                    `  <div id="each-item" class="each-item">
            <img class="list-item-img" src="${imgtest}">
             <div class="text-card-li">
             <h3 class="title">${books.volumeInfo.title}</h3>
              <p class="author-li">By: ${author}</p>

              <div class="add-quntity">
                <span class="minus" onClick='decreaseCount(event, this)'>-</span>
                <input class="input-text-cart" type="text" value="1">
               <span class="plus" onClick='increaseCount(event, this)'>+</span>
             </div>
             <h4 class="price" id="price">20.46$</h4>
             </div>
             <div class="remove-item" onclick="removeFromCart(event, this)">X</div>
          </div>`;
            }
        })
}
function updateTotalPrice() {
    let totalPrice = 0;
    const cartItems = document.querySelectorAll('.each-item');
    cartItems.forEach(item => {
        const priceElement = item.querySelector('.price');
        if (priceElement) {
            const pricee = parseFloat(priceElement.textContent.replace('$', ''));
            totalPrice += pricee;
        }
    });
    price.textContent = totalPrice.toFixed(2);
}


function increaseCount(event, element) {
    const input = element.previousElementSibling;
    let value = parseInt(input.value, 10);
    value = isNaN(value) ? 1 : value;
    value++;
    input.value = value;
    const priceElement = element.closest('.each-item').querySelector('.price');
    const basePrice = parseFloat(priceElement.textContent.replace('$', ''));
    const newPrice = (basePrice * value).toFixed(2);
    priceElement.textContent = `$${newPrice}`;
    updateTotalPrice();
}