import { useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { User } from '../../Interfaces';
import { useNavigate } from 'react-router-dom';
axios.defaults.withCredentials = true;

/**
 * Redirects the user from "/" to either "/home" or "/login" depending on if they are logged in or not
 */
function RedirectHome() {

    /**
     * used to navigate to 
     */
    const navigate = useNavigate();
    const navigatePage = (link: string) => {
        navigate(link);
    }

    /**
     * useEffect that runs first time only
     */
    useEffect(() => {
        /**
         * async function that checks if a current user exists
         */
        async function checkCurrentUser() {
            try {
                await axios.get<User>('http://localhost:9090/user/current_user');
                navigatePage("/home");
            } catch (error) {
                console.error(error);
                navigatePage("/login");
            }
        }
        checkCurrentUser();

    }, []);

    return (<div></div>);
}

export default RedirectHome;
