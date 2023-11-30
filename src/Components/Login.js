import React, { useEffect, useState } from 'react';
import { Box, Button, Checkbox, FormControl, FormControlLabel, InputLabel, OutlinedInput } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

export default function Login(props) {

    const navigate =useNavigate();
    const {auth, setAuth, userData, setData} = useAuth();
    const [user, setUser] = useState({
        username: '',
        password: '',
        status: true,
        type: ''
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

            const userId = Object.keys(data).filter(key => data[key].username === user.username);

            if(userId){
                setAuth(true);
                setData(data[userId])
            }


        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=> {
        if(auth){
            navigate('/DashboardUser')
        }
    },[userData])

    return (
        <>
        <h1>Login to your Account Now</h1>

            <FormControl component="form">
                <Box>
                    <FormControl sx={{ borderRadius: '5px',background:'white', display: 'flex', alignContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column',marginBottom: '20px' }}>
                        <InputLabel htmlFor='Username' color={'black'}>UserName</InputLabel>
                        <OutlinedInput onChange={(e) => handleForm(e.target.value, 'username')} type='text' label='Username' id='Username' color={'black'} value={user.username} sx={{width: '400px'}} required />
                    </FormControl>
                    <FormControl sx={{ borderRadius: '5px',background:'white', display: 'flex', alignContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column',marginBottom: '20px' }}>
                        <InputLabel htmlFor='Password' color={'black'}>Password</InputLabel>
                        <OutlinedInput onChange={(e) => handleForm(e.target.value, 'password')} type='password' label='Password' color={'black'} value={user.password} sx={{width: '400px'}} required />
                    </FormControl>
                    <FormControl sx={{ display: 'flex', alignContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column'}}>
                    <FormControlLabel
                        control={<Checkbox onChange={(e) => handleForm(e.target.checked, 'type')} required />}
                        label="isAdmin"
                    />
                        
                    </FormControl>
                    <Button onClick={handleSubmit} variant='contained' color='black' sx={{background: 'white', marginTop: '10px'}} >Submit</Button>
                </Box>
            </FormControl>

            <Box>
                <p>Not a member ? <span style={{textDecoration: 'underline', color: 'white'}} onClick={props.handleLogin}>Create account now</span></p>
            </Box>

        </>
    );
}
