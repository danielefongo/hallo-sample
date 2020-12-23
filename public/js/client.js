import '../css/style.scss';
import HalloClient from 'hallo-client'

let mediaConstraints = {
  audio: false,
  video: { width: 480, height: 270 },
}

const iceServers = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
}

const hallo = new HalloClient(iceServers)

let localStream
let streams = new Set()

function addLocalStream(stream) {
  localStream = stream
  render()
}

function addRemoteStream(stream) {
  streams.add(stream)
  render()
}

function removeRemoteStream(stream) {
  streams.delete(stream)
  render()
}

window.addEventListener('beforeunload', (event) => {
  hallo.leave()
  event.preventDefault();
  return undefined
});

function render() {
  let html = `<video class="video" id="local-video" autoplay="autoplay" muted></video>`

  html += [...streams].reduce((prev, stream) => {
    return prev + `<video class="video" id="${stream.id}" autoplay="autoplay"></video>`
  }, "")

  document.getElementById('videos').innerHTML = html

  document.getElementById("local-video").srcObject = localStream
  streams.forEach(stream => {
    document.getElementById(stream.id).srcObject = stream
  }, "")
}

hallo.join(window.location.pathname, mediaConstraints, {addLocalStream, addRemoteStream, removeRemoteStream})

document.getElementById('toggle').addEventListener('click', () => {
  mediaConstraints.audio = !mediaConstraints.audio
  hallo.changeConstraints(mediaConstraints)
})