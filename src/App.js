import './App.css';
import { useState } from 'react'
import io from 'socket.io-client'
import Chat from './Component/Chat';

const socket = io.connect("http://localhost:8080")


function App() {

  const [username, setUserName] = useState("")
  const [room, setRoom] = useState("")
  const [showChat, setShowChat] = useState(false)

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      const userData={
        username: username,
        room: room,
      }
      socket.emit("joinRoom", userData)
      setShowChat(true)
    }
  }

  
  return (
    <div className="App">
      {!showChat ?(<div className="joinChatContainer">
      <h3>Join a Chat</h3>
      <div className="joinForm">
      <input type="text" placeholder="Enter the Name" onChange={(e) => { setUserName(e.target.value) }} />
      <input type="text" placeholder="Room id" onChange={(e) => { setRoom(e.target.value) }} />
      <button onClick={joinRoom}>Join A Room</button>
      </div>
      </div>):
       (<Chat socket={socket} username={username} room={room}/>)}
    </div>
  );
}

export default App;
