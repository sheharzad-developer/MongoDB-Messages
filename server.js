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


// POST API - Create record
app.post('/api/record', async (req, res) => {
    const { name, email, phone, message, address, gender } = req.body;

    const doc = {
        name: name ?? '',
        email: email ?? '',
        phone: phone ?? '',
        message: message ?? '',
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


// GET API - Get records
app.get('/api/records', async (req, res) => {
    const messages = await db.collection("messages").find().toArray();
    const normalized = messages.map(doc => ({
        _id: doc._id.toString(),
        name: String(doc.name ?? ''),
        email: String(doc.email ?? ''),
        phone: String(doc.phone ?? ''),
        message: String(doc.message ?? ''),
        address: String(doc.address ?? ''),
        gender: String(doc.gender ?? '')
    }));
    res.json(normalized);
});


// PUT API - Update record
app.put('/api/record/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, message, address, gender } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: 'Invalid id' });
    }

    const result = await db.collection("messages").updateOne(
        { _id: new ObjectId(id) },
        { $set: {
            name: name ?? '',
            email: email ?? '',
            phone: phone ?? '',
            message: message ?? '',
            address: address ?? '',
            gender: gender ?? ''
        }}
    );

    if (result.matchedCount === 0) {
        return res.status(404).json({ success: false, error: 'Record not found' });
    }

    res.json({ success: true });
});


// DELETE API - Delete message
app.delete('/api/record/:id', async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: 'Invalid id' });
    }

    const result = await db.collection("messages").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
        return res.status(404).json({ success: false, error: 'Record not found' });
    }

    res.json({ success: true });
});


app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});