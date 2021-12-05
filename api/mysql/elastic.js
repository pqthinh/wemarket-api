"use strict";
var elasticsearch = require('elasticsearch');
var connectionString = 'https://site:c8b2b87e8acb777eed5d624a22f4e89b@gimli-eu-west-1.searchly.com';
var client = new elasticsearch.Client({
    host: connectionString,
    ssl: { rejectUnauthorized: false, pfx: [] }
});

module.exports = client;