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
let remoteVideoStreams = {}

function addLocalTrack(track) {
  if(track.kind !== 'video') return

  const stream = new MediaStream([track])
  document.getElementById("local-video").srcObject = stream
}

function removeLocalTrack(track) {
  if(track.kind !== 'video') return

  document.getElementById("local-video").srcObject = undefined
}

function addRemoteTrack(track) {
  if(track.kind !== 'video') return

  remoteVideoStreams[track.id] = new MediaStream([track])
  renderRemoteTracks()
}

function removeRemoteTrack(track) {
  if(track.kind !== 'video') return

  delete remoteVideoStreams[track.id]
  renderRemoteTracks()
}

function renderRemoteTracks() {
  const streams = Object.values(remoteVideoStreams)

  document.getElementById('videos').innerHTML = streams.reduce((prev, stream) => {
    return prev + `<video class="video" id="${stream.id}" autoplay="autoplay"></video>`
  }, "")

  streams.forEach(stream => {
    document.getElementById(stream.id).srcObject = stream
  }, "")
}

window.addEventListener('beforeunload', () => hallo.leave() && undefined);

const webcam = () => navigator.mediaDevices.getUserMedia({ video: true })
const monitor = () => navigator.mediaDevices.getDisplayMedia({ video: {displaySurface: "monitor"} })

hallo.join(window.location.pathname, webcam, {addLocalTrack, removeLocalTrack, addRemoteTrack, removeRemoteTrack})

document.getElementById('show-monitor').onclick = () => hallo.changeMediaLambda(monitor)
document.getElementById('show-webcam').onclick = () => hallo.changeMediaLambda(webcam)