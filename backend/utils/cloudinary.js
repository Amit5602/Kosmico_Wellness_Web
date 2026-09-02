const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const https = require('https');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sweetmonk/products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    agent: new https.Agent({ family: 4 }),
  },
});

const upload = multer({ storage: storage });

module.exports = {
  cloudinary,
  upload,
};
