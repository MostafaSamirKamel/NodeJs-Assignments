const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

const getAllAuthors = async (req, res) => {
    try {
        const db = getDB();
        const result = await db.collection('authors').find().toArray();
        console.log(`Fetched ${result.length} authors`);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in getAllAuthors:', error);
        res.status(500).json({ error: error.message });
    }
};

const insertOneAuthor = async (req, res) => {
    try {
        console.log('Inserting author:', req.body);
        const db = getDB();
        const result = await db.collection('authors').insertOne(req.body);
        console.log('Author insertion result:', result);
        res.status(201).json({ acknowledged: result.acknowledged, insertedId: result.insertedId });
    } catch (error) {
        console.error('Error in insertOneAuthor:', error);
        res.status(500).json({ error: error.message });
    }
};

const deleteAuthorById = async (req, res) => {
    try {
        const db = getDB();
        const id = req.params.id;
        console.log(`Deleting author with ID: ${id}`);
        const result = await db.collection('authors').deleteOne({ _id: new ObjectId(id) });
        res.status(200).json({ acknowledged: result.acknowledged, deletedCount: result.deletedCount });
    } catch (error) {
        console.error('Error in deleteAuthorById:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllAuthors,
    insertOneAuthor,
    deleteAuthorById
};
