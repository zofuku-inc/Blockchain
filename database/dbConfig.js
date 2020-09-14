const knex = require('knex');

const environment = process.env.DB_ENV || process.env.NODE_ENV || "development";

const config = require('../knexfile')[environment];

const db = knex(config);

module.exports = db;