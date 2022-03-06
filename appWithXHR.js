const apiKey = "0159f7d9175212dd6237dd8806cfd506";  
const form = document.getElementsByTagName('form')[0];     
let ul = document.getElementsByTagName('ul')[0];
let listItems = ul.children; 
let msg = document.getElementsByClassName('msg')[0];   
function loadCityWeather(e){
    
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
    
        let xhr = new XMLHttpRequest();
        xhr.addEventListener('readystatechange', function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    let dataObj = JSON.parse(xhr.responseText);           
                    let {main, name, weather, sys} = dataObj;                             
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
                } else {
                    msg.textContent = "Please search for a valid city 😩";
                    form.reset();  
                    return;               
                }
            }          
        })
    
        xhr.open("GET",url,true);      
        xhr.send();    
}

form.addEventListener('submit', loadCityWeather);