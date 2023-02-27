import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="">
        TwitterClone
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function CreateAccount() {

    const createUser = async (data : any) => {
      await axios.post("http://localhost:9090/user", {
        userid: data.userid,
        ownerName: data.name,
        email: data.email,
        password : data.password
      })
      .then(function (response) {
        console.log(response);
        navigatePage("/login");
      })
      .catch(function (error) {
        setRegistrationError(error.response.data)
        console.log(error);
      });
    };

    const [registrationError, setRegistrationError] = useState("");
    const [isValidEmail, setIsValidEmail] = useState([false, true]);
    const [isValidName, setIsValidName] = useState([false, true]);
    const [isValidUserID, setIsValidUserID] = useState([false, true]);
    const [isValidPassword, setIsValidPassword] = useState([false, true]);
    
    const validateEmail = (email : string) => {
      const emailRegexValidator = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      
      if (emailRegexValidator.test(email)) {
          setIsValidEmail([true, true]);
      }
      else {
          setIsValidEmail([false, false]);
      }
  }
  const validateName = (name : string) => {
    if (name !== "") {
      setIsValidName([true, true]);
    }
    else {
      setIsValidName([false, false]);
    }
}
    const validateUserID = (userID : string) => {
        if (userID !== "") {
          setIsValidUserID([true, true]);
        }
        else {
          setIsValidUserID([false, false]);
        }
    }
    const validatePassword = (password : string) => {
        if (password !== "") {
            setIsValidPassword([true, true]);
        }
        else {
            setIsValidPassword([false, false]);
        }
    }
    
    const navigate = useNavigate();
    const navigatePage = (link : string) => {
        navigate(link);
    }


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      userid : data.get('id'),
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
    });
    const dataValue = {
      userid : data.get('id'),
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
    }
    createUser(dataValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  error={!isValidName[1]}
                  helperText={!isValidName[1] ? "Field can not be empty." : ""}
                  required
                  fullWidth
                  id="name"
                  label="Your Name"
                  name="name"
                  autoComplete="name"
                  onChange={(event) => {
                    validateName(event.target.value);
                  }} 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={!isValidUserID[1]}
                  helperText={!isValidUserID[1] ? "Field can not be empty." : ""}
                  required
                  fullWidth
                  id="id"
                  label="User ID"
                  name="id"
                  autoComplete="id"
                  onChange={(event) => {
                    validateUserID(event.target.value);
                }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={!isValidEmail[1]}
                  helperText={!isValidEmail[1] ? "Please use a valid email format." : ""}
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={(event) => {
                    validateEmail(event.target.value);
                }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={!isValidPassword[1]}
                  helperText={!isValidPassword[1] ? "Field can not be empty." : ""}
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={(event) => {
                    validatePassword(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
              </Grid>
            </Grid>
            {registrationError ? <Box sx=
            {{
              color: "red",
              fontSize: "12px",
            }}>{registrationError}</Box> : null}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!isValidEmail[0] || !isValidPassword[0] || !isValidName[0] || !isValidUserID[0]}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link href="" variant="body2" onClick={() => navigatePage("/login")}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}