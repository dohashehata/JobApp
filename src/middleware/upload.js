

import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4(); 
    const fileExtension = path.extname(file.originalname); 
    cb(null, `${uniqueSuffix}${fileExtension}`); 
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') { 
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
