const axios = require('axios');
const { TestMatrix } = require('firebase-functions/lib/providers/testLab');

const key = '8b4bdfc570514b1d9e71628238368e3e'

async function DetectFace(imageURL) { //convert face image to face id
    const config = {
        method: 'post',
        url: 'https://southeastasia.api.cognitive.microsoft.com/face/v1.0/detect',
        headers: { 'Ocp-Apim-Subscription-Key': key  },
        params: {returnFaceId:true },
        data:{
            url : imageURL
            }
    }
    let res = await axios(config)
    let data = res.data
    return data[0].faceId
}

async function FindSimilarity(faceId,faceListId) { //convert face image to face id
    const config = {
        method: 'post',
        url: 'https://southeastasia.api.cognitive.microsoft.com/face/v1.0/findsimilars',
        headers: { 'Ocp-Apim-Subscription-Key': key },
        // params: {returnFaceId:false },
        data:{
            faceId: faceId,
            faceListId: faceListId
        }
    }
    let res = await axios(config)
    let data = res.data
    return data

}

async function CreateFaceList(faceListId,faceName) { //Create empty face list id
    const config = {
        method: 'put',
        url:'https://southeastasia.api.cognitive.microsoft.com/face/v1.0/facelists/'+faceListId,
        headers: { 'Ocp-Apim-Subscription-Key': key },
        data:{
            name : faceName
        }
    }
    let res = await axios(config)
    let data = res.data
    if(data == ''){
        console.log('Your ('+faceListId+') face list id has created');
    }
    else
    {
        console.error('Error occur');
    }

    
}

async function ListFaceList() { //Get whole face list 
    const config = {
        method: 'get',
        url:'https://southeastasia.api.cognitive.microsoft.com/face/v1.0/facelists',
        headers: { 'Ocp-Apim-Subscription-Key': key }
    }
    let res = await axios(config)
    let data = res.data
    // return data
    console.log(data);
}

async function GetFaceList(faceListId) { //Get information from specific face list id
    const config = {
        method: 'get',
        url:'https://southeastasia.api.cognitive.microsoft.com/face/v1.0/facelists/'+faceListId,
        headers: { 'Ocp-Apim-Subscription-Key': key },
        params: {returnRecognitionModel: false }
    }
    let res = await axios(config)
    let data = res.data
    console.log( data);
}


async function GetFaceList(faceListId) { //Get information from specific face list id
        const config = {
            method: 'get',
            url:'https://southeastasia.api.cognitive.microsoft.com/face/v1.0/facelists/'+faceListId,
            headers: { 'Ocp-Apim-Subscription-Key': key },
            params: {returnRecognitionModel: false }
        }
        let res = await axios(config)
        let data = res.data
        console.log( data);
}

async function AddToFaceList(faceListId,imageURL) { // Add URL image to specific face list id
    const config = {
        method: 'post',
        url: 'https://southeastasia.api.cognitive.microsoft.com/face/v1.0/facelists/'+faceListId+'/persistedFaces',
        headers: { 'Ocp-Apim-Subscription-Key': key },
        data:{
            url : imageURL

        }
    }
    let res = await axios(config)
    let data = res.data
    console.log( data);
}

async function DeleteFaceList(faceListId) { //Delete specific face list id
    const config = {
        method: 'delete',
        url:'https://southeastasia.api.cognitive.microsoft.com/face/v1.0/facelists/'+faceListId,
        headers: { 'Ocp-Apim-Subscription-Key': key }
    }
    let res = await axios(config)
    console.log( 'Your ('+faceListId+') face list id has removed');
}

async function ImageURL_FaceListID_FindSimilar(imageURL,faceListId) {
    var faceId = await DetectFace(imageURL)
    var result = await FindSimilarity(faceId,faceListId)
    return result
}
// DetectFace('https://upload.wikimedia.org/wikipedia/commons/0/07/Prayuth_2018_cropped.jpg')
// .then(result => {
//     console.log(result);
// })
// CreateFaceList('lift2542','lift2542face')
 
  
// CreateFaceList('777777','777name77')
// GetFaceList('600610750');
// AddToFaceList('lift2542','https://firebasestorage.googleapis.com/v0/b/studentchecking.appspot.com/o/lift2542?alt=media&token=e538ebba-8534-4053-bcc3-812047ee47d0')
// DeleteFaceList('lift2542')
ListFaceList()
// var imageurl = 'https://firebasestorage.googleapis.com/v0/b/studentchecking.appspot.com/o/Image?alt=media&token=91e6623d-181f-44a3-9221-75b1a8907a6d'
// ImageURL_FaceListID_FindSimilar(imageurl,'lift2542')
// .then(result => {
//     console.log(result);
// })

// FindSimilarity('aa2f32e3-97a5-4413-85d5-eb46345c4ad9','lift2542')
// .then(result => {
//     console.log(result);
// })


async function Test(){
    // await DeleteFaceList('777')
    // await DeleteFaceList('7777')
    // await DeleteFaceList('77777')
    // await DeleteFaceList('777777')
    // await DeleteFaceList('777')
    // await DeleteFaceList('7777')
    ListFaceList().then(async re => {
        await re.forEach(async element => {
            if(element.faceListId[0] == '6' ){
                await DeleteFaceList(element.faceListId)
            }
        });
    })
    

      
}

// Test()




// var url = 'https://ichef.bbci.co.uk/news/640/cpsprodpb/1020D/production/_104916066_hi050616611.jpg'
// var faceID = 'prayut'
// let matchResult = ImageURL_FaceListID_FindSimilar(url,faceID)
// matchResult.then(result => {
//     console.log(result);
// })

