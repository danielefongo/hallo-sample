const express = require('express')
const app = express()
const server = require('http').createServer(app)
const halloServer = require('hallo-server')
const path = require('path')

app.use('/', express.static('public'))
app.use(express.static(path.join(__dirname, "dist")));
app.get('*', (req, res) =>{
  res.sendFile(path.join(__dirname, "index.html"));
});

const port = process.env.PORT || 3000
halloServer.use(server)
server.listen(port, () => console.log(`Listening on port ${port}`))