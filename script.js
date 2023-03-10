const API_KEY='e0c92d9887e0e5a460ca6c12ce31cefc';
let temp=null;


const yourWeather=document.querySelector('#your-weather-section');
const searchWeather=document.querySelector('#search-weather-section');
const grantLocationButton=document.querySelector('#grant-location-button');
const grantLocationDescription=document.querySelector('#grant-location-description');
const grantLocation=document.querySelector('#grant-location-page');
const search=document.querySelector('#search-page');
const cityNotFound=document.querySelector('#city-not-found');
const failedError=document.querySelector('#error');
const searchBar=document.querySelector('#search-page-bar');
const searchIcon=document.querySelector('#search-page-icon');
const loading=document.querySelector('#loading-page');
const showWeatherInformation=document.querySelector('#show-weather-information-page');
const showCityName=document.querySelector('#city-name');
const showCityFlag=document.querySelector('#city-flag');
const showWeatherDescription=document.querySelector('#show-weather-description');
const showWeatherIcon=document.querySelector('#show-weather-icon');
const showTemperature=document.querySelector('#show-weather-temperature-value');
const showWindspeed=document.querySelector('#show-weather-windspeed-value');
const showHumidity=document.querySelector('#show-weather-humidity-value');
const showClouds=document.querySelector('#show-weather-clouds-value');

let currentTab;

yourWeather.addEventListener('click', ()=>changeTab(yourWeather));
searchWeather.addEventListener('click', ()=>changeTab(searchWeather));
searchIcon.addEventListener('click', searchWeatherData);
grantLocationButton.addEventListener('click', getYourLocation);
displayStartingPage();

function display(show){
    let possible=[grantLocation, loading, showWeatherInformation, cityNotFound, failedError];
    for(key of possible){
        if(key==show){
            key.classList.remove('hidden');
        }
        else{
            key.classList.add('hidden');
        }
    }
}
function changeTab(clickedTab){
    if( currentTab != clickedTab ){
        console.log('Tab Changed');
        currentTab.classList.remove('selected');
        currentTab=clickedTab;
        currentTab.classList.add('selected');

        if(yourWeather.classList.contains('selected')){
            displayYourWeather();
        }
        else{
            displaySearchWeather();
        }
    }
}
function displayStartingPage(){
    currentTab=yourWeather;
    if(sessionStorage.getItem('user-location')){
        display(loading);
        let location=JSON.parse(sessionStorage.getItem('user-location'));
        getYourWeather(location.latitude, location.longitude);
    }
    else{
        display(grantLocation);
    }
}
function displayYourWeather(){
    search.classList.add('hidden');
    display(loading);
    if(sessionStorage.getItem('user-location')){
        let location=JSON.parse(sessionStorage.getItem('user-location'));
        getYourWeather(location.latitude, location.longitude);
    }
    else{
        getYourLocation();
    }
}
function displaySearchWeather(){
    search.classList.remove('hidden');
    display();
}
async function searchWeatherData(){
    let city=searchBar.value;
    display(loading);
    let rawData=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    let jsonData=await rawData.json();
    if(!(jsonData?.name)){
        display(cityNotFound);
    }
    else{
        displayWeather(jsonData);
    }
}
async function getYourWeather(lat, lon){
    let rawData=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    let jsonData=await rawData.json();
    if(!(jsonData?.name)){
        display(failedError);
    }
    else{
        displayWeather(jsonData);
    }
}
function getYourLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition, function(err){
            grantLocationDescription.textContent='You denied the request for Geolocation.';
            display(grantLocation);
        });
    }
    else{
        //  Add Something if browser doesn't support Location servies
    }
}
function showPosition(position){
    display(loading);
    let lat=position.coords.latitude;
    let lon=position.coords.longitude
    let positionData={
        latitude:lat,
        longitude:lon,
    }
    sessionStorage.setItem('user-location', JSON.stringify(positionData));
    getYourWeather(lat, lon);
}
function displayWeather(pureData){
    showCityName.textContent=pureData?.name;
    showCityFlag.src=`https://flagcdn.com/144x108/${pureData?.sys?.country.toLowerCase()}.png`;
    showWeatherDescription.textContent=pureData?.weather?.[0]?.main;
    showWeatherIcon.src=`http://openweathermap.org/img/w/${pureData?.weather?.[0]?.icon}.png`;
    showTemperature.textContent=pureData?.main?.temp.toPrecision(2);
    showWindspeed.textContent=pureData?.wind?.speed;
    showHumidity.textContent=pureData?.main?.humidity;
    showClouds.textContent=pureData?.clouds?.all;

    display(showWeatherInformation);
}