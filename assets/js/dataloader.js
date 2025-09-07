function dataload(){
    let password = document.location.hash.replace('#','').trim();
    loader_update(`Downloading Data...<br><span class="w3-small"> Accessing the global family directory!</span>`)
    const json_load = new XMLHttpRequest();
    if(password.trim()==''){
        password = prompt("Enter Passphrase",'');
    }
    // const password = prompt("Enter Passphrase",'');
    json_load.onload = function() {
        people_data = JSON.parse(this.responseText)
        try {
            if(people_data['remark']=='Passphrase incorrect'){
                loader_update(`Unable to Parse Data<br><span class="w3-small"> EOF Null Pointer Error!</span>`)
                return;
            }
        } catch (error) {
            loader_update(`Fetching Nodes...<br><span class="w3-small"> Accessing the global family directory!</span>`)
        }
        callback_after_load()
        autocomplete('focus_person', people_data);
    }
    URL = '../assets/data/family.json';
    // CORS error when accessing GAS API
    URL = "https://script.google.com/macros/s/AKfycbygTufhFtIAyDdLky4941c0hmKW0DCNN8QDqdF42IQm96UsRrbxBeS_6JZdZDpzgo0gig/exec?passphrase="+password;
    json_load.open("GET", URL);
    json_load.send();
}
dataload()