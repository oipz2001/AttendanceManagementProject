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


router.get('/getClassroom', async function(req,res){
  const selectedDate  = req.query.date
  const studentID = req.query.studentID
  var currentDateForCheckStatus = req.query.clientCurrentDate
  var currentTimeForCheckStatus = req.query.clientCurrentTime
  
  // console.log(selectedDate);
  // console.log(studentID);
  // console.log(currentDateForCheckStatus);
  // console.log(currentTimeForCheckStatus);

  const studentRef = db.collection('Students').doc(studentID)
  
  const studentData = await studentRef.get()
  var myResultData = []
  if(studentData.exists){
  
  var studentClassroomData = studentData.data().classroom
  const promises = [];
  studentClassroomData.forEach(async classD => {
    const classroomRef = db.collection('Classroom').doc(classD.teacherID).collection('sessions').doc(classD.classUqID)
    const promise = classroomRef.get()
    .then(doc => {
      if(doc.data().registeredDay.includes(selectedDate)){
        var tempData = doc.data()
        tempData.currentDate = selectedDate
        tempData.uqID = classD.classUqID
        tempData.sessionStatus =  getSessionState(tempData.currentDate,tempData.startTime,tempData.endTime,currentDateForCheckStatus,currentTimeForCheckStatus)

         // delete unimportant data
         delete tempData['endDate']
         delete tempData['startDate']
         delete tempData['macAddrList']
         delete tempData['totalClassChecked']
         delete tempData['registeredDay']
         delete tempData['duplicatedDay']
         delete tempData['isAutoSelectMACSet']
         delete tempData['statistics']
         delete tempData['isStudentAdded']
         delete tempData['statistics']
         delete tempData['statistics']

        //  console.log(tempData);
         myResultData.push(tempData)
      }
    })
    
    
    promises.push(promise);
    
  });
  
  Promise.all(promises).then(() => {
    res.send(myResultData);
  })
  .catch(err => {
    res.status(err);
})

    

  }else{
    console.log('This student do not exist');
    res.send(myResultData)
  }
  
})

router.post('/matchMAC', async function (req,res){
  console.log('matchMACAPI');
    var classD = req.body.classData
    var teacherID = classD.teacherID
    var classID = classD.uqID
    var studentMACList = req.body.studentWifiList
    var classMACList = []
    console.log(studentMACList[0]);
    console.log(classID);
    console.log(teacherID);
    const classRef = db.collection('Classroom').doc(teacherID).collection('sessions').doc(classID)
    const classSnapData = await classRef.get()
    var classMACList = classSnapData.data().macAddrList

    console.log(classMACList[0]);
    
    var matchResult = false
    if(classMACList[0] == studentMACList[0]){
      matchResult = true
    }


    res.send({matchResult:matchResult})
  })


  router.get('/isFaceListAdded',async function (req,res){
    const studentID = req.query.studentID
    console.log(studentID);
    const ref = db.collection('Students').doc(studentID)
    const doc = await ref.get()
    if(doc.exists){

      if(doc.data().faceListID == null){
        res.send({response:false})
    }else{
        res.send({response:true})
    }

    }
    else{
      res.send({response:null})
    }
    

    
  })

  router.post('/addFaceListToStudent', async function(req,res){
    const faceListId = req.body.faceListId
    const studentID = faceListId
    const stdFaceListIDRef = db.collection('Students').doc(studentID)
    await stdFaceListIDRef.update({faceListID:faceListId})
    res.send({response:faceListId})
  })


  router.post('/addNewStudent', async function (req,res){
    const studentID = req.body.studentID
    const studentName = req.body.studentName
    const faceListID = req.body.faceListId
    const classroom = []

    const Ref = db.collection('Students').doc(studentID.toString())
    await Ref.set(
      {
        name:studentName,
        id:studentID,
        faceListID:faceListID,
        classroom:classroom

      }
    )

    res.send({response:studentID+'is added'})
  })



module.exports = router