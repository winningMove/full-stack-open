import { Schema, model } from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const authorSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
  },
  born: {
    type: Number,
  },
});

authorSchema.plugin(mongooseUniqueValidator);

export default model("Author", authorSchema);
