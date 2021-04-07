// function getSimilaritry(a, b) {
//     return a.map(function(val, index) { 
//       //calculate the position offset and divide by the length to get each 
//       //values similarity score
//       var posOffset = Math.abs(b.indexOf(val) - index); 
//       return posOffset/a.length
//     }).reduce(function(curr, prev) {
//       //divide the current value by the length and subtract from 
//       //one to get the contribution to similarity 
//       return (1 - curr/a.length) + prev;
//     });
// }


var arr1 = [8,7,6,5,1,2,3,4]

var arr2 = [0,1,2,3]

var arr3 = [0,1,2,3,5,6,4,7]
console.log(arr1[0] == arr2[1]);

const getSimilaritry = (arr1,arr2) => {
    var score = 0
    
    for(var i=0;i<arr1.length;i++){
        for(var j=0;j<arr2.length;j++){
            if(arr1[i] == arr2[j] ){
                
                if(i == j){
                    score+=0
                }
                else{
                    score += ( Math.abs(i-j)/8 )

                }
            }

        }
    }
    return score
}

console.log(getSimilaritry(arr1,arr3));


