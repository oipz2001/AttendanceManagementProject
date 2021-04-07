const express = require('express');
var router = express.Router()
const functions = require('firebase-functions');
const axios = require('axios');
const app = express();

const configFirebase = require('./firebaseConfig')
const db = configFirebase.firestoreDB
var batch = db.batch()
const FieldValue = require('firebase-admin').firestore.FieldValue;

const moment = require('moment')

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


router.get('/', function (req, res) {
    res.send('Web Test')
});

router.get('/getSession',async function (req,res) {
    var date = req.query.date
    var teacherID = req.query.teacherID
    console.log(date);
    console.log(teacherID);
    
    // get current Date,Time
    var currentDate = req.query.clientCurrentDate
    var currentTime = req.query.clientCurrentTime

    console.log( currentDate );
    console.log(currentTime);


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

router.post('/addNewStudents',async function (req,res) {
  var uqID = req.body.uqID
  var teacherID = req.body.teacherID
  var studentData = req.body.studentList

  
  
  // add students to Student collections and add classrooms
  studentData.forEach(async (doc) => {
    var setDocRef = db.collection('Students').doc(doc.id.toString())
    var getDocRef = await db.collection('Students').doc(doc.id.toString()).get();
    
    if(!getDocRef.exists){
       var temp1 = {}
      temp1.id = doc.id
      temp1.name = doc.name
      temp1.faceListID = null
      temp1.classroom = []
      temp1.classroom.push({classUqID:uqID,teacherID:teacherID})
      console.log(temp1);
      await setDocRef.set(temp1);
    }else{
      
      var temp2 = getDocRef.data()
      temp2.classroom.push({classUqID:uqID,teacherID:teacherID})
      console.log(temp2);
      await setDocRef.set(temp2);

    }
   

   

    
    
  });

 
  
  // prepare student data for statistics field (default data)
  var statisticsData = {}

    const registeredDayRef = db.collection('Classroom').doc(teacherID).collection('sessions').doc(uqID)
    const doc = await registeredDayRef.get()
    
    doc.data().registeredDay.forEach(async date => {
      var myStdArr = []
      studentData.forEach(data => {
        var myStdObj = {}
        myStdObj.studentID = data.id
        myStdObj.studentName = data.name
        myStdObj.isChecked = false
        myStdObj.timestamp = null
        myStdArr.push(myStdObj)
      })
      statisticsData[date] = myStdArr
    })
    

  // add data to statistics field and set isStudentAdded = true
  const docRef =  db.collection('Classroom').doc(teacherID)
  .collection('sessions').doc(uqID)

  await docRef.update({
    statistics : statisticsData,
    isStudentAdded:true
  });


  

  res.send({status:"Success"})



})

router.post('/editClassDetail',async function(req,res) {
  
  const uqID = req.body.ClassUqId
  const teacherID = req.body.ClassTeacherId
  const editClassID = req.body.editClassId
  const editClassName = req.body.editClassName
  const editClassStartTime = req.body.editClassStartTime
  const editClassEndTime = req.body.editClassEndTime
  const editClassSemester = req.body.editClassSemester
  const editClassDesc = req.body.editClassDesc

  const Ref = db.collection("Classroom").doc(teacherID).collection('sessions').doc(uqID)

  await Ref.update(
    {
      name:editClassName,
      id:editClassID,
      startTime:editClassStartTime,
      endTime:editClassEndTime,
      semester:editClassSemester,
      desc:editClassDesc
    }
  )

  console.log(uqID);
  console.log(teacherID);
  console.log(editClassDesc);
  console.log(editClassName);
  console.log(editClassStartTime);
  console.log(editClassEndTime);
  console.log(editClassID);
  console.log(editClassSemester);
  res.send({response:"Success"})
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