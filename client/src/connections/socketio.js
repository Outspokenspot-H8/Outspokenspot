import { io } from 'socket.io-client'

export const server = "https://outspokenspot-h8.herokuapp.com/"

export const socket = io(server)