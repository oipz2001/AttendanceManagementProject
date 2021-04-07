
const moment = require('moment')

var classDate = '2020-12-15'
var classStartTime = '8:20'
var classEndTime = '22:00'

var currentDate = moment(new Date()).format('YYYY-MM-DD')
var currentTime = moment(new Date()).format('HH:mm')



const getSessionState = (classDate,startTime,endTime,currentDate,currentTime) => {

    if(moment(currentDate).isBefore(classDate))
    {
        return -1
    }
    else if(moment(currentDate).isAfter(classDate))
    {
        return 1
    }
    else
    {
        
        if(moment(moment(currentTime, 'HH:mm')).isBefore(moment(startTime , 'HH:mm')))
        {
            return -1
        }
        else if(moment(moment(currentTime, 'HH:mm')).isAfter(moment(endTime, 'HH:mm')))
        {
            return 1
        }
        else{
            return 0
        }
    }
}
console.log(getSessionState(classDate,classStartTime,classEndTime,currentDate,currentTime));



