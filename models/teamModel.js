const { Schema, model } = require("mongoose");

const teamSchema = new Schema(
  {
    name: { type: String, required: true, unique: true }, // Make name unique

    // Assigned Users
    ceo: { type: Schema.Types.ObjectId, ref: 'User' },
    coo: { type: Schema.Types.ObjectId, ref: 'User' },
    supervisor: { type: Schema.Types.ObjectId, ref: 'User' },
    manager: { type: Schema.Types.ObjectId, ref: 'User' },

    rankandfile: [{ type: Schema.Types.ObjectId, ref: 'User' }], // array because multiple allowed
  },
  { timestamps: true }
);

module.exports = model("Team", teamSchema);
