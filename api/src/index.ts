import app from './app.js';
import { mdbclient } from './mongodb.js';

mdbclient.connect();
app.listen(5000);