const express = require('express');
const router = express.Router();

const {getMyRegistrations,cancelRegistration,registerForEvent} = require('../controllers/registrationController');

// POST /api/registrations
router.post('/api/registrations', registerForEvent);

// GET /api/registrations/:email
router.get('/api/registrations/:email', getMyRegistrations);

// DELETE /api/registrations/:id
router.delete('/api/registrations/:id', cancelRegistration);

module.exports = router;