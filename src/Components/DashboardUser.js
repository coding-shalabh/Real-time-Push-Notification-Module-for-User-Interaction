import React, { useCallback, useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';

import { useAuth } from '../Context/AuthContext';
import { Alert, Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, List, ListItemText, OutlinedInput, TextField } from '@mui/material';
import styles from './DashboardUser.module.css';
import CreateIcon from '@mui/icons-material/Create';
import DoneIcon from '@mui/icons-material/Done';
import Requests from './Requests';
import CloseIcon from '@mui/icons-material/Close';
import userImage from '../shalabh-gupta.jpg';

const apiUrl = process.env.REACT_APP_API_URL;

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
            const res = await fetch(apiUrl + data.userData.id + '.json',
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

    const handleNotificationPopup = useCallback((id) => {
        const index = updatedNotification.findIndex((item, index) => index === id);

        if (index !== -1) {
            setNotification(updatedNotification[index]);
            setUpdatedNotification((prev) => {
                const updatedArray = [...prev];
                updatedArray[index] = { ...updatedArray[index], status: 'read' };
                sendUpdateNotificationLog(updatedArray);
                return updatedArray;
            });
        }
        setPopup(true);
    }, [updatedNotification])

    const handleRequestSubmit = (val) => {
        if (data) {
            const SubmitRequest = async () => {

                try {

                    console.log(data.userData.requestLog)

                    const notificationLog = {
                        title: '✅ Your Automatic Request is Approved',
                        date: val.date,
                        time: val.time,
                        status: 'unread',
                        description: `Your new automatic request for: " ${val.details} " is approved.`,
                    }

                    const payload = {
                        ...data.userData,
                        requestLog: data.userData?.requestLog === undefined ? [{ ...val }] : [...data.userData.requestLog, { ...val }],
                        notification: data.userData?.notification === undefined ? [{ ...notificationLog }] : [...data.userData?.notification, { ...notificationLog }]

                    }

                    const res = await fetch(apiUrl + data.userData.id + '.json', {
                        method: 'PATCH',
                        headers: {
                            'Content-type': 'application/json'
                        },
                        body: JSON.stringify(payload),
                    })

                    if (res.status === 200) {
                        setAlert((prev) => ({ ...prev, sendRequests: true }));

                        setTimeout(() => {
                            setAlert((prev) => ({
                                ...prev, sendRequests: false
                            }))
                        }, 1000)

                        const updateRequestData = await res.json();

                        setAuth(true);
                        setData({ ...updateRequestData })
                        UpdateNotificationLog([...updateRequestData.notification]);
                    }
                } catch (error) {
                    console.log(error)
                }
            }
            SubmitRequest();
        }

    }

    const UpdateNotificationLog = (val) => {
        setUpdatedNotification(val);
    }

    const sendUpdateNotificationLog = async (updatedNotificationList) => {
        const payload = {
            ...data.userData,
            notification: [...updatedNotificationList]
        }

        try {

            const res = await fetch(apiUrl + data.userData.id + '.json', {
                method: 'PATCH',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(payload),
            })

            if (res.ok) {
                setAuth(true);
                setData({ ...data.userData, notification: [...updatedNotificationList] })
                setUpdatedNotification([...updatedNotificationList])
            }

        } catch (error) {
            console.log(error)
        }

    }

    const handleReadAll = useCallback(() => {
        setUpdatedNotification((prev) => {
            const updatedList = [...prev].map((item) => ({
                ...item, status: 'read'
            }))
            sendUpdateNotificationLog(updatedList);
            return updatedList;
        });
    }, []);




    const handleLogOut = () => {

        setAuth(true);
        setData({});
        setNotification({})
        setUpdatedNotification([]);
        navigate('/');

     }

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
                        className={styles.MainContainer}
                    >
                        <Box
                            width={'70%'}
                            display={'flex'}
                            alignItems={'center'}
                            justifyContent={'center'}
                            flexDirection={'column'}
                            className={styles.LeftContainer}
                        >
                            <Box
                                display={'flex'}
                                alignItems={'center'}
                                justifyContent={'space-between'}
                                flexDirection={'row'}
                                width={'480px'}
                                className={styles.UserDetails}
                            >
                                <Avatar
                                    alt="Remy Sharp"
                                    src={userImage}
                                    sx={{ width: '120px', height: '120px' }}
                                    className={styles.Avatar}
                                />
                                <Box
                                    display={'flex'}
                                    alignItems={'center'}
                                    justifyContent={'center'}
                                    flexDirection={'column'}
                                    marginLeft={5}
                                    className={styles.FormFields}
                                >
                                    <TextField
                                        value={userDetails ? userDetails.username : data.userData.username} disabled={editForm}
                                        sx={{background: editForm ? '' : 'white',borderRadius: '5px',width: '255px',}}
                                        onChange={(e) =>handleInputChange(e.target.value,'username')}
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

                                        className={styles.FormFields}
                                    />
                                </Box>
                                <Box
                                    display={'flex'}
                                    alignItems={'center'}
                                    justifyContent={'center'}
                                    flexDirection={'column'}
                                    className={styles.UserDetailsUpdate}
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
                                className={styles.Divider}
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
                            className={styles.RightContainer}
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
                                className={styles.NotificationBar}
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
                            <Divider sx={{ borderColor: 'light-grey', borderWidth: '1.2px' }} />
                            <DialogContent>
                                <DialogContentText>
                                    <Box sx={{ color: '#000' }}>
                                        {notification.description}
                                    </Box>
                                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} width={'100%'} marginTop={1}>
                                        <span style={{ fontSize: '12px', fontWeight: 500, color: '#000' }}>

                                            {notification.date}
                                        </span>
                                        <span style={{ fontSize: '12px', fontWeight: 500, color: '#000' }}>
                                            {notification.time}

                                        </span>
                                    </Box>
                                </DialogContentText>
                                <DialogActions sx={{ padding: 0 }}>
                                    <Button onClick={handleClosePopup} sx={{ padding: 0, textAlign: 'right', justifyContent: 'flex-end', color: '#000' }}>
                                        <CloseIcon />
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
