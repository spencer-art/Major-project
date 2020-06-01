const mongoose = require("mongoose");
const slugify = require("slugify");

//Category schema
const suitSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "a suit must have a name"],
        unique: true,
        maxlength: [40, 'A product name must have less or equal then 40 characters'],
        minlength: [10, 'A product name must have more or equal then 10 characters']
    },
    slug: String,
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, "a suit must have a prrice"]
    },
    fabric: {
        type: String
    },
    construction: {
        type: String
    },
    category: String,
    description: {
        type: String,
        trim: true
    },
    images: [String],
    imageCover: String

}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

suitSchema.index({
    price: 1
});
suitSchema.index({
    slug: 1
});

// Virtual populate
suitSchema.virtual('reviews', {
    ref: 'Reviews',
    foreignField: 'suit',
    localField: '_id'
});

//DOC MIDDLEWARE:RUNS BREFORE .SAVE() AND .CREATE()
suitSchema.pre('save', function (next) {
    this.slug = slugify(this.name, {
        lower: true
    });
    next();
});




const Suit = mongoose.model("Suit", suitSchema);
module.exports = Suit;