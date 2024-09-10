const express = require('express');
const app = express();
const port = 4000;
const cors = require('cors');
var admin = require("firebase-admin");

var serviceAccount = require("./firebase-config.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

app.use(express.json());
app.use(cors());
const fetchRoadmap = require('./roadmap.js');
const resumeAnalyser = require('./resumeAnalyser');

// Middleware to verify Firebase ID token
const verifyFirebaseToken = async (req, res, next) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1];

    if (!idToken) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error verifying Firebase ID token:', error);
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/roadmap/:title', verifyFirebaseToken, (req, res) => {
    fetchRoadmap(req.params.title).then((data) => {
        res.json(data);
    }).catch((error) => {
        console.error('Error fetching roadmap:', error);
        res.status(500).json({ error: 'An error occurred while fetching the roadmap' });
    });
});

// Use the resumeAnalyser route
app.use('/analyse-resume', verifyFirebaseToken, resumeAnalyser);

app.post('/api/jobs', verifyFirebaseToken, async (req, res) => {
    try {
        const jobData = req.body;
        // const job = new Job(jobData);
        // await job.save();
        res.status(200).json({ message: 'Job data saved successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while saving job data.' });
    }
});


app.post('/upload-resume', upload.single('resume'), (req, res) => {
    const file = req.file;
    if (!file) {
      return res.status(400).send('Please upload a file');
    }
  
    const storagePath = `resumes/${req.uid}/${file.originalname}`;
  
    bucket.upload(file.path, {
      destination: storagePath,
      metadata: {
        contentType: file.mimetype,
      },
    }, (err, uploadedFile) => {
      if (err) {
        console.error('Error uploading file to Firebase Storage:', err);
        return res.status(500).send('An error occurred while uploading the file');
      }
  
      // File uploaded successfully
      res.status(200).send('File uploaded successfully');
    });
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});