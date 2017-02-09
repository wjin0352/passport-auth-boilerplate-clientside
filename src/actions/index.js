import axios from 'axios';
import { browserHistory } from 'react-router';
import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR
} from './types';

const ROOT_URL = 'http://localhost:3000';

export function signinUser({ email, password}) {
  // using redux thunk middleware so we return a function.  by using redux thunk we get direct access to dispatch (so we can dispatch as many actions anytime we want) which is the all powerful function that if we send an action to it it will magically get forwarded to all reducers.  hence the first argument below is dispatch.  Inside this function we can make any async action or request we want.  we can place a ton of logic in this function as well thanks to redux-thunk!
  return function(dispatch) {
    // submit email/passwd to server
    axios.post(`${ROOT_URL}/signin`, { email, password })
      .then(response => {
        console.log('response: ', response)
        // if request is good...
        // - update state to indicate user is authenticated
        dispatch({ type: AUTH_USER });
        // - save JWT token, localStorage is an object available on the window scope, to save the item call setItem to save to local storage. remember localstorage is persistant to browser so user wont have to reloggin and its doesn't work on other domains for security reasons.
        localStorage.setItem('token', response.data.token);
        // - redirect to route /'feature' using react router so not to reload the page
        browserHistory.push('/feature');
      })
      .catch(() => {
        // if request is bad...
        // show error to the user
        dispatch(authError('Bad Login Info'));
      });
  };
}

export function signupUser({ email, password }) {
  return function(dispatch) {
    axios.post(`${ROOT_URL}/signup`, { email, password })
      .then((response) => {
        console.log(response)
        dispatch({ type: AUTH_USER });

        localStorage.setItem('token', response.data.token);
        browserHistory.push('/feature');
      })
      .catch((response) => dispatch(authError(response.data.error)));
  }
}

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  };
}

export function signoutUser() {
  localStorage.removeItem('token');

  return { type: UNAUTH_USER };
}
