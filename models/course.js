const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "where the title of course?"],
    },
    image: {
      type: String,
    },
    description: {
      type: String,
      required: [true, "where the description of course?"],
    },
    syllabus: {
      course: {
        overview: { type: String,  required: [true, "where the  overview of syllabus?"], },
        prerequisites: [{ type: String,  required: [true, "where the  prerequisites of syllabus?"] }],
      },
      modules: [
        {
          title: { type: String,  required: [true, "where the  title of chapter?"], },
          topics: [{ type: String,  required: [true, "where the  topics of chapter?"], }],
        },
      ],
      project: [
        {
          title: { type: String,  required: [true, "where the  title of project?"], },
          description: { type: String,  required: [true, "where the  description of project?"], },
        },
      ],
      references: [{ type: String }],
    },
    duration: {
      type: String,
      required: [true, "where the  duration of course?"],
    },
    price: {
      type: Number,
      min: [10, 'minimum 10 ruppes price'],
     required: [true, "where the  price of course?"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
