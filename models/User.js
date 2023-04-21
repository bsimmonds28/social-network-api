const { Schema, model } = require('mongoose');

// Schema to create User model
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /.+\@.+\..+/,
    },
    thoughts: [
        {
            type: Schema.types.objectId,
            ref: 'thought',
        }
    ],
    //Array of _id values referencing teh User model (self-reference)
    friends: [
        {
            type: Schema.types.objectId,
            ref: 'user',
        }
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// Create a virtual property
postSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

const User = model('user', userSchema);

module.exports = User;
