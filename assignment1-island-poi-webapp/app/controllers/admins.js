"use strict";

const Boom = require("@hapi/boom");
const Joi = require("@hapi/joi");
const Admin = require("../models/admin")
const POI = require("../models/poi");
const User = require("../models/user");
const Category = require("../models/category");

const Admins = {
  adminDashboard: {
    auth: false,
    handler: async function (request, h) {
      const pois = await POI.find().populate("creator").lean();
      const categories = await Category.find().populate().lean();
      const users = await User.find().populate().lean();
      return h.view("adminDashboard", {
        title: "Administrator Dashboard",
        pois: pois,
        category: categories,
        user: users
      });
    }
  },
  showAdminSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("adminSignup", { title: "Create your Administrator Account" });
    },
  },
  adminSignup: {
    auth: false,
    validate: {
      payload: {
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        role: Joi.string().required(),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
          .view("adminSignup", {
            title: "Sign up error",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      try {
        const payload = request.payload;
        let admin = await Admin.findByEmail(payload.email);
        if (admin) {
          const message = "Email address is already registered";
          throw Boom.badData(message);
        }
        const newAdmin = new Admin({
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          password: payload.password,
          role: payload.role,
        });
        admin = await newAdmin.save();
        request.cookieAuth.set({ id: admin.id });
        return h.redirect("/adminDashboard");
      } catch (err) {
        return h.view("adminSignup", { errors: [{ message: err.message }] });
      }
    },
  },
  showAdminLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("adminLogin", { title: " Administrator Login" });
    },
  },
  adminLogin: {
    auth: false,
    validate: {
      payload: {
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
          .view("adminLogin", {
            title: "Sign in error",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      const { email, password } = request.payload;
      try {
        let admin = await Admin.findByEmail(email);
        if (!admin) {
          const message = "Email address is not registered";
          throw Boom.unauthorized(message);
        }
        admin.comparePassword(password);
        request.cookieAuth.set({ id: admin.id });
        return h.redirect("/adminDashboard");
      } catch (err) {
        return h.view("login", { errors: [{ message: err.message }] });
      }
    },
  },
  adminLogout: {
    handler: function (request, h) {
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },
  deleteUser: {
    handler: async function (request, h) {
      try {
        const user = await User.findById(request.params._id);
        await user.delete();
        return h.redirect("/adminDashboard");
      } catch (err) {
        return h.view("adminDashboard", { errors: [{ message: err.message }] });
      }
    }
  }
};

module.exports = Admins;