"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const categorySchema = Schema({
  category: String
});

module.exports = Mongoose.model("Category", categorySchema);