const json_load = new XMLHttpRequest();
json_load.onload = function() {
    people_data = JSON.parse(this.responseText)
    callback_after_load()
}
json_load.open("GET", "../assets/data/family.json");
json_load.send();