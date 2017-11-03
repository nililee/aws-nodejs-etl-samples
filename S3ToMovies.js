/**
 * Author: @leeilwoong
 * Date: 2017.11.03
 */

'use strict';

const AWS = require("aws-sdk");
const commons = require('../commons.js');

// AWS Switch Role
commons.switchRole();

var s3 = new AWS.S3();
var docClient = new AWS.DynamoDB.DocumentClient();

var params = {
    Bucket: "poc-etl-movies",
    Key: "movies_20171103142406"
};

// Get S3 bucket data
var getObjectPromise = s3.getObject(params).promise();
getObjectPromise.then(function(data) {
    
    var movies = JSON.parse(data.Body.toString());
    //console.log("Retrieved s3 data: \n" + JSON.stringify(movies));

    putMoviesToDynamodb(movies);

}).catch(commons.handleError);

// Put all movie data to target DynamoDB
var putMoviesToDynamodb = function(movies) {

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
