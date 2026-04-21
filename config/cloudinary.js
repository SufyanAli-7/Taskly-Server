const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: 'dvdvw8azo', 
  api_key: '313714631277283', 
  api_secret: 'REDACTED_CLOUDINARY_SECRET'
});


module.exports = cloudinary;