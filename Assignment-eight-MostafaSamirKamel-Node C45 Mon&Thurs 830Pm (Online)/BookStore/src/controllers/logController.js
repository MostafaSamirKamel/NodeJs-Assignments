const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

const insertLog = async (req, res) => {
    try {
        const db = getDB();
        const result = await db.collection('logs').insertOne(req.body);
        res.status(201).json({ acknowledged: result.acknowledged, insertedId: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllLogs = async (req, res) => {
    try {
        const db = getDB();
        const result = await db.collection('logs').find().toArray();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteLogById = async (req, res) => {
    try {
        const db = getDB();
        const id = req.params.id;
        const result = await db.collection('logs').deleteOne({ _id: new ObjectId(id) });
        res.status(200).json({ acknowledged: result.acknowledged, deletedCount: result.deletedCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    insertLog,
    getAllLogs,
    deleteLogById
};
