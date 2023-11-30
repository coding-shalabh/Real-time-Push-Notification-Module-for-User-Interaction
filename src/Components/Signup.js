import React, { useState } from 'react';
import { Box, Button, Checkbox, FormControl, FormControlLabel, InputLabel, OutlinedInput } from '@mui/material';

export default function Signup(props) {

    const [user, setUser] = useState({
        username: '',
        password: '',
        status: true,
        type: ''
    });

    const handleForm = (val, type) => {
        setUser((prev) => ({
            ...prev,
            [type]: type === 'type' ? 'Admin' : val
        }))
    }

    const handleSubmit = async () => {

        const {username, password, status, type} = user

        try {
            const res = await fetch('https://pushnotificationmodule-a88c5-default-rtdb.firebaseio.com/usersList.json', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body : JSON.stringify({username, password, status, type})
            })

            if(res){
                console.log('Data logged Successfully');
                setUser({
                    username: '',
                    password: '',
                    status: true,
                    type: ''
                })
            }
            
        } catch (error) {
            console.log('There is something wrong:' + error)
        }


    }

    return (
        <>
        <h1>Create Account Now</h1>
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
                <p>Already a member ? <span style={{textDecoration: 'underline', color: 'white'}} onClick={props.handleSignup}>Login now</span></p>
            </Box>
        </>
    );
}
