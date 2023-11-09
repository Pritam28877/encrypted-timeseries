const crypto = require('crypto');
const io = require('socket.io')();
const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/timeseriesDB', { useNewUrlParser: true, useUnifiedTopology: true });

const DataModel = mongoose.model('Data', {
    name: String,
    origin: String,
    destination: String,
    secret_key: String,
    timestamp: { type: Date, default: Date.now }
});

io.on('connection', (socket) => {
    socket.on('dataStream', (encryptedDataStream) => {
        const messages = encryptedDataStream.split('|');
        
        messages.forEach(encryptedMessage => {
            const decryptedMessage = decryptMessage(encryptedMessage, 'passkey');
            const data = JSON.parse(decryptedMessage);
            
            const { name, origin, destination, secret_key } = data;

            // Validate secret_key
            const calculatedKey = crypto.createHash('sha256').update(JSON.stringify({ name, origin, destination })).digest('hex');
            
            if (calculatedKey === secret_key) {
                const newData = new DataModel({ name, origin, destination });
                newData.save();
            } else {
                console.log('Data integrity compromised');
            }
        });
    });
});

io.listen(3000); // Listener service listens on port 3000
