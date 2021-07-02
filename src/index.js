import './sass/main.scss';
import fetchCountries from './js/fetchCountries.js';
import debounce from 'lodash.debounce';
import createCard from './templates/country-render.hbs';
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";
import "@pnotify/mobile/dist/PNotifyMobile.css";
import "@pnotify/countdown/dist/PNotifyCountdown.css";
import { alert } from '@pnotify/core';



const refs = {
    input: document.querySelector('.input'),
    countryList: document.querySelector('.country-list'),
}


refs.input.addEventListener('input', debounce(searchCountry, 1000));

function searchCountry(e) {
    const countryToFind = refs.input.value;
    return fetchCountries(countryToFind)
        .then((response) => {
            return createMarkup(response);
        });
}


function createMarkup(countries) {
    refs.countryList.innerHTML = '';
    if (countries.length > 10) {
        return alert('to many countries')
    };
    if (countries.length >= 2 && countries.length <= 10) {
        return createCountriesList(countries);
    }
    if (countries.length === 1) {
        return createDetailCard(...countries);
    }
    return alert({
        text: 'country not found',
        type: 'error',
        delay: 3000
    });
    
}

function createCountriesList(countries) {
    const markup = countries.reduce((acc, elem) => acc + `<li>${elem.name}</li>`, '');
    refs.countryList.insertAdjacentHTML('beforeend', markup);
}

function createDetailCard(country) {
    const markupCountry = createCard(country);
    refs.countryList.insertAdjacentHTML('beforeend', markupCountry);
    refs.input.value = '';
}