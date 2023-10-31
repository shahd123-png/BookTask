
/*--------------------------------------------------------------search method-------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
    var outputList = document.getElementById("list-output");
    var bookUrl = "https://www.googleapis.com/books/v1/volumes?q=";
    var searchData;
    var searchInput = document.getElementById("search-bar");
    var debounceTimeout;
    var item, title1, author1, publisher1, bookLink1, bookImg1, item2, title2, author2, publisher2, bookLink2, bookImg2;

    searchInput.addEventListener("input", function () {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(performSearch, 1000);
    });


    function performSearch() {
        outputList.innerHTML = "";
        searchData = searchInput.value;

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
                    if (data.totalItems === 0) {
                        alert("No results! Please try again.");
                    } else {
                        var main = document.querySelector(".main-without-search");
                        main.style.visibility = "hidden";
                        var bookList = document.querySelector(".book-list");
                        bookList.style.visibility = "visible";
                        footer.style.visibility = "hidden";

                        displayResults(data);
                    }
                })
                .catch(error => {
                    console.error("Fetch error:", error);
                });
        }
    }

    function displayResults(data) {
        for (var i = 0; i < data.items.length; i += 2) { // Because every row has 2 books
            item = data.items[i];
            title1 = item.volumeInfo.title;
            author1 = item.volumeInfo.authors ? item.volumeInfo.authors[0] : "N/A";
            publisher1 = item.volumeInfo.publisher ? item.volumeInfo.publisher : "N/A";
            bookLink1 = item.volumeInfo.previewLink;
            bookImg1 = item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.smallThumbnail : "N/A";

            item2 = data.items[i + 1];
            title2 = item2.volumeInfo.title;
            author2 = item2.volumeInfo.authors ? item2.volumeInfo.authors[0] : "N/A";
            publisher2 = item2.volumeInfo.publisher ? item2.volumeInfo.publisher : "N/A";
            bookLink2 = item2.volumeInfo.previewLink;
            bookImg2 = item2.volumeInfo.imageLinks ? item2.volumeInfo.imageLinks.smallThumbnail : "N/A";

            outputList.innerHTML += '<div class="row">' +
                formatOutput(bookImg1, title1, author1, publisher1, bookLink1) +
                '</div>' +
                '<div class="other-row">' +
                formatOutput(bookImg2, title2, author2, publisher2, bookLink2) +
                '</div>';
        }
    }

    function formatOutput(bookImg, title, author, publisher, bookLink) {
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
        </div>`;
        return htmlCard;
    }


    function displayError() {
        alert("Search term cannot be empty!");
    }
});