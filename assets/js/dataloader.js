function dataload(){
    loader_update(`Fetching Nodes...<br><span class="w3-small"> Accessing global family directory!</span>`)
    const json_load = new XMLHttpRequest();
    json_load.onload = function() {
        people_data = JSON.parse(this.responseText)
        callback_after_load()
    }
    URL = '../assets/data/family.json';
    // CORS error when accessing GAS API
    URL = "https://script.google.com/macros/s/AKfycbygTufhFtIAyDdLky4941c0hmKW0DCNN8QDqdF42IQm96UsRrbxBeS_6JZdZDpzgo0gig/exec";
    json_load.open("GET", URL);
    json_load.send();
}

setTimeout(()=>{
    dataload()
},2000)