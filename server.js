const express = require('express');
const proc = require('process');
const server = express();

const PORT = 3333;

server.use(express.static('public'));
server.listen(PORT);

proc.stdout.write(`Transparent Smurfs on port ${PORT}`);

