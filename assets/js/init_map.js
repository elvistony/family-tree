function callback_after_load(){
    setTimeout(()=>{
        render_map()
    },2000)
}

function prepare_structures(){
    var persons = []
    var relations = []
    var love_map = {}

    for (person of Object.values(people_data)){

        persons.push({
            id: person.ID,
            label: person.Name,
            group: person.House,
            font:{
              background:'white'
            }
        })

        // Spouse to LOVE Node
        if(Object.keys(person).includes("Spouse")){
            if(!(Object.keys(love_map).includes(person.ID))){
                let marriage = genID(5);
                relations.push({
                    from: person.ID,
                    to: marriage+"_LOVE",
                    width:5,
                    color:{
                        color:'red'
                    }
                })
                relations.push({
                    from: person.Spouse,
                    to: marriage+"_LOVE",
                    width:5,
                    color:{
                        color:'red'
                    }
                })

              // Bring spouses closer together
              //   relations.push({
              //     from: person.ID,
              //     to: person.Spouse,
              //     width:5,
              //     hidden:true
              // })
                love_map[person.Spouse] = marriage+"_LOVE"
                love_map[person.ID] = marriage+"_LOVE"

                persons.push({
                    id: marriage+"_LOVE",
                    label: "❤️",
                    group: person.House,
                    shape: "circle",
                    size: 4,
                    // image: "https://img.icons8.com/officexs/344/filled-like.png",
                    sortkey: 0,
                  });
            }
        }

        // LOVE Node to children
        if(Object.keys(person).includes("Children")){
            for (child of person["Children"]){
                relations.push({
                    from: love_map[person.ID],
                    to: child
                })
            }
        }
    }
    
    // console.log(relations,love_map)

    return {nodes:persons,edges:relations}
}


function genID(length) {
  // Ensure the length is a positive number.
  if (length <= 0 || !Number.isInteger(length)) {
    console.error("The length must be a positive integer.");
    return '';
  }

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;

  // Loop 'length' times to build the ID string.
  for (let i = 0; i < length; i++) {
    // Get a random character from the 'characters' string and append it to the result.
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

let network;
function render_map(){

    var net = prepare_structures()
    var nodes = new vis.DataSet(net.nodes);
    var edges = new vis.DataSet(net.edges);

    

    var options = {
        layout: {
          improvedLayout: true,
          clusterThreshold: 1000,
          randomSeed:'0.3826156948434907:1757244543703'
        },
        nodes: {
          widthConstraint: {
            minimum: 80,
            maximum: 95,
          },
          shape: "box",
          font: {
            multi: "html",
          },
          labelHighlightBold: false,
        },
        
        physics: {
          // stabilization: true,
          enabled: true,
          stabilization: {
            iterations: 200,

          },
        },
      };

      // var cookie = getCookie("CalculatedNodes")
      var storage = localStorage.getItem("CalculatedNodes")
      if(storage!=null & false){        
        loader_update(`Loading Cached Nodes...<br><span class="w3-small"> This will be quick!</span>`)
        console.log("Found a previous scroll of knowledge!")
        var data = {
            nodes: JSON.parse(storage),
            edges: edges,
        };
      }else{
        loader_update(`Stabilizing Nodes...<br><span class="w3-small"> This is a one time process and will be cached to your device!</span>`)
        console.log("No stored positions, would have to get the job done normally!")
        var data = {
            nodes: nodes,
            edges: edges,
        };
      }

      var container = document.getElementById("myfamily");
      network = new vis.Network(container, data, options);

      console.log("Seed:",network.getSeed())

      network.on("click", function (params) {
        //  console.log(params);
        if (params.nodes[0] != null) {
          details_pane = document.getElementById("side-details");
          details_pane.innerHTML = ``;
    
          person = people_data[params.nodes[0]];
    
          for (key in person) {
            switch (key) {
              case "Generation":
              case "ID":
                break;
              case "Image":
                details_pane.innerHTML = `<p><img src="${person[key]}" class="w3-image w3-responsive" alt=""></p>` + details_pane.innerHTML 
                break;
              case "Parent":
                details_pane.innerHTML =
                  details_pane.innerHTML +
                  prepare_field("Parent", people_data[person[key]]["Name"]);
                break;
              case "Spouse":
                details_pane.innerHTML +=prepare_field("Spouse", people_data[person[key]]["Name"]);
                if("Children" in people_data[person[key]]){
                  details_pane.innerHTML += `<p class="side-info-item"><span class="w3-small">Children:</br><ul class='w3-ul'>`
                  for (child of people_data[person[key]]['Children']){
                    details_pane.innerHTML +=`<li>${people_data[child]['Name']}</li>`
                  }
                  details_pane.innerHTML += "</ul></p>"
                }
                break;
              case "Name":
                details_pane.innerHTML +=  prepare_field("Name", person[key]);
                break;
              case "DOB":
                details_pane.innerHTML =
                  details_pane.innerHTML +
                  prepare_field("Date of Birth", person[key]);
                break;
              case "House":
                details_pane.innerHTML +=  prepare_field("House", person[key]);
                break;
              case "Full Name":
                details_pane.innerHTML +=prepare_field("Full Name", +person[key]);
                break;
              case  "Children":
                details_pane.innerHTML += `<p class="side-info-item"><span class="w3-small">Children:</br><ul class='w3-ul'>`
                for (child of person[key]){
                  details_pane.innerHTML +=`<li>${people_data[child]['Name']}</li>`
                }
                details_pane.innerHTML += "</ul></p>"
                break;
              default:
                details_pane.innerHTML +=  prepare_field(key, person[key]);
                break;
            }
          }
          // document.body.classList.remove('sb-sidenav-toggled');
        } else if (params.edges.length == 0 && params.nodes.length == 0) {
          document.getElementById("side-details").innerHTML = `
          <table style="height:100%;width:100%; text-align: center;color: grey;font-size: small;"> 
          <tr><td>Select a node to view its information</td></tr>
        </table>`;
          // document.body.classList.add('sb-sidenav-toggled');
        }
      });

      network.once('stabilizationIterationsDone',function(){
        leave_loader()
        if(localStorage.getItem('CalculatedNodes')==null){
          network.storePositions()
          console.log(data.nodes.get())
          localStorage.setItem("CalculatedNodes",JSON.stringify(data.nodes.get()))
        }
        // setCookie("CalculatedNodes",JSON.stringify(data.nodes.get()),5)
      })

      
}

function prepare_field(prop,value){
  console.log(prop,value)
  if(value==NaN || value=="NaN"){
    return ""
  }
  return `<p class="side-info-item"><span class="w3-small">${prop}:</br></span> <input type="text" class="w3-input" readonly value="${value}"></p>`
}