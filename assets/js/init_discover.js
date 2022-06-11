var people_data={}; 
var people={};

function callback_after_load(){
    setTimeout(()=>{
        console.log("Loaded");
        console.log(people);
        autocomplete('relative_A', people_data);
        autocomplete('relative_B', people_data);
        leave_loader()
    },2000)
}