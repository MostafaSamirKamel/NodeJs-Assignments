const { getDB } = require('../config/db');

const createExplicitCollection = async (req, res) => {
    try {
        const db = getDB();
        await db.createCollection('books', {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: ['title'],
                    properties: {
                        title: {
                            bsonType: 'string',
                            description: 'must be a string and is required',
                            minLength: 1
                        }
                    }
                }
            }
        });
        res.status(201).json({ ok: 1 });
    } catch (error) {
        if (error.codeName === 'NamespaceExists') {
            return res.status(200).json({ ok: 1, message: 'Collection already exists' });
        }
        res.status(500).json({ error: error.message });
    }
};

const createImplicitCollection = async (req, res) => {
    try {
        const db = getDB();
        const result = await db.collection('authors').insertOne(req.body);
        res.status(201).json({ acknowledged: result.acknowledged, insertedId: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createCappedCollection = async (req, res) => {
    try {
        const db = getDB();
        await db.createCollection('logs', {
            capped: true,
            size: 1024 * 1024 // 1MB
        });
        res.status(201).json({ ok: 1 });
    } catch (error) {
        if (error.codeName === 'NamespaceExists') {
            return res.status(200).json({ ok: 1, message: 'Collection already exists' });
        }
        res.status(500).json({ error: error.message });
    }
};

const createIndex = async (req, res) => {
    try {
        const db = getDB();
        const result = await db.collection('books').createIndex({ title: 1 });
        res.status(200).send(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createExplicitCollection,
    createImplicitCollection,
    createCappedCollection,
    createIndex
};
