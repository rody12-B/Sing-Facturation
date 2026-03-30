const multer  = require('multer');

// configuration du stockage 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

//filtrer les fichiers 

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)){
        cb(null, true);
    } else {
        cb(new Error('Uniquement .jpeg, .png, .jpg, et .pdf sont les formats autorisés'), false)
    }
}; 

const upload = multer({ storage, fileFilter });
module.exports = upload;