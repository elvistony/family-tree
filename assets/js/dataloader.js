const json_load = new XMLHttpRequest();
json_load.onload = function() {
    people_data = JSON.parse(this.responseText)
    callback_after_load()
}
URL = '../assets/data/family.json';
URL = "https://script.googleusercontent.com/macros/echo?user_content_key=Cbk-7jgfNj0ifpUWINqOJhMycHFKcQ_QYZuqbu_INTeZz0D_rn0A2cRgbbXvO47VVdhpv2xtW7uLBjxLzNeWe0AyFEfy00GUm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnMPYdn_qKLx7MPeDOVe124Donyo1yrE701EWsraKblVOEL62pnWyY5K0gQka4RKmNUJfd2C6q4t3jbgEoScS7JoAmBwbTW0bRtz9Jw9Md8uu&lib=MbRtGIS41UfKvxlJpHpTqAVHEBcGLnv5U";
json_load.open("GET", URL);
json_load.send();