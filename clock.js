function update_clock(){
    let d = new Date();
    let hours = (d.getHours() < 10) ? "0"+d.getHours() : d.getHours();
    let minutes = (d.getMinutes() < 10) ? "0"+d.getMinutes() : d.getMinutes();
    let seconds = (d.getSeconds() < 10) ? "0"+d.getSeconds() : d.getSeconds();
    let days = (d.getDate() < 10) ? "0"+d.getDate() : d.getDate();
    document.getElementById("clock").innerHTML = hours + ":" + minutes + ":" + seconds + " - " +  get_month_short(d.getMonth()) + ": " + days;
}

function get_month_short(num){
    let return_value = "";
    switch(num){
        case 0:
            return_value = "jan";
            break;
        case 1:
            return_value = "Feb"
            break;
        case 2:
            return_value = "Mar"
            break;
        case 3:
            return_value = "Apr"
            break;
        case 4:
            return_value = "May"
            break;
        case 5:
            return_value = "Jun"
            break;
        case 6:
            return_value = "Jul"
            break;
        case 7:
            return_value = "Aug"
            break;
        case 8:
            return_value = "Sep"
            break;
        case 9:
            return_value = "Oct"
            break;
        case 10:
            return_value = "Nov"
            break;
        case 11:
            return_value = "Dec"
            break;
        default:
            return_value = "NaM"
    }
    return return_value;
}

update_clock();
setInterval(update_clock, 1000);