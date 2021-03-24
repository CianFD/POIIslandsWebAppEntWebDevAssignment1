"use strict";

const Mongoose = require("mongoose");
const Boom = require("@hapi/boom");
const Schema = Mongoose.Schema;

const adminSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  role: String,
});

adminSchema.statics.findByEmail = function(email) {
  return this.findOne({ email : email});
};

adminSchema.methods.comparePassword = function(candidatePassword) {
  const isMatch = this.password === candidatePassword;
  if (!isMatch) {
    throw Boom.unauthorized('Password mismatch');
  }
  return this;
};

module.exports = Mongoose.model("Admin", adminSchema);