'use strict';

const form = document.querySelector('.js-form');
const searchButton = document.querySelector('.search-button');
const seriesContainer = document.querySelector('.js-series-container');
const favouriteList = document.querySelector('.js-favourite-list');
// let series = [];
let favourites = getSavedFavouriteList();
paintFavouriteSeries();


//comienzo

function searchSerie(event) {
    event.preventDefault();
    const inputSerie = document.querySelector('.js-input-serie').value;
    // console.log(`Voy a buscar ${inputSerie}`);

    fetch(`http://api.tvmaze.com/search/shows?q=${inputSerie}`)
        .then(response => response.json())
        .then(data => {
            event.preventDefault();
            // console.log(data);
            paintSeries(data);
            listenSeries();
        });
};

function getSavedFavouriteList() {
    const savedFavourites = JSON.parse(localStorage.getItem('favourites'));
    if (savedFavourites === null) {
        return [];
    } else {
        return savedFavourites;
    }
};


const paintSeries = (series) => {
    seriesContainer.innerHTML = '';
    for (let serie of series) {
        let nameSerie = serie.show.name;
        let imageSerie = '';

        if (serie.show.image === null) {
            imageSerie = `https://via.placeholder.com/210x295/ffffff/666666/?text=${nameSerie}`;
        } else {
            imageSerie = serie.show.image.original;
        }
        let classSerie = 'serieContainer';

        if (favourites.findIndex(favourite => favourite.name === nameSerie) !== -1) {
            classSerie += ' favourite';
        }
        seriesContainer.innerHTML += `<div class="${classSerie}"><h2 class="titleSerie">${nameSerie}</h2><img class="img" src="${imageSerie}"></div>`;
    }
};

const listenSeries = () => {
    const serieElements = document.querySelectorAll('.serieContainer');

    for (const serieElement of serieElements) {
        serieElement.addEventListener("click", toggleFavourites);
    }
};


const toggleFavourites = (event) => {
    const containerSelected = event.currentTarget;
    containerSelected.classList.toggle('favourite');

    if (containerSelected.classList.contains('favourite')) {
        //acabo de añadirlo a favoritos
        const nameSerieFavourite = containerSelected.querySelector('h2').textContent;
        const imgSerieFavourite = containerSelected.querySelector('.img').src;
        const listSerieFavourite = { name: nameSerieFavourite, image: imgSerieFavourite };
        favourites.push(listSerieFavourite);
    } else {
        //acabo de quitarlo de favoritos
        const indexSerie = favourites.findIndex(el => el.name === containerSelected.querySelector('h2').textContent);
        favourites.splice(indexSerie, 1);
    }
    saveUpdatedFavouriteList(favourites);
    paintFavouriteSeries();
};


function saveUpdatedFavouriteList(updatedFavouriteList) {
    localStorage.setItem('favourites', JSON.stringify(updatedFavouriteList));
}


function paintFavouriteSeries() {
    favouriteList.innerHTML = '';
    for (let favourite of favourites) {
        const name = favourite.name;
        const image = favourite.image;
        favouriteList.innerHTML += `<h2>${name}</h2><img class="img imgFavourite" src="${image}"></img>`;
    }
}

searchButton.addEventListener('click', searchSerie);
form.addEventListener('submit', searchSerie);
