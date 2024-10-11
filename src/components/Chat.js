import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Update with your server URL

const ChatApp = ({ currentUser, selectedFriend }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            if (!currentUser || !selectedFriend) {
                console.error('Current user or selected friend is not defined');
                return;
            }

            const response = await fetch(`/messages/${currentUser._id}/${selectedFriend._id}`);
            const data = await response.json();
            setMessages(data);
        };

        fetchMessages();

        // Set up socket listener for incoming messages
        socket.on('receiveMessage', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        return () => {
            socket.off('receiveMessage'); // Clean up the socket listener on unmount
        };
    }, [currentUser, selectedFriend]);

    const sendMessage = async () => {
        if (!currentUser || !selectedFriend) {
            console.error('Current user or selected friend is not defined');
            return;
        }

        const messageData = {
            senderId: currentUser._id,
            receiverId: selectedFriend._id,
            content: message,
        };

        // Emit the message via Socket.io
        socket.emit('sendMessage', messageData);
        setMessage(''); // Clear the input after sending the message
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h1>Live Chat</h1>
            <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '20px', border: '1px solid #ddd', padding: '10px' }}>
                {messages.map((msg) => (
                    <div key={msg._id} style={{ margin: '5px 0' }}>
                        <strong>{msg.sender.username}: </strong>
                        {msg.content}
                        <span style={{ marginLeft: '10px', fontSize: 'small', color: 'gray' }}>
                            {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ width: '70%', padding: '10px', marginRight: '10px' }}
            />
            <button onClick={sendMessage} style={{ padding: '10px 20px' }}>Send</button>
        </div>
    );
};

export default ChatApp;
