import mysql from 'mysql2';
import { environmentService } from './EnvironmentService';

const connection = mysql.createConnection({
    host: environmentService.DB_HOST,
    user: environmentService.DB_USERNAME,
    password: environmentService.DB_PASSWORD,
    database: environmentService.DB_NAME
});

connection.connect(error => {
    if (error) {
        console.error('Error connecting to the database:', error.stack);
        return;
    }
    console.log('Connected to the database as ID', connection.threadId);
});

export default connection;
