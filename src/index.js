import './css/styles.css';
import { fetchCountries } from '../src/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));

function onSearchCountry(evt) {
  const valueInput = evt.target.value.trim();

  if (valueInput.length === 0) {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    refs.input.removeEventListener('input', evt);
    return;
  }

  fetchCountries(valueInput)
    .then(onRenderCountriesList)
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      refs.countryList.innerHTML = '';
      refs.countryInfo.innerHTML = '';
    });

  function onRenderCountriesList(countries) {
    const numberCountriesFound = countries.length;

    const markupCountriesList = countries
      .map(
        ({ name: { official }, flags: { svg } }) =>
          `<li class="country"><img src="${svg}"
      alt="Flag of ${official}" />
      <h1>${official}</h1></li>`
      )
      .join('');
    refs.countryList.innerHTML = markupCountriesList;

    if (numberCountriesFound === 1) {
      const bigRenderCountry = document.querySelector('.country');
      bigRenderCountry.classList.add('big');

      const markupInfoAboutCountry = countries
        .map(
          ({ capital, population, languages }) =>
            `<p><b>Capital: </b>${capital}</p>
         <p><b>Population: </b>${population}</p>
         <p><b>Languages: </b>${Object.values(languages)}</p>`
        )
        .join('');
      refs.countryInfo.innerHTML = markupInfoAboutCountry;
      return;
    }

    if (numberCountriesFound > 10) {
      Notiflix.Notify.warning(
        'Too many matches found. Please enter a more specific name'
      );
    }

    refs.countryInfo.innerHTML = '';
  }
}
