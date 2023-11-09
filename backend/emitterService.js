const crypto = require('crypto');
const io = require('socket.io-client');

const socket = io('http://localhost:3000'); // Connect to listener service

const data = require('./data.json'); // Load the data for name, origin, destination

function generateRandomMessage() {
    // Create a function to generate a single random message
    const randomIndex = Math.floor(Math.random() * data.length);
    const { name, origin, destination } = data[randomIndex];

    const originalMessage = { name, origin, destination };
    const secret_key = crypto.createHash('sha256').update(JSON.stringify(originalMessage)).digest('hex');

    const sumCheckMessage = { ...originalMessage, secret_key };
    const encryptedMessage = encryptMessage(JSON.stringify(sumCheckMessage), 'passkey');

    return encryptedMessage;
}

function encryptMessage(message, passkey) {
    const cipher = crypto.createCipher('aes-256-ctr', passkey);
    let encrypted = cipher.update(message, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function sendStream() {
    const messageStream = Array.from({ length: Math.floor(Math.random() * 450) + 50 }, () => generateRandomMessage()).join('|');
    socket.emit('dataStream', messageStream); // Send the encrypted data stream
}

setInterval(sendStream, 10000); // Send every 10 seconds
