"use strict";
const _ = require("lodash");

/**
 * `user-can-update` middleware
 */

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info("In user-can-update middleware.");

    // use lodash pick

    // check the user is logged in and authenticated
    if (!ctx.state?.user) {
      strapi.log.error("You are not authenticated.");
      return ctx.badRequest("You are not authenticated.");
    }

    // check we are passing the user id in the params
    const params = ctx.params;
    const requestedUserId = params?.id;
    const currentUserId = ctx.state?.user?.id;

    // no params or userId in params
    if (!requestedUserId) {
      strapi.log.error("Missing user ID.");
      return ctx.badRequest("Missing or invalid user ID.");
    }

    // check s the current user who's authenticated and the requested user I match
    if (Number(currentUserId) !== Number(requestedUserId)) {
      return ctx.unauthorized("You are not authorized to perform this action.");
    }

    // if all is ok, use lodash to double check the body to make sure that you're only able to update the following
    // Fields first name name last name bio and image
    ctx.request.body = _.pick(ctx.request.body, [
      "firstName",
      "lastName",
      "bio",
      "image",
    ]);

    await next();
  };
};
