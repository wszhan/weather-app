import { decode } from "js-base64";

const KHEE = 'MDU0NDk5ZDk0Mjg3ZmY2ZDA3MDk4NGM3ZTc2ODQzMjQ=';
const test_city = 'Worcester';
const fake_data = {
    coords: {
        latitude: 42.270458539184084,
        longitude: -71.8127617520125,
    },
}

const locationName = document.getElementById('location-name');
const shortDescription = document.getElementById('weather-short-description');
const longDescription = document.getElementById('weather-long-description');
const currTemperature = document.getElementById('curr-temp');
const feelsLikeTemperature = document.getElementById('feels-like-temp');
const minTemperature = document.getElementById('min-temp');
const maxTemperature = document.getElementById('max-temp');
const humidity = document.getElementById('humidity');
const searchButton = document.getElementById('search-button');

searchButton.onclick = e => {
    e.preventDefault();
    const form = e.target.parentElement;
    const inputLocation = form.querySelector('#location-search').value;
    console.log(inputLocation);
    onecallWeatherLocation(inputLocation);
}

function onecallWeatherLocation(name) {
    return locationNameToCoordinates(name)
        .then(d => ({
            name: d.name,
            latitude: d.lat,
            longitude: d.lon,
        }))
        .then(
            d => {
                // set location
                locationName.innerText = d.name;
                // get one call weather
                const url = constructOnecallUrl(d.latitude, d.longitude);
                fetch(url)
                    .then(res => res.json())
                    .then(data => {
                        const currWeather = data.current;
                        shortDescription.innerText = currWeather.weather[0].main;
                        longDescription.innerText = currWeather.weather[0].description;

                        currTemperature.innerText = currWeather.temp;
                        feelsLikeTemperature.innerText = currWeather.feels_like;
                    });
            }
        )
        .catch(err => {
            console.log(err);
        });
}


function locationNameToCoordinates(name) {
    const key=decode(KHEE);
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=1&appid=${key}`;

    /*
    Return json object:
    {
        "name": "Worcester",
        "local_names": {
          "ru": "Вустер",
          "uk": "Вустер",
          "en": "Worcester"
        },
        "lat": 42.2625621,
        "lon": -71.8018877,
        "country": "US",
        "state": "Massachusetts"
    }
    */

    return fetch(url)
        .then(data => data.json())
        .then(data => data[0])
        .catch(err => `Invalid Name: ${name}, error: ${err}`);
}

function constructOnecallUrl(
    latitude=undefined, longitude=undefined, 
    imperial=false,
    lang='en'
    ) {
    const key=decode(KHEE);
    
    const res = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${key}&units=${imperial ? 'imperial' : 'metric'}&lang=${lang}`;

    return res;
}

// onecallWeatherLocation('shanghai');

function weatherObjFactory(
    locationName=undefined,
    shortDescription=undefined, longDescription=undefined,
    currTemperature=undefined, feelsLikeTemperature=undefined,
    minTemperature=undefined, maxTemperature=undefined,
    humidity=undefined
) {
    return {
        locationName,
        descriptions: {
            shortDescription,
            longDescription,
        },
        temperatures: {
            currTemperature,
            feelsLikeTemperature,
            minTemperature,
            maxTemperature,
        },
        humidity
    }
}

function updateDOM(weatherObj) {
    locationName.innerText = weatherObj.locationName ?? 'Hey';
}

// needs modification
function getCurrentLatLon() {
    let lat, lon;
    navigator.geolocation.getCurrentPosition(
        pos => {
            console.log(pos.coords);
            lat = pos.coords.latitude;
            lon = pos.coords.longitude;
        },
        err => console.log('err'),
        {}
    );

    return {
        latitude: lat,
        longitude: lon,
    }
}

const urlGeneric = `http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=${decode(KHEE)}`;
function currentWeatherUrl (
    latitude=undefined, longitude=undefined, 
    city=undefined, 
    imperial=false,
    lang='en'
    ) {
    const key=decode(KHEE);
    
    const res = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}&units=${imperial ? 'imperial' : 'metric'}&lang=${lang}`;

    console.log(res);

    return res;
}

function getWeatherLocationName(location) {
    return fetch(constructUrl(city=location))
        .then(data => data.json());
}

function getWeatherLatLon(lat, lon) {
    return fetch(constructUrl(lat, lon))
        .then(data => data.json())
}

// getWeatherLocationName(test_city)

// getWeatherLatLon(fake_data.coords.latitude, fake_data.coords.longitude)
//     .then(data => console.log(data));