


const functions = require('firebase-functions');
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




const key = '8b4bdfc570514b1d9e71628238368e3e'

var mobileAppTeacher = require('./mobileAppTeacher')
app.use('/mobileApp/teachers', mobileAppTeacher)

var mobileAppStudents = require('./mobileAppStudents')
app.use('/mobileApp/students', mobileAppStudents)

var webApp = require('./webApp')
app.use('/webApp', webApp)


// exports.generateThumbnail = functions.storage.object().onFinalize(async (object) => {

//   async function mediaLinkToDownloadableUrl(object) {
//     var firstPartUrl = object.mediaLink.split("?")[0] // 'https://www.googleapis.com/download/storage/v1/b/abcbucket.appspot.com/o/songs%2Fsong1.mp3.mp3'
//     var secondPartUrl = object.mediaLink.split("?")[1] // 'generation=123445678912345&alt=media'
  
//     firstPartUrl = firstPartUrl.replace("https://www.googleapis.com/download/storage", "https://firebasestorage.googleapis.com")
//     firstPartUrl = firstPartUrl.replace("v1", "v0")
  
//     firstPartUrl += "?" + secondPartUrl.split("&")[1]; // 'alt=media'
//     firstPartUrl += "&token=" + object.metadata.firebaseStorageDownloadTokens

    
  
//     return firstPartUrl
//   }

  
 

//   async function DetectFace(imageURL) { //convert face image to face id
//     const config = {
//         method: 'post',
//         url: 'https://southeastasia.api.cognitive.microsoft.com/face/v1.0/detect',
//         headers: { 'Ocp-Apim-Subscription-Key': key },
//         params: {returnFaceId:true },
//         data:{
//             url : imageURL
//             }
//     }
//     let res = await axios(config)
//     let data = res.data
//     return data[0].faceId
// }

// async function FindSimilarity(faceId,faceListId) { //convert face image to face id
//     const config = {
//         method: 'post',
//         url: 'https://southeastasia.api.cognitive.microsoft.com/face/v1.0/findsimilars',
//         headers: { 'Ocp-Apim-Subscription-Key': key },
//         params: {returnFaceId:true },
//         data:{
//             faceId: faceId,
//             faceListId: faceListId
//         }
//     }
//     let res = await axios(config)
//     let data = res.data
//     return data

// }

// async function CreateFaceList(faceListId,faceName) { //Create empty face list id
//     const config = {
//         method: 'put',
//         url:'https://southeastasia.api.cognitive.microsoft.com/face/v1.0/facelists/'+faceListId,
//         headers: { 'Ocp-Apim-Subscription-Key': key },
//         data:{
//             name : faceName
//         }
//     }
//     let res = await axios(config)
//     console.log('Your ('+faceListId+') face list id has created');
// }

// async function ListFaceList() { //Get whole face list 
//     const config = {
//         method: 'get',
//         url:'https://southeastasia.api.cognitive.microsoft.com/face/v1.0/facelists',
//         headers: { 'Ocp-Apim-Subscription-Key': key }
//     }
//     let res = await axios(config)
//     let data = res.data
//     console.log( data);
// }

// async function GetFaceList(faceListId) { //Get information from specific face list id
//     const config = {
//         method: 'get',
//         url:'https://southeastasia.api.cognitive.microsoft.com/face/v1.0/facelists/'+faceListId,
//         headers: { 'Ocp-Apim-Subscription-Key': key },
//         params: {returnRecognitionModel: false }
//     }
//     let res = await axios(config)
//     let data = res.data
//     console.log( data);
// }


// async function AddToFaceList(faceListId,imageURL) { // Add URL image to specific face list id
//     const config = {
//         method: 'post',
//         url: 'https://southeastasia.api.cognitive.microsoft.com/face/v1.0/facelists/'+faceListId+'//persistedFaces',
//         headers: { 'Ocp-Apim-Subscription-Key': key },
//         data:{
//             url : imageURL

//         }
//     }
//     let res = await axios(config)
//     let data = res.data
//     // console.log( data);
//     return data
// }

// async function DeleteFaceList(faceListId) { //Delete specific face list id
//     const config = {
//         method: 'delete',
//         url:'https://southeastasia.api.cognitive.microsoft.com/face/v1.0/facelists/'+faceListId,
//         headers: { 'Ocp-Apim-Subscription-Key': key }
//     }
//     let res = await axios(config)
//     console.log( 'Your ('+faceListId+') face list id has removed');
// }

// async function ImageURL_FaceListID_FindSimilar(imageURL,faceListId) {
//     var faceId = await DetectFace(imageURL)
//     var result = await FindSimilarity(faceId,faceListId)
//     return result
// }

// async function makeRequest() { 
    
//     var splitStr = object.name.split("|")  
//     var faceListID = splitStr[0]
//     var func = splitStr[1]
//     var glob_imageURL = ''
//   await mediaLinkToDownloadableUrl(object).then(imageURL => {
//       glob_imageURL = imageURL
//   })
// //   console.log(object);
//   console.log(glob_imageURL);
//   console.log(splitStr);
  

//   if(func == 'add'){
//         await AddToFaceList(faceListID, glob_imageURL)
//         .then(result => {
//             console.log(result);
//         })           
//   }
//   else if(func == 'match'){
//       await ImageURL_FaceListID_FindSimilar(glob_imageURL,faceListID)
//       .then(result => {
//           console.log(result);
//       })
//   }
// }

  
//   makeRequest();
  

// });



exports.checkapp = functions.https.onRequest(app);