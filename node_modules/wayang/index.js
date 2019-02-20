var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
require('./routes')(app)
var makeClass = require('./utils/makeClass')

const clickOpt = {
  button: 'left',
  delay: 1000,
}
const screenOpt = {
  path: __dirname+'/public/screencap.png'
}

function dalang(option) {
  this.listenToDalang = async function(callback) {
    http.listen(3388, function() {
      console.log('dalang-web on localhost:3388');
    });
    io.on('connection', function(socket) {
      socket.on('callback',function(action){
        callback && callback(action)
      })
      socket.on('hiserver', async function(msg) {
        if (msg == 'screencap') {
          await option.page.screenshot(screenOpt)
          console.log("done")
          await socket.emit('hiweb', 'refresh')
          console.log("sent refresh")
        }
      })
      socket.on('fill', function(data) {
        data = JSON.parse(data)
        console.log(data)
        option.page.evaluate(function(rclass, text) {
          document.querySelector('.' + rclass).value = text
        }, data.rclass, data.text).then(async function() {
          await option.page.screenshot(screenOpt)
          await socket.emit('hiweb', 'refresh')
        })
      })
      socket.on('event', function(data) {
        data = JSON.parse(data)
        if (data.click) {
          let rclass = makeClass()
          option.page.mouse.click(data.x, data.y).then(function() {
            option.page.evaluate(function() {
              var p = Promise
              document.addEventListener("DOMNodeInserted", function(e) {
                return p.resolve()
              }, false);
            }).then(function() {
              option.page.evaluate(function(x, y,rclass) {
                document.elementFromPoint(x, y).classList.add(rclass)
                if (document.elementFromPoint(x, y).getAttribute('type') == "text" || document.elementFromPoint(x, y).getAttribute('type') == "password") {
                  return Promise.resolve('input')
                }
                return Promise.resolve('')
              }, data.x, data.y,rclass).then(async function(type) {
                if (type == "input") {
                  console.log("INPUT")
                  socket.emit('input', rclass)
                }
                await option.page.screenshot(screenOpt)
                await socket.emit('hiweb', 'refresh')
              })
            })
          })

        }
      })
    });
  }
}

module.exports = dalang
