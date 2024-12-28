import { Schema, model } from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
  },
  favoriteGenre: {
    type: String,
  },
});

userSchema.plugin(mongooseUniqueValidator);

export default model("User", userSchema);
