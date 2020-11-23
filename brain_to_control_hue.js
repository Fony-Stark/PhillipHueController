let standard = "https://192.168.1.116/api/9VVcN-PWsDxs-bmWgNPOE0N4SfzO-OTdFypVWEO9";
async function get_all_lights(){
    let response = await fetch(standard + "/lights");
    if(response.ok){
        let light_object = await response.json();
        //console.log(light_object);
        let all_lights = [];
        let i = 1;
        while(light_object[i] != null){
            all_lights.push(light_object[i]);
            i++;
        }
        return all_lights;
    }
}

document.getElementsByTagName("BODY")[0].addEventListener("click", longer_then_10_min);
let last_input = new Date();
function longer_then_10_min(){
    if(Math.floor((new Date() - last_input)/60000) > 10){
        reloadLights();
    }
    last_input = new Date();
}

let current_timer = null;
let current_timer_stopper = null;
function made_progress(){
    longer_then_10_min();
    if(current_timer != null){
        window.clearTimeout(current_timer);
        window.clearTimeout(current_timer_stopper);
    }

    current_timer = setTimeout(reloadLights, 5*1000*60);
    
    current_timer_stopper = setTimeout(() => {
        current_timer = null;
    }, 5*1000*60);
}

function turn_off_light(light, index){
    let xhr = new XMLHttpRequest();
    let encoded_url = encodeURI(standard + "/lights/" + index + "/state");
    //console.log("Hey", encoded_url);
    xhr.open('PUT', encoded_url, true);

    let bool = !light.state.on;
    light.state.on = bool;
    //console.log("This bool:", bool);

    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(["{\"on\":" + bool + "}"]);
    made_progress();
}

function reloadLights(){
    document.getElementById("containter").innerHTML = "";
    get_all_lights().then((value) => {
        let lights = value;
        let i = 0;
        while(lights[i] != null){
            create_light_mode(lights[i], i+1);
            i++;
        }
    });
}
reloadLights();

document.getElementById("ReLoad").addEventListener("click", reloadLights);

function remove_specific(){
    document.getElementById("back_click_killer_window").removeEventListener("click", remove_specific);
    document.getElementById("back_click_killer_window").remove();
    document.getElementById("advanced_settings").remove();
}

function open_specific(light, index, xpos, ypos){
    let backgroung_to_click_away = document.createElement("div");
    backgroung_to_click_away.style.height = "98%";
    backgroung_to_click_away.style.width = "98%";
    backgroung_to_click_away.id = "back_click_killer_window";
    backgroung_to_click_away.style.position = "absolute";

    backgroung_to_click_away.addEventListener("click", remove_specific);

    let advanced_settings_div = document.createElement("div");
    advanced_settings_div.style.width = "500px";
    advanced_settings_div.style.height = "275px";
    advanced_settings_div.style.position = "absolute";
    advanced_settings_div.style.top = ((ypos + 275 > window.innerHeight) ? window.innerHeight - 275 : ypos)+"px";
    advanced_settings_div.style.left = ((xpos + 500 > window.innerWidth) ? window.innerWidth - 500 : xpos)+"px";
    advanced_settings_div.style.border = "solid black 2px";
    advanced_settings_div.style.backgroundColor = "#BDA69D"; 
    advanced_settings_div.id = "advanced_settings";

    let brightness_slider = document.createElement("input");
    brightness_slider.type = "range";
    brightness_slider.min = 1;
    brightness_slider.max = 254;
    brightness_slider.value = light.state.bri;
    brightness_slider.classList.add("slider");
    brightness_slider.onchange = function(){
        let xhr = new XMLHttpRequest();
        let encoded_url = encodeURI(standard + "/lights/" + index + "/state");
        xhr.open('PUT', encoded_url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(["{\"bri\":" + this.value + "}"]);
        light.state.bri = this.value;
        made_progress();
    }

    let paragraph_bright = document.createElement("p");
    paragraph_bright.innerHTML = "Brightness:";
    paragraph_bright.style.marginBottom = 0;
    paragraph_bright.style.fontSize = "2em";

    let hue_slighter = document.createElement("input");
    hue_slighter.type = "range";
    hue_slighter.min = 0;
    hue_slighter.max = 65535;
    hue_slighter.value = light.state.hue;
    hue_slighter.classList.add("slider");
    hue_slighter.onchange = function(){
        let xhr = new XMLHttpRequest();
        let encoded_url = encodeURI(standard + "/lights/" + index + "/state");
        xhr.open('PUT', encoded_url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(["{\"hue\":" + this.value + "}"]);
        light.state.hue = this.value;
        made_progress();
    }

    let paragraph_hue = document.createElement("p");
    paragraph_hue.innerHTML = "Hue:";
    paragraph_hue.style.marginBottom = 0;
    paragraph_hue.style.fontSize = "2em";

    let sat_slighter = document.createElement("input");
    sat_slighter.type = "range";
    sat_slighter.min = 0;
    sat_slighter.max = 254;
    sat_slighter.value = light.state.sat;
    sat_slighter.classList.add("slider");
    sat_slighter.onchange = function(){
        let xhr = new XMLHttpRequest();
        let encoded_url = encodeURI(standard + "/lights/" + index + "/state");
        xhr.open('PUT', encoded_url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(["{\"sat\":" + this.value + "}"]);
        light.state.sat = this.value;
        made_progress();
    }

    let paragraph_sat = document.createElement("p");
    paragraph_sat.innerHTML = "Sat:";
    paragraph_sat.style.marginBottom = 0;
    paragraph_sat.style.fontSize = "2em";

    let sleep_2_min = document.createElement("div");
    sleep_2_min.innerHTML = "Sluk efter 2 min";
    sleep_2_min.style.fontSize = "2em";
    sleep_2_min.style.border = "black solid 2px";
    sleep_2_min.style.width = "max-content";
    sleep_2_min.style.margin = "2px";
    sleep_2_min.style.cursor = "pointer";
    sleep_2_min.style.backgroundColor = "#9DB4BD";
    sleep_2_min.addEventListener("click", function() {
        sleep_after_n_minutes(light, index, 2);
    });

    advanced_settings_div.appendChild(sleep_2_min);
    advanced_settings_div.appendChild(paragraph_bright);
    advanced_settings_div.appendChild(brightness_slider);
    advanced_settings_div.appendChild(paragraph_hue);
    advanced_settings_div.appendChild(hue_slighter);
    advanced_settings_div.appendChild(paragraph_sat);
    advanced_settings_div.appendChild(sat_slighter);

    document.getElementsByTagName("BODY")[0].appendChild(backgroung_to_click_away);
    document.getElementsByTagName("BODY")[0].appendChild(advanced_settings_div);
}

function sleep_after_n_minutes(light, index, n){
    setTimeout(turn_off_light, n*1000*60, light, index)
}

function create_light_mode(light, index){
    let container = document.createElement("div");
    container.classList.add("containers");

    let title = document.createElement("h1");
    title.innerHTML = light.name;

    let advance_button = document.createElement("div");
    advance_button.innerHTML = "Advanced";
    advance_button.classList.add("Advanced");
    
    advance_button.addEventListener("click", function(event) {
        let xpos = event.clientX;
        let ypos = event.clientY;
        open_specific(light, index, xpos, ypos);
        made_progress();
    });

    let switch_obj = document.createElement("div");
    switch_obj.innerHTML = (light.state.on) ? "ON" : "OFF";
    if(switch_obj.innerHTML == "ON"){
        switch_obj.style.direction = "ltr";
    } else {
        switch_obj.style.direction = "rtl";
    }
    switch_obj.style.backgroundColor = (light.state.on) ? "#197F64" : "#99192F";
    switch_obj.classList.add("On_off_switch");

    switch_obj.addEventListener("click", function (){ 
        turn_off_light(light, index);
        if(switch_obj.innerHTML == "OFF"){
            switch_obj.innerHTML = "ON";
            switch_obj.style.direction = "ltr";
            switch_obj.style.backgroundColor = "#197F64";
        } else {
            switch_obj.innerHTML = "OFF";
            switch_obj.style.direction = "rtl";
            switch_obj.style.backgroundColor = "#99192F";
        }
    });

    container.appendChild(title);
    container.appendChild(advance_button);
    container.appendChild(switch_obj);
    document.getElementById("containter").appendChild(container);
}

function changeName(index, new_name){
    let xhr = new XMLHttpRequest();
    let encoded_url = encodeURI(standard + "/lights/" + index);
    xhr.open('PUT', encoded_url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(["{\"name\":" + "\""+new_name+"\"" + "}"]);
}