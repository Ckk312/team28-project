import express from 'express';
import { register } from './register.js';
import { login } from './login.js';
var app = express();
app.use(express.json());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    next();
});
app.post('/api/register', register);
app.post('/api/login', login);
export default app;
