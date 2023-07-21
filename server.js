const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(express.static('public'));  // Serve static files from 'public' directory

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

app.post('/submit', (req, res) => {
    const clientData = req.body;

    // Create a new data object with the desired order
    const data = {};

    // Convert timezone offset to string
    const offsetMinutes = new Date().getTimezoneOffset();
    const sign = offsetMinutes > 0 ? '-' : '+';
    const hours = Math.abs(Math.floor(offsetMinutes / 60));
    const minutes = Math.abs(offsetMinutes) % 60;
    const offsetString = `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    data.timeZone = offsetString;

    // Add a UTC timestamp
    data.timestamp = new Date().toISOString();

    // Capture the IP
    // Adjusted to work with potential proxies like NGINX
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    data.ipAddress = ipAddress.startsWith('::ffff:') ? ipAddress.split('::ffff:')[1] : ipAddress;
    
    // Capture Source Port
    data.sourcePort = req.connection.remotePort;
    console.log("Connect from:", data.ipAddress, ":", data.sourcePort);

    // Spread the rest of the clientData into the data object
    Object.assign(data, clientData);

    data.acceptLanguage = req.headers['accept-language'];
    data.doNotTrack = req.headers['dnt'];

    fs.appendFile('data/fingerprintData.txt', JSON.stringify(data) + '\n', (err) => {
        if (err) {
            console.error('Failed to save data:', err);
            res.status(500).json({ message: 'Failed to save data' });
            return;
        }
        res.json({ message: 'Data saved successfully' });
    });
});


app.listen(3000, () => {
    console.log('Server started on port 3000');
});

