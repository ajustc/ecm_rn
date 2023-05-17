import {LOGIN_SUCCESS, LOGOUT} from './type';

import AuthService from '../services/authService';

export const login = user => dispatch => {
  return AuthService.logIn(user)
    .then(response => {
      if (response.status === 'success') {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: {user: response.data},
        });
        Promise.resolve();

        return response;
      }
    })
    .catch(error => {
      Promise.reject();

      return error;
    });
};

export const logout = () => dispatch => {
  return AuthService.logOut().then(response => {
    if (response.status === 'success') {
      dispatch({
        type: LOGOUT,
      });
      Promise.resolve();
      return response;
    }
  });
};
