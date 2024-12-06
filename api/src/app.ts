import express, { Express } from 'express';
import { register } from './register.js';
import { login } from './login.js';
import { forgotpass } from './forgotpass.js';
import { resetpass } from './resetpass.js';
import { verifyemail } from './verifyemail.js';
import { createdocument } from './createdocument.js';
import { readdocument } from './readdocument.js';
import { updatedocument } from './updatedocument.js';
import { deletedocument } from './deletedocument.js';
import { searchdocuments } from './searchdocuments.js';

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
app.post('/api/verifyemail', verifyemail);
app.post('/api/createdocument', createdocument);
app.post('/api/readdocument', readdocument);
app.post('/api/updatedocument', updatedocument);
app.post('/api/deletedocument', deletedocument);
app.post('/api/searchdocuments', searchdocuments);




export default app;