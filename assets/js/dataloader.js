const json_load = new XMLHttpRequest();
json_load.onload = function() {
    people_data = JSON.parse(this.responseText)
    callback_after_load()
}
URL = '../assets/data/family.json';
URL = "https://script.google.com/macros/s/AKfycbz1lq5OjuEctWs5KUppm_YkBWM-Sr73JJ_AV2qr8KGHCGE0peeLS_0h6yU6o0vWH6lZcw/exec";
json_load.open("GET", URL);
json_load.send();