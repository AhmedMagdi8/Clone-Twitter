const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    content: {
      type: String,
      trim: true,
    },
    postedBy: { type: Schema.Types.ObjectId, ref: "User" },
    pinned: { type: Boolean },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    retweetUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    retweetData: { type: Schema.Types.ObjectId, ref: "Post" },
    replyTo: { type: Schema.Types.ObjectId, ref: "Post" },
    pinned: Boolean

  },
  { timestamps: true }
);

const postModel = mongoose.model("Post", postSchema);

module.exports = postModel;
