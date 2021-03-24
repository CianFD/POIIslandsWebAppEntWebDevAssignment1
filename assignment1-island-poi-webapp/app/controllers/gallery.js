'use strict';

const ImageStore = require('../utils/image-store');

const Gallery = {
  gallery: {
    handler: async function(request, h) {
      try {
        const allImages = await ImageStore.getAllImages();
        return h.view("image-gallery", {
          title: "Image Gallery",
          images: allImages
        });
      } catch (err) {
        console.log(err);
      }
    }
  },

  uploadFile: {
    handler: async function(request, h) {
      try {
        const file = request.payload.imagefile;
        if (Object.keys(file).length > 0) {
          await ImageStore.uploadImage(request.payload.imagefile);
          return h.redirect("/image-gallery");
        }
        return h.view("image-gallery", {
          title: 'Image Gallery',
          error: 'No file selected'
        });
      } catch (err) {
        console.log(err);
      }
    },
    payload: {
      multipart: true,
      output: 'data',
      maxBytes: 209715200,
      parse: true
    }
  },

  deleteImage: {
    handler: async function(request, h) {
      try {
        await ImageStore.deleteImage(request.params.id);
        return h.redirect("/image-gallery");
      } catch (err) {
        console.log(err);
      }
    }
  }
};

module.exports = Gallery;