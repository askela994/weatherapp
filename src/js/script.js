import clear from 'url:../icons/clear.svg';
import cloud from 'url:../icons/cloud.svg';
import haze from 'url:../icons/haze.svg';
import rain from 'url:../icons/rain.svg';
import snow from 'url:../icons/snow.svg';
import storm from 'url:../icons/storm.svg';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const wrapper = document.querySelector('.wrapper');
const inputPart = document.querySelector('.input-part');
const infoTxt = document.querySelector('.info-txt');
const inputField = document.querySelector('input');
const locationBtn = document.querySelector('button');
const wIcon = document.querySelector('.weather-part img');
const arrowBack = document.querySelector('header i');

let api;

inputField.addEventListener('keyup', e => {
  if (e.key === 'Enter' && inputField.value.trim() != '') {
    requestApi(inputField.value.trim());
  }
});

locationBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert('Your browser not support geolocation api');
  }
});

const onSuccess = position => {
  const { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=API_KEY`;
  fetchData();
};

const onError = error => {
  infoTxt.textContent = error.message;
  infoTxt.classList.add('error');
};

const timeout = sec => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Request took too long'));
    }, sec * 1000);
  });
};

const requestApi = city => {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=API_KEY`;
  fetchData();
};

const fetchData = async () => {
  try {
    infoTxt.textContent = 'Getting weather details...';
    infoTxt.classList.add('pending');
    const res = await Promise.race([fetch(api), timeout(10)]);
    const data = await res.json();
    weatherDetails(data);
  } catch (err) {
    console.log(err.message);
    infoTxt.classList.replace('pending', 'error');
    infoTxt.textContent = err.message;
  }
};

const weatherDetails = info => {
  if (info.cod === '404') {
    infoTxt.classList.replace('pending', 'error');
    infoTxt.textContent = `${inputField.value} isn't a valid city name`;
  } else {
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { feels_like, humidity, temp } = info.main;

    if (id == 800) {
      wIcon.src = `${clear}`;
    } else if (id >= 200 && id <= 232) {
      wIcon.src = `${storm}`;
    } else if (id >= 600 && id <= 622) {
      wIcon.src = `${snow}`;
    } else if (id >= 701 && id <= 781) {
      wIcon.src = `${haze}`;
    } else if (id >= 801 && id <= 804) {
      wIcon.src = `${cloud}`;
    } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
      wIcon.src = `${rain}`;
    }

    wrapper.querySelector('.temp .numb').textContent = Math.floor(temp);
    wrapper.querySelector('.weather').textContent = description;
    wrapper.querySelector('.location span').textContent = `${city}, ${country}`;
    wrapper.querySelector('.temp .numb-2').textContent = Math.floor(feels_like);
    wrapper.querySelector('.humidity span').textContent = `${humidity}%`;

    infoTxt.classList.remove('pending', 'error');
    wrapper.classList.add('active');
  }
};

arrowBack.addEventListener('click', () => {
  wrapper.classList.remove('active');
  inputField.value = '';
});
