/**
 * Author: @leeilwoong
 * Date: 2017.11.03
 */

'use strict';

const AWS = require("aws-sdk");
const uuid = require('node-uuid');
const dateFormat = require('dateformat');
const commons = require('./commons.js');

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

    putMoviesToMovies(movies);

}).catch(commons.handleError);

// Put all movie data to target DynamoDB
var putMoviesToMovies = function(movies) {

    console.log("Importing movies into DynamoDB. Please wait.");
    
    movies.forEach(function(movie) {
    
        var params = {
            TableName: "POC_MOVIES_TARGET",
            Item: {
                "year":  movie.year,
                //"title": movie.title,
                "title": "[POC] " + movie.title,
                "info":  movie.info
            }
        };

        var putPromise = docClient.put(params).promise();
        putPromise.then(function(data) {
            console.log("Movie added: ", movie.title);
        }).catch(function(err) {
            console.error("Unable to add movie: ", movie.title, ". Error JSON:", JSON.stringify(err, null, 2));
        });
    });
}
