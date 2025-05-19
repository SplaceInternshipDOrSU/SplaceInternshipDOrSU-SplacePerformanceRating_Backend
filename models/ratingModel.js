const { Schema, model } = require("mongoose");

const criterionSchema = new Schema({
  criterion: { type: String, required: true },
  maxScore: { type: Number, required: true },
  scoreStars: { type: Number, required: true },
  scoreWeighted: { type: Number, required: true },
  comments: { type: String },
}, { _id: false });

const ratingSchema = new Schema({
  evaluatedUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  evaluator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  roleOfEvaluator: {
    type: String,
    enum: ['self', 'peer', 'supervisor', 'manager', 'coo', 'ceo'],
    required: true,
  },
  category: { // Category of the user being evaluated
    type: String,
    enum: ['rankandfile', 'supervisor', 'manager', 'coo', 'ceo'],
    required: true,
  },
  quarter: { type: Number, required: true },   // 1 to 4
  year: { type: Number, required: true },      // e.g., 2025
  ratings: [criterionSchema], // Array of rating objects
  totalScore: { type: Number }, // Calculated from ratings.scoreWeighted
  createdAt: { type: Date, default: Date.now },
});

// Compute total weighted score before saving
ratingSchema.pre('save', function (next) {
  this.totalScore = this.ratings.reduce((sum, r) => sum + r.scoreWeighted, 0);
  next();
});

module.exports = model("Rating", ratingSchema);
