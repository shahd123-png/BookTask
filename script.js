/*------------------------------------------------------------------FETCHING DATA-----------------------------------------------------------*/
let isLoading = false;
const footer = document.querySelector('.footer-text');
const apikey = "AIzaSyCF6ZG48YwmxCuLB6PgGHP9yeevssOKxrU";
const booksPerRow = 4;
let currentPage = 0;
const booksPerPage = booksPerRow * 2;

function slowLoad(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchAndDisplayBooks() {
  if (isLoading) {
    return;
  }

  isLoading = true;
  const skeletonImages = Array.from({ length: booksPerPage }, () => `<div class="skeleton-loader"></div>`);
  document.querySelector(".big-div-api-vertical").innerHTML += skeletonImages.join('');
  await slowLoad(1500);
  fetch(`https://www.googleapis.com/books/v1/volumes?q=fantasy&startIndex=${currentPage * booksPerPage}&maxResults=${booksPerPage}&key=${apikey}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      } else {
        return response.json();
      }
    })
    .then(data => {
      var books = data;
      document.querySelectorAll('.skeleton-loader').forEach((element) => {
        element.remove();
      });
      for (let i = 0; i < books.items.length; i++) {
        const book = books.items[i];
        const author = book.volumeInfo.authors && book.volumeInfo.authors.length > 0 ? book.volumeInfo.authors[0] : 'Unknown Author';
        const imgtest = book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.smallThumbnail ? book.volumeInfo.imageLinks.smallThumbnail : "Pictures/book1.jpg";

        document.querySelector(".big-div-api-vertical").innerHTML += `<div class="book" id="bookid">
        <img class="book1-selected-img" src="${imgtest}" onclick="sendDataToSecondPage('${book.volumeInfo.title}', '${imgtest}', '${author}', '${book.volumeInfo.publisher}', '${book.volumeInfo.language}', '${book.volumeInfo.pageCount}', '${book.volumeInfo.publishedDate}', '${book.volumeInfo.categories}', '${book.volumeInfo.contentVersion}', '${book.id}')">
        <h3 class="book-name" id="book-name">${book.volumeInfo.title}</h3>
        <p class="author-name">${author}</p>
        
        <div class="price-and-fav">
        <h4 class="price">20.46$</h4>
        <img class="icon" id="icon-fav-${book.id}" src="Pictures/heart-white.png" onclick="clickfav('${book.id}')">
        
        </div>
        <button class="add-to-cart-button" onclick="addToCart('${book.id}')"> <img class="icon" src="Pictures/shopping-white.png">Add to cart</button>
        </div>`;

      }
      isLoading = false;
    });

  currentPage++;
}


function onScroll(entries) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting && !isLoading) {
      fetchAndDisplayBooks();
    }
  });
}

const options = {
  root: null,
  rootMargin: '0px',
  threshold: 1,
};

const observer = new IntersectionObserver(onScroll, options);
observer.observe(footer);

fetchAndDisplayBooks();

/*-------------------------------------------------when click on button and send book details to seconed page------------------------------------*/
function sendDataToSecondPage(title, image, author, publisher, language, pageCount, publishedDate, categories, contentVersion, bookId) {
  const allData = {
    title,
    image,
    author,
    publisher,
    language,
    pageCount,
    publishedDate,
    categories,
    contentVersion,
    bookId
  };

  localStorage.setItem('bookData', JSON.stringify(allData));
  window.location.href = `productPage.html?id=${bookId}`;
}
document.addEventListener('DOMContentLoaded', function () {
  const data = JSON.parse(localStorage.getItem('bookData'));
  if (data) {
    document.querySelector('.bookTitle').textContent = data.title;
    document.querySelector('.main-pic').src = data.image;
    document.querySelector('.author-api').textContent = data.author;
    document.querySelector('.publisher').textContent = data.publisher;
    // document.getElementById('par-api').textContent = data.description;
    document.querySelector('.lang').textContent = data.language;
    document.querySelector('.print-length').textContent = data.pageCount;
    document.querySelector('.published-Date').textContent = data.publishedDate;
    document.querySelector('.catog').textContent = data.categories;
    document.querySelector('.version').textContent = data.contentVersion;
  }
});
/*---------------------------------------------------------------Sign Up---------------------------------------------------------------- */
function headclick() {
  window.open('index.html', '_self');
}


