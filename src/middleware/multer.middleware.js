import multer from "multer";

/**
 * 
 * @returns a middleware with multer
 * @example uploadFiles().single('profile' || 'products' || 'documents') <= Los nombres de los fieldname
 */
export const uploadFiles = () => {
    const generateFileName = (req, file, cb) => {
        const extension = file.originalname.split('.').pop();
        const name = file.originalname.split('.').shift();
        const fileName = `${file.fieldname}-${req.user? req.user.user.first_name : req.body.first_name}-${name}.${extension}`;
        cb(null, fileName);
    };

    const destination = (req, file, cb) => {
        if (file.fieldname === 'profile') {
            cb(null, 'public/img/profiles');
        } else if (file.fieldname === 'products') {
            cb(null, 'public/img/products');
        } else if (file.fieldname === 'documents') {
            cb(null, 'public/documents');
        } else {
            cb(new Error('Tipo de archivo no válido'));
        }
    };

    const storage = multer.diskStorage({
        destination: destination,
        filename: generateFileName,
    });

    return multer({ storage: storage });
};