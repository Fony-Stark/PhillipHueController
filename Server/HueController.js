const { Console } = require("console");
const http = require("http");
const https = require("https");
const path = require("path");

class HueController {
    constructor(ip, identification) {
        this.identification = identification;
        this.ip = ip;
    }

    turn_light_off(index){
        let action = {"on": false};
        this.send_message(action, "/lights/" + index + "/state");
    }

    turn_light_on(index){
        let action = {"on": true};
        this.send_message(action, "/lights/" + index + "/state");
    }

    change_hue_value(index, value){
        let action = {"hue": parseInt(value)};
        this.send_message(action, "/lights/" + index + "/state");
    }

    change_bri_value(index, value){
        let action = {"bri": parseInt(value)};
        this.send_message(action, "/lights/" + index + "/state");
    }

    sleep(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
    }

    async blink(index, value1, value2, time){
        while(true){
            this.change_hue_value(index, value1);
            await this.sleep(time);
            this.change_hue_value(index, value2);
            await this.sleep(time);
        }
    }

    change_sat_value(index, value){
        let action = {"sat": parseInt(value)};
        this.send_message(action, "/lights/" + index + "/state");
    }

    change_name(index, new_name){
        let action = {"name": new_name};
        this.send_message(action, "/lights/" + index);
    }

    send_message(json_object, extended_path){
        let options = {
            host: this.ip,
            path: "/api/" + this.identification + extended_path,
            method: "PUT",
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        }

        // console.log("ip = ", this.ip + "/api/" + this.identification + extended_path);

        let request = http.request(options, function(response) {
            let responseString = "resp - ";

            response.on("data", function(data){
                responseString += data;
            })
            response.on("end", function() {
                console.log(responseString);
            });
        });

        // console.log("this is it: ", json_object);
        request.write(JSON.stringify(json_object));
        request.end()
    }
}

module.exports = { HueController };