const express = require('express');
const router = express.Router();
const noteController = require('../controllers/note.controller');
const auth = require('../middleware/auth.middleware');

// Note APIs - All require authentication
router.use(auth);

// 1. PATCH /all (static — must come first)
router.patch('/all', noteController.updateAllTitles);

// 2. GET /paginate-sort (static)
router.get('/paginate-sort', noteController.getPaginatedNotes);

// 3. GET /note-by-content (static)
router.get('/note-by-content', noteController.getNoteByContent);

// 4. GET /note-with-user (static)
router.get('/note-with-user', noteController.getNotesWithUser);

// 5. GET /aggregate (static)
router.get('/aggregate', noteController.getAggregateNotes);

// 6. POST / (create)
router.post('/', noteController.createNote);

// 7. DELETE / (delete all)
router.delete('/', noteController.deleteAllNotes);

// 8. PUT /replace/:noteId (dynamic)
router.put('/replace/:noteId', noteController.replaceNote);

// 9. PATCH /:noteId (dynamic — must come AFTER statics)
router.patch('/:noteId', noteController.updateNote);

// 10. GET /:id (dynamic — must come AFTER statics)
router.get('/:id', noteController.getNoteById);

// 11. DELETE /:noteId (dynamic)
router.delete('/:noteId', noteController.deleteNote);

module.exports = router;
