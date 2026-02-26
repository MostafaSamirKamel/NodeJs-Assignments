const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

const getAllBooks = async (req, res) => {
    try {
        const db = getDB();
        const result = await db.collection('books').find().toArray();
        console.log(`Fetched ${result.length} books`);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in getAllBooks:', error);
        res.status(500).json({ error: error.message });
    }
};

const deleteBookById = async (req, res) => {
    try {
        const db = getDB();
        const id = req.params.id;
        console.log(`Deleting book with ID: ${id}`);
        const result = await db.collection('books').deleteOne({ _id: new ObjectId(id) });
        res.status(200).json({ acknowledged: result.acknowledged, deletedCount: result.deletedCount });
    } catch (error) {
        console.error('Error in deleteBookById:', error);
        res.status(500).json({ error: error.message });
    }
};

const insertOneBook = async (req, res) => {
    try {
        console.log('Inserting book:', req.body);
        const db = getDB();
        const result = await db.collection('books').insertOne(req.body);
        console.log('Insertion result:', result);
        res.status(201).json({ acknowledged: result.acknowledged, insertedId: result.insertedId });
    } catch (error) {
        console.error('Error in insertOneBook:', error);
        res.status(500).json({ error: error.message });
    }
};

const insertBatchBooks = async (req, res) => {
    try {
        const db = getDB();
        const result = await db.collection('books').insertMany(req.body);
        res.status(201).json({ acknowledged: result.acknowledged, insertedIds: result.insertedIds });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateBookByTitle = async (req, res) => {
    try {
        const db = getDB();
        const result = await db.collection('books').updateOne(
            { title: req.params.title },
            { $set: req.body }
        );
        res.status(200).json({
            acknowledged: result.acknowledged,
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const findBookByTitle = async (req, res) => {
    try {
        const db = getDB();
        const title = req.query.title;
        const result = await db.collection('books').findOne({ title });
        if (!result) return res.status(404).json({ message: 'Book not found' });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const findBooksByYearRange = async (req, res) => {
    try {
        const db = getDB();
        const { from, to } = req.query;
        const result = await db.collection('books').find({
            year: { $gte: parseInt(from), $lte: parseInt(to) }
        }).toArray();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const findBooksByGenre = async (req, res) => {
    try {
        const db = getDB();
        const genre = req.query.genre;
        const result = await db.collection('books').find({ genres: genre }).toArray();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const skipLimitSorted = async (req, res) => {
    try {
        const db = getDB();
        const result = await db.collection('books')
            .find()
            .sort({ year: -1 })
            .skip(2)
            .limit(3)
            .toArray();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const findBooksWithIntegerYear = async (req, res) => {
    try {
        const db = getDB();
        const result = await db.collection('books').find({ year: { $type: 'int' } }).toArray();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const findBooksExcludingGenres = async (req, res) => {
    try {
        const db = getDB();
        const result = await db.collection('books').find({
            genres: { $nin: ['Horror', 'Science Fiction'] }
        }).toArray();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteBooksBeforeYear = async (req, res) => {
    try {
        const db = getDB();
        const year = parseInt(req.query.year);
        const result = await db.collection('books').deleteMany({ year: { $lt: year } });
        res.status(200).json({ acknowledged: result.acknowledged, deletedCount: result.deletedCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Aggregations
const aggregate1 = async (req, res) => {
    try {
        const db = getDB();
        const result = await db.collection('books').aggregate([
            { $match: { year: { $gt: 2000 } } },
            { $sort: { year: -1 } }
        ]).toArray();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const aggregate2 = async (req, res) => {
    try {
        const db = getDB();
        const result = await db.collection('books').aggregate([
            { $match: { year: { $gt: 2000 } } },
            { $project: { title: 1, author: 1, year: 1, _id: 0 } }
        ]).toArray();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const aggregate3 = async (req, res) => {
    try {
        const db = getDB();
        const result = await db.collection('books').aggregate([
            { $unwind: '$genres' },
            { $project: { title: 1, genres: 1, _id: 0 } }
        ]).toArray();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const aggregate4 = async (req, res) => {
    try {
        const db = getDB();
        const result = await db.collection('logs').aggregate([
            {
                $lookup: {
                    from: 'books',
                    let: { book_id: { $toObjectId: '$book_id' } },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$_id', '$$book_id'] } } }
                    ],
                    as: 'book_details'
                }
            },
            {
                $project: {
                    _id: 0,
                    action: 1,
                    book_details: 1
                }
            }
        ]).toArray();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    insertOneBook,
    insertBatchBooks,
    updateBookByTitle,
    findBookByTitle,
    findBooksByYearRange,
    findBooksByGenre,
    skipLimitSorted,
    findBooksWithIntegerYear,
    findBooksExcludingGenres,
    deleteBooksBeforeYear,
    aggregate1,
    aggregate2,
    aggregate3,
    aggregate4,
    getAllBooks,
    deleteBookById
};
