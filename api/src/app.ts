import express, { Express } from 'express';
import { register } from './register.js';
import { login } from './login.js';
import { forgotpass } from './forgotpass.js';
import { resetpass } from './resetpass.js';
import { updateuser } from './updateuser.js';
import { deleteuser } from './deleteuser.js';
import { addplayer } from './addplayer.js';
import { updateplayer } from './updateplayer.js';
import { deleteplayer } from './deleteplayer.js';
import { searchplayers } from './searchplayers.js';
import { verifyemail } from './verifyemail.js';

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
app.post('/api/forgotpass', forgotpass);
app.post('/api/resetpass', resetpass);
app.post('/api/updateuser', updateuser);
app.post('/api/deleteuser', deleteuser);
app.post('/api/addplayer', addplayer);
app.post('/api/updateplayer', updateplayer);
app.post('/api/deleteplayer', deleteplayer);
app.post('/api/searchplayers', searchplayers);
app.post('/api/verifyemail', verifyemail);




export default app;