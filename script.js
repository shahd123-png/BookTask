/*------------------------------------------------------------------FETCHING DATA-----------------------------------------------------*/

//https://www.googleapis.com/books/v1/volumes?q=science+fiction&projection=full&filter=full&key=AIzaSyCF6ZG48YwmxCuLB6PgGHP9yeevssOKxrU
const apikey = "AIzaSyCF6ZG48YwmxCuLB6PgGHP9yeevssOKxrU";
const projectionapi = "full";
const filterapi = "full";
const startIndexapi = 0;
const booksPerPage = 40;

const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=fantasy&projection=${projectionapi}&filter=${filterapi}&startIndex=${startIndexapi}&maxResults=${booksPerPage}&key=${apikey}`;
fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    else
      return response.json();
  })
  .then(data => {
    var books = data;
   document.getElementById("title-api").textContent = books.items[1].volumeInfo.title;
    document.getElementById("pargraph-api").textContent = books.items[1].volumeInfo.description;
    document.getElementById("img-big-change").innerHTML = `<img id="img-big-change" class="noc-book-img" src="${books.items[1].volumeInfo.imageLinks.smallThumbnail}">`;
    document.getElementById("Big-div-api-vertical").innerHTML += `<div class="selected-for-you-div" id="Big-div-api-horizantal">`;
    var check = 2;
    for (let i = 2; i < books.items.length; i++) {
      if (check < 6) {
        const book = books.items[i];
        const author = book.volumeInfo.authors && book.volumeInfo.authors.length > 0 ? book.volumeInfo.authors[0] : 'Unknown Author';
        const but = document.getElementById("but-test-index");
        but.innerHTML=`  <button class="button-author" onclick="navigateToSecondPage('${book.id}')" id="but-test">Author of augest</button>`;
        document.getElementById("Big-div-api-horizantal").innerHTML +=
          `<div class="book" id="bookid">
          <img class="book1-selected-img" src="${book.volumeInfo.imageLinks.smallThumbnail}">
          <h3 class="book-name" id="book-name">${book.volumeInfo.title}</h3>
          <p class="author-name">${author}</p>

          <div class="price-and-fav">
          <h4 class="price">20.46$</h4>
          <img class="icon" id="icon-fav-${book.id}" src="Pictures/heart-white.png" onclick="clickfav('${book.id}')">

          </div>
          <button class="add-to-cart-button" onclick="addToCart('${book.id}')"> <img class="icon" src="Pictures/shopping-white.png">Add to cart</button>
          </div>`;
      }
      check++;
    }
    document.getElementById("Big-div-api-vertical").innerHTML += `</div>`;
    addToCart(bookid);
}) 

/*-------------------------------------------------when click on button and send book details to seconed page----------------------------*/
function navigateToSecondPage(bookId) {
  console.log("hi");
  localStorage.setItem('selectedBookId', bookId);
  window.location.href = 'productPage.html';
}
const selectedBookId = localStorage.getItem('selectedBookId');
if (selectedBookId) {
    fetch(`https://www.googleapis.com/books/v1/volumes/${selectedBookId}`)
        .then(response => response.json())
        .then(book => {
            const author = book.volumeInfo.authors && book.volumeInfo.authors.length > 0 ? book.volumeInfo.authors[0] : 'Unknown Author';
            document.getElementById('bookTitle').textContent = book.volumeInfo.title;
            document.getElementById('author-api').textContent = author;
            document.getElementById('main-pic').src = book.volumeInfo.imageLinks.smallThumbnail;
            document.getElementById('par-api').textContent = book.volumeInfo.description;
            document.getElementById("publisher").textContent = book.publisher;
            document.getElementById("lang").textContent=book.language;
        })
        .catch(error => {
            console.error('Error fetching book details:', error);
        });
} else {
  
}


/*----------------------------------------------------------------Add to Cart-------------------------------------------------------------------*/

let openShopping = document.querySelector('.icon-shopping');
let closeShopping = document.querySelector('.closeShopping');
let body = document.querySelector('body');
//let total = document.querySelector('.total');
let price= document.querySelector('.price');

let quantity = document.querySelector('.quantity');
openShopping.addEventListener('click', ()=>{
    body.classList.add('active');
})

closeShopping.addEventListener('click', ()=>{
  body.classList.remove('active');
})

let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    cartCount.innerHTML = cartItems.length;
    //total.innerHTML= cartItems.length;
}

function addToCart(bookId) {
  fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    else
      return response.json();
  })
  .then(data => {
    var books = data;
    let book = books.items.find(item => item.id === bookId);
    if (book) {
      cartItems.push({ book, bookId });
        updateCartCount();
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        const listItem = document.getElementById('li-item');
       
        listItem.innerHTML += 
       `  <div id="each-item" class="each-item">
            <img class="list-item-img" src="${book.volumeInfo.imageLinks.smallThumbnail}">
             <div class="text-card-li">
             <h3 class="title">${book.volumeInfo.title}</h3>
              <p class="author-li">By: ${book.volumeInfo.authors[0]}</p>

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
      const priceElement = item.querySelector('#price');
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

/*----------------------------------------------------------------favorite------------------------------------------------------------------- */
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let favoritesList = JSON.parse(localStorage.getItem('favoritesList')) || [];

function clickfav(bookId) {
    const heartIcon = document.getElementById(`icon-fav-${bookId}`);
    const bookIndex = favorites.findIndex(item => item.id === bookId);
    
    if (bookIndex !== -1) {
        favorites.splice(bookIndex, 1);
        heartIcon.src = "Pictures/heart-white.png";
        document.getElementById('fav-count').textContent = favorites.length;
        const bookListIndex = favoritesList.findIndex(item => item.id === bookId);
        if (bookListIndex !== -1) {
            favoritesList.splice(bookListIndex, 1);
            localStorage.setItem('favoritesList', JSON.stringify(favoritesList));
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
    } else {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const books = data;
                let book = books.items.find(item => item.id === bookId);
                if (book) {
                    const favoriteBookInfo = {
                        id: book.id,
                        image: book.volumeInfo.imageLinks.smallThumbnail,
                        title: book.volumeInfo.title,
                        authors: book.volumeInfo.authors[0],
                        publisher: book.volumeInfo.publisher
                    };
                    
                    favorites.push(favoriteBookInfo);
                    localStorage.setItem('favorites', JSON.stringify(favorites));
                    
                    favoritesList.push(favoriteBookInfo);
                    localStorage.setItem('favoritesList', JSON.stringify(favoritesList));
                    
                    heartIcon.src = "Pictures/heart (1).png";
                    document.getElementById('fav-count').textContent = favorites.length;
                  
                }
            });
    }

  }


  function favClickDisplay() {
    const favoritesList = JSON.parse(localStorage.getItem('favoritesList')) || [];
    var main = document.querySelector(".main-without-search");
    main.style.visibility = "hidden"
    var fav = document.querySelector(".fav-page");
    fav.style.visibility = "visible";

    var hBigDiv = document.querySelector(".head-big-fav");
    var h= document.querySelector(".fav-heading");
    hBigDiv.style.visibility = "visible";
    h.style.visibility = "visible";

    const bookElement2 = document.createElement('div');
    bookElement2.className = "div-inner-fav";

    for (let i = 0; i < favoritesList.length; i++) {
      const bookInfo = favoritesList[i];
      const bookElement = document.createElement('div');
      bookElement.className = "img-and-text-card";

      bookElement.innerHTML = `
          
            <div class="img-card">
                <img src="${bookInfo.image}" class="card-img" alt="...">
            </div>
            <div class="text-card">
                <h4 class="card-text">${bookInfo.title}</h4>
                <p class="card-text">Author: ${bookInfo.authors}</p>
                <p class="card-text">Publisher: ${bookInfo.publisher}</p>
            </div>
        `;

        bookElement2.appendChild(bookElement);
    }
    fav.appendChild(bookElement2);
}
/*-----------------------------------------------------------------when scroll load 8 books-------------------------------------------------*/
let isScrolled = false;
let check = 5;
let booksToDisplay = 8; 
window.addEventListener('scroll', () => {
  if (window.scrollY > 200 && !isScrolled) {
    isScrolled = true;
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      var books = data;
      document.getElementById("Big-div-api-vertical").innerHTML += `<div class="selected-for-you-div" id="id="Big-div-api-horizantal"> `;
      for (let x = check; x < check + booksToDisplay; x++) {
        if (x < books.items.length) {
          const book = books.items[x];
          const author = book.volumeInfo.authors && book.volumeInfo.authors.length > 0 ? book.volumeInfo.authors[0] : 'Unknown Author';  
          document.getElementById("Big-div-api-horizantal").innerHTML +=
            `<div class="book">
              <img class="book1-selected-img" src="${book.volumeInfo.imageLinks.smallThumbnail}">
              <h3 class="book-name">${book.volumeInfo.title}</h3>
              <p class="author-name">${author}</p>
              <div class="price-and-fav">
              <h4 class="price">20.90$</h4>
              <img class="icon" id="icon-fav-${book.id}" src="Pictures/heart-white.png" onclick="clickfav('${book.id}')">

              </div>
              <button class="add-to-cart-button" onclick="addToCart('${book.id}')"> <img class="icon" src="Pictures/shopping-white.png">Add to cart</button>
              </div>`;
            }
          }
          
          document.getElementById("Big-div-api-vertical").innerHTML += `</div>`;
          isScrolled = false;
          check += booksToDisplay;
        })
        .catch(error => {
          console.error('Fetch error:', error);
        });
      }
    });
    
/*--------------------------------------------------------------search method-------------------------------------------------------------- */
//let query = 'harry'
// let query = '-search+terms'
document.addEventListener("DOMContentLoaded", function() {
  var outputList = document.getElementById("list-output");
  var bookUrl = "https://www.googleapis.com/books/v1/volumes?q=";
    var searchData;
  
    document.getElementById("search-bar").addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        event.preventDefault(); 
        performSearch();
      }
    });
  
    function performSearch() {
      outputList.innerHTML = "";
      searchData = document.getElementById("search-bar").value;
  
      if (searchData === "" || searchData === null) {
        displayError();
      } else {
        var url = bookUrl + searchData;
        fetch(url)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            } else {
              return response.json();
            }
          })
          .then(data => {
           // console.log(data);
            if (data.totalItems === 0) {
              alert("No results! Please try again.");
            } else {
              var main = document.querySelector(".main-without-search");
              main.style.visibility = "hidden"

              var bookList = document.querySelector(".book-list");
              bookList.style.visibility = "visible";
           
              displayResults(data);
            }
          })
          .catch(error => {
            console.error("Fetch error:", error);
          });
      }
      document.getElementById("search-bar").value = ""; // Clear the search bar
    }

    var item, title1, author1, publisher1, bookLink1, bookImg1,item2,title2,author2,publisher2,bookLink2,bookImg2;
    function displayResults(data) {
      for (var i = 0; i < data.items.length; i+=2) { //cuz every row has 2 books 
        item = data.items[i];
        title1 = item.volumeInfo.title;
        author1 = item.volumeInfo.authors[0];
        publisher1 = item.volumeInfo.publisher;
        bookLink1 = item.volumeInfo.previewLink;
        bookImg1 = item.volumeInfo.imageLinks.smallThumbnail;

        item2 = data.items[i+1];
        title2 = item2.volumeInfo.title;
        author2 = item2.volumeInfo.authors[0];
        publisher2 = item2.volumeInfo.publisher;
        bookLink2 = item2.volumeInfo.previewLink;
        bookImg2 = item2.volumeInfo.imageLinks.smallThumbnail;

        outputList.innerHTML += '<div class="row">' +
                                formatOutput(bookImg1, title1, author1, publisher1, bookLink1) +
                                '</div>'
                                '<div class="other-row">'
                                formatOutput(bookImg2, title2, author2, publisher2, bookLink2) +
                                '</div>';

        //console.log(outputList);

    }
  }


  function formatOutput(bookImg, title, author, publisher, bookLink) {
  //console.log(title + ""+ author +" "+ publisher +" "+ bookLink+" "+ bookImg);

  var htmlCard = `
  <div class="img-and-text-card">
    <div class="img-card">
      <img src="${bookImg}" class="card-img" alt="...">
    </div>
      <div class="text-card">
        <h4 class="card-text">${title}</h4>
        <p class="card-text">Author: ${author}</p>
        <p class="card-text">Publisher: ${publisher}</p>
    </div>
</div>`
return htmlCard;
}

function displayError() {
  alert("search term can not be empty!")
}

  });
/*---------------------------------------------------------------Sign Up---------------------------------------------------------------- */
function headclick(){
  window.open('index.html', '_self');
}
    /*
    let isScrolled = false;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 200 && !isScrolled) {
    isScrolled = true;
    var books = myRequest.response;
    var check = 4;
    document.getElementById("Big-div-api-vertical").innerHTML += `<div class="selected-for-you-div" id="Big-div-api-horizantal"> `
    for (let x = check; x < 8; x++) {
      if (check < 8) {
        document.getElementById("Big-div-api-horizantal").innerHTML +=
        `<div class="book">
        <img class="book1-selected-img" src="${books.items[x].volumeInfo.imageLinks.smallThumbnail}">
        <h3 class="book-name">${books.items[x].volumeInfo.title}</h3>
        <p class="author-name">${books.items[x].volumeInfo.authors[0]}</p>
        <div class="price-and-fav">
        <h4 class="price">20.46$</h4>
        <img class="icon" src="Pictures/heart (1).png">
        </div>
        <button class="add-to-cart-button"> <img class="icon" src="Pictures/shopping-white.png">Add to cart</button>
        </div>
        `
      }
      check++;
    }
     
    
    
  }
  
  document.getElementById("Big-div-api-vertical").innerHTML += `</div>`;
  isScrolled = false;
  check = 0;
  
});

*/





















/*
let myRequest = new XMLHttpRequest();
myRequest.open("GET", "https://www.googleapis.com/books/v1/volumes?q=science+fiction&key=AIzaSyCF6ZG48YwmxCuLB6PgGHP9yeevssOKxrU");
myRequest.responseType = "json";
myRequest.send();
myRequest.onload = function () {
  var books = myRequest.response;
  document.getElementById("title-api").textContent = books.items[8].volumeInfo.title;
  document.getElementById("pargraph-api").textContent = books.items[8].volumeInfo.description;
  document.getElementById("img-big-change").innerHTML = `<img id="img-big-change" class="noc-book-img" src="${books.items[8].volumeInfo.imageLinks.smallThumbnail}">`;
  var check = 0;
  document.getElementById("Big-div-api-vertical").innerHTML += `<div class="selected-for-you-div" id="Big-div-api-horizantal"> `;

  for (let book of books.items) {
    if (check < 4) {
      document.getElementById("title-api").textContent = book.volumeInfo.title;
      document.getElementById("pargraph-api").textContent = book.volumeInfo.description;
      document.getElementById("Big-div-api-horizantal").innerHTML +=
      `<div class="book">
      <img class="book1-selected-img" src="${book.volumeInfo.imageLinks.smallThumbnail}">
      <h3 class="book-name">${book.volumeInfo.title}</h3>
      <p class="author-name">${book.volumeInfo.authors[0]}</p>
      <div class="price-and-fav">
      <h4 class="price">20.46$</h4>
      <img class="icon" src="Pictures/heart (1).png">
      </div>
      <button class="add-to-cart-button"> <img class="icon" src="Pictures/shopping-white.png">Add to cart</button>
      </div>
      `
    }

    check++;
  }
  document.getElementById("Big-div-api-vertical").innerHTML += `</div>`;


}
*/
//document.getElementById("title-api").textContent = book.volumeInfo.title;
// document.getElementById("pargraph-api").textContent = book.volumeInfo.description;