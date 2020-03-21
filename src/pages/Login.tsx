import React, {useState, useContext} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from 'axios'
import {API_ROUTES, API_URL} from "../constants";
import {UserContext, UserContextProps} from "../context/userContext";
import {Grid} from "@material-ui/core";


const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const Login:React.FC = () => {
    const classes = useStyles();
    let userContext:UserContextProps = useContext(UserContext)

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)

    const handleSubmit = (event:React.FormEvent) =>{
        event.preventDefault()
        setLoading(true)
        setError(false)
        let body = {
            username:email,
            password:password
        }
        axios.post(API_URL+API_ROUTES.LOGIN,body)
            .then(res=>{
                userContext.dispatch({ type: "login", payload:{user:{email:res.data.email, name:res.data.name},
                        token:res.data.token} })
            })
            .catch(error=>{
                setError(true)
                setLoading(false)
            })
    }
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form className={classes.form} noValidate onSubmit={handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={(event)=>setEmail(event.target.value)}
                    />
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
                        onChange={(event)=>setPassword(event.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={loading}
                    >
                        {
                            loading ?
                            <CircularProgress size={25} color='secondary'/>
                                :
                            'Sign In'
                        }
                    </Button>
                    {error &&
                    <Grid container>
                        <Grid item xs>
                            Error: Invalid email and password
                        </Grid>
                    </Grid>
                    }
                </form>
            </div>
        </Container>
    );
}

export default Login