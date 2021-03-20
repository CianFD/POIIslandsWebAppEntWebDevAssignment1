"use strict";
const POI = require("../models/poi");
const User = require("../models/user");

const POIs = {
  home: {
    handler: function(request, h) {
      return h.view("home", { title: "Home" });
    }
  },
  report: {
    handler: async function(request, h) {
      const pois = await POI.find().populate("creator").lean();
      return h.view("report", {
        title: "POIs Added",
        pois: pois
      });
    }
  },
  addPOI: {
    handler: async function(request, h) {
      try {
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        const data = request.payload;
        const newPOI = new POI({
          name: data.name,
          description: data.description,
          category: data.category,
          creator: user._id
        });
        await newPOI.save();
        return h.redirect("/report");
      } catch (err) {
        return h.view("main", { errors: [{ message: err.message }] });
      }
    }
  }
};

module.exports = POIs;
