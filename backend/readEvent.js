const dynamo = require('./dynamoClient');

exports.handler = async (event) => {
  try {
    const id = event.queryStringParameters?.id;

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing Id in query parameters' }),
      };
    }

    const params = {
      TableName: 'EventsTable', //rename with DynamoDB table name
      Key: { id },
    };

    const result = await dynamo.get(params).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Event not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
