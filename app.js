const http = require('http')
const https = require('https');
const fs = require('fs');
const app = require('./bootstrap')
const port = process.env.PORT || 3000
const portSecure = process.env.PORT_SECURE || 443

http.createServer(app).listen(port, () => {
  console.log(`Listen the app at :${port}`)
})

https.createServer({
  key: fs.readFileSync('./cert/key.pem'),
  cert: fs.readFileSync('./cert/cert.pem'),
  passphrase: '6C76oymytoXk'
}, app)
.listen(portSecure,  () => {
  console.log(`Listen the secure app at :${portSecure}`)
});