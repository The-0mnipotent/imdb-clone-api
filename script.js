let searchInput = document.getElementById('Input');
let displaySearchList = document.getElementsByClassName('fav-container');

fetch('http://www.omdbapi.com/?i=tt3896198&apikey=48aa722f')
    .then(res => res.json())
    .then(data => console.log(data));

    // Doing real time search
searchInput.addEventListener('input', findMovies);

// Finding movies
async function singleMovie() {
    let urlQueryParams = new URLSearchParams(window.location.search);
    let id = urlQueryParams.get('id')
    console.log(id);
    const url = `https://www.omdbapi.com/?i=${id}&apikey=${key}`
    const res = await fetch(`${url}`);
    const data = await res.json();
    console.log(data);
    console.log(url);

    //string interpolation
    let output = `

    <div class="movie-poster">
        <img src=${data.Poster} alt="Movie Poster">
    </div>
    <div class="movie-details">
        <div class="details-header">
            <div class="dh-ls">
                <h2>${data.Title}</h2>
            </div>
            <div class="dh-rs">
                <i class="fa-solid fa-bookmark" onClick=addFavorites('${id}') style="cursor: pointer;"></i>
            </div>
        </div>
        <span class="italics-text"><i>${data.Year} &#x2022; ${data.Country} &#x2022; Rating - <span
                    style="font-size: 18px; font-weight: 600;">${data.imdbRating}</span>/10 </i></span>
        <ul class="details-ul">
            <li><strong>Actors: </strong>${data.Actors}</li>
            <li><strong>Director: </strong>${data.Director}</li>
            <li><strong>Writers: </strong>${data.Writer}</li>
        </ul>
        <ul class="details-ul">
            <li><strong>Genre: </strong>${data.Genre}</li>
            <li><strong>Release Date: </strong>${data.DVD}</li>
            <li><strong>Box Office: </strong>${data.BoxOffice}</li>
            <li><strong>Movie Runtime: </strong>${data.Runtime}</li>
        </ul>
        <p style="font-size: 14px; margin-top:10px;">${data.Plot}</p>
        <p style="font-size: 15px; font-style: italic; color: #222; margin-top: 10px;">
            <i class="fa-solid fa-award"></i>
            &thinsp; ${data.Awards}
        </p>
    </div> 
    `;

    document.querySelector('.movie-container').innerHTML = output
}

// add Favorite function
async function addFavorites(id) {
    console.log("fav-item", id);
    localStorage.setItem(Math.random().toString(36).slice(2, 7), id);// math.random for the unique key and value pair
    alert('Movie Added to Favorites!');
}

//Remove Favorite function
async function removeFavorites(id) {
    console.log(id);
    for (i in localStorage) {
        if (localStorage[i] == id) {
            localStorage.removeItem(i)
            break;
        }
    }
    alert('Movie Removed from Favorites!');
    window.location.replace('favorites.html');
}

// Display Movie
async function displayMovieList(movies) {
    let output = ''; // looping through movies
    for (i of movies) {

        let img = '';
        if (i.Poster != 'N/A') {
            img = i.Poster;
        }
        else {
            img = 'img/blank-poster.webp';
        }

        let id = i.imdbID;
        output += `
        <div class="fav-item">
            <div class="fav-poster">
            <a href="details.html?id=${id}"><img src=${img} alt="Favourites Poster"></a>
            </div>
            <div class="fav-details">
                <div class="fav-details-box">
                    <div>
                        <p class="fav-movie-name"><a href="details.html?id=${id}">${i.Title}</a></p>
                        <p class="fav-movie-rating"><a href="details.html?id=${id}">${i.Year}</a></p>
                    </div>
                    <div>
                        <i class="fa-solid fa-bookmark" style="cursor:pointer;" onClick=addFavorites('${id}')></i>
                    </div>
                </div>
            </div>
        </div>
       `
    }
    document.querySelector('.fav-container').innerHTML = output;
    console.log("here is movie list ..", movies);
}

// Search function
async function findMovies() {
    const url = `https://www.omdbapi.com/?s=${(searchInput.value).trim()}&page=1&apikey=${key}`
    const res = await fetch(`${url}`);
    const data = await res.json();

    if (data.Search) {
        displayMovieList(data.Search)
    }
}


// Favorite loader
async function favoritesMovieLoader() {

    let output = ''
    for (i in localStorage) {

        let id = localStorage.getItem(i);
        if (id != null) {
            const url = `https://www.omdbapi.com/?i=${id}&plot=full&apikey=${key}`
            const res = await fetch(`${url}`);
            const data = await res.json();
            console.log(data);

            let img = ''
            if (data.Poster) {
                img = data.Poster
            }
            else { 
                img = data.Title 
            }

            let Id = data.imdbID;
            output += `
            <div class="fav-item">
                <div class="fav-poster">
                    <a href="details.html?id=${id}"><img src=${img} alt="Favourites Poster"></a>
                </div>
                <div class="fav-details">
                    <div class="fav-details-box">
                        <div>
                            <p class="fav-movie-name">${data.Title}</p>
                            <p class="fav-movie-rating">${data.Year} &middot; <span
                                    style="font-size: 15px; font-weight: 600;">${data.imdbRating}</span>/10</p>
                        </div>
                        <div style="color: maroon">
                            <i class="fa-solid fa-trash" style="cursor:pointer;" onClick=removeFavorites('${Id}')></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
        }

    }
    document.querySelector('.fav-container').innerHTML = output;
}