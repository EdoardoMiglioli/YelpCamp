const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}

module.exports.renderNewForm =  (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully created a new campground');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async(req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        // for every review there will be an author populated
        path: 'reviews',
        populate: {
            path: 'author'
        }
    // for every campground there will be a single author populated
    }).populate('author');
    if(!campground) {
        req.flash('error', 'Cannot find the campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
}

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground) {
        req.flash('error', 'Cannot find the campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
}

module.exports.updateCampground = async (req, res) => {
    const {id} = req.params;
    // below is an object and it is way to pass by
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success', 'Successfully added campground');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a campground')
    res.redirect('/campgrounds');
}