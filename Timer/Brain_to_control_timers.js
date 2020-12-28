async function get_all_lights(){
    let response = await fetch("/lights");
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


document.getElementById("choose_lamp").addEventListener("click", function(event) {
    let xpos = event.clientX;
    let ypos = event.clientY;
    choose_recipe(xpos, ypos);
});

async function choose_recipe(xpos, ypos){
    let backgroung_to_click_away = document.createElement("div");
    backgroung_to_click_away.style.height = "100vh";
    backgroung_to_click_away.style.width = "100vw";
    backgroung_to_click_away.style.top = "0";
    backgroung_to_click_away.style.left = "0";
    backgroung_to_click_away.id = "back_click_killer_window";
    backgroung_to_click_away.style.position = "absolute";

    backgroung_to_click_away.addEventListener("click", remove_specific);

    let advanced_settings_div = document.createElement("div");
    advanced_settings_div.style.width = "500px";
    advanced_settings_div.style.height = "275px";
    advanced_settings_div.style.position = "absolute"; 
    advanced_settings_div.style.overflowX = "hidden";
    advanced_settings_div.style.top = ((ypos + 275 > window.innerHeight) ? window.innerHeight - 275 : ypos)+"px";
    advanced_settings_div.style.left = ((xpos + 500 > window.innerWidth) ? window.innerWidth - 500 : xpos)+"px";
    advanced_settings_div.style.border = "solid black 2px";
    advanced_settings_div.style.backgroundColor = "#BDA69D"; 
    advanced_settings_div.id = "choose_recipe";

    let lights = await get_all_lights();

    for(let i = 0; i < lights.length; i++){
        let op = document.createElement("p");
        op.innerHTML = lights[i].name;
        op.style.cursor = "pointer";
        op.style.textDecoration = "underline";
        op.style.fontSize = "1.5em";
        op.style.backgroundColor = "rgba(25,127,100,.5)";
        op.addEventListener("click", () => {
            let selected_light = document.createElement("p");
            selected_light.style.cursor = "pointer";
            selected_light.style.textDecoration = "underline";
            selected_light.style.fontSize = "1.5em";
            selected_light.style.backgroundColor = "rgba(25,127,100,.5)";
            selected_light.innerHTML = lights[i].name;
            document.getElementById("choosen_lamps").appendChild(selected_light);
        });
        advanced_settings_div.appendChild(op);
    }

    document.getElementsByTagName("BODY")[0].appendChild(backgroung_to_click_away);
    document.getElementsByTagName("BODY")[0].appendChild(advanced_settings_div);
}

function remove_specific(){
    document.getElementById("back_click_killer_window").removeEventListener("click", remove_specific);
    document.getElementById("back_click_killer_window").remove();
    document.getElementById("choose_recipe").remove();
}

function get_value_timer(){
    let raw_data = document.getElementById("timer").innerHTML;
    
    let value = raw_data.split(":");
    return value;
}

function past_value(raw_value){
    let value = raw_value.split(":");
    document.getElementById("timer").innerHTML = value[0] + ":" + value[1] + ":" + value[2];
}

function addTime_Timer(value){
    let timer_value = get_value_timer();
    let new_timer_value = "";

    if(timer_value[0][0] != "0"){
        return;
    }
    new_timer_value += timer_value[0][1];
    new_timer_value += timer_value[1][0];
    new_timer_value += ":";
    new_timer_value += timer_value[1][1];
    new_timer_value += timer_value[2][0];
    new_timer_value += ":";
    new_timer_value += timer_value[2][1];
    new_timer_value += value;

    past_value(new_timer_value);
}

function resetTimer(){
    document.getElementById("timer").innerHTML = "00:00:00";
}

function del_last_value(){
    let timer_value = get_value_timer();
    let new_timer_value = "";

    new_timer_value += "0";
    new_timer_value += timer_value[0][0];
    new_timer_value += ":";
    new_timer_value += timer_value[0][1];
    new_timer_value += timer_value[1][0];
    new_timer_value += ":";
    new_timer_value += timer_value[1][1];
    new_timer_value += timer_value[2][0];

    past_value(new_timer_value);
}

function innitiad_numpad(){
    document.getElementById("n1").addEventListener("click", () => {
        addTime_Timer(1);
    })
    document.getElementById("n2").addEventListener("click", () => {
        addTime_Timer(2);
    })
    document.getElementById("n3").addEventListener("click", () => {
        addTime_Timer(3);
    })
    document.getElementById("n4").addEventListener("click", () => {
        addTime_Timer(4);
    })
    document.getElementById("n5").addEventListener("click", () => {
        addTime_Timer(5);
    })
    document.getElementById("n6").addEventListener("click", () => {
        addTime_Timer(6);
    })
    document.getElementById("n7").addEventListener("click", () => {
        addTime_Timer(7);
    })
    document.getElementById("n8").addEventListener("click", () => {
        addTime_Timer(8);
    })
    document.getElementById("n9").addEventListener("click", () => {
        addTime_Timer(9);
    })
    document.getElementById("n0").addEventListener("click", () => {
        addTime_Timer(0);
    })
    document.getElementById("nDel").addEventListener("click", () => {
        del_last_value();
    })
    document.getElementById("nReset").addEventListener("click", () => {
        resetTimer();
    })
}
innitiad_numpad();