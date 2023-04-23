const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (date) => {
        //or try .toDateString()
        if (date) return date.toISOString().split("T") [0];
      },
    },
    //Check - user that created this thought
    username: [
        {
          type: Schema.Types.ObjectId,
          ref: 'user',
          required: true,
        },
      ],
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      getters: true,
      virtuals: true,
    },
    id: false,
  }
);

// Create a virtual property
thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

const Thought = model('thought', thoughtSchema);

module.exports = Thought;
