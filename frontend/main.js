import 'core-js/stable';
import 'regenerator-runtime/runtime';

import Login from './modules/Login';

const login = new Login('.form-login');
const newUser = new Login('.form-newUser');
login.init();
newUser.init();

//import './assets/css/style.css';
