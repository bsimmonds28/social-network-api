const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .then(async (users) => {
        const userObj = {
          users,
        };
        return res.json(userObj);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // Get a single user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select('-__v')
      .then(async (user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json({
              user,
            })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a new user
  createUser(req, res) {
    console.log('You are creating a user');
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },

  // Update a user
  updateUser(req, res) {
    console.log('You are updating a user');
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with this id' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Delete a user and remove their associated thought
  deleteUser(req, res) {
    console.log('You are deleting a user');
    console.log(req.params)
    console.log(req.params.userId)
    User.findOneAndRemove({ _id: req.params.userId })
      .then(() => res.json({ message: 'User successfully deleted' })
      )
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  // Add a freind to a user
  addFriend(req, res) {
    console.log('You are adding a friend');
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $push: { friends: req.body.userId } },
    )
      .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: 'No user found with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Remove a friend from a user
  removeFriend(req, res) {
    console.log('You are removing a friend');
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
    )
      .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: 'No user found with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};
