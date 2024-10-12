
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PendingRequest = () => {
    const [pendingRequests, setPendingRequests] = useState([]); 
    const token = localStorage.getItem('token'); 

    useEffect(() => {
        const fetchPendingRequests = async () => {
            if (!token) {
                console.error('No token found in localStorage');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/api/auth/pending-requests', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log('API Response:', response.data);

                if (response.data && response.data.pendingRequests) {
                    setPendingRequests(response.data.pendingRequests);
                } else {
                    console.warn('Unexpected response structure:', response.data);
                    setPendingRequests([]); 
                }
            } catch (error) {
                console.error('Error fetching pending friend requests:', error);
            }
        };

        fetchPendingRequests();
    }, [token]);

    const acceptFriendRequest = async (requestID) => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            console.error('No token found in localStorage');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:5000/api/auth/accept-request',
                { id: requestID },  
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            console.log('Friend request accepted:', response.data);
            setPendingRequests((prev) =>
                prev.filter((request) => request.userId !== requestID) 
            );

            alert('Friend request accepted!');
        } catch (error) {
            if (error.response) {
                console.error('Error accepting friend request:', error.response.data);
            } else {
                console.error('Error sending friend request:', error.message);
            }
        }
    };

    return (
        <div>
            <h3>Pending Friend Requests</h3>
            <ul>
                {pendingRequests.length > 0 ? (
                    pendingRequests.map(request => (
                        <li key={request.userId}>
                            {request.username} 
                            <button onClick={() => acceptFriendRequest(request.userId)}>Accept Friend Request</button>
                        </li>
                    ))
                ) : (
                    <p>No pending friend requests</p>
                )}
            </ul>
        </div>
    );
};

export default PendingRequest;
