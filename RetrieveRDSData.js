/**
 * Author: @leeilwoong
 * Date: 2017.11.03
 */

'use strict';

const AWS = require("aws-sdk");
const commons = require('./commons.js');

const mysql = require("mysql");

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

connection.query('SELECT * FROM poc_etl_movies', function (err, results, fields) {
    if (err) throw err;
    console.log(results);
});

connection.end();
