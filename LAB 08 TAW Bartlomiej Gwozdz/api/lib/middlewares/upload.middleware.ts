import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Sprawdzanie, czy na pewno jest ścieżka do zapisu obrazów
const uploadDir = path.join(__dirname, '../../images');
console.log('Upload directory:', uploadDir);

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Created upload directory:', uploadDir);
}

// Miejsce na obrazy postów (konfiguracja)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('Destination called for file:', file.originalname);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = 'image-' + uniqueSuffix + path.extname(file.originalname);
        console.log('Generated filename:', filename);
        cb(null, filename);
    }
});

const fileFilter = (req: any, file: any, cb: any) => {
    console.log('File filter check for:', file.originalname, 'mimetype:', file.mimetype);
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (allowedMimes.includes(file.mimetype)) {
        console.log('File accepted:', file.originalname);
        cb(null, true);
    } else {
        console.log('File rejected:', file.originalname);
        cb(new Error('Only image files are allowed (jpeg, png, gif, webp)'), false);
    }
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

export default upload;
