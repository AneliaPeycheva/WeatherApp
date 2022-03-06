const apiKey = "0159f7d9175212dd6237dd8806cfd506";  
const form = document.getElementsByTagName('form')[0];     
let ul = document.getElementsByTagName('ul')[0];
let listItems = ul.children; 
let msg = document.getElementsByClassName('msg')[0];     

function checkError(response) { 
    console.log(response)          
    if (response.ok && response.status < 400) {
        return response.json();
    }
    throw new Error(`${response.status} | ${response.statusText}`);            
}

async function loadCityWeather(e) {
    try {
        e.preventDefault();      
        msg.textContent = "";
        let inputCity = "";          
        const inputVal = form[0].value; 
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;
    
        if (inputVal.includes(',')) {
            inputCity = inputVal.split(',')[0];               
        } else {
            inputCity = inputVal;
        }     
                
        if (listItems.length > 0) {  
            for (const item of listItems) {
                let city = item.querySelector('.city').innerText;                               
                if ( city === inputCity) {
                    msg.textContent = `You already know the weather for ${city} ...otherwise be more specific by providing the country code as well 😉`;
                    form.reset();                     
                    return;
                }                   
            }
        }        
                
        let response = await fetch(url);  

        if (!response.ok || response.status > 400) {
            throw ({
                response:response.status,
                status:response.statusText
            });  
        } 

        let data = await response.json();                       
        let {main, name, weather, sys} = data; 
        //const icon = `https://openweathermap.org/img/wn/${weather[0]["icon"]}@2x.png`; get icon from api                       
        const icon = `./${weather[0]["icon"]}.svg`;                            
        let li = document.createElement('li');
        li.classList.add("card");
        const markup = `<div class="card-container">
            <h2>
                <span class="city">${name}</span>
                <sup class="country">${sys.country}</sup>
            </h2>
            <div class="temp-container">
                <span class="temp">${Math.round(main.temp)}</span>
                <sup class="degrees">°C</sup>
            </div>                        
            <img class="city-icon"  alt=${weather[0]["main"]} src=${icon}>
            <div class="weather-text">
                ${weather[0].description}
            </div>
        </div>`;
        li.innerHTML = markup;
        ul.appendChild(li);
        msg.textContent = "";
        form.reset();                   
    }
     catch(err) {
        console.log(`${err.response} | ${err.status}`);
        msg.textContent = "Please search for a valid city 😩";
        form.reset();  
        return
     }       
     
}

form.addEventListener('submit', loadCityWeather);