/**
 * Author: @leeilwoong
 * Date: 2017.11.03
 */

'use strict';

const AWS = require("aws-sdk");
const uuid = require('node-uuid');
const dateFormat = require('dateformat');
const commons = require('../commons.js');

// AWS Switch Role
commons.switchRole();

var docClient = new AWS.DynamoDB.DocumentClient();
var s3 = new AWS.S3();

// Query - All Movies Released in a Year
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

var movies = [];

var queryPromise = docClient.query(params).promise();
queryPromise.then(function(data) {

    console.log(data.Items.length + " records found.");

    var idx = 0;
    data.Items.forEach(function(movie) {
        movies.push(movie);
    });

    putMoviesToS3(movies);

}).catch(commons.handleError);

// Put all movie data to S3 bucket
var putMoviesToS3 = function(movies) {

    var params = {
        Bucket: "poc-etl-movies",
        Key: "movies_" + dateFormat(new Date(), "yyyymmddHHMMss"),
        Body: JSON.stringify(movies),
        ContentType: "application/json"
    };

    var putObjectPromise = s3.putObject(params).promise();
    putObjectPromise.then(function(data) {
        console.log("Successfully uploaded data to " + params.Bucket + "/" + params.Key);
    }).catch(commons.handleError);
}
