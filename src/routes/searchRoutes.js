const express = require('express');
const router = express.Router();

const searchController = require('../controllers/searchController');
const middleware = require('../middleware');

router.get('/' ,middleware.authMiddleware, searchController.getSearch);
router.get('/:selectedTab' ,middleware.authMiddleware, searchController.getSelectedTab);

module.exports = router;
