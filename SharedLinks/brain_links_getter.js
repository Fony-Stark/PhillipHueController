function send_new_opskrift(url, title){
    let f = {title: title, url: url, intend: "ny_opskrift"};

    let xhr = new XMLHttpRequest();
    xhr.open('POST', "/", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(f));
}

async function get_all_opskrifter(){
    let response = await fetch("/opskrifter");
    if(response.ok){
        let opskrifter = await response.json();
        document.getElementById("linkViewer").src = opskrifter.urls[0];
        for(let i = 0; i < opskrifter.urls.length; i++){
            creat_opskrift(opskrifter.urls[i], opskrifter.title[i]);
        }
    }
}

function creat_opskrift(url, name){
    let link = document.createElement("p");
    link.classList = "opskrifter"
    link.addEventListener("click", () => {
        document.getElementById("linkViewer").src = url;
        console.log("url:", url);
    });
    link.innerHTML = name;

    document.getElementById("linksfield").appendChild(link);
}

get_all_opskrifter();
document.getElementById("new_opskrift").addEventListener("click", () => {
    let url = prompt("What is the url to the recipe?");
    let title = prompt("What would you call this recipe?");

    if(url != "" && title != ""){
        send_new_opskrift(url, title);
        creat_opskrift(url, title);
    }
});

document.getElementById("test_url").addEventListener("click", () => {
    let url = prompt("What is the url to the recipe?");

    document.getElementById("linkViewer").src = url;
});