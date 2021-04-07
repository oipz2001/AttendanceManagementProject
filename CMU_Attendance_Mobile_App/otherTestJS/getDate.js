
// var targetDate = new Date();
// // targetDate.setDate(targetDate.getDate()+7 );
// // targetDate.setDate(17+15);
// // console.log(targetDate.getDate());
// // console.log(targetDate.getMonth() + 1);
// // console.log(targetDate.getFullYear());


// var dd = targetDate.getDate();

// var mm = targetDate.getMonth() + 1; // 0 is January, so we must add 1
// var yyyy = targetDate.getFullYear();


// var dateString = dd + "/" + mm + "/" + yyyy;

// console.log( dateString + " " + targetDate.getDay())
// while(true){
//     targetDate.setDate(targetDate.getDate()+7 );
//     dd = targetDate.getDate()
//     mm = targetDate.getMonth() + 1;
//     yyyy = targetDate.getFullYear()
//     dateString = dd + "/" + mm + "/" + yyyy;
//     console.log( dateString + " " + targetDate.getDay())
//     if(dd == 31 && mm == 12 && yyyy == 2020) break ;
    
// }

var start = '1-1-2021'
var end = '31-1-2021'
var dupDay = [false,true,false,false,true,false,false]

// console.log(start.split('-'));

function listDay(startDate,endDate,dupDayArray){
    var dayList = []
    for(var i=0;i<dupDayArray.length;i++){
        if(dupDayArray[i]==true){
            dayList.push(i)
        }
    }
    var ddSt = startDate.split('-')[0]
    var mmSt = startDate.split('-')[1]
    var yyyySt = startDate.split('-')[2]
    var ddEnd =  endDate.split('-')[0]
    var mmEnd =  endDate.split('-')[1]
    var yyyyEnd =  endDate.split('-')[2]
    var targetDate = new Date();
    targetDate.setDate(ddSt)
    targetDate.setMonth(mmSt-1)
    targetDate.setFullYear(yyyySt)
    
    while(true){
        
        dd = targetDate.getDate()
        mm = targetDate.getMonth() + 1;
        yyyy = targetDate.getFullYear()
        dateString = dd + "/" + mm + "/" + yyyy;
        if(dayList.includes(targetDate.getDay())){
        console.log( dateString + " " + targetDate.getDay())
        }
        targetDate.setDate(targetDate.getDate()+1 );
        if(dd == ddEnd && mm == mmEnd && yyyy == yyyyEnd) break ;
        
    }
}
listDay(start,end,dupDay)




