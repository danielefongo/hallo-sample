import '../css/style.scss';
import HalloClient from 'hallo-client'
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

const username = uniqueNamesGenerator({dictionaries: [colors, adjectives, animals]})

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

function alreadyJoined({username, room}) {
  alert(`${username} already joined on ${room}`)
}

function addLocalTrack(username, track) {
  if(track.kind !== 'video') return

  const stream = new MediaStream([track])
  document.getElementById("local-video").srcObject = stream
  document.getElementById("local-username").innerHTML = username
}

function removeLocalTrack(username, track) {
  if(track.kind !== 'video') return

  document.getElementById("local-video").srcObject = undefined
}

function addRemoteTrack(username, track) {
  if(track.kind !== 'video') return

  remoteVideoStreams[track.id] = {
    username,
    media: new MediaStream([track])
  }
  renderRemoteTracks()
}

function removeRemoteTrack(username, track) {
  if(track.kind !== 'video') return

  delete remoteVideoStreams[track.id]
  renderRemoteTracks()
}

function renderRemoteTracks() {
  const streams = Object.values(remoteVideoStreams)

  document.getElementById('videos').innerHTML = streams.reduce((prev, {media, username}) => {
    return prev + `
      <div class="video-container">
        <span>${username}</span>
        <video class="video" id="${media.id}" autoplay="autoplay"></video>
      </div>`
  }, "")

  streams.forEach(({media}) => {
    document.getElementById(media.id).srcObject = media
  }, "")
}

window.addEventListener('beforeunload', () => hallo.leave() && undefined);

const webcam = () => navigator.mediaDevices.getUserMedia({ video: true })
const monitor = () => navigator.mediaDevices.getDisplayMedia({ video: {displaySurface: "monitor"} })

hallo.join(username, window.location.pathname, webcam, {
  addLocalTrack,
  removeLocalTrack,
  addRemoteTrack,
  removeRemoteTrack,
  alreadyJoined
})

document.getElementById('show-monitor').onclick = () => hallo.changeMediaLambda(monitor)
document.getElementById('show-webcam').onclick = () => hallo.changeMediaLambda(webcam)