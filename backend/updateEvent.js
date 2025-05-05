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
      UpdateExpression: 'SET title = :title, description = :description, start = :start, end = :end, host = :host, attendees = :attendees',
      ExpressionAttributeValues: {
        ':title': data.title,
        ':description': data.description,
        ':start': data.start,
        ':end': data.end,
        ':host': data.host,
        ':attendees': data.attendees,
      },
      ReturnValues: 'UPDATED_NEW',
    };

    await dynamo.update(params).promise();
    return { statusCode: 200, body: JSON.stringify({ message: 'Event updated' }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
