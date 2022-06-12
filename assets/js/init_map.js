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
            group: person.House
        })

        // Spouse to LOVE Node
        if(Object.keys(person).includes("Spouse")){
            if(!Object.keys(love_map).includes(person.ID)){
                relations.push({
                    from: person.ID,
                    to: person.Spouse+"_LOVE",
                    width:5,
                    color:{
                        color:'red'
                    }
                })
                relations.push({
                    from: person.Spouse,
                    to: person.Spouse+"_LOVE",
                    width:5,
                    color:{
                        color:'red'
                    }
                })
                love_map[person.Spouse] = person.Spouse+"_LOVE"
                love_map[person.ID] = person.Spouse+"_LOVE"

                persons.push({
                    id: person.Spouse+"_LOVE",
                    label: "❤️",
                    group: person.House,
                    shape: "circle",
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
    
    // console.log(persons,relations)

    return {nodes:persons,edges:relations}
}

function render_map(){

    var net = prepare_structures()
    var nodes = new vis.DataSet(net.nodes);
    var edges = new vis.DataSet(net.edges);

    

    var options = {
        layout: {
          improvedLayout: true,
          clusterThreshold: 1000,
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
          iterations: 800,

        },
        },
      };

      var cookie = getCookie("CalculatedNodes")
      if(cookie!=""){        
        var data = {
            nodes: JSON.parse(cookie),
            edges: edges,
        };
      }else{
        console.log("No stored positions, would have to get the job done normally!")
        var data = {
            nodes: nodes,
            edges: edges,
        };
      }

      var container = document.getElementById("myfamily");
      var network = new vis.Network(container, data, options);

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
                details_pane += `<img src="${person[key]}" class="w3-image w3-responsive" alt="">`
                break;
              case "Parent":
                details_pane.innerHTML =
                  details_pane.innerHTML +
                  prepare_field("Parent", people_data[person[key]]["Name"]);
                break;
              case "Spouse":
                details_pane.innerHTML =
                  details_pane.innerHTML +
                  prepare_field("Spouse", people_data[person[key]]["Name"]);
                break;
              case "Name":
                details_pane.innerHTML +=  prepare_field("Name:", person[key]);
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
              default:
                details_pane.innerHTML +=  prepare_field(key, person[key]);
                break;
            }
          }
          // document.body.classList.remove('sb-sidenav-toggled');
        } else if (params.edges.length == 0 && params.nodes.length == 0) {
          document.getElementById("side-details").innerHTML = `<table style="height:100%;width:100%; text-align: center;color: grey;font-size: small;"> 
          <tr><td>Select a node to view its information</td></tr>
        </table>`;
          // document.body.classList.add('sb-sidenav-toggled');
        }
      });

      network.once('stabilizationIterationsDone',function(){
        leave_loader()
        network.storePositions()
        setCookie("CalculatedNodes",data.nodes.get(),5)
      })

      loader_update("Stabilizing Nodes...<br>This might take a while!")
}

function prepare_field(prop,value){
  return `<p>${prop}: <input type="text" class="w3-input" value="${value}"></p>`
}