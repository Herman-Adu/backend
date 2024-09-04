"use strict";

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // check user is logged into strapi
    const user = ctx.state.user;

    // if not return You are not authenticated
    if (!user) return ctx.unauthorized("You are not authenticated");

    // get user available credits
    const availableCredits = user.credits;

    // check if they have enough available credits
    if (availableCredits === 0)
      return ctx.unauthorized("You do not have enough credits.");

    await next();

    // update the user's credits
    const uid = "plugin::users-permissions.user";

    // create a new payload that deducts the credit from the strapi instance
    const payload = {
      data: {
        credits: availableCredits - 1,
        // connect the user to the summaries collection type
        summaries: {
          connect: [ctx.response.body.data.id],
        },
      },
    };

    try {
      // pass the payload to the update service, using entity service
      await strapi.entityService.update(uid, user.id, payload);
    } catch (error) {
      ctx.badRequest("Error Updating User Credits");
    }

    console.log("############ Inside middleware end #############");
  };
};
