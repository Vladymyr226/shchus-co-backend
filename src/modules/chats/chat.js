import { Server } from 'socket.io'

export const setupChatSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
    },
  })

  io.on('connection', (socket) => {
    console.log('A user connected')

    socket.on('CHAT_MESSAGE', ({ message }) => {
      console.log(message)
      io.emit('CHAT_UPDATE', { message })
    })

    socket.on('disconnect', () => {
      console.log('User disconnected')
    })
  })

  return io
}
