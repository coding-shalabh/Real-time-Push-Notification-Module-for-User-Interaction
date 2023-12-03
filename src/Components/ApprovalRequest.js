import { Box, IconButton, TextField } from '@mui/material'
import DoneIcon from '@mui/icons-material/Done';
import React, { useState } from 'react';


const ApprovalRequest = ({props}) => {

  const date = new Date();

  const [autoRequest, setAutoRequest] = useState({
    date: date.toLocaleDateString(),
    time: date.toLocaleDateString(),
    details: '',
    type: 'automatic',
    status: 'approved',
});

const [approveRequest, setApproveRequest] = useState({
    date: date.toLocaleDateString(),
    time: date.toLocaleDateString(),
    details: '',
    type: 'approve',
    status: 'pending',
});

  const handleInput = (val, type)=> {
        type === 'automatic' ? setAutoRequest(val) : setApproveRequest(val);
  }

    

  return (
    <>
    <Box>
    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} >
        <TextField multiline value={autoRequest.details} onChange={(e)=> handleInput(e.target.value, 'automatic')} label={'Automatic Request Type'}/>
    </Box>
        <TextField multiline value={approveRequest.details} onChange={(e)=> handleInput(e.target.value, 'approve')} label={'Approve Request Type'}/>
        <IconButton sx={{ marginLeft: '20px'}} onClick={()=> props.saveUserRequest(approveRequest)}><DoneIcon /></IconButton>

    </Box>
    </>

  )
}

export default ApprovalRequest