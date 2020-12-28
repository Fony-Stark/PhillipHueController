let opskrifter;

async function get_all_opskrifter(){
    let response = await fetch("/opskrifter");
    if(response.ok){
        opskrifter = await response.json();
    }
}


async function main(){
    await get_all_opskrifter();
    document.getElementById("linkViewer").src = opskrifter.urls[0];
}

main();

document.getElementById("DisguisedBox").addEventListener("click", function(event) {
    let xpos = event.clientX;
    let ypos = event.clientY;
    choose_recipe(xpos, ypos);
});
function choose_recipe(xpos, ypos){
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

    for(let i = 0; i < opskrifter.urls.length; i++){
        let op = document.createElement("p");
        op.innerHTML = opskrifter.title[i];
        op.style.cursor = "pointer";
        op.style.textDecoration = "underline";
        op.style.fontSize = "1.5em";
        op.style.backgroundColor = "rgba(25,127,100,.5)";
        op.addEventListener("click", () => {
            document.getElementById("linkViewer").src = opskrifter.urls[i];
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
