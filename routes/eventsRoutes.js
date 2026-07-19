const express = require('express');
const router = express.Router();
const {getAllEvents,getEventById} = require('../controllers/eventController');

router.get('/api/events',getAllEvents);
router.get('/api/events/:id',getEventById);

module.exports = router;