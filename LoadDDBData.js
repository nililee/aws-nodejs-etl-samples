/**
 * Author: @leeilwoong
 * Date: 2017.11.03
 */

'use strict';

const AWS = require("aws-sdk");
const fs = require("fs");
const commons = require('./commons.js');

// AWS Switch Role
commons.switchRole();

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing movies into DynamoDB. Please wait.");

var movies = JSON.parse(fs.readFileSync('./moviedata.json', 'utf8'));
movies.forEach(function(movie) {
    var params = {
        TableName: "POC_MOVIES_SOURCE",
        Item: {
            "year":  movie.year,
            "title": movie.title,
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
