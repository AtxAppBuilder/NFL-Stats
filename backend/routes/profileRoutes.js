const express = require('express')
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");

const {  
    getProfile, 
    updateProfile, 
    deleteProfile, 
    // createProfile, 
    uploadAvatar 
} = require("../controllers/profileController.js");

router.use(authMiddleware);
router.get("/profile", getProfile);
router.put('/profile', updateProfile)
router.delete('/profile', deleteProfile)
router.post("/avatar", upload.single("avatar"), uploadAvatar);

module.exports = router;