const express = require("express");
const app = express();
const port = 4000;
const cors = require("cors");
const admin = require("firebase-admin");
const multer = require("multer");
const path = require("path");



app.use(cors());
app.use(express.json());

var serviceAccount = require("./firebase-config.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://yatharth-24.appspot.com"
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

const fetchRoadmap = require("./roadmap.js");
const resumeAnalyser = require("./resumeAnalyser");

// Configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limit file size to 5MB
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/roadmap/:title", (req, res) => {
  console.log("Fetching roadmap:", req.params.title);
  fetchRoadmap(req.params.title)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error("Error fetching roadmap:", error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching the roadmap" });
    });
});

// Use the resumeAnalyser route
app.use("/analyse-resume", resumeAnalyser);

app.post("/api/jobs", async (req, res) => {
  try {
    const jobData = req.body;
    // const job = new Job(jobData);
    // await job.save();
    res.status(200).json({ message: "Job data saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while saving job data." });
  }
});

app.post("/upload-resume", upload.single("resume"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const file = req.file;
  const uid = req.body.uid; // Assuming UID is sent in the form data

  try {
    const storagePath = `resumes/${uid}/resume.pdf`;
    const fileUpload = bucket.file(storagePath);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on("error", (error) => {
      console.error("Error uploading to Firebase Storage:", error);
      res.status(500).send("An error occurred while uploading the file");
    });

    blobStream.on("finish", async () => {
      // Get the public URL
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURIComponent(fileUpload.name)}?alt=media`;

      // Save user data to Firestore
      await db.collection("users").doc(uid).set(
        {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          city: req.body.city,
          college: req.body.college,
          resumeUrl: publicUrl,
        },
        { merge: true }
      );

      res
        .status(200)
        .send({
          message: "File uploaded successfully",
          downloadUrl: publicUrl,
        });
    });

    blobStream.end(file.buffer);
  } catch (error) {
    console.error("Error in upload process:", error);
    res.status(500).send("An error occurred during the upload process");
  }
});

app.get("/get-resume-url/:uid", (req, res) => {
  const uid = req.params.uid;
  const storagePath = `resumes/${uid}/resume.pdf`;
  bucket
    .file(storagePath)
    .getSignedUrl({
      action: "read",
      expires: "03-01-2500", // Set an expiration date for the URL
    })
    .then((url) => {
      res.status(200).json({ downloadURL: url });
    })
    .catch((error) => {
      console.error("Error generating download URL:", error);
      res
        .status(500)
        .send("An error occurred while generating the download URL");
    });
});

app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await admin.auth().createUser({
      email,
      password,
    });
    res
      .status(200)
      .json({ message: "User created successfully", uid: user.uid });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the user" });
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
