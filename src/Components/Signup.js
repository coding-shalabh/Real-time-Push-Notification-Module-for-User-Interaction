import React, { useEffect, useState } from 'react';
import { Box, Button, Checkbox, FormControl, FormControlLabel, InputLabel, OutlinedInput } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import Login from './Login';
import Styles from './Login.module.css'

export default function Signup(props) {

    const navigate = useNavigate();
    const {setAuth, auth, userData, setData } = useAuth();

    const date = new Date();


    const [user, setUser] = useState({
        username: '',
        password: '',
        status: true,
        type: 'user',
        notification: [    {
            title: 'Your account is created 🎉',
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString(),
            status: 'unread',
            description: `Hi 👋, Congratulations on creation of new account.`
        }],
        requestLog: '',
        managedBy: '',
    })

    const handleForm = (val, formType) => {
        if(formType === 'type'){
            setUser((prev) => ({
                ...prev,
                type: 'Admin',
            }))
        }else{
            setUser((prev) => ({
                ...prev,
                [formType]: val,
            }))
        }
    }

    const handleSubmit = async () => {

        const {username, password, status, type, notification, requestLog} = user

        try {
            const res = await fetch('https://pushnotificationmodule-a88c5-default-rtdb.firebaseio.com/usersList.json', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body : JSON.stringify({username, password, status, type, notification, requestLog})
            })

            // if(res){
            //     setAuth(true);
            //     setData({
            //         username,
            //         password,
            //         status: true,
            //         type: 'user',
            //         id: '',
            //         notification: [],
            //         requestLog: [],
            //         managedBy: '',
            //     });
            //     setUser({
            //         username: '',
            //         password: '',
            //         status: true,
            //         type: '',
            //         notification: [    {
            //             title: 'Your account is created 🎉',
            //             date: date.toLocaleDateString(),
            //             time: date.toLocaleTimeString(),
            //             status: 'unread',
            //             description: `Hi ${this.username} 👋, Congratulations on creation of new account.`
            //         }],
            //         requestLog: [],
            //         managedBy: '',

            //     }) 
            // }

            if(res){
                console.log('woerinf')
                navigate('/Login')
            }
            
        } catch (error) {
            console.log('There is something wrong:' + error)
        }
    }

    useEffect(()=> {
        if(auth){
            navigate('/DashboardUser');
        }
    },[userData])

    return (
        <>
        <h1>Create Account Now</h1>
            <FormControl component="form">
                <Box>
                    <FormControl sx={{ borderRadius: '5px',background:'white', display: 'flex', alignContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column',marginBottom: '20px' }}>
                        <InputLabel htmlFor='Username' color={'black'}>UserName</InputLabel>
                        <OutlinedInput className={Styles.FormFields} onChange={(e) => handleForm(e.target.value, 'username')} type='text' label='Username' id='Username' color={'black'} value={user.username} sx={{width: '400px'}} required />
                    </FormControl>
                    <FormControl sx={{ borderRadius: '5px',background:'white', display: 'flex', alignContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column',marginBottom: '20px' }}>
                        <InputLabel htmlFor='Password' color={'black'}>Password</InputLabel>
                        <OutlinedInput className={Styles.FormFields} onChange={(e) => handleForm(e.target.value, 'password')} type='password' label='Password' color={'black'} value={user.password} sx={{width: '400px'}} required />
                    </FormControl>
                    <FormControl sx={{ display: 'flex', alignContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column'}}>
                    {/* <FormControlLabel
                        control={<Checkbox onChange={(e) => handleForm(e.target.checked, 'type')} required />}
                        label="isAdmin"
                    /> */}
                        
                    </FormControl>
                    <Button onClick={handleSubmit} variant='contained' color='black' sx={{background: 'white', marginTop: '10px'}} >Submit</Button>
                </Box>
            </FormControl>
            <Box>
                <p>Already a member ? <span style={{textDecoration: 'underline', color: 'white'}} onClick={props.handleSignup}>Login now</span></p>
            </Box>
        </>
    );
}
