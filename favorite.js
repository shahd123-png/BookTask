/*----------------------------------------------------------------favorite------------------------------------------------------------------- */
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

function clickfav(bookId) {
    const heartIcon = document.getElementById(`icon-fav-${bookId}`);
    const bookIndex = favorites.findIndex(item => item.id === bookId);

    if (bookIndex !== -1) {
        favorites.splice(bookIndex, 1);
        heartIcon.src = "Pictures/heart-white.png";
        document.getElementById('fav-count').textContent = favorites.length;
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    else {
        fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apikey}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(bookData => {
                const imgtest = bookData.volumeInfo.imageLinks && bookData.volumeInfo.imageLinks.smallThumbnail ? bookData.volumeInfo.imageLinks.smallThumbnail : "Pictures/book1.jpg";
                const author = bookData.volumeInfo.authors && bookData.volumeInfo.authors.length > 0 ? bookData.volumeInfo.authors[0] : 'Unknown Author';

                const favoriteBookInfo = {
                    id: bookId,
                    image: imgtest,
                    title: bookData.volumeInfo.title,
                    authors: author,
                    publisher: bookData.volumeInfo.publisher
                };

                favorites.push(favoriteBookInfo);
                localStorage.setItem('favorites', JSON.stringify(favorites));
                heartIcon.src = "Pictures/heart (1).png";
                document.getElementById('fav-count').textContent = favorites.length;
            })
            .catch(error => {
                console.error('Error adding to favorites:', error);
            });
    }
}



function favClickDisplay() {
    const favoritesList = JSON.parse(localStorage.getItem('favorites')) || [];
    var main = document.querySelector(".main-without-search");
    var fav = document.querySelector(".fav-page");
    var hBigDiv = document.querySelector(".head-big-fav");
    var h = document.querySelector(".fav-heading");
    const bookElement2 = document.createElement('div');

    main.style.visibility = "hidden"
    fav.style.visibility = "visible";
    footer.style.visibility = "hidden"
    hBigDiv.style.visibility = "visible";
    h.style.visibility = "visible";
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