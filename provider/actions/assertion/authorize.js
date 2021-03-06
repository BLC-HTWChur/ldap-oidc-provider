"use strict";

const debug = require("debug")("ldap-oidc:jwt-assertion-authz");
const { InvalidRequestError } = require("oidc-provider/lib/helpers/errors");
const JWT = require("oidc-provider/lib/helpers/jwt");

/**
 * This module is part of the jwt-bearer assertion handling.
 *
 * This module handles the authorization of one client for another client.
 *
 */
module.exports = function factory(provider, settings) { // eslint-disable-line
    return async function authorize(ctx, next) {
        debug("authorize if necessary");
        if (ctx.oidc.assertion_grant.authz) {
            debug("authorize");

            const claims = ctx.oidc.assertion_grant.body;

            if (ctx.oidc.client.clientId !== claims.iss) {
                if (Array.isArray(ctx.oidc.client.redirectUris)) {
                    debug("%O", claims.azp);
                    // debug("%O", ctx.oidc.client);
                    debug("%O", ctx.oidc.client.redirectUris);

                    if(ctx.oidc.client.redirectUris.indexOf(claims.azp) < 0)  {
                        debug("authorizing client does not match the authorized party");
                        ctx.throw(new InvalidRequestError("invalid assertion request"));
                    }
                }
                else if (ctx.oidc.client.redirectUris !== claims.azp) {
                    debug("authorizing client single does not match the authorized party");
                    ctx.throw(new InvalidRequestError("invalid assertion request"));
                }
            }

            // TODO: Define the correct behaviour of this claim or find a better alternative....

            // if (claims.x_jwt) {
            //     let decoded;

                // try {
                //     decoded = JWT.decode(claims.x_jwt);
                // }
                // catch (error) {
                //     debug("x_jwt claim is an invalid compact serialization");
                //     ctx.throw(new InvalidRequestError("invalid assertion provided"));
                // }
                //
                // if (!decoded) {
                //     debug("x_jwt claim is invalid");
                //     ctx.throw(new InvalidRequestError("invalid assertion provided"));
                // }
                //
                // if (!decoded.payload.iss) {
                //     debug("x_jwt.iss claim MUST be present");
                //     ctx.throw(new InvalidRequestError("invalid assertion provided"));
                // }

                // TODO verify if the iss is an registered app (optional, configurable)
                // TODO if the jwt is signed, then verify if the signature matches the iss/kid combination (optional)

                // NOTE: additional multi-factor auth information might be present in the x_crd claim
            // }
        }
        await next();
    };
};
