/**
 * Author: @leeilwoong
 * Date: 2017.11.03
 */

'use strict';

const AWS = require("aws-sdk");
const commons = require('./commons.js');

// AWS Switch Role
commons.switchRole();

var docClient = new AWS.DynamoDB.DocumentClient();

// Query - All Movies Released in a Year
/*
var params = {
    TableName: "POC_MOVIES_SOURCE",
    KeyConditionExpression: "#yr = :yyyy",
    ExpressionAttributeNames: {
        "#yr": "year"
    },
    ExpressionAttributeValues: {
        ":yyyy": 2000
    }
};

console.log("Querying the table...");

var queryPromise = docClient.query(params).promise();
queryPromise.then(function(data) {

    console.log(data.Items.length + " records found.");

    var idx = 0;
    data.Items.forEach(function(movie) {
        console.log("#" + (++idx), movie.year, movie.title);
    });
}).catch(commons.handleError);
*/

// Query - All Movies Released in a Year with Certain Titles
/*
var params = {
    TableName: "POC_MOVIES_SOURCE",
    ProjectionExpression:"#yr, title, info.genres, info.actors[0]",
    KeyConditionExpression: "#yr = :yyyy and title between :letter1 and :letter2",
    ExpressionAttributeNames:{
        "#yr": "year"
    },
    ExpressionAttributeValues: {
        ":yyyy": 2000,
        ":letter1": "A",
        ":letter2": "L"
    }
};

console.log("Querying the table...");

var queryPromise = docClient.query(params).promise();
queryPromise.then(function(data) {

    console.log(data.Items.length + " records found.");

    var idx = 0;
    data.Items.forEach(function(movie) {
        console.log("#" + (++idx), movie.year, movie.title, movie.info.genres, movie.info.actors[0]);
    });
}).catch(commons.handleError);
*/

// Scanning
var params = {
    TableName: "POC_MOVIES_SOURCE",
    ProjectionExpression: "#yr, title, info.rating",
    FilterExpression: "#yr between :start_yr and :end_yr",
    ExpressionAttributeNames: {
        "#yr": "year",
    },
    ExpressionAttributeValues: {
            ":start_yr": 2000,
            ":end_yr": 2009
    }
};

console.log("Scanning the table...");

var scanPromise = docClient.scan(params).promise();
scanPromise.then(function(data) {

    console.log(data.Items.length + " records found.");

    var idx = 0;
    data.Items.forEach(function(movie) {
        console.log("#" + (++idx), movie.title, movie.info.rating);
    });
}).catch(commons.handleError);
