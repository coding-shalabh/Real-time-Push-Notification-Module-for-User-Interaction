import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import styles from './Login.module.css'

export default function Login(props) {

    const navigate =useNavigate();
    const {auth, setAuth, userData, setData} = useAuth();
    const [alert,setAlert] = useState(false);
    const [user, setUser] = useState({
        username: '',
        password: '',
        status: true,
        type: '',
        id: '',
        notification: [],
        requestLog: [],
        managedBy: ''
    });

    const handleForm = (val, type) => {
        setUser((prev) => ({
            ...prev,
            [type]: val
        }))
    }
    
    const handleSubmit = async () => {
        try {
            const res = await fetch('https://pushnotificationmodule-a88c5-default-rtdb.firebaseio.com/usersList.json')

            

            const data = await res.json();
            const userId = Object.keys(data).filter(key => (data[key]?.username).toLowerCase() === (user?.username).toLowerCase() && data[key]?.password === user?.password);



            if(userId.length > 0){
                setAuth(true);
                console.log(data[userId]);
                setData(()=> (
                    {id: userId[0],
                        ...data[userId]
                    }
                    ))
            }else {
                setAlert(true);
                setTimeout(()=> {
                    setAlert(false)
                }, 2000)
            }

            if((data[userId[0]].type).toLowerCase() === 'admin'){
                console.log('This is Admin user');
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=> {
        if(auth && (userData.type === 'user')){
            navigate('/DashboardUser')
        }else if(auth && (userData.type === 'admin')){
            navigate('/DashboardAdmin');
            console.log('this is admin')
        }else {
            navigate('/');
        }
    },[userData])

    return (
        <>
        <h1>Login to your Account Now</h1>

            <FormControl component="form">
                <Box>
                    <FormControl sx={{ borderRadius: '5px',background:'white', display: 'flex', alignContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column',marginBottom: '20px' }}>
                        <InputLabel htmlFor='Username' color={'black'}>UserName</InputLabel>
                        <OutlinedInput className={styles.FormFields} onChange={(e) => handleForm(e.target.value, 'username')} type='text' label='Username' id='Username' color={'black'} value={user.username} sx={{width: '400px'}} required />
                    </FormControl>
                    <FormControl sx={{ borderRadius: '5px',background:'white', display: 'flex', alignContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column',marginBottom: '20px' }}>
                        <InputLabel htmlFor='Password' color={'black'}>Password</InputLabel>
                        <OutlinedInput className={styles.FormFields} onChange={(e) => handleForm(e.target.value, 'password')} type='password' label='Password' color={'black'} value={user.password} sx={{width: '400px'}} required />
                    </FormControl>
                    <FormControl sx={{ display: 'flex', alignContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column'}}>
                    </FormControl>
                    <Button onClick={handleSubmit} variant='contained' color='black' sx={{background: 'white', marginTop: '10px'}} >Submit</Button>
                </Box>
            </FormControl>

            <Box>
                <p>Not a member ? <span style={{textDecoration: 'underline', color: 'white'}} onClick={props.handleLogin}>Create account now</span></p>
            </Box>
            <Alert severity="error" sx={{ display: alert ? '' : 'none', position: 'absolute', top: 10, }}>Please enter correct details</Alert>
        </>
    );
}
