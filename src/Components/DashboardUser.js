import React, { useCallback, useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';

import { useAuth } from '../Context/AuthContext';
import { Alert, Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, List, ListItemText, OutlinedInput, TextField } from '@mui/material';
import styles from './DashboardUser.module.css';
import CreateIcon from '@mui/icons-material/Create';
import DoneIcon from '@mui/icons-material/Done';
import Requests from './Requests';

const NotificationBar = {
    position: 'absolute',
    top: 0,
    background: '#14213d',
    color: 'white',
    width: 'calc(100% - 40px)',
    textAlign: 'center',
    margin: 0,
    padding: '10px 20px',
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
}


// const tempnotification = [
//     {
//         title: 'Your account is created',
//         date: '20/05/30',
//         time: '12:45PM',
//         status: 'read',
//         description: 'lorem ipsum dkfndj fdsjfnmn dfdfknloremmd dsfkndxdeertr errre trrt'
//     },
//     {
//         title: 'New Message Received',
//         date: '20/06/01',
//         time: '2:30PM',
//         status: 'read',
//         description: 'You have a new message from a friend.'
//     },
//     {
//         title: 'Event Reminder',
//         date: '20/06/05',
//         time: '10:00AM',
//         status: 'unread',
//         description: 'Reminder: Attend the important event.'
//     },
//     {
//         title: 'Your account is created',
//         date: '20/05/30',
//         time: '12:45PM',
//         status: 'read',
//         description: 'lorem ipsum dkfndj fdsjfnmn dfdfknloremmd dsfkndxdeertr errre trrt'
//     },
//     {
//         title: 'New Message Received',
//         date: '20/06/01',
//         time: '2:30PM',
//         status: 'unread',
//         description: 'You have a new message from a friend.'
//     },
//     {
//         title: 'Event Reminder',
//         date: '20/06/05',
//         time: '10:00AM',
//         status: 'read',
//         description: 'Reminder: Attend the important event.'
//     },
//     {
//         title: 'Upcoming Deadline',
//         date: '20/06/10',
//         time: '3:00PM',
//         status: 'unread',
//         description: 'Deadline approaching. Finish your tasks on time.'
//     },
//     {
//         title: 'Product Launch',
//         date: '20/06/15',
//         time: '1:00PM',
//         status: 'read',
//         description: 'Exciting news! Our new product is launching soon.'
//     },
//     {
//         title: 'Upcoming Deadline',
//         date: '20/06/10',
//         time: '3:00PM',
//         status: 'read',
//         description: 'Deadline approaching. Finish your tasks on time.'
//     },
//     {
//         title: 'Product Launch',
//         date: '20/06/15',
//         time: '1:00PM',
//         status: 'unread',
//         description: 'Exciting news! Our new product is launching soon.'
//     },
// ]

// Use a constant for temporary notifications

const tempnotification = [];

// Component for Dashboard User
const DashboardUser = () => {
    // Authentication context
    const data = useAuth();
    const [popup, setPopup] = useState(false);
    const [notification, setNotification] = useState({});
    const [initialDataLoaded, setInitialDataLoaded] = useState(false);
    const [updatedNotification, setUpdatedNotification] = useState([]);
    const [userDetails, setUserDetails] = useState(null);
    const [editForm, setEdit] = useState(true);
    const [alert, setAlert] = useState({
        updatedDetails: false,
        sendRequests: false,
    });

    const { setAuth, userData, setData } = useAuth();
    const navigate = useNavigate();

    // Function to enable editing user details
    const editUserDetails = () => {
        setEdit(false);
        if (data) {
            setUserDetails({
                username: data.userData.username,
                password: data.userData.password,
            });
        }
    };

    // Function to handle input changes in user details
    const handleInputChange = (val, type) => {
        setUserDetails((prev) => ({
            ...prev,
            [type]: val,
        }));
    };

    // Function to save updated user data
    const saveUpdateUserData = async () => {
        setEdit(true);

        const payload = {
            ...data.userData,
            username: userDetails.username,
            password: userDetails.password,
        };

        try {
            const res = await fetch(
                `https://pushnotificationmodule-a88c5-default-rtdb.firebaseio.com/usersList/${data.userData.id}.json`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (res.ok) {
                // Display success message
                setAlert((prev) => ({
                    ...prev,
                    updatedDetails: true,
                }));
                setTimeout(() => {
                    setAlert((prev) => ({
                        ...prev,
                        updatedDetails: false,
                    }));
                }, 2000);
            }
        } catch (error) {
            console.error('Error updating user details:', error);
            // You may want to handle errors differently, such as displaying an error message to the user
        }
    };

    // Function to mark all notifications as read
    const handleReadAll = useCallback(() => {
        setUpdatedNotification((prevNotifications) =>
            prevNotifications.map((item) => ({ ...item, status: 'read' }))
        );
    }, []);

    // Function to handle notification popup
    const handleNotificationPopup = useCallback(
        (id) => {
            setUpdatedNotification((prevNotifications) =>
                prevNotifications.map((item, index) =>
                    index === id ? { ...item, status: 'read' } : item
                )
            );

            setPopup(true);
            const notificationPopup = updatedNotification.find(
                (item, index) => index === id
            );
            setNotification(notificationPopup);
            UpdateNotificationLog(undefined, true);
        },
        [updatedNotification]
    );

    // Function to close notification popup
    const handleClosePopup = () => {
        setPopup(false);
    };

    // Effect to load initial data
    useEffect(() => {
        if (!initialDataLoaded) {
            setUpdatedNotification(
                data?.userData?.notification !== undefined
                    ? [...data.userData.notification]
                    : [...tempnotification]
            );
            setInitialDataLoaded(true);
        }
    }, [data.auth, data.userData, initialDataLoaded]);

    // Function to handle request submission
    const handleRequestSubmit = async (val) => {
        try {
            // Creating a new log entry
            const newLogEntry = {
                date: val.date,
                time: val.time,
                details: val.details,
                type: val.type,
                status: 'pending',
            };

            // Creating the payload with the updated requestLog
            console.log(data);



            const payload = data.userData?.requestLog === undefined ? {
                ...data.userData,
                requestLog: [newLogEntry],
            } : { ...data.userData, requestLog: [...data.userData.requestLog, newLogEntry] }

            console.log(data);

            // Logging the payload for debugging
            console.log('Payload:', payload);

            // Sending a PATCH request to update user data
            console.log(data);
            const res = await fetch(
                `https://pushnotificationmodule-a88c5-default-rtdb.firebaseio.com/usersList/${data.userData.id}.json`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                }
            );

            // Check if the request was successful
            if (res.ok) {
                // Parsing the response data
                const updatedDataRequestList = await res.json();

                // Handling success
                setAlert((prev) => ({
                    ...prev,
                    sendRequests: true,
                }));

                setAuth(true);
                setData(updatedDataRequestList);
                setUpdatedNotification([...updatedDataRequestList.notification]);

                // Setting a timeout to clear the alert
                const timeoutId = setTimeout(() => {
                    setAlert((prev) => ({
                        ...prev,
                        sendRequests: false,
                    }));
                }, 2000);

                // If it's an automatic request, update notification log
                if (val.type === 'automatic') {
                    UpdateNotificationLog(val, false, { ...payload });
                }

                return () => clearTimeout(timeoutId);
            } else {
                console.error('Request failed with status:', res.status);
            }
        } catch (error) {
            console.error('Error submitting request:', error);
            // Handle the error or log it for further investigation
        }
    };

    // Function to update notification log
    const UpdateNotificationLog = async (val, readType, updatedData) => {
        const payload = val
            ? {
                ...updatedData,
                notification: [
                    ...updatedNotification,
                    {
                        title: '✅ Your Automatic Request is Approved',
                        date: val.date,
                        time: val.time,
                        status: 'unread',
                        description: `Your new automatic request for: " ${val.details} " is approved.`,
                    },
                ],
            }
            : { ...updatedData };

        console.log(payload);

        try {
            const res = await fetch(
                `https://pushnotificationmodule-a88c5-default-rtdb.firebaseio.com/usersList/${data.userData.id}.json`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                }
            );

            const updatedDataNotificationList = await res.json();

            if (res.ok && readType === false) {
                setAlert((prev) => ({
                    ...prev,
                    sendRequests: true,
                }));

                const timeoutId = setTimeout(() => {
                    setAlert((prev) => ({
                        ...prev,
                        sendRequests: false,
                    }));
                }, 2000);

                setAuth(true);
                setData(updatedDataNotificationList);
                setUpdatedNotification([
                    ...updatedDataNotificationList.notification,
                ]);

                return () => clearTimeout(timeoutId);
            } else {
                console.error('Request failed with status:', res.status);
            }
        } catch (error) {
            console.error('Error updating notification log:', error);
            throw error;
        }
    };

    // Function to handle logout
    const handleLogOut = () => {
        UpdateNotificationLog();
        setAuth(false);
        setData({});
        navigate('/');
    };

    // Main JSX structure
    return (
        <>
            {data.auth ? (
                <>
                    <Box
                        sx={{
                            background: '#fca311',
                            width: '100%',
                            height: '100%',
                        }}
                        display={'flex'}
                        alignItems={'center'}
                        justifyContent={'center'}
                    >
                        <Box
                            width={'70%'}
                            display={'flex'}
                            alignItems={'center'}
                            justifyContent={'center'}
                            flexDirection={'column'}
                        >
                            <Box
                                display={'flex'}
                                alignItems={'center'}
                                justifyContent={'space-between'}
                                flexDirection={'row'}
                                width={'480px'}
                            >
                                <Avatar
                                    alt="Remy Sharp"
                                    src="/static/images/avatar/1.jpg"
                                    sx={{ width: '120px', height: '120px' }}
                                />
                                <Box
                                    display={'flex'}
                                    alignItems={'center'}
                                    justifyContent={'center'}
                                    flexDirection={'column'}
                                    marginLeft={5}
                                >
                                    <TextField
                                        value={
                                            userDetails
                                                ? userDetails.username
                                                : data.userData.username
                                        }
                                        disabled={editForm}
                                        sx={{
                                            background: editForm ? '' : 'white',
                                            borderRadius: '5px',
                                            width: '255px',
                                        }}
                                        onChange={(e) =>
                                            handleInputChange(
                                                e.target.value,
                                                'username'
                                            )
                                        }
                                    />
                                    <OutlinedInput
                                        type={editForm ? 'password' : 'text'}
                                        value={
                                            userDetails
                                                ? userDetails.password
                                                : data.userData.password
                                        }
                                        disabled={editForm}
                                        sx={{
                                            marginTop: '20px',
                                            background: editForm
                                                ? ''
                                                : 'white',
                                            borderRadius: '5px',
                                            width: '255px',
                                        }}
                                        onChange={(e) =>
                                            handleInputChange(
                                                e.target.value,
                                                'password'
                                            )
                                        }
                                    />
                                </Box>
                                <Box
                                    display={'flex'}
                                    alignItems={'center'}
                                    justifyContent={'center'}
                                    flexDirection={'column'}
                                >
                                    <IconButton
                                        sx={{ marginLeft: '20px' }}
                                        onClick={editUserDetails}
                                    >
                                        <CreateIcon />
                                    </IconButton>
                                    <IconButton
                                        sx={{
                                            marginLeft: '20px',
                                            display: editForm
                                                ? 'none'
                                                : 'block',
                                        }}
                                        onClick={saveUpdateUserData}
                                    >
                                        <DoneIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                            <Divider
                                sx={{
                                    border: '0.5px solid #000000',
                                    width: '500px',
                                    marginTop: '20px',
                                }}
                            />
                            <Box>
                                <Requests
                                    onClick={handleRequestSubmit}
                                    sendRequest={alert.sendRequests}
                                />
                                <Button
                                    variant='contained'
                                    sx={{
                                        marginTop: '20px',
                                        background: 'black',
                                    }}
                                    onClick={handleLogOut}
                                >
                                    Logout
                                </Button>
                            </Box>
                        </Box>
                        <Box
                            width={'30%'}
                            display={'flex'}
                            alignItems={'center'}
                            justifyContent={'center'}
                        >
                            <Box
                                position={'relative'}
                                width={'calc(100% - 80px)'}
                                height={'calc(100vh - 100px)'}
                                sx={{
                                    background: 'white',
                                    boxShadow: '5px 6px 10px #14213d0002e',
                                }}
                                borderRadius={2}
                                display={'flex'}
                                alignItems={'center'}
                                justifyContent={'center'}
                                border={'1px solid #14213d'}
                            >
                                <h4 style={NotificationBar}>
                                    Notifcation Bar{' '}
                                    <span>
                                        <Button
                                            onClick={handleReadAll}
                                            style={{
                                                padding: 0,
                                                color: '#fca311',
                                            }}
                                        >
                                            Read all
                                        </Button>
                                    </span>
                                </h4>
                                <List
                                    sx={{
                                        width: '100%',
                                        height: 'calc(100% - 60px)',
                                        overflowY: 'auto',
                                        paddingTop: '30px',
                                    }}
                                >
                                    {updatedNotification.length === 0 ? (
                                        <p
                                            style={{
                                                fontStyle: 'italic',
                                                color: 'grey',
                                                textAlign: 'center',
                                            }}
                                        >
                                            You have no notification 😊
                                        </p>
                                    ) : (
                                        updatedNotification.map(
                                            (item, index) => (
                                                <ListItemText
                                                    key={index}
                                                    className={
                                                        item.status === 'unread'
                                                            ? styles.readMessage
                                                            : styles.unreadMessage
                                                    }
                                                    primary={item.title}
                                                    secondary={`${item.date} ${item.time}`}
                                                    sx={{
                                                        background: '#e5e5e5',
                                                        padding: '10px 20px',
                                                        margin: 0,
                                                        borderBottom:
                                                            '1px solid #14213d',
                                                    }}
                                                    onClick={() =>
                                                        handleNotificationPopup(
                                                            index
                                                        )
                                                    }
                                                />
                                            )
                                        )
                                    )}
                                </List>
                            </Box>
                        </Box>
                    </Box>
                    {notification ? (
                        <Dialog
                            open={popup}
                            disableEscapeKeyDown={true}
                        >
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
                                <DialogActions>
                                    <Button onClick={handleClosePopup}>
                                        Close
                                    </Button>
                                </DialogActions>
                            </DialogContent>
                        </Dialog>
                    ) : (
                        ''
                    )}

                    <Alert
                        severity='success'
                        sx={{
                            display: alert.updatedDetails ? '' : 'none',
                            position: 'absolute',
                            top: 10,
                        }}
                    >
                        Your Details have been updated
                    </Alert>
                    <Alert
                        severity='success'
                        sx={{
                            display: alert.sendRequests ? '' : 'none',
                            position: 'absolute',
                            top: 10,
                        }}
                        
                    >
                        Your Request has been Submitted.
                    </Alert>
                </>
            ) : (
                <Navigate to={'/'} replace />
            )}
        </>
    );
};

export default DashboardUser;
