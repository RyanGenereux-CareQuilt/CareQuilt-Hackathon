const dynamo = require('./dynamoClient');

exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);

    if (!data.id) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Id is required' }) };
    }

    const params = {
      TableName: 'EventsTable', //rename with DynamoDB table name
      Key: { id: data.id },
    };

    await dynamo.delete(params).promise();
    return { statusCode: 200, body: JSON.stringify({ message: 'Event deleted' }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};