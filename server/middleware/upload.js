import multer from "multer";

// Set up multer to store the file temporarily in memory (buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
