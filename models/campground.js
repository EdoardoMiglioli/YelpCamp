const mongoose = require('mongoose');
const { campgroundSchema } = require('../schema');
const Schema = mongoose.Schema;
const Review = require('./review')


const ImageSchema = new Schema(
    {
        url: String,
        filename: String
    }
);

// this is done to show thumbnail of the image while editing/deleting
// replacing /url with /url/w_300
// where w_300 is width 300
// below is not working propoerly
// below is connected to models/campgrounds where img.thumnail
ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', 'upload/w_100');
 });

const CampgroundSchema = new Schema({
    title: String,
    images: [
        // it will store two things
        // url of cloud media and filname in which media is stored
        // cloudinary will store the media
        // mongoDB stores the url and filename of the media
        {
            url: String,
            filename: String
        }
        
    ],
    price: Number,
    description: String,
    location: String,
    // to provide specific field a owner such as review for a particular user
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
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