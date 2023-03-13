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
import { Copyright } from '../util/CopyrightFooter';

axios.defaults.withCredentials = true

/**
 * This page uses the standard darktheme from MUI
 */
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
const theme = createTheme(darkTheme);

/**
 * Format for the data that the form will gather which is sent to login function
 */
type dataFormat = {
  email: FormDataEntryValue | null,
  password: FormDataEntryValue | null,
};

/**
 * LoginPage component
 * @returns HTML
 */
export default function Login() {

  /**
  * UseState for error message. This message will appear below the register button if the registrationprocess returned an error
  */
  const [loginError, setLoginError] = useState("");

  /**
   * UseState for text field validation. Will change the state of the textfield to showcase error if the useState is false
   */
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);

  /**
   * Checks if the email is a valid format
   * @param email string of email
   */
  const validateEmail = (email: string) => {
    const emailRegexValidator = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    if (emailRegexValidator.test(email)) {
      setIsValidEmail(true);
    }
    else {
      setIsValidEmail(false);
    }
  }

  /**
   * Checks if the password is not empty
   * @param password string of password
   */
  const validatePassword = (password: string) => {
    if (password !== "") {
      setIsValidPassword(true);
    }
    else {
      setIsValidPassword(false);
    }
  }

  /**
   * React router dom to navigate the website
   */
  const navigate = useNavigate();
  const navigatePage = (link: string) => {
    navigate(link);
  }

  /**
   * Sends a post request to login. Will set registrationError if error occurs
   * @param data from the form
   */
  const login = async (data: dataFormat) => {
    await axios.post("http://localhost:9090/user/login", {
      email: data.email,
      password: data.password
    })
      .then(function (response) {
        console.log(response);
        navigatePage("/home");
      })
      .catch(function (error) {
        setLoginError(error.response.data)
        console.log(error);
      });
  };

  /**
  * Handle submit function
  * @param event form
  */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
    const dataValue = {
      email: data.get('email'),
      password: data.get('password'),
    }
    login(dataValue);
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
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(event) => {
                validateEmail(event.target.value);
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(event) => {
                validatePassword(event.target.value);
              }}
            />
            {loginError ? <Box sx=
              {{
                color: "red",
                fontSize: "12px",
              }}>{loginError}</Box> : null}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!isValidEmail || !isValidPassword}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="" variant="body2" onClick={() => navigatePage("/register")}>
                  Click here to register
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright />
      </Container>
    </ThemeProvider>
  );
}