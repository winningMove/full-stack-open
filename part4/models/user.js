import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      minLength: 3,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: String,
    blogs: [{ type: Schema.Types.ObjectId, ref: "Blog" }],
  },
  {
    toJSON: {
      transform: (_, ret) => {
        ret.id = String(ret._id);
        delete ret._id;
        delete ret.__v;
        delete ret.password;
      },
    },
  }
);

export default model("User", userSchema);
