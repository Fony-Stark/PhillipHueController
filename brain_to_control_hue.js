async function get_all_lights(){
    let response = await fetch("https://192.168.1.116/api/9VVcN-PWsDxs-bmWgNPOE0N4SfzO-OTdFypVWEO9/lights");
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

let standard = "https://192.168.1.116/api/9VVcN-PWsDxs-bmWgNPOE0N4SfzO-OTdFypVWEO9";
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

function create_light_mode(light, index){
    let container = document.createElement("div");
    container.classList.add("containers");

    let title = document.createElement("h1");
    title.innerHTML = light.name;

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
    }

    let paragraph_sat = document.createElement("p");
    paragraph_sat.innerHTML = "Sat:";
    paragraph_sat.style.marginBottom = 0;
    paragraph_sat.style.fontSize = "2em";

    let switch_obj = document.createElement("div");
    switch_obj.innerHTML = (light.state.on) ? "ON" : "OFF";
    switch_obj.style.backgroundColor = (light.state.on) ? "green" : "red";
    switch_obj.classList.add("On_off_switch");

    switch_obj.addEventListener("click", function (){ 
        turn_off_light(light, index);
        if(switch_obj.innerHTML == "OFF"){
            switch_obj.innerHTML = "ON";
            switch_obj.style.backgroundColor = "GREEN";
        } else {
            switch_obj.innerHTML = "OFF";
            switch_obj.style.backgroundColor = "RED";
        }
    });

    container.appendChild(title);
    container.appendChild(paragraph_bright);
    container.appendChild(brightness_slider);
    container.appendChild(paragraph_hue);
    container.appendChild(hue_slighter);
    container.appendChild(paragraph_sat);
    container.appendChild(sat_slighter);
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