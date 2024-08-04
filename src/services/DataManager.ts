import mysql from 'mysql2';

const connection = mysql.createConnection({
    host: 'hostname',
    user: 'username',
    password: 'password',
    database: 'databasename'
});

connection.connect(error => {
    if (error) {
        console.error('Error connecting to the database:', error.stack);
        return;
    }
    console.log('Connected to the database as ID', connection.threadId);
});

export default connection;
