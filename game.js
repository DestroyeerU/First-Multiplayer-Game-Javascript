export default function createGame() {
  const state = {
    players: {},
    fruits: {},
    screen: {
      width: 10,
      height: 10
    }
  }

  function addPlayer(command) {
    const {playerId, playerX, playerY} = command

    state.players[playerId] = {
      x: playerX,
      y: playerY,
    }
  }

  function removePlayer(command) {
    const {playerId} = command

    delete state.players[playerId]
  }

  function addFruit(command) {
    const {fruitId, fruitX, fruitY} = command

    state.fruits[fruitId] = {
      x: fruitX,
      y: fruitY,
    }
  }

  function removeFruit(command) {
    const {fruitId} = command

    delete state.fruits[fruitId]
  }

  function checkForFruitCollision(playerId) {
    const player = state.players[playerId]

    for(const fruitId in state.fruits) {
      const fruit = state.fruits[fruitId]

      if (player.x === fruit.x && player.y === fruit.y) {
        removeFruit({ fruitId })
      }
    }
  }

  function movePlayer(command) {
    const acceptedMoves = {
      ArrowUp(player) {
        if (player.y -1 >= 0) {
          player.y -= 1
        }
      },
      ArrowDown(player) {
        if (player.y + 1 < state.screen.height) {
          player.y += 1
        }
      },
      ArrowRight(player) {
        if (player.x + 1 < state.screen.width) {
          player.x += 1
        }
      },
      ArrowLeft(player) {
        if (player.x - 1 >= 0) {
          player.x -= 1
        }
      },
    }

    const {playerId, keyPressed} = command
    const player = state.players[playerId]
    const moveFunction = acceptedMoves[keyPressed]

    if (player && moveFunction) {
      moveFunction(player)
      checkForFruitCollision(playerId)
    }
  }

  return {
    state,
    movePlayer,
    addPlayer,
    removePlayer,
    addFruit,
    removeFruit
  }
}
