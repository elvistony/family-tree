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
        console.log(all_people[from])

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
                    list_container.innerHTML+=render_list_item(step.id,"Relative A")
                    break;
                default:
                    list_container.innerHTML+=render_list_item(step.id,step.how)
            }
        }
    }

    function render_list_item(id,relation){
        template = `<li class="w3-bar">
                <img src="${all_people[id]['Image']}" class="w3-bar-item w3-circle " style="width:85px">
                <div class="w3-bar-item">
                  <span class="w3-large">${all_people[id]['Name']}</span><br>
                  <span>${relation}</span>
                </div>
              </li>`;
        return template;
    }
}

// function traverse(from_id, to_id, steps = [], relation = "relative") {
//   if (all_people[from_id]["visited"]) {
//     return false;
//   }



//   // push "ID" to steps
//   steps.push({ id: from_id, relation: relation });
//   all_people[from_id]["visited"] = true;
//   // try{console.log(all_people[from_id]["Name"])}catch{}
//   if (from_id == to_id) {
//     console.log("FOUND!");
//     // console.log(steps)
//     print_path(steps);
//     return steps;
//   }

//   // Traverse to parent
//   try {
//     if (!all_people[from_id]["parent"]["visted"]) {
//       // console.log("<= PARENT")
//       traverse(
//         all_people[from_id]["parent"],
//         to_id,
//         steps.slice(),
//         (relation = "parent")
//       );
//     }
//   } catch {}

//   // Traverse to spouse
//   try {
//     if (!all_people[from_id]["spouse"]["visted"]) {
//       // console.log("== SPOUSE")
//       traverse(
//         all_people[from_id]["spouse"],
//         to_id,
//         steps.slice(),
//         (relation = "spouse")
//       );
//     }
//   } catch {}

//   // Traverse to children

//   try {
//     for (child of all_people[from_id]["children"]) {
//       if (!all_people[child]["visted"]) {
//         // console.log("=> CHILD")
//         traverse(child, to_id, steps.slice(), (relation = "child"));
//       }
//     }
//   } catch {}
// }

// function print_path(steps) {
//   console.log(steps);
//   tags = document.getElementById("result-tags");
//   // tags.innerHTML = ""
//   tags.innerHTML += `<span class="tag bg-warning">${
//     document.getElementById("relation_1").value
//   }'s</span>`;
//   steps = steps.slice(0, -1);
//   c = 0;
//   suffix = "'s";
//   for (step of steps) {
//     console.log(step.relation);
//     if (c == steps.length) {
//       suffix = "";
//     }
//     switch (step.relation) {
//       case "relative":
//         break;
//       case "spouse":
//         break;
//       default:
//         tags.innerHTML += `<span class="">${step.relation + suffix}</span>`;
//     }
//     c += 1;
//   }
//   tags.innerHTML += `is <span class="tag bg-warning"> ${
//     document.getElementById("relation_2").value
//   }</span>`;
// }
