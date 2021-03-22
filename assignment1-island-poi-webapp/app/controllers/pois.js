"use strict";
const POI = require("../models/poi");
const User = require("../models/user");
const Gallery = require("../controllers/gallery");
const ImageStore = require('../utils/image-store');

const POIs = {
  home: {
    handler: async function(request, h) {
      const pois = await POI.find().populate().lean();
      const allImages = await ImageStore.getAllImages();
      return h.view("home", {
        title: "Home",
        pois: pois,
        images: allImages
      });
    }
  },
  report: {
    handler: async function(request, h) {
      const pois = await POI.find().populate("creator").lean();
      return h.view("report", {
        title: "Islands Added",
        pois: pois
      });
    }
  },
  showAddPOI: {
    auth: false,
    handler: function (request, h) {
      return h.view("add", { title: "Add an Island" });
    },
  },
  addPOI: {
    handler: async function(request, h) {
      try {
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        const data = request.payload;
        const file = request.payload.imagefile;
        if (Object.keys(file).length > 0) {
          await ImageStore.uploadImage(request.payload.imagefile);
        }
        const newPOI = new POI({
          name: data.name,
          description: data.description,
          category: data.category,
          creator: user._id
        });
        await newPOI.save();
        return h.redirect("/home");
      } catch (err) {
        return h.view("home", { errors: [{ message: err.message }] });
      }
    },
    payload: {
      multipart: true,
      output: 'data',
      maxBytes: 209715200,
      parse: true
    }
  }
};

module.exports = POIs;
