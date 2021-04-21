import { io } from 'socket.io-client'

export const server = "http://localhost:4000"

export const socket = io(server)