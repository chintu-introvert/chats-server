import express from 'express';
const app = express();
const server = app.listen(3001, () => {
    console.log('Listening on 3001');
});
process.on('exit', code => console.log('Exiting with code', code));
