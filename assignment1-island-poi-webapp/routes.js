"use strict";

const Accounts = require("./app/controllers/accounts");
const POIs = require("./app/controllers/pois");
const Gallery = require("./app/controllers/gallery");

module.exports = [
  { method: "GET", path: "/", config: Accounts.index },
  { method: "GET", path: "/signup", config: Accounts.showSignup },
  { method: "GET", path: "/login", config: Accounts.showLogin },
  { method: "GET", path: "/logout", config: Accounts.logout },
  { method: "POST", path: "/signup", config: Accounts.signup },
  { method: "POST", path: "/login", config: Accounts.login },
  { method: 'GET', path: '/settings', config: Accounts.showSettings },
  { method: 'POST', path: '/settings', config: Accounts.updateSettings },

  { method: "GET", path: "/home", config: POIs.home },
  { method: "GET", path: "/add", config: POIs.showAddPOI },
  { method: "POST", path: "/addPOI", config: POIs.addPOI },
  { method: "GET", path: "/report", config: POIs.report },
  { method: "GET", path: "/showEditPOI/{_id}", config: POIs.showEditPOI },
  { method: "POST", path: "/editPOI/{_id}", config: POIs.editPOI },
  { method: "GET", path: "/deletePOI/{_id}", config: POIs.deletePOI },

  { method: "GET", path: "/image-gallery", config: Gallery.gallery },
  { method: 'POST', path: '/uploadfile', config: Gallery.uploadFile },
  { method: 'GET', path: '/deleteimage/{public_id}', config: Gallery.deleteImage },

  {
    method: "GET",
    path: "/{param*}",
    handler: {
      directory: {
        path: "./public",
      },
    },
    options: { auth: false },
  },
];
