const { User, Thought } = require('../models');

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  // Get a thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Create a thought and add associated user's id
  createThought(req, res) {
    console.log('You are creating a thought');
    Thought.create(req.body)
      .then((thought) => {
        User.findOneAndUpdate(
            { _id: req.body.userId },
            { $push: { thoughts: thought._id } },
            { new: true }
          )
        })
      .then((thought) => res.json(thought))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // Update a thought
  updateThought(req, res) {
    console.log('You are updating a thought');
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
    .then((thought) => {
      User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: thought._id } },
          { new: true }
        )
    })
    .then(() => res.json({ message: 'Thought successfully updated' }))
    .catch((err) => res.status(500).json(err));
  },
  // Delete a thought
  deleteThought(req, res) {
    console.log('You are deleting a thought');
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then(() => res.json({ message: 'Thought deleted' }))
      .catch((err) => res.status(500).json(err));
  },
  
  // Create a reaction
  addReaction(req, res) {
    console.log('You are adding a reaction');
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: 'No thought found with that ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Remove a reaction
  removeReaction(req, res) {
    console.log('You are removing a reaction');
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: 'No thought found with that ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
};


