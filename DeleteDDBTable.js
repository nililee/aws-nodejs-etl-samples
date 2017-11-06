/**
 * Author: @leeilwoong
 * Date: 2017.11.03
 */

 'use strict';

const AWS = require("aws-sdk");
const commons = require('./commons.js');

// AWS Switch Role
commons.switchRole();

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "POC_MOVIES_TARGET"
};

console.log("Deleting DynamoDB table...");

var deleteTablePromise = dynamodb.deleteTable(params).promise();
deleteTablePromise.then(commons.logResponse).catch(commons.handleError);
