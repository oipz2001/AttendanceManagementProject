
const hostIP = '192.168.0.100'

const localEndpointTeacher = 'http://'+hostIP+':5000/studentchecking/us-central1/checkapp/mobileApp/teachers'
const remoteEndpointTeacher = 'https://us-central1-studentchecking.cloudfunctions.net/checkapp/mobileApp/teachers'

const localEndpointStudent = 'http://'+hostIP+':5000/studentchecking/us-central1/checkapp/mobileApp/students'
const remoteEndpointStudent = 'https://us-central1-studentchecking.cloudfunctions.net/checkapp/mobileApp/students'

// const endpointDefault = 'http://'+hostIP+':5000/studentchecking/us-central1/checkapp'
const endpointDefault = 'https://us-central1-studentchecking.cloudfunctions.net/checkapp'

// const myEndpointTeacher = localEndpointTeacher
// const myEndpointStudent = localEndpointStudent

const myEndpointStudent = remoteEndpointStudent
const myEndpointTeacher = remoteEndpointTeacher

module.exports = {myEndpointTeacher,myEndpointStudent,endpointDefault}