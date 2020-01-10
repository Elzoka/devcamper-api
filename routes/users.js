const express = require('express');

const {getUsers, getUser, createUser, updateUser, deleteUser} = require('../controllers/users');

const advancedResults = require('../middleware/advancedResults');
const {protect, authorize} = require('../middleware/auth');

const User = require('../models/User');

const router = express.Router({mergeParams: true});


router.use(protect, authorize('admin'));

router
    .route('/')
    .get(advancedResults(User) , getUsers)
    .post(createUser);

router
    .route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);


module.exports = router;