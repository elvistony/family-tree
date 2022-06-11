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
                    label: "",
                    group: person.House,
                    shape: "image",
                    color: {
                      color: "transparent",
                    },
                    size: 10,
                    image: "https://img.icons8.com/officexs/344/filled-like.png",
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

    var container = document.getElementById("myfamily");
    var data = {
        nodes: nodes,
        edges: edges,
    };

    var options = {
        layout: {
          improvedLayout: false,
          clusterThreshold: 500,
        },
        edges: {
          //   chosen: false,
          //   font: {
          //   	multi: "html",
          //   	align: 'top',
          //   	color: "#79553D"
          //   },
          //   smooth: {
          //   	type: 'cubicBezier',
          //   	forceDirection: 'vertical',
          //   	roundness: 1
          //   },
          //   color: {
          //   	color: "#79553D"
          //   },
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
          // enabled: false,
          //   stabilization: {
          //     iterations: 500,
    
          //   },
          // "barnesHut": {
          //   "springConstant": 0,
          //   "avoidOverlap": 0.2
          // },
          // repulsion: {
          //     springLength: 1000,
          //     nodeDistance: 1500,
          //     //centralGravity: 0,
          //     //springConstant: 0.05,
          // },
          stabilization: true,
        },
      };
      var network = new vis.Network(container, data, options);
      leave_loader()
}