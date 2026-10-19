import multer from "multer";

const storage = multer.memoryStorage();

const upload =multer({
    storage,
    limits: {fileSize: 50 * 1024 * 1024}, // 50MB
    fileFilter: (req, file, cb) => {
        if(!file.mimetype.startsWith("image/") && !file.mimetype.startsWith("video/")){
            return cb(new Error("Only image and video files are allowed"), false);
        }
        cb(null, true);
    },

})

export default upload;