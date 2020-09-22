import { PORT, app } from './app'
import SocketIO from 'socket.io'

const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

const io = SocketIO(server)

io.on('connect', (socket) => {
  socket.on('salutations', (...data) => {
    console.log(data)
  })

  socket.on('card', (...data) => {
    socket.broadcast.emit('card', {
      ...data,
    })
  })
})

export { io as socket }
