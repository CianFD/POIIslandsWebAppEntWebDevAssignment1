"use strict";

const Home = {
  home: {
    handler: function (request, h) {
      return h.view("home", { title: "Your Dashboard" });
    },
  },
  report: {
    handler: function (request, h) {
      return h.view("report", { title: "Donations so far" });
    },
  },
  donate: {
    handler: function (request, h) {
      const data = request.payload;
      var donorEmail = request.auth.credentials.id;
      data.donor = this.users[donorEmail];
      this.donations.push(data);
      return h.redirect("/report");
    },
  },
};

module.exports = Home;