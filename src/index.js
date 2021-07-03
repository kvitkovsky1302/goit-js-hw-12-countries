import './sass/main.scss';
import fetchCountries from './js/fetchCountries.js';
import debounce from 'lodash.debounce';
import createCard from './templates/country-render.hbs';
import createCountryList from './templates/country-list.hbs';
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";
import "@pnotify/mobile/dist/PNotifyMobile.css";
import "@pnotify/countdown/dist/PNotifyCountdown.css";
import notificationOptions from './js/notificationSettings.js';
import { alert} from '@pnotify/core';



const refs = {
    input: document.querySelector('.autocomplete-input'),
    countryList: document.querySelector('.result-list'),
    countryCard: document.querySelector('.country-card'),
}


refs.input.addEventListener('input', debounce(searchCountry, 500));

function searchCountry(e) {
    const countryToFind = refs.input.value;
    if (countryToFind) {
        return fetchCountries(countryToFind)
        .then((response) => {
            return createMarkup(response);
        });
    }
}


function createMarkup(countries) {
    clearMarkup();
    if (countries.length > 10) {
        return alert(notificationOptions.toMachResults);
    };
    if (countries.length > 1 && countries.length <= 10) {
        alert(notificationOptions.coupleResults);
        refs.countryList.classList.remove('hidden')
        return createCountriesList(countries);
    }
    if (countries.length === 1) {
        alert(notificationOptions.successResult);
        return createDetailCard(...countries);
    }
    return  alert(notificationOptions.noResult); 
}


function clearMarkup() {
    refs.countryList.innerHTML = '';
    refs.countryCard.innerHTML = '';
    refs.countryCard.classList.remove('visible');
}

function createCountriesList(countries) {
    const resultArray = countries.map(country => country.name);
    refs.countryList.insertAdjacentHTML("beforeend", createCountryList({ countryName: resultArray }));
}

function createDetailCard(country) {
    clearMarkup()
    refs.countryCard.classList.add('visible');
    const markupCountry = createCard(country);
    refs.countryCard.insertAdjacentHTML('beforeend', markupCountry);
    refs.input.value = '';
}