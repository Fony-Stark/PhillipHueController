const fs = require("fs");
const https = require("https");
const http = require("http");
const path = require("path");
const HCLib = require("./HueController");
const { exception } = require("console");


http.createServer((req, res) => {
    server_functions(req, res, 12000);
}).listen(12000);

function server_functions(req, res, port_listner){
    if(req.method == "GET"){
        GET_method_response(req, res);
    } else if(req.method == "POST"){
        POST_method_response(req, res);
    } else {
        res.writeHead(404)
        res.end();
    }
}

async function GET_method_response(req, res){
    let [request_url, path_url] = fix_url(req, res);

    console.log("This is the Path url: ", request_url);
    if(request_url == "lights"){
        res.writeHead(200, {"Content-Type": "application/json"});
        let path_for_lights = "/api/" + KEY + "/lights"

        http.get("http://" + URL + path_for_lights, (resp) => {
            let data = "";

            resp.on("data", (chunk) => {
                data += chunk;
            });

            resp.on("end", () => {
                res.write(data);
                res.end();
            });
        }).on("error", (err) => {
            console.log("Error: ", err.message);
        });     
        return;
    }

    if(request_url == "opskrifter"){
        s_data = fs.readFileSync(path_url + '/SharedLinks/opskrifter.json', 'utf8'); 
        res.writeHead(200, {"Content-Type": "application/json"});
        res.write(s_data);
        res.end();
        return;
    }

    console.log("Does the file exist?", path_url + request_url, "/", fs.existsSync(path_url + request_url));
    if(request_url != "" && request_url != "/" && fs.existsSync(path_url + request_url)){
        let [file_name, file_type] = request_url.split(".");
        try {
          switch(file_type.toLowerCase()){
              case "html":
                  res.writeHead(200, {"Content-Type": "text/html"});
                  res.write(fs.readFileSync(path_url + request_url));
                  res.end();
                  return;
                  break;
              case "txt":
                res.writeHead(200, {"Contet-Type": "text/txt; charset=utf-8"});
                break;
              case "css":
                  res.writeHead(200, {"Content-Type": "text/css"});
                  break;
              case "js":
                  //console.log("This is what I found:", new_url);
                  res.writeHead(200, {"Content-Type": "text/javascript"});
                  console.log();
                  break;
              case "png":
                  res.writeHead(200, {"Content-Type": "image/png"});
                  res.write(fs.readFileSync(path_url + request_url), "binary");
                  res.end();
                  return;
              case "jpg":
                  res.writeHead(200, {"Content-Type": "image/jpg"});
                  res.write(fs.readFileSync(path_url + request_url), "binary");
                  res.end();
                  return;
  	          case "jpeg":
  		            res.writeHead(200, {"Content-Type": "image/jpeg"});
                  res.write(fs.readFileSync(path_url + request_url), "binary");
                  res.end();
  		            return;
              default:
                  res.writeHead(404);
                  res.end();
                  console.log("I was asked for a file type, which I isn't programmed for:", file_type);
                  return;
              }
        } catch(err) {
          console.log(err);
          res.writeHead(200, {"Contet-Type": "text/html"});
          res.write(fs.readFileSync(path_url + "/HueController/frontpage.html").toString());
          res.end();
          return;
        }
        res.write(fs.readFileSync(path_url + request_url).toString());
        res.end();
    } else {
        res.writeHead(200, {"Contet-Type": "text/html"});
        res.write(fs.readFileSync(path_url + "/HueController/frontpage.html").toString());
        res.end();
        console.log("I just send the main page");
    }
}

async function timer_action(light_index, name){
    switch(name){
        case "turn_off":
            huecontrol.turn_light_off(light_index);
            break;
        default:
            break;
    }
}

let URL = "192.168.1.116";
let KEY = "9VVcN-PWsDxs-bmWgNPOE0N4SfzO-OTdFypVWEO9";
let huecontrol = new HCLib.HueController(URL, KEY);
async function POST_method_response(req, res){
    let current_path = __dirname;
    let source_url = current_path.substring(0, current_path.length - "server".length);

    let raw_message = await post_value(req, res); 
    let message = JSON.parse(raw_message);
    /* console.log(message); */
    if(message.intend == "lights"){
        switch(message.action){
            case "turn_light_on":
                huecontrol.turn_light_on(message.index);
                break;
            case "turn_light_off":
                huecontrol.turn_light_off(message.index);
                break;
            case "change_bri_value":
                huecontrol.change_bri_value(message.index, message.value);
                break;
            case "change_hue_value":
                huecontrol.change_hue_value(message.index, message.value);
                break;
            case "change_sat_value":
                huecontrol.change_sat_value(message.index, message.value);
                break;
            case "change_name":
                huecontrol.change_name(message.index, message.value);
                break;
            case "turn_off_after_2":
                console.log("Turning off light with index", message.index, "in:", message.n_minutes);
                setTimeout(timer_action, message.n_minutes*1000*60, message.index, "turn_off");
                break;
            default:
                console.log("I recived a light command, which I didn't recognize.");
                break;
        }
    } else if (message.intend == "timer"){

    } else if (message.intend == "alarm"){

    } else if (message.intend == "ny_opskrift"){
        let json_object;
        s_data = fs.readFileSync(source_url + '/SharedLinks/opskrifter.json', 'utf8'); 
        json_object = await JSON.parse(s_data);
        json_object.urls.push(message.url);
        json_object.title.push(message.title);
        let data = JSON.stringify(json_object, null, 2);

        fs.writeFile(source_url + '/SharedLinks/opskrifter.json', data, (err) => {
            if(err){
                console.log(err);
            }
        });
    }
        
}

function fix_url(req, res){
    let modified_url = req.url.split("");
    modified_url.shift();

    let current_path = __dirname;
    let source_url = current_path.substring(0, current_path.length - "server".length);

    let new_url = "";
    for(let i = 0; i < modified_url.length; i++){
        new_url += modified_url[i];
    }

    return [new_url, source_url];
}

async function post_value(req, res){
    let body_of_post = "";
    await req.on("data", function(data) {
      body_of_post += data
    });
  
    await req.on("end", function() {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end("Post received");
    });
  
    return body_of_post;
  }