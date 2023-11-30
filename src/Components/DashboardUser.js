import React, { useEffect, useState } from 'react'
import { useAuth } from '../Context/AuthContext';
import { Box, Dialog, DialogContent, DialogContentText, DialogTitle, List, ListItemText } from '@mui/material';
import styles from './DashboardUser.module.css'

const NotificationBar = {
    position: 'absolute',
    top: 0,
    background: 'blue',
    width: '100%',
    textAlign: 'center',
    margin: 0,
    padding: '10px 0',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    zIndex: 1000
}

const tempnotification = [
    {
        title: 'Your account is created',
        date: '20/05/30',
        time: '12:45PM',
        status: 'read',
        description: 'lorem ipsum dkfndj fdsjfnmn dfdfknloremmd dsfkndxdeertr errre trrt'
    },
    {
        title: 'New Message Received',
        date: '20/06/01',
        time: '2:30PM',
        status: 'read',
        description: 'You have a new message from a friend.'
    },
    {
        title: 'Event Reminder',
        date: '20/06/05',
        time: '10:00AM',
        status: 'unread',
        description: 'Reminder: Attend the important event.'
    },
    {
        title: 'Your account is created',
        date: '20/05/30',
        time: '12:45PM',
        status: 'read',
        description: 'lorem ipsum dkfndj fdsjfnmn dfdfknloremmd dsfkndxdeertr errre trrt'
    },
    {
        title: 'New Message Received',
        date: '20/06/01',
        time: '2:30PM',
        status: 'unread',
        description: 'You have a new message from a friend.'
    },
    {
        title: 'Event Reminder',
        date: '20/06/05',
        time: '10:00AM',
        status: 'read',
        description: 'Reminder: Attend the important event.'
    },
    {
        title: 'Upcoming Deadline',
        date: '20/06/10',
        time: '3:00PM',
        status: 'unread',
        description: 'Deadline approaching. Finish your tasks on time.'
    },
    {
        title: 'Product Launch',
        date: '20/06/15',
        time: '1:00PM',
        status: 'read',
        description: 'Exciting news! Our new product is launching soon.'
    },
    {
        title: 'Upcoming Deadline',
        date: '20/06/10',
        time: '3:00PM',
        status: 'read',
        description: 'Deadline approaching. Finish your tasks on time.'
    },
    {
        title: 'Product Launch',
        date: '20/06/15',
        time: '1:00PM',
        status: 'unread',
        description: 'Exciting news! Our new product is launching soon.'
    },
]


const DashboardUser = () => {

    const data = useAuth();
    const [popup, setPopup] = useState(false);
    const [notification, setNotification] = useState({});
    const [updatedNotification, setUpdatedNotification] = useState([...tempnotification]);

    useEffect(() => {
        console.log('Component mounted');

        console.log(data);

        // Clean-up function
        return () => {
            // Additional clean-up logic if needed
            console.log('Component is unmounting or dependency changed');
        };
    }, [data.auth]);



    const handleNotificationPopup = (id) => {
        const updatedNotifications = tempnotification.map((item, index) =>
          index === id ? { ...item, status: 'read' } : item
        );
      
        setUpdatedNotification(updatedNotifications);
        setPopup(true);
      
        // Use the updatedNotifications array instead of tempnotification
        const notificationPopup = updatedNotifications.find((item, index) => index === id);
        setNotification(() => ({
          ...notificationPopup,
        }));
      };
      

    const handleClosePopup = ()=> {
        setPopup(false);
    }

    return (
        <>
            {/* {data.auth ? (
    <Box sx={{background: 'red'}}>
        
    </Box>
    ): <Navigate to={'/'} replace/>
    } */}

            <Box sx={{ background: 'red', width: '100%', height: '100%' }} display={'flex'} alignItems={'center'} justifyContent={'center'} >
                <Box width={'70%'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    dsdfg
                </Box>
                <Box width={'30%'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <Box position={'relative'} width={'calc(100% - 80px)'} height={'calc(100vh - 100px)'} sx={{ background: 'white', boxShadow: '5px 6px 10px #0000002e' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'} >
                        <h4 style={NotificationBar}>Notifcation Bar</h4>
                        <List sx={{
                            width: '100%',
                            height: 'calc(100% - 60px)',
                            overflowY: 'auto',
                            paddingTop: '30px'
                        }}>
                            {
                                updatedNotification.map((item, index) => {
                                    return <ListItemText key={index}
                                        className= {item.status === 'unread' ? styles.readMessage : styles.unreadMessage}
                                        primary={item.title}
                                        secondary={`${item.date} ${item.time}`}
                                        sx={{background: '#f9f9a3', padding: '5px 20px', margin: 0, borderBottom: '1px solid #000'}}
                                        onClick={()=> handleNotificationPopup(index)}
                                    />
                                })
                            }
                        </List>
                    </Box>
                </Box>
            </Box>
            <Dialog open={popup} onClose={handleClosePopup}>
                <DialogTitle>{notification.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    <Box>
                        {notification.description}
                    </Box>
                    <Box>
                        {notification.date}
                        {notification.time}
                    </Box>
                    </DialogContentText>
                    
                </DialogContent>
            </Dialog>
        </>
    )
}

export default DashboardUser