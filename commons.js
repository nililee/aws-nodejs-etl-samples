/**
 * Author: @leeilwoong
 * Date: 2017.11.03
 */

'use strict';

const AWS = require('aws-sdk');

module.exports = {
    isLambda: false,
    defaultProfile: "B2_IA@l-b2-dev",
    switchRole: function(profile = this.defaultProfile) {
        const credentials = new AWS.SharedIniFileCredentials({profile: profile});
        AWS.config.credentials = credentials;
        AWS.config.update({
            region: "us-east-1"
        })
    },
    handleError: function(err) {
        console.error("Error: \n", JSON.stringify(err, null, 2));
    },
    logResponse: function(response) {
        console.log("Resonse: \n", response);
    }
};