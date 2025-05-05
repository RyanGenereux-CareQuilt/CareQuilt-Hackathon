const dynamo = require('./dynamoClient');

exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);

    if (!data.id || !data.title || !data.start || !data.end || !data.host || !data.attendees) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
    }

    const params = {
      TableName: 'EventsTable', //rename with DynamoDB table name
      Item: {
        id: data.id,
        title: data.title,
        description: data.description || '', //optional field
        start: data.start,
        end: data.end,
        host: data.host,
        attendees: data.attendees || '', //optional field
      },
    };

    await dynamo.put(params).promise();
    return { statusCode: 200, body: JSON.stringify({ message: 'Event created' }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};