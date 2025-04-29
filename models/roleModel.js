const { Schema, model } = require("mongoose");

const roleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

roleSchema.index({
  name: "text",
});
module.exports = model("roles", roleSchema);
