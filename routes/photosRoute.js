const express = require("express");
const app = express();
const router = express.Router();
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

router.get("/:photoId", async (req, res) => {});

//Crete One
router.post("/", async (req, res) => {
  try {
    const fileStr = req.body.data;
    const uploadedResponse = await cloudinary.uploader.unsigned_upload(
      fileStr,
      "testPreset"
    );
    console.log("Photo Uploaded");
    res.json({ newUrl: uploadedResponse.url });
  } catch (err) {
    console.error(err);
    res.status(400).json({ err: "Couldn't Upload" });
  }
});

module.exports = router;
