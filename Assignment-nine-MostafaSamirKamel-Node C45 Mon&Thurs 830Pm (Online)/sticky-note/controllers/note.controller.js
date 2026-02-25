const Note = require('../models/note.model');
const mongoose = require('mongoose');

// Create Note
exports.createNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        const note = new Note({ title, content, userId: req.userId });
        await note.save();
        res.status(201).json({ message: "Note created", note });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update Single Note
exports.updateNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        let note = await Note.findById(noteId);
        if (!note) return res.status(404).json({ message: "Note not found" });

        if (note.userId.toString() !== req.userId) {
            return res.status(403).json({ message: "You are not the owner" });
        }

        note = await Note.findByIdAndUpdate(noteId, req.body, { new: true, runValidators: true });
        res.status(200).json({ message: "updated", note });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Replace Entire Note
exports.replaceNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const note = await Note.findById(noteId);
        if (!note) return res.status(404).json({ message: "Note not found" });

        if (note.userId.toString() !== req.userId) {
            return res.status(403).json({ message: "You are not the owner" });
        }

        const replacedNote = await Note.findOneAndReplace(
            { _id: noteId },
            { ...req.body, userId: req.userId },
            { new: true, overwrite: true, runValidators: true }
        );
        res.status(200).json(replacedNote);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update All Notes Titles
exports.updateAllTitles = async (req, res) => {
    try {
        const { title } = req.body;
        const result = await Note.updateMany({ userId: req.userId }, { title }, { runValidators: true });
        if (result.matchedCount === 0) return res.status(404).json({ message: "No note found" });
        res.status(200).json({ message: "All notes updated" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete Single Note
exports.deleteNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const note = await Note.findById(noteId);
        if (!note) return res.status(404).json({ message: "Note not found" });

        if (note.userId.toString() !== req.userId) {
            return res.status(403).json({ message: "You are not the owner" });
        }

        const deletedNote = await Note.findByIdAndDelete(noteId);
        res.status(200).json({ message: "deleted", note: deletedNote });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Paginated & Sorted Notes
exports.getPaginatedNotes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const notes = await Note.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get Note by ID
exports.getNoteById = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: "Note not found" });

        if (note.userId.toString() !== req.userId) {
            return res.status(403).json({ message: "You are not the owner" });
        }

        res.status(200).json(note);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get Note by Content
exports.getNoteByContent = async (req, res) => {
    try {
        const { content } = req.query;
        const note = await Note.findOne({ userId: req.userId, content });
        if (!note) return res.status(404).json({ message: "No note found" });
        res.status(200).json(note);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Notes with User Info (Populate)
exports.getNotesWithUser = async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.userId })
            .populate('userId', 'email')
            .select('title userId createdAt');
        res.status(200).json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Aggregation with Search
exports.getAggregateNotes = async (req, res) => {
    try {
        const { title } = req.query;
        const matchStage = { userId: new mongoose.Types.ObjectId(req.userId) };

        if (title) {
            matchStage.title = { $regex: title, $options: 'i' };
        }

        const notes = await Note.aggregate([
            { $match: matchStage },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    title: 1,
                    userId: 1,
                    createdAt: 1,
                    'user.name': 1,
                    'user.email': 1
                }
            }
        ]);

        res.status(200).json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete All User Notes
exports.deleteAllNotes = async (req, res) => {
    try {
        await Note.deleteMany({ userId: req.userId });
        res.status(200).json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
