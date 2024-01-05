const express = require('express');

// id can be accessed, as we were unable to do before
// we do it by {mergeParams: true}
const router = express.Router({mergeParams: true});

const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')

const {reviewSchema} = require('../schema');

const Campground = require('../models/campground');
const Review = require('../models/review')

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        // err.details will be an array of objects
        const msg = error.details.map(el => el.message).join(','); 
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review)
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!')
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:reviewId', catchAsync(async(req, res) => {
    // pull removes all instances of a value or values that match specified condition
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review')
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router; 