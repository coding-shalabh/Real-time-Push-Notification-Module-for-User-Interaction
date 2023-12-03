import { Box, IconButton, TextField } from '@mui/material'
import DoneIcon from '@mui/icons-material/Done';
import React, { useEffect, useState } from 'react';


const Requests = (props) => {

  const date = new Date();

  const [autoRequest, setAutoRequest] = useState({
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString(),
    details: '',
    type: 'automatic',
    status: 'approved',
});

const [approveRequest, setApproveRequest] = useState({
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString(),
    details: '',
    type: 'approve',
    status: 'pending',
});

  const handleInput = (val, type)=> {
        type === 'automatic' ? setAutoRequest((prev)=> ({
            ...prev,
            details: val
        }))
         : 
         setApproveRequest((prev)=> ({
            ...prev,
            details: val
        }));
  }

  useEffect(()=> {
        setAutoRequest((prev)=> ({
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString(),
            details: '',
            type: 'automatic',
            status: 'approved',
        }))
        setApproveRequest((prev)=> ({
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString(),
            details: '',
            type: 'approve',
            status: 'pending',
        }))


  },[props.onClick])
    

  return (
    <>
    <Box>
    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} >
        <TextField multiline value={autoRequest.details} onChange={(e)=> handleInput(e.target.value, 'automatic')} label={'Automatic Request Type'} sx={{marginTop: '20px', width: '420px', background: 'white', borderRadius: '5px'}}/>
        <IconButton sx={{ marginLeft: '20px'}} onClick={()=> props.onClick(autoRequest)}><DoneIcon /></IconButton>

    </Box>
    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} >
    
        <TextField multiline value={approveRequest.details} onChange={(e)=> handleInput(e.target.value, 'approve')} label={'Approve Request Type'} sx={{marginTop: '20px', width: '420px', background: 'white', borderRadius: '5px'}}/>
        <IconButton sx={{ marginLeft: '20px'}} onClick={()=> props.onClick(approveRequest)}><DoneIcon /></IconButton>
        </Box>
    </Box>
    </>

  )
}

export default Requests