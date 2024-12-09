import { Schema, model } from "mongoose";

const blogSchema = new Schema(
  {
    title: String,
    author: String,
    url: String,
    likes: Number,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    comments: [String],
  },
  {
    toJSON: {
      transform: (_, ret) => {
        ret.id = String(ret._id);
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export default model("Blog", blogSchema);
