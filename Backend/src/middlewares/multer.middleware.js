import multer from "multer";
import path from "path"; // To manage file paths

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp"); // Set destination folder
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Create unique suffix
        const fileExt = path.extname(file.originalname); // Get the file extension
        const baseName = path.basename(file.originalname, fileExt); // Get the original filename without the extension
        
        cb(null, baseName + '-' + uniqueSuffix + fileExt); // Append suffix to the original filename and include the extension
    }
});

export const upload = multer({ storage });
