import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const FriendList = () => {
    const { user } = useAuth();
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        const fetchFriends = async () => {
            if (user) {
                try {
                    const response = await axios.get('http://localhost:5000/api/auth/friends', {
                        headers: { Authorization: `Bearer ${user.token}` } // Ensure token is included
                    });
                    setFriends(response.data);
                } catch (error) {
                    console.error('Error fetching friends:', error);
                }
            }
        };

        fetchFriends();
    }, [user]);

    return (
        <div>
            <h3>Friends</h3>
            <ul>
                {friends.map(friend => (
                    <li key={friend._id}>{friend.username}</li>
                ))}
            </ul>
        </div>
    );
};

export default FriendList;

