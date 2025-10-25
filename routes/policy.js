const express = require('express');
const router = express.Router();
const policyController = require('../controllers/policyController');

router.get('/search', policyController.searchPolicyByUsername);
router.get('/aggregate-by-user', policyController.aggregatePoliciesByUser);

module.exports = router;
