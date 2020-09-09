export default function renderScreen(screen, game, requestAnimationFrame, currentPlayerId) {
  const context = screen.getContext('2d')

  context.fillStyle = 'white'
  context.clearRect(0, 0, 10, 10)

  const { players, fruits } = game.state;

  for (const playerId in players) {
    const player = players[playerId]

    context.fillStyle = 'black'
    context.fillRect(player.x, player.y, 1, 1)
  }

  for (const fruitId in fruits) {
    const fruit = fruits[fruitId]

    context.fillStyle = 'green'
    context.fillRect(fruit.x, fruit.y, 1, 1)
  }

  const currentPlayer = players[currentPlayerId]

  if (currentPlayer) {
    context.fillStyle = '#f0db4f'
    context.fillRect(currentPlayer.x, currentPlayer.y, 1, 1)
  }

  requestAnimationFrame(() => {
    renderScreen(screen, game, requestAnimationFrame, currentPlayerId)
  })
}
