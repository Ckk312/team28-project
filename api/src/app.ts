import express, { Express } from 'express';
import { register } from './register.js';
import { login } from './login.js';
import { forgotPass } from './forgotpass.js';
import { searchTeam } from './searchteam.js';

const app : Express = express();

app.use(express.json());
app.use((req, res, next) => 
    {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept, Authorization'
        );
        res.setHeader(
            'Access-Control-Allow-Methods',
            'GET, POST, PATCH, DELETE, OPTIONS'
        );
        next();
    }
);
app.post('/api/register', register);
app.post('/api/login', login);
app.post('/api/forgotpass', forgotPass);
app.post('/api/searchteam', searchTeam);


export default app;