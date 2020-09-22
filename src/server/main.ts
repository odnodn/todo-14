import { PORT, app } from './app'
import SocketIO from 'socket.io'

const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

const io = SocketIO(server)

io.on('connect', (socket) => {
  console.log('hello world!')

  socket.emit('hello_world', {
    say: 'hello!',
  })

  socket.send({
    say: 'hello!',
  })

  socket.on('salutations', (...data) => {
    console.log(data)
  })
})

export { io as socket }
