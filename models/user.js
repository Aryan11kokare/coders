const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    courses:[{
      type:Schema.Types.ObjectId,
      ref:"Course"
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
