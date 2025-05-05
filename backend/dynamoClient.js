const AWS = require('aws-sdk');

// Set region if not using Lambda environment's default
// AWS.config.update({ region: 'us-east-2' });

const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports = dynamo;