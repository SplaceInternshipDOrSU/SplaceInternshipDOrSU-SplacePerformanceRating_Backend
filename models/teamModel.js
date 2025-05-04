const { Schema, model } = require("mongoose");

const teamSchema = new Schema(
  {
    name: { type: String, required: true },

    // Assigned Users
    ceo: { type: Schema.Types.ObjectId, ref: 'User', unique: true },
    coo: { type: Schema.Types.ObjectId, ref: 'User', unique: true },
    supervisor: { type: Schema.Types.ObjectId, ref: 'User', unique: true },
    manager: { type: Schema.Types.ObjectId, ref: 'User', unique: true },

    rankandfile: [{ type: Schema.Types.ObjectId, ref: 'User' }], // array because multiple allowed

  },
  { timestamps: true }
);

module.exports = model("Team", teamSchema);
