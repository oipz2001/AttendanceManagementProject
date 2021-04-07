
const Graph = require('digraphe')
var graph = new Graph();


var seatmap ={
    "2021-01-15" : {
        nodes: ["A","B","C","D","E","F","G","Z","ZZX","L","X"],
        mapSeat : [
            {studentID:"A",receivedStudentID:"B",direction:0},
            {studentID:"B",receivedStudentID:"C",direction:0},
            {studentID:"C",receivedStudentID:"D",direction:0},
            {studentID:"E",receivedStudentID:"F",direction:0},
            {studentID:"G",receivedStudentID:"B",direction:1},
            {studentID:"ZZX",receivedStudentID:"A",direction:1},
            {studentID:"L",receivedStudentID:"D",direction:1},
            {studentID:"D",receivedStudentID:"X",direction:1},
            {studentID:"F",receivedStudentID:"D",direction:1},
            {studentID:"Z",receivedStudentID:"G",direction:1},
        
        ],
        graphs:[]
    }
}

var myNodeList = seatmap['2021-01-15'].nodes
var mapSeatArr = seatmap['2021-01-15'].mapSeat





const addMapSeat = (studentRef,studentPointed,direction,graph) =>{
    const twoBitOpposite = (number) => {
        if(number==0) return 2
        else if(number==1)  return 3
        else if(number==2)  return 0
        else return 1
    }
    graph.addEdge(studentRef, studentPointed,{ weight: direction} );
    graph.addEdge(studentPointed,studentRef,{ weight: twoBitOpposite(direction)} );
}

mapSeatArr.forEach(mapseat=> {
    addMapSeat(mapseat.studentID,mapseat.receivedStudentID,mapseat.direction,graph)
});

var seatMapGroup = []
var countGroup = 0
while(myNodeList.length != 0){
    var studentNode = myNodeList[0]
    var myVisitedNodeList = []
    var seatMap = new Map()
    if(graph.hasNode(studentNode)){
        Graph.Visitor.BFS(graph, studentNode, function (array_of_nodes, depth) {
            array_of_nodes.forEach(myNode => {
                var index = myNodeList.indexOf(myNode.id)
                var adjList = [] 
                myNodeList.splice(index,1)
                seatMap.set(myNode.id,adjList)
                myNode.edges.forEach(myEdge => {
                    if(myEdge.source.id == myNode.id && !myVisitedNodeList.includes(myEdge.target.id)){
                        var adjPair = []
                        var direction = 'none'
                        if(myEdge.weight == 0)
                        {
                            direction = "Right"
                        }else if(myEdge.weight == 1)
                        {
                            direction = "Front"
                        }else if(myEdge.weight == 2)
                        {
                            direction = "Left"
                        }else
                        {
                            direction = "Back"
                        }
                        adjPair = [myEdge.target.id,direction]
                        adjList.push(adjPair)
                    }
                });
                myVisitedNodeList.push(myNode.id)
            });
        });
            seatMapGroup.push(seatMap)
        }else
        {
            seatMap.set(studentNode,[])
            seatMapGroup.push(seatMap)
            myNodeList.splice(0,1) 
        }       
    countGroup+=1
}

var mySeatmapCoordinatesList = []
for(var i=0;i<countGroup;i++){
    mySeatmapCoordinatesList.push(new Map())
}

var c=0
seatMapGroup.forEach(seatmap => {
    seatmap.forEach((adjNodeArr,node) => {
        if(mySeatmapCoordinatesList[c].get(node) == undefined){
            var X_parent = 0
            var Y_parent = 0
            mySeatmapCoordinatesList[c].set(node,[X_parent,Y_parent])
        }
        adjNodeArr.forEach(adjNode => {
            var X_parent = mySeatmapCoordinatesList[c].get(node)[0]
            var Y_parent = mySeatmapCoordinatesList[c].get(node)[1]
            if(adjNode[1] == 'Right')
            {
                X_parent+=1;
            }
            else if(adjNode[1] == 'Left')
            {
                X_parent-=1;
            }
            else if(adjNode[1] == 'Front')
            {
                Y_parent+=1;
            }
            else if(adjNode[1] == 'Back')
            {
                Y_parent-=1
            }
            mySeatmapCoordinatesList[c].set(adjNode[0],[X_parent,Y_parent])
        });
    });
    c+=1 
})

console.log(mySeatmapCoordinatesList);
