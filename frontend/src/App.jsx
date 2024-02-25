import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Container } from '@mui/material';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';

export default function () {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [slipData, setSlipData] = useState(null);

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  }));


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if(file){
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      }
      reader.readAsDataURL(file);
    }
  }

  const handleUpload = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('files', selectedFile);

    try{
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      })

      if(response.ok){
        const data = await response.json();
        setSlipData(data);
        alert('File uploaded successfully');
        console.log(data);
      }else{
        alert('Error uploading file try again');
      }
    } catch (error) {
      console.error(error);
      alert('Error uploading file');
    }
  }
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Slip Ok
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Container maxWidth="sm" sx={{marginTop: 2}}>
        <form onSubmit={handleUpload}>
          <Stack spacing={2}>
            <Item>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Upload file
                <VisuallyHiddenInput type="file" accept='image/*' onChange={handleFileChange} />
              </Button>
            </Item>
            <Item>
              { imageUrl != '' &&
              <img src={imageUrl} alt="Preview" height={600} width={500} />
              }
            </Item>
            <Item>
              <Button type="submit" variant="contained">Upload Slip</Button>
            </Item>
          </Stack>
        </form>
        { slipData &&
          <Box>
            <AssignmentTurnedInIcon />
          <Typography variant="body1" gutterBottom>
            SendingBank : {slipData?.data?.sendingBank}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Sender : {slipData?.data?.sender?.displayName}
          </Typography>
          <Typography variant="body1" gutterBottom>
            ReceivingBank : {slipData?.data?.receivingBank}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Receiver : {slipData?.data?.receiver?.displayName}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Amount : {slipData?.data?.amount}
          </Typography>
          </Box>
        }
      </Container>
    </div>
  )
}
