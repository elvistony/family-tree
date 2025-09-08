function discover() {

    if(document.getElementById('relative_A_ID').value =="" || document.getElementById('relative_B_ID').value ==""){
        alert("Ensure you've selected 2 Relatives!")
        return;
    }
    
    var from_id = document.getElementById('relative_A_ID').value
    var to_id = document.getElementById('relative_B_ID').value


  all_people = JSON.parse(JSON.stringify(people_data));

    function traverse(from,to,steps,relation="relative"){

        if(all_people[from]["visited"]){
            return false;
        }

        steps.push({id:from, how:relation})
        all_people[from]["visited"] = true
        // console.log(all_people[from])

        if(from==to){
            console.log("Found Path!")
            console.log(steps)
            callback_discovered(steps)
            return steps
        }

        if("Parent" in all_people[from]){
            if(!Object.keys(all_people[from]["Parent"]).includes("visited")){
                if(!all_people[from]["Parent"]['visited']){
                    traverse(all_people[from]["Parent"],to,steps.slice(),"parent")
                }
            }
        }

        if("Spouse" in all_people[from]){
            if(!Object.keys(all_people[from]["Spouse"]).includes("visited")){
                if(all_people[from]["Spouse"]!=all_people[from].ID){
                    if(!all_people[from]["Spouse"]['visited']){
                        traverse(all_people[from]["Spouse"],to,steps.slice(),"spouse")
                    }
                }
            }
        }

        if("Children" in all_people[from]){
            for (child of all_people[from]["Children"]){
                if(!Object.keys(all_people[child]).includes("visited")){
                    if(!all_people[child]['visited']){
                        traverse(child,to,steps.slice(),"child")
                    }
                }
            }
        }
    }

    traverse(from_id,to_id,[],"relative")

    function callback_discovered(steps){
        list_container = document.getElementById('discover-list');
        list_container.innerHTML = ""
        for (step of steps){
            switch(step.how){
                case 'relative':
                    list_container.innerHTML+=render_list_item(step.id,"-START-")
                    break;
                default:
                    list_container.innerHTML+=render_list_item(step.id,step.how)
            }
        }
        console.log(steps)
    }

    function render_list_item(id,relation){
        // src="${all_people[id]['Image']}"
        template = `<li class="w3-bar">
                <img src="../assets/img/user.png" class="w3-bar-item w3-circle " style="width:85px">
                <div class="w3-bar-item">
                    <div>${relation}</div>
                  <div class="w3-large">${all_people[id]['Name']}</div>
                  
                </div>
              </li>`;
        return template;
    }

    function render_list_person(id,relation){
        // src="${all_people[id]['Image']}"
        template = `<div class="person-tile">
            
        </div>`;
        return template;
    }
    function render_list_relation(id,relation){
        // src="${all_people[id]['Image']}"
        template = `<div class="person-tile">
        
        </div>`;
        return template;
    }
}

let pairs = {
    'parent':['child','spouse'],
    'grandparent':['child','child']
}