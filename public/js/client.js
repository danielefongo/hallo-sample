import '../css/style.scss';
import HalloClient from 'hallo-client'

const iceServers = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' }
  ]
}

const hallo = new HalloClient(iceServers)
let localStream

function addLocalStream(stream) {
  localStream = stream
  document.getElementById("local-video").srcObject = stream
}

function addRemoteStream(stream) {
  if(document.getElementById(stream.id)) return

  const div = `<video class="video" id="${stream.id}" autoplay="autoplay"></video>`
  document.getElementById("videos").innerHTML += div
  document.getElementById(stream.id).srcObject = stream
  document.getElementById("local-video").srcObject = localStream
}

function removeRemoteStream(stream) {
  if(!document.getElementById(stream.id)) return

  const element = document.getElementById(stream.id)
  element.parentNode.removeChild(element)
  document.getElementById("local-video").srcObject = localStream
}

window.addEventListener('beforeunload', (event) => {
  hallo.leave()
  event.preventDefault();
  return undefined
});

const audioOnly = () => navigator.mediaDevices.getUserMedia({ audio: true })
const webcam = () => navigator.mediaDevices.getUserMedia({ audio: true, video: true })
const monitor = () => navigator.mediaDevices.getDisplayMedia({ audio: true, video: {displaySurface: "monitor"} })

hallo.join(window.location.pathname, audioOnly, {addLocalStream, addRemoteStream, removeRemoteStream})

document.getElementById('show-monitor').onclick = () => hallo.changeMediaLambda(monitor)
document.getElementById('show-webcam').onclick = () => hallo.changeMediaLambda(webcam)
document.getElementById('toggle-video').onclick = () => {
  localStream.getVideoTracks()[0].enabled = !localStream.getVideoTracks()[0].enabled
}