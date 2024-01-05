const mongoose = require('mongoose');
const { campgroundSchema } = require('../schema');
const Schema = mongoose.Schema;
const Review = require('./review')

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    // embedding many reviews  into one campground as an array
    reviews: [
        {
            type: Schema.Types.ObjectId,
            // object id from a Review model
            ref: 'Review'
        }
    ]
});

CampgroundSchema.post('findOneAndDelete', async function(doc) {
    if(doc) {
        // deleting all reviews aftter deleteing a campground
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);