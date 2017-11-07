/**
 * Author: @leeilwoong
 * Date: 2017.11.03
 */

'use strict';

const AWS = require("aws-sdk");
const mysql = require("mysql");
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

    putMoviesToRDS(movies);

}).catch(commons.handleError);

// Put all movie data to target RDS
var putMoviesToRDS = function(movies) {
    
    console.log("Importing movies into RDS. Please wait.");

    var data = [];

    // Map DynamoDB entries into RDS columns
    movies.forEach(function(movie) {
        
        var _data = [];

        _data.push(movie.year);
        _data.push("[POC] " + movie.title);
        _data.push(movie.info.release_date.substring(0, 10));
        _data.push(movie.info.rating);
        _data.push(movie.info.image_url);
        _data.push(movie.info.plot);
        _data.push(movie.info.rank);
        _data.push(movie.info.running_time_secs);

        data.push(_data);
    });

    var connection = mysql.createConnection({
        host     : 'ltcmdev.cluster-cgbrkjqdtcei.ap-northeast-1.rds.amazonaws.com',
        port     : 3306,
        user     : 'b2_dba',
        password : 'qwer1234',
        // host     : 'localhost',
        // port     : 3306,
        // user     : 'root',
        // password : '1234',
        database : 'poc_etl'
    });
    
    connection.connect();
    
    connection.query(
        'INSERT INTO poc_etl.poc_etl_movies (year, title, release_date, rating, image_url, plot, rank, running_time_secs) VALUES ?',
        [data],
        function (err, results, fields) {
            if (err) throw err;
            console.log(results);
        }
    );
    
    connection.end();
}
