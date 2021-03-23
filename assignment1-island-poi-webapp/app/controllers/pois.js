"use strict";

const Joi = require("@hapi/joi");

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
  },
  showEditPOI: {
    auth: false,
    handler: function (request, h) {
      return h.view("editPOI", { title: "Edit an Island" });
    },
  },
  editPOI: {
    validate: {
      payload: {
        name: Joi.string().required(),
        description: Joi.string().required(),
        category: Joi.string().required(),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
          .view("editPOI", {
            title: "Change Failed",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      try {
        const poiEdit = request.payload;
        const id = poiEdit.id;
        const poi = await poi.findById(id);
        poi.name = poiEdit.name;
        poi.description = poiEdit.description;
        poi.category = poiEdit.category;
        await poi.save();
        return h.redirect("/report");
      } catch (err) {
        return h.view("report", { errors: [{ message: err.message }] });
      }
    },
  },
  deletePOI: {
    validate: {
      payload: {
        name: Joi.string().required(),
        description: Joi.string().required(),
        category: Joi.string().required(),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
          .view("report", {
            title: "Unable to Delete",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      try {
        const poiDelete = request.payload;
        const id = poiDelete.id;
        const poi = await poi.findById(id);
        await poi.delete();
        return h.redirect("/report");
      } catch (err) {
        return h.view("report", { errors: [{ message: err.message }] });
      }
    }
  }
};

module.exports = POIs;
