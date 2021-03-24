"use strict";

const Joi = require("@hapi/joi");

const POI = require("../models/poi");
const User = require("../models/user");
const Category = require("../models/category");

const POIs = {
  home: {
    handler: async function(request, h) {
      const pois = await POI.find().populate().lean();
      const categories = await Category.find().populate().lean();
      return h.view("home", {
        title: "Home",
        pois: pois,
        category: categories
      });
    }
  },
  report: {
    handler: async function(request, h) {
      const pois = await POI.find().populate("creator").lean();
      const categories = await Category.find().populate().lean();
      return h.view("report", {
        title: "Islands Added",
        pois: pois,
        category: categories
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
        const rawCategory = request.payload.category;
        const category = await Category.findOne({
          name: rawCategory
        });
        const newPOI = new POI({
          name: data.name,
          description: data.description,
          category: category._id,
          creator: user._id
        });
        await newPOI.save();
        return h.redirect("/home");
      } catch (err) {
        return h.view("home", { errors: [{ message: err.message }] });
      }
    },
  },
  showEditPOI: {
    auth: false,
    handler: async function(request, h) {
      try {
        const id = request.params._id
        const poi = await POI.findById(id).lean();
        return h.view("editPOI", { title: "Edit POI", poi: poi });
      } catch (err) {
        return h.view("report", { errors: [{ message: err.message }] });
      }
    },
  },
  editPOI: {
    validate: {
      payload: {
        name: Joi.string().required(),
        description: Joi.string().required()
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
        const poi = await POI.findById(request.params._id);
        poi.name = poiEdit.name;
        poi.description = poiEdit.description;
        await poi.save();
        return h.redirect("/report");
      } catch (err) {
        return h.view("report", { errors: [{ message: err.message }] });
      }
    },
  },
  deletePOI: {
    handler: async function (request, h) {
      try {
        const poi = await POI.findById(request.params._id);
        await poi.delete();
        return h.redirect("/report");
      } catch (err) {
        return h.view("report", { errors: [{ message: err.message }] });
      }
    }
  }
};

module.exports = POIs;
