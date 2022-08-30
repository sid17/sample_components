import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import {
    useNavigate,
    useLocation,
} from "react-router-dom";

import useCustomForm from './CustomForm';
import { SignInSubmitFn, AuthTokenExistsFn } from "../ApiCalls";
import { defaultValidate } from './Validators'


const initialValues = {
    phone_number: "",
    password: "",
};

function SideSignIn(props) {
    let navigate = useNavigate();
    let location = useLocation();
    let from = location.state?.from?.pathname || "/";
    const [authenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        if (AuthTokenExistsFn()) {
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        if (authenticated) {
            navigate(from, { replace: true });
        }
    }, [authenticated]);

    const validators = {
        "phone_number": defaultValidate,
        "password": defaultValidate,
    }

    const {
        values,
        errors,
        touched,
        isFormValid,
        handleChange,
        handleBlur,
        handleSubmit
    } = useCustomForm({
        initialValues, validators,
        onSubmit: SignInSubmitFn(setIsAuthenticated)
    });

    return (
        <Grid container component="main" style={{
            height: '80vh',
            padding: "30px",
            marginTop: '5vh'
        }}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} style={{
                backgroundImage: props.image,
                backgroundRepeat: 'no-repeat',
                backgroundColor: 'grey',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }} />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div style={{
                    margin: "8px",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form style={{
                        width: '100%', // Fix IE 11 issue.
                        marginTop: "10px",
                    }} noValidate onSubmit={handleSubmit}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="phone_number"
                            label="Phone Number"
                            name="phone_number"
                            autoComplete="tel"
                            onChange={handleChange}
                            value={values.phone_number}
                        />
                        <span style={{ color: "red" }}>{errors.phone_number}</span>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={values.password}
                            onChange={handleChange}
                        />
                        <span style={{ color: "red" }}>{errors.password}</span>
                        {/* TODO(manochas): Add remember me functionality, cookie will only be saved for this session */}
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
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
                                {/* <RouterLink to="/merchant/signup">
                                    {"Don't have an account? Sign Up"}
                                </RouterLink> */}
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Grid>
        </Grid>
    );
}
export default SideSignIn;