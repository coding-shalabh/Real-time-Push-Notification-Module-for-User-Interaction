import { Box, Button, List, ListItemText } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useAuth } from '../Context/AuthContext';

const DashboardAdmin = () => {
    // State for notification popup
    const [popup, setPopup] = useState(false);
    const [notification, setNotification] = useState({});
    const [updatedNotification, setUpdatedNotification] = useState([]);

    // Authentication context
    const { auth, setAuth, userData, setData } = useAuth();

    // Handle action to mark all notifications as read
    const handleReadAll = (() => {
        setUpdatedNotification((prevNotifications) => {
            const updateNotification = prevNotifications.map((item, index) =>
                ({ ...item, status: 'read' })
            );
            return updateNotification;
        });
    });

    // Handle action to show notification popup
    const handleNotificationPopup = useCallback((id) => {
        setUpdatedNotification((prevNotifications) => {
            const updatedNotifications = prevNotifications.map((item, index) =>
                index === id ? { ...item, status: 'read' } : item
            );
            return updatedNotifications;
        });

        setPopup(true);
        const notificationPopup = updatedNotification.find((item, index) => index === id);
        setNotification(() => ({
            ...notificationPopup,
        }));
    }, [updatedNotification]);

    // Handle action to close notification popup
    const handleClosePopup = () => {
        setPopup(false);
    };

    return (
        <Box sx={{ background: '#fca311', width: '100%', height: '100%' }} display={'flex'} alignItems={'center'} justifyContent={'center'}>
            <Box width={'70%'} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                {/* Add any additional content for the admin dashboard */}
            </Box>
            <Box width={'30%'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                <Box position={'relative'} width={'calc(100% - 80px)'} height={'calc(100vh - 100px)'} sx={{ background: 'white', boxShadow: '5px 6px 10px #14213d0002e' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'} border={'1px solid #14213d'}>
                    <h4 className='NotificationBar'>Notification Bar <span><Button onClick={handleReadAll} style={{ padding: 0, color: '#fca311' }}>Read all</Button></span></h4>
                    <List sx={{
                        width: '100%',
                        height: 'calc(100% - 60px)',
                        overflowY: 'auto',
                        paddingTop: '30px'
                    }}>
                        {updatedNotification.length === 0 ? <p style={{ fontStyle: 'italic', color: 'grey', textAlign: 'center' }}>You have no notification 😊</p> :
                            updatedNotification.map((item, index) => {
                                return <ListItemText key={index}
                                    className={item.status === 'unread' ? 'readMessage' : 'unreadMessage'}
                                    primary={item.title}
                                    secondary={`${item.date} ${item.time}`}
                                    sx={{ background: '#e5e5e5', padding: '10px 20px', margin: 0, borderBottom: '1px solid #14213d' }}
                                    onClick={() => handleNotificationPopup(index)}
                                />
                            })
                        }
                    </List>
                </Box>
            </Box>
        </Box>
    );
}

export default DashboardAdmin;
