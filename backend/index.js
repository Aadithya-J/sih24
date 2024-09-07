const express = require('express');
const app = express();
const port = 4000;
const cors = require('cors');
app.use(express.json());
app.use(cors());
const fetchRoadmap = require('./roadmap.js');
const resumeAnalyser = require('./resumeAnalyser');

app.get('/', (req, res) => 
    {
        res.send('Hello World!');
    }
);

app.get('/roadmap/:title', (req, res) =>
    {
        fetchRoadmap(req.params.title).then((data) =>
            {
                res.json(data);
            }
        ).catch((error) =>
            {
                console.error('Error fetching roadmap:', error);
                res.status(500).json({ error: 'An error occurred while fetching the roadmap' });
            }
        );
    }
);

// Use the resumeAnalyser route
app.use('/analyse-resume', resumeAnalyser);

app.listen(port, () =>
    {
        console.log(`app listening at http://localhost:${port}`);
    }
);


app.post('/api/jobs', async (req, res) => {
    try {
        const jobData = req.body;
        // const job = new Job(jobData);
        // await job.save();
        res.status(200).json({ message: 'Job data saved successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while saving job data.' });
    }
});
