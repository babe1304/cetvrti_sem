import all from './utils';
const QRCode = require('qrcode');

const genQR = async (data, fileName) => {
    try {
        await QRCode.toFile(fileName, data);
    } catch (err) {
        console.error(err)
    }
}

logger.log('Generiram QR kod');
genQR('https://www.fer.unizg.hr/', './fer-qr.png');