import {
  DynamoDBDocumentClient, PutCommand, GetCommand,
  UpdateCommand, DeleteCommand, ScanCommand
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const ddbClient = new DynamoDBClient({ region: "us-east-2" });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const TableName = "Events";

const isValidEvent = (data) => {
  return data.start && data.end;
};

const generateID = () => {
  const timestamp = new Date().getTime();
  return timestamp.toString() + Math.random().toString(36).substring(2, 15);
};

const paramsFromData = (data) => ({
  TableName,
  Item: {
    id: data.id,
    title: data.title,
    description: data.description || '',
    start: data.start,
    end: data.end,
    host: data.host,
    attendees: data.attendees || '',
  },
});

export const handler = async (event) => {
  const input = typeof event.body === "string" ? JSON.parse(event.body) : event;
  const data = input.body;
  const operation = input.operation;

  const headers = {
    "Access-Control-Allow-Origin": "*"
  };

  switch (operation) {
    case "readAll":
      const result = await ddbDocClient.send(new ScanCommand({ TableName }));
      return { statusCode: 200, headers, body: JSON.stringify(result.Items) };

    case "read":
      if (!data.id) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing required fields' }) };
      }
      try {
        const result = await ddbDocClient.send(new GetCommand({ TableName, Key: { id: data.id.toString() } }));
        return { statusCode: 200, headers, body: JSON.stringify(result.Item) };
      } catch (err) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: err.message, data }) };
      }

    case "create":
      data.id = generateID();
      if (!isValidEvent(data)) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing required fields' }) };
      }
      try {
        await ddbDocClient.send(new PutCommand(paramsFromData(data)));
        return { statusCode: 200, headers, body: JSON.stringify({ message: 'Event created', id: data.id }) };
      } catch (err) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
      }

    case "update":
      if (!isValidEvent(data)) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing required fields' }) };
      }
      try {
        await ddbDocClient.send(new PutCommand(paramsFromData(data)));
        return { statusCode: 200, headers, body: JSON.stringify({ message: 'Event updated' }) };
      } catch (err) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
      }

    case "delete":
      if (!data.id) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing required fields' }) };
      }
      try {
        await ddbDocClient.send(new DeleteCommand({ TableName, Key: { id: data.id.toString() } }));
        return { statusCode: 200, headers, body: JSON.stringify({ message: 'Event deleted' }) };
      } catch (err) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
      }

    default:
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid operation' }) };
  }
};
