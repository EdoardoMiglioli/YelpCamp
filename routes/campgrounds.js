const express = require('express');
const {campgroundSchema} = require('../schema');
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground');
const router = express.Router({mergeParams: true});
const {isLoggedIn} = require('../middleware')

// joi validation middleware
const validateCampground = (req, res, next) => {
    // validating requested data
    const {error} = campgroundSchema.validate(req.body);

    if(error) {
        // err.details will be an array of objects
        const msg = error.details.map(el => el.message).join(','); 
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}))

// to add a new campground
router.get('/new', isLoggedIn, (req, res) => {
    
    res.render('campgrounds/new');
})

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully created a new campground');
    res.redirect(`/campgrounds/${campground._id}`)
}))

// to find a campground by id
router.get('/:id', catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if(!campground) {
        req.flash('error', 'Cannot find the campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
}));

// to edit a campground
router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground) {
        req.flash('error', 'Cannot find the campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
}))

// to update
router.put('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const {id} = req.params;
    // below is an object and it is way to pass by
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success', 'Successfully added campground');
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a campground')
    res.redirect('/campgrounds');
}))

module.exports = router;