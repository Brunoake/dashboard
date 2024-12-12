const express = require('express');
const { getMetrics } = require('../Controllers/MetaControllers');

const router = express.Router();

router.get('/metrics', getMetrics);

module.exports = router;