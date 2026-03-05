const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

let db;

// Connect to MongoDB
async function connectDB() {
    await client.connect();
    db = client.db("myDatabase");
    console.log("Connected to MongoDB");
}

connectDB();


// POST API - Save message
app.post('/api/message', async (req, res) => {
    const { message, location, country, dob, address, gender } = req.body;

    const doc = {
        message: message || '',
        location: location ?? '',
        country: country ?? '',
        dob: dob ?? '',
        address: address ?? '',
        gender: gender ?? ''
    };
    console.log('Saving to MongoDB:', doc);

    const result = await db.collection("messages").insertOne(doc);

    res.json({
        success: true,
        id: result.insertedId
    });
});


// GET API - Get messages
app.get('/api/messages', async (req, res) => {
    const messages = await db.collection("messages").find().toArray();
    // Ensure _id is always a string for the frontend
    const normalized = messages.map(doc => ({
        ...doc,
        _id: doc._id.toString()
    }));
    res.json(normalized);
});


// PUT API - Update message
app.put('/api/message/:id', async (req, res) => {
    const { id } = req.params;
    const { message, location, country, dob, address, gender } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: 'Invalid id' });
    }

    const result = await db.collection("messages").updateOne(
        { _id: new ObjectId(id) },
        { $set: {
            message: message ?? '',
            location: location ?? '',
            country: country ?? '',
            dob: dob ?? '',
            address: address ?? '',
            gender: gender ?? ''
        }}
    );

    if (result.matchedCount === 0) {
        return res.status(404).json({ success: false, error: 'Message not found' });
    }

    res.json({ success: true });
});


// DELETE API - Delete message
app.delete('/api/message/:id', async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: 'Invalid id' });
    }

    const result = await db.collection("messages").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
        return res.status(404).json({ success: false, error: 'Message not found' });
    }

    res.json({ success: true });
});


app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});