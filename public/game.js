export default function createGame() {
  const state = {
    players: {},
    fruits: {},
    screen: {
      width: 10,
      height: 10
    }
  }

  const observers = []

  function start() {
    const frequency = 2000

    setInterval(addFruit, frequency)
  }

  function subscribe(observerFunction) {
    observers.push(observerFunction)
  }

  function notifyAll(command) {
    for (const observer of observers) {
      observer(command)
    }
  }

  function setState(newState) {
    Object.assign(state, newState)
  }

  function addPlayer(command) {
    // console.log(command);

    const { playerId, playerX, playerY } = command

    const x = playerX || Math.floor(Math.random() * state.screen.width)
    const y = playerY || Math.floor(Math.random() * state.screen.height)

    state.players[playerId] = { x, y }

    notifyAll({
      type: 'add-player',
      playerId,
      playerX: x,
      playerY: y,
    })
  }

  function removePlayer(command) {
    const { playerId } = command

    delete state.players[playerId]

    notifyAll({
      type: 'remove-player',
      playerId,
    })
  }

  function addFruit(command) {
    const fruitId= command ? command.fruitId : Math.floor(Math.random() * 100000)
    const x = command ? command.fruitX : Math.floor(Math.random() * state.screen.width)
    const y = command ? command.fruitY : Math.floor(Math.random() * state.screen.height)

    state.fruits[fruitId] = { x, y }

    notifyAll({
      type: 'add-fruit',
      fruitId,
      fruitX: x,
      fruitY: y,
    })
  }

  function removeFruit(command) {
    const { fruitId } = command

    delete state.fruits[fruitId]

    notifyAll({
      type: 'remove-fruit',
      fruitId,
    })
  }

  function checkForFruitCollision(playerId) {
    const player = state.players[playerId]

    for (const fruitId in state.fruits) {
      const fruit = state.fruits[fruitId]

      if (player.x === fruit.x && player.y === fruit.y) {
        removeFruit({ fruitId })
      }
    }
  }

  function movePlayer(command) {
    notifyAll(command)

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
    start,
    subscribe,
    notifyAll,
    setState,
    movePlayer,
    addPlayer,
    removePlayer,
    addFruit,
    removeFruit
  }
}
