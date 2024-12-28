import { Schema, model } from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
  },
  published: {
    type: Number,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "Author",
  },
  genres: [{ type: String }],
});
bookSchema.plugin(mongooseUniqueValidator);

export default model("Book", bookSchema);
