const express = require('express');
var router = express.Router()
const axios = require('axios');
const app = express();
const moment = require('moment')

const configFirebase = require('./firebaseConfig')
const admin = require('./firebaseConfig')
const db = configFirebase.firestoreDB

const FieldValue = require('firebase-admin').firestore.FieldValue;

const key = '8b4bdfc570514b1d9e71628238368e3e'

// gen Registered Day
function getlistDay(startDate,endDate,dupDayArray){
  var dayList = []
  var re = []
  for(var i=0;i<dupDayArray.length;i++){
      if(dupDayArray[i]==true){
          dayList.push(i)
      }
  }
  var ddSt = startDate.split('-')[2]
  var mmSt = startDate.split('-')[1]
  var yyyySt = startDate.split('-')[0]
  var ddEnd =  endDate.split('-')[2]
  var mmEnd =  endDate.split('-')[1]
  var yyyyEnd =  endDate.split('-')[0]
  var targetDate = new Date();
  targetDate.setDate(ddSt)
  targetDate.setMonth(mmSt-1)
  targetDate.setFullYear(yyyySt)
  if(dayList.length==0){
    while(true){
      
      dd = targetDate.getDate()
      mm = targetDate.getMonth() + 1;
      yyyy = targetDate.getFullYear()
      dateString = yyyy + "-" + mm + "-" + dd;
      re.push(dateString)
      targetDate.setDate(targetDate.getDate()+1 );
      if(dd == ddEnd && mm == mmEnd && yyyy == yyyyEnd) break ;
      
  }
 

  }
  else
  {
  
  while(true){
      
      dd = targetDate.getDate()
      mm = targetDate.getMonth() + 1;
      yyyy = targetDate.getFullYear()
      dateString = yyyy + "-" + mm + "-" + dd;
      if(dayList.includes(targetDate.getDay())){
        re.push(dateString)
      }
      targetDate.setDate(targetDate.getDate()+1 );
      if(dd == ddEnd && mm == mmEnd && yyyy == yyyyEnd) break ;
      
  }
}
  return re
}


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







router.get('/test', async function (req, res) {
  console.log("Test Success");
  res.send({name:"Lift",id:123456789})
  });



router.post('/matchFace', function (req, res) {
  console.log(req.body.firstParam);
    const config = {
      method: 'post',
      url: 'https://southeastasia.api.cognitive.microsoft.com/face/v1.0/detect',
      headers: {'Content-Type': 'application/octet-stream','Ocp-Apim-Subscription-Key': key },
      params: {returnFaceId:true },
      data:req.body.firstParam
  }
  let res =  axios(config)
  let data = res.data
  // return data[0].faceId
  // res.send(req.body)
  res.send(data)
  // res.end()
    
});



router.post('/addSession',async function (req,res){
  var classID = req.body.classID
  var className = req.body.className
  var semester = req.body.semester
  var teacherID = req.body.teacherID
  var desc = req.body.desc
  var startDate = req.body.startDate
  var endDate = req.body.endDate
  var startTime = req.body.startTime
  var endTime = req.body.endTime
  var isLocationSet = req.body.isLocationSet
  var isSeatmapSet = req.body.isSeatmapSet
  var isAutoSelectMACSet = req.body.isAutoSelectMACSet
  var macAddrList = req.body.macAddrList
  var dupDay = req.body.dupDay
  var registeredDay =  getlistDay(req.body.startDate,req.body.endDate,req.body.dupDay)
  var totalClassChecked = registeredDay.length
  var isStudentAdded = false
  var statistics = {}

  console.log(teacherID);
  
  var macListModify = []
  macAddrList.forEach(mac => {
    macListModify.push(mac.split('.')[0])
  })

  
  const docRef = await db.collection('Classroom').doc(teacherID)
  .collection('sessions').doc()
  await docRef.set({
    id:classID,
    name:className,
    semester :semester,
    desc:desc,
    startDate:startDate,
    endDate:endDate,
    startTime:startTime,
    endTime:endTime,
    isLocationSet:isLocationSet,
    isSeatmapSet:isSeatmapSet,
    isAutoSelectMACSet:isAutoSelectMACSet,
    macAddrList:macListModify,
    duplicatedDay:dupDay,
    registeredDay:registeredDay,
    totalClassChecked:totalClassChecked,
    isStudentAdded:isStudentAdded,
    statistics:statistics,
    teacherID:teacherID
    
  });
  

  res.send({response:'success'})


})

router.get('/getSession',async function (req,res) {
    var date = req.query.date
    var teacherID = req.query.teacherID
    
    
    // get current Date,Time
    var currentDate = req.query.clientCurrentDate
    var currentTime = req.query.clientCurrentTime


    var myData = []
    const sessionRef = db.collection('Classroom').doc(teacherID).collection('sessions');
    const sessionSnapshot = await sessionRef.get();
    sessionSnapshot.forEach(async doc => {
      if(doc.data().registeredDay.includes(date)){
        var tempData = doc.data()
        // add date field
        tempData.currentDate = date
        // add uniqueID of classroom
        tempData.uqID = doc.id

        


        // delete unimportant data
        delete tempData['endDate']
        delete tempData['startDate']
        delete tempData['macAddrList']
        delete tempData['totalClassChecked']
        delete tempData['registeredDay']
        delete tempData['duplicatedDay']
        delete tempData['isAutoSelectMACSet']


        // check if added student then calculate statistics(all,absent,present)
        if(tempData.statistics[date] != undefined){
        // add defalse stat each student
        var currentDateStudent = tempData.statistics[date]
        var studentCount = tempData.statistics[date].length
        var checkedStudent = 0
        var uncheckedStudent = 0
        currentDateStudent.forEach(stdStatData => {
          if(stdStatData.isChecked)
            checkedStudent+=1
          
        })
        uncheckedStudent=studentCount-checkedStudent

        tempData.totalStudent = studentCount
        tempData.checkedStudent = checkedStudent
        tempData.uncheckedStudent = uncheckedStudent

        delete tempData['statistics']

        // add sessionStatus field
        var classDate = tempData.currentDate
        var classStartTime = tempData.startTime
        var classEndTime = tempData.endTime
        tempData.sessionStatus =  getSessionState(classDate,classStartTime,classEndTime,currentDate,currentTime)
      }
      else{ // if students is not added

      // In progress status
      tempData.sessionStatus = -99
    }
      
        
        myData.push(tempData)
      
      }
    
    });
    // console.log(myData);
    
    
    

    res.send(myData)

  })

  router.post('/cancelSession', async function (req,res){
    var teacherID = req.body.teacherID
    var uqID = req.body.uqID
    var date = req.body.date

    const sessionRef = db.collection('Classroom').doc(teacherID)
    .collection('sessions').doc(uqID)
    const sessionDoc = await  sessionRef.get();


    const registeredDaysArray = sessionDoc.data().registeredDay
    const dateIndex = registeredDaysArray.indexOf(date);
    registeredDaysArray.splice(dateIndex, 1);

    const delRegisteredDate =  await sessionRef.update({
      registeredDay : registeredDaysArray
    });

    const delStudentStatField =  await sessionRef.set({
      statistics : {
        [date] : FieldValue.delete()
      }
    },{ merge: true });

    const doc = await  sessionRef.get();
    const registeredDateLength = await doc.data().registeredDay.length
    if(registeredDateLength == 0){
      sessionRef.delete();
    }


    res.send({status:'Success'})


  })

  

  


module.exports = router

