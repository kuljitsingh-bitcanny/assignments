const addLocContainer=document.querySelector(".location-container");
const addLocForm=addLocContainer.querySelector("form");
const addLocBtn=addLocContainer.querySelector("button");
const weatherWrapper=document.querySelector("#weather-data-wrapper");
const weatherParent=weatherWrapper.querySelector(".weather-parent");
const weatherContainers=weatherParent.getElementsByClassName("weather-data-container");
const extraInfoContainer=document.querySelector(".extra-info-container");
const forecastParent=document.querySelector(".forecast-parent");
const forecastContainers=forecastParent.getElementsByClassName("forecast-container");

const weekNames=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const key="user_loc";
const maxLoc=5;

function getUrl(apiKey,lat,long){
    const url=`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,hourly&units=metric&appid=${apiKey}`;
    console.log(url);
    return url;
}
function getActiveForecastContainer(){
    for(let cont of forecastContainers){
        if(cont.classList.contains("active-forecast-container")) return cont;
    }
   

}
function showActiveList(){
    Array.prototype.forEach.call(weatherContainers,(cont,indx)=>{
        if(cont.classList.contains("active")){
            forecastContainers[indx].classList.add("active-forecast-container");
        }
        else forecastContainers[indx].classList.remove("active-forecast-container");
        //console.log("calling foreach on weather containers");
    })
}
function removePrevActiveContainer(){
    // for(let i=0;i<weatherContainers.length;i++){
    //     weatherContainers[i].classList.remove("active");
    //     forecastContainers[i].classList.remove("active-forecast-container");
    // }
    Array.prototype.forEach.call(weatherContainers,(cont,indx)=>{
        cont.classList.remove("active");
        forecastContainers[indx].classList.remove("active-forecast-container");
    })
}
function checkCity(city){
    if(localStorage.getItem(key)){
        const locations=JSON.parse(localStorage.getItem(key));
        if(Object.keys(locations).indexOf(city)+1){
            getWeatherByLoc(...locations[city],city,true);
        }
        else getLatLongByLoc(city);
    }
    else getLatLongByLoc(city,false)
}
function fillWeatherContainer(data,country,city,loadReq){
    const wethrCont=document.createElement("div");
    wethrCont.classList.add("weather-data-container","carousel-item");
    wethrCont.innerHTML=`
        <div>
          <span>${city},${country}</span>
          <span class="del-btn"><i class="fas fa-trash"></i></span>
        </div>
        <div>
          <img src=" http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png">
          <span class="temp-info-container">${data.current.temp}&#x2103;</span>
          <span>${data.current.weather[0].main}</span>
        </div>
        <div class="extra-info-container" style="display: none;">
          <span>
            <span>Morn</span>
            <span>${data.daily[0].temp.morn}&#x2103;</span>
          </span>
          <span>
            <span>Day</span>
            <span>${data.daily[0].temp.day}&#x2103;</span>
          </span>
          <span>
            <span>Eve</span>
            <span>${data.daily[0].temp.eve}&#x2103;</span>
          </span>
          <span>
            <span>Night</span>
            <span>${data.daily[0].temp.night}&#x2103;</span>
          </span>
        </div>
    `;
    let forecastContainer=document.createElement("div");
    forecastContainer.classList.add("forecast-container",city);
    for(let i=1;i<data.daily.length;i++){
        const divEl=document.createElement("div");
        const avgTemp=(data.daily[i].temp.morn+data.daily[i].temp.day+data.daily[i].temp.eve+data.daily[i].temp.night)/4;
        divEl.innerHTML=`
        <span>${weekNames[new Date((data.daily[i].dt)*1000).getDay()]}</span>
        <span class="temp-container">${avgTemp.toFixed(2)}&#x2103;</span>
        <span><img src=" http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png"></span>
        <div class="extra-info-container" style="display:none;">
        <span>
            <span>Morn</span>
            <span>${data.daily[i].temp.morn}&#x2103;</span>
        </span>
        <span>
            <span>Day</span>
            <span>${data.daily[i].temp.day}&#x2103;</span>
        </span>
        <span>
            <span>Eve</span>
            <span>${data.daily[i].temp.eve}&#x2103;</span>
        </span>
        <span>
            <span>Night</span>
            <span>${data.daily[i].temp.night}&#x2103;</span>
        </span>
        </div>
        `;
        forecastContainer.append(divEl);
    }
    if(loadReq){
        removePrevActiveContainer();
        wethrCont.classList.add("active");
        forecastContainer.classList.add("active-forecast-container");
    }
    weatherParent.append(wethrCont);
    forecastParent.appendChild(forecastContainer);
    
}

async function getWeatherByLoc(lat,long,country,city,loadReq){
    console.log(lat,long,country,city,loadReq);
    const resp=await fetch(getUrl("eb3a0633d8659677115815383ff2557f",lat,long));
    const data=await resp.json();
    console.log(data,country,city);
    fillWeatherContainer(data,country,city,loadReq)
    
}

async function getLatLongByLoc(loc,isUpdate=true){
    const resp=await fetch(`https://geocode.xyz/${loc}?json=1&auth=12627312440311e15967368x46609`);
    const {latt,longt,standard}=await resp.json();
    console.log(latt,longt,standard);
    if(latt==undefined || longt==undefined ||standard==undefined){
        alert("Invalid location!");
    }
    else{
        let locations;
        if(isUpdate){
            locations=JSON.parse(localStorage.getItem(key));
            const keys=Object.keys(locations);
            if(keys.length>=maxLoc){
                weatherParent.removeChild(weatherParent.children[0]);
                forecastParent.removeChild(forecastParent.children[0]);
                delete locations[keys[0]];
            }
            locations[loc]=[latt,longt,standard.countryname];
        }
        else locations={[loc]:[latt,longt,standard.countryname]};
        localStorage.setItem(key,JSON.stringify(locations));
        getWeatherByLoc(latt,longt,standard.countryname,loc,true);
    }
    
    
}
addLocBtn.addEventListener("click",(e)=>{
    e.target.parentElement.classList.remove("active");
    e.target.parentElement.nextElementSibling.classList.add("active");
})

addLocForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    const city=e.target[0].value;
    if(city){
        checkCity(city);
    }
    e.target[0].value="";
    e.target.classList.remove("active");
    e.target.previousElementSibling.classList.add("active");
})

weatherWrapper.addEventListener("click",(e)=>{
    if(e.target.classList.contains("temp-info-container")){
        e.target.parentElement.nextElementSibling.style.display="flex";
    }
    else if(e.target.classList.contains("extra-info-container")){
        e.target.style.display="none";
    }
    else if(e.target.classList.contains("carousel-control-next-icon") || 
        e.target.classList.contains("carousel-control-prev-icon")){
            showActiveList();
    }
    else if(e.target.classList.contains("del-btn")){
        const wethrCont=e.target.parentElement.parentElement;
        const frcstCont=getActiveForecastContainer();
        const prevWethrCont=wethrCont.previousElementSibling??wethrCont.nextElementSibling;
        weatherParent.removeChild(wethrCont);
        forecastParent.removeChild(frcstCont);
        console.log(weatherContainers,localStorage.getItem(key))
        if(prevWethrCont){
            prevWethrCont.classList.add("active");
            showActiveList();
        }
        if(weatherContainers.length==0){
            checkCity("newdelhi");
        }
        const locations=localStorage.getItem(key)?JSON.parse(localStorage.getItem(key)):{};
        const city=wethrCont.firstElementChild.children[0].innerText.replace(/,.+/,"");
        delete locations[city];
        localStorage.setItem(key,JSON.stringify(locations));
    }
    
})
forecastParent.addEventListener("click",(e)=>{
    if(e.target.classList.contains("temp-container")){
        e.target.nextElementSibling.nextElementSibling.style.display="flex";
    }
    if(e.target.classList.contains("extra-info-container")){
        e.target.style.display="none";
    }
})

window.addEventListener("load",(e)=>{
    const locations=localStorage.getItem(key)?JSON.parse(localStorage.getItem(key)):{};
    const keys=Object.keys(locations);
    weatherParent.textContent="";
    forecastParent.textContent="";
    keys.forEach((key,indx)=>{
        getWeatherByLoc(...locations[key],key,indx==keys.length-1);
    })
    if(keys.length==0) checkCity("newdelhi");
})