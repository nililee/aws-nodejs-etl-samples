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
    //TableName : "POC_MOVIES_SOURCE",
    TableName : "POC_MOVIES_TARGET",
    KeySchema: [
        { AttributeName: "year", KeyType: "HASH" },   // Partition key
        { AttributeName: "title", KeyType: "RANGE" }  // Sort key
    ],
    AttributeDefinitions: [       
        { AttributeName: "year", AttributeType: "N" },
        { AttributeName: "title", AttributeType: "S" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};

console.log("Creating DynamoDB table...");

var createTablePromise = dynamodb.createTable(params).promise();
createTablePromise.then(commons.logResponse).catch(commons.handleError);
