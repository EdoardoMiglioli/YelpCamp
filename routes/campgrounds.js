const express = require('express');
const catchAsync = require('../utils/catchAsync')
const router = express.Router({mergeParams: true});
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')
const campgrounds = require('../controllers/campgrounds')

// fancy way of writing the routers when many router having the same path
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

// to add a new campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    // to find a campground by id
    .get(catchAsync(campgrounds.showCampground))
    // to update
    .put(isLoggedIn, isAuthor, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))


// to edit a campground
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))


module.exports = router;