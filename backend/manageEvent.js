import {
    DynamoDBDocumentClient, PutCommand, GetCommand,
    UpdateCommand, DeleteCommand, ScanCommand
  } from "@aws-sdk/lib-dynamodb";
  import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
  
  const ddbClient = new DynamoDBClient({ region: "us-east-2" });
  const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
  
  // Define the name of the DDB table to perform the CRUD operations on
  const TableName = "Events";
  
  const isValidEvent = (data) => {
    return data.id && data.title && data.start && data.end && data.host
  }
  
  const paramsFromData = (data) => {
    return {
      TableName,
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
  
  }
  
  export const handler = async (event) => {
    const data = event.body;
    switch (event.operation) {
      case "read":
        return await ddbDocClient.send(new ScanCommand({ TableName}))
      case "create":
        if (!isValidEvent(data)) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
        }
  
        try {
          await ddbDocClient.send(new PutCommand(paramsFromData(data)));
          return { statusCode: 200, body: JSON.stringify({ message: 'Event created' }) };
        } catch (err) {
          return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
        }
      case "update":
        if (!isValidEvent(data)) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
        }
  
        try {
          await ddbDocClient.send(new PutCommand(paramsFromData(data)));
          return { statusCode: 200, body: JSON.stringify({ message: 'Event updated' }) };
        } catch (err) {
          return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
        }
  
      case "delete":
        const id = data.id;
        if (!id) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
        }
        try {
          await ddbDocClient.send(new DeleteCommand({ TableName, Key: { id } }));
          return { statusCode: 200, body: JSON.stringify({ message: 'Event deleted' }) };
        } catch (err) {
          return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
        }
      default:
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid operation' }) };
    }
  };
  