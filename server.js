import express from 'express'
import http from 'http'
import socketio from 'socket.io'

import createGame from './public/game.js'

const app = express()
const server = http.createServer(app)
const socket = socketio(server)

app.use(express.static('public'))

const game = createGame()
game.start()

game.subscribe((command) => {
  console.log('> Emitting ' + command.type)
  socket.emit(command.type, command)
})

socket.on('connection', (client) => {
  const playerId = client.id
  console.log(`Player connected on Server with id: ${playerId}`)

  game.addPlayer({ playerId })

  client.emit('setup', game.state)

  client.on('move-player', (command) => {
     command.playerId = playerId // Cause do not have authentication
     command.type = 'move-player' // Cause do not have authentication

     game.movePlayer(command)
  })

  client.on('disconnect', () => {
    game.removePlayer({ playerId })
    console.log(`Player disconnected on Server with id: ${playerId}`)
  })
})

server.listen('3000', () => {
  console.log('Server listening on port: 3000')
})
