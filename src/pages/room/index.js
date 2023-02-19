import React, {useEffect, useState} from 'react';
import io from 'socket.io-client';

function Room(props) {
    const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const socket = io();

    socket.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleMessageSubmit = (event) => {
    event.preventDefault();
    const socket = io();
    socket.emit('message', inputValue);
    setInputValue('');
  };

  return (
    <div>
      <h1>Hello, world!</h1>
      <form onSubmit={handleMessageSubmit}>
        <input type="text" value={inputValue} onChange={(event) => setInputValue(event.target.value)} />
        <button type="submit">Send</button>
      </form>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
}



Room.getInitialProps = ({query}) => {
    console.log(query)
    return {myParams: query}
}


export default Room;