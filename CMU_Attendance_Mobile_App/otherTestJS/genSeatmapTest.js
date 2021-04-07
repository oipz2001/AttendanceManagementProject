var seatmap =[]

var student_id = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]

let student_pointTo = new Map()
let student_BePointBy = new Map()
var frontRowStudent = [1,16,7,2]

student_pointTo.set(2,1)
// student_pointTo.set(12,15)
// student_pointTo.set(13,5)
student_pointTo.set(8,7)
student_pointTo.set(9,4)
// student_pointTo.set(5,3)
student_pointTo.set(7,2)
student_pointTo.set(16,7)
student_pointTo.set(15,6)
student_pointTo.set(4,2)
student_pointTo.set(10,11)
// student_pointTo.set(14,9)
student_pointTo.set(11,8)
student_pointTo.set(3,16)
student_pointTo.set(6,1)



student_pointTo.forEach((val1,key1) => {
    // console.log(key1 + ' points to '+ val1);
    // var arr = []

    // student_BePointBy.set(val,key)
    // console.log(val1);

    



})

student_id.forEach(id => {
    var arr = []
    student_pointTo.forEach((val,key) => {
        if(id == val ){
            arr.push(key)
        }
    })
    if(arr.length!=0){
        // console.log(id + ' is pointed by ' + arr);
        student_BePointBy.set(id,arr)
    }
    arr = []
        
})

// console.log(student_pointTo);
// console.log(student_BePointBy);
// console.log(frontRowStudent);


var upperLeft ;

frontRowStudent.forEach(front => {
    if(student_BePointBy.get(front).length == 1)
        upperLeft=front
})

// console.log(upperLeft);

console.log(student_BePointBy);
var  frontRowStudent_ordered = []

frontRowStudent_ordered.push(upperLeft)
var current=upperLeft


while(student_pointTo.get(current) != undefined){
    
    
    frontRowStudent_ordered.push(student_pointTo.get(current))
    current=student_pointTo.get(current)
}

console.log(frontRowStudent);

var student_BePointBy_copy = student_BePointBy

frontRowStudent.forEach(f1 => {
    // var item = f
    // var index = student_BePointBy_copy.get(f).indexOf(item);
    // console.log(index);
    // student_BePointBy.get(f).splice(index,1);
    frontRowStudent.forEach(f2 => {
        var item = f2
        var index = student_BePointBy_copy.get(f1).indexOf(item);
        
        if(index!=-1){
            student_BePointBy_copy.get(f1).splice(index,1);
            console.log(f1 + ' '+ item);
        }

    })
})

console.log(student_BePointBy_copy);


seatmap.push(frontRowStudent_ordered)
seatmap.push([0,0,0,0])
seatmap.push([0,0,0,0])
seatmap.push([0,0,0,0])

console.log(seatmap);



for(var i=0;i<3;i++){
    console.log(seatmap);
    for(var j=0;j<4;j++){

        
        console.log(student_BePointBy_copy.get(seatmap[i][j]));  
        if(student_BePointBy_copy.get(seatmap[i][j]) == undefined){
            continue
        }else{
        seatmap[i+1][j] = student_BePointBy_copy.get(seatmap[i][j])[0]  
     }
        
    }
    

}

console.log(seatmap);









