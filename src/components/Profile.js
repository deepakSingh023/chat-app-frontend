import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Import your auth context
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For navigation



const Profile = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate(); // For navigation
    
    // Search for users
    const handleSearch = async () => {
        const token = localStorage.getItem('token'); // Retrieve the token only once
    
        if (!token) {
            console.error('No token found in localStorage');
            return;
        }
        if (searchTerm) {
            try {
                const response = await axios.get(`http://localhost:5000/api/auth/search?name=${searchTerm}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSearchResults(response.data);
            } catch (error) {
                console.error('Error searching users:', error);
            }
        }
    };
    
    

    const sendFriendRequest = async (friendId) => {
        const token = localStorage.getItem('token'); // Ensure you're retrieving the token correctly
        
        if (!token) {
            console.error('No token found in localStorage');
            return;
        }
    
        // Log the friendId to ensure it's valid
        const senderId=user._id;
        console.log('Sending friend request for ID:', friendId);
        console.log('Sending friend request for ID:', user._id);
        try {
            const response = await axios.post(
                'http://localhost:5000/api/auth/friend-request',
                { recieverID: friendId ,senderId}, // Make sure this matches what the backend expects
                {
                    headers: { Authorization: `Bearer ${token}` } // Use the token from localStorage
                }
            );
    
            // Log the server response to check if it's successful
            console.log('Friend request sent:', response.data);
            alert('Friend request sent!');
        } catch (error) {
            // Log error details for debugging
            if (error.response) {
                console.error('Error sending friend request:', error.response.data); // Backend response
            } else {
                console.error('Error sending friend request:', error.message); // General error
            }
        }
    };
    
    // Navigate to the friend requests page
    const goToPendingRequests = () => {
        navigate('/PendingRequest'); // Adjust the route accordingly
    };

    // Navigate to the friend list page
    const goToFriendList = () => {
        navigate('/FriendList'); // Adjust the route accordingly
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Home</h1>
            <input
                type="text"
                placeholder="Search for users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>

            <h2>Search Results</h2>
            <ul>
                {searchResults.length > 0 ? (
                    searchResults.map(user => (
                        <li key={user._id}>
                            {user.username} 
                            <button onClick={() => sendFriendRequest(user._id)}>Send Friend Request</button>
                        </li>
                    ))
                ) : (
                    <li>No users found</li>
                )}
            </ul>

            <button onClick={goToPendingRequests}>View Pending Friend Requests</button>
            <button onClick={goToFriendList}>View Friends List</button>
        </div>
    );
};

export default Profile;
