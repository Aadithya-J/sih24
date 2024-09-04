const express = require('express');
const app = express();
const port = 4000;

app.use(express.json());

const fetchRoadmap = require('./roadmap.js');

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



app.listen(port, () =>
    {
        console.log(`app listening at http://localhost:${port}`);
    }
);