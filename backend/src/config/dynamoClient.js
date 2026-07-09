import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
  ScanCommand,
  TransactWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});

export const TABLE_NAME = process.env.DYNAMODB_TABLE || 'BusTicket';

// ==================== GENERIC HELPERS ====================

export async function getItem(pk, sk) {
  const cmd = new GetCommand({
    TableName: TABLE_NAME,
    Key: { PK: pk, SK: sk || pk },
  });
  const result = await docClient.send(cmd);
  return result.Item || null;
}

export async function putItem(item) {
  const cmd = new PutCommand({
    TableName: TABLE_NAME,
    Item: item,
  });
  await docClient.send(cmd);
  return item;
}

export async function updateItem(pk, sk, updates, conditionExpression) {
  const updateExpression = [];
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};

  for (const [key, value] of Object.entries(updates)) {
    updateExpression.push(`#${key} = :${key}`);
    expressionAttributeNames[`#${key}`] = key;
    expressionAttributeValues[`:${key}`] = value;
  }

  const cmd = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { PK: pk, SK: sk || pk },
    UpdateExpression: `SET ${updateExpression.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ConditionExpression: conditionExpression,
    ReturnValues: 'ALL_NEW',
  });
  const result = await docClient.send(cmd);
  return result.Attributes;
}

export async function deleteItem(pk, sk) {
  const cmd = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { PK: pk, SK: sk || pk },
  });
  await docClient.send(cmd);
}

// ==================== QUERY HELPERS ====================

export async function queryByPK(pk, options = {}) {
  const { skBeginsWith, filterExpression, expressionAttributeValues, limit, scanIndexForward } = options;
  const expressionAttributeNames = {};
  const eav = {};

  let keyConditionExpression = '#pk = :pk';
  expressionAttributeNames['#pk'] = 'PK';
  eav[':pk'] = pk;

  if (skBeginsWith) {
    keyConditionExpression += ' AND begins_with(#sk, :sk)';
    expressionAttributeNames['#sk'] = 'SK';
    eav[':sk'] = skBeginsWith;
  }

  if (expressionAttributeValues) {
    Object.assign(eav, expressionAttributeValues);
  }

  const cmd = new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: keyConditionExpression,
    ExpressionAttributeNames: {
      ...expressionAttributeNames,
      ...(options.expressionAttributeNames || {}),
    },
    ExpressionAttributeValues: eav,
    FilterExpression: filterExpression,
    Limit: limit,
    ScanIndexForward: scanIndexForward !== undefined ? scanIndexForward : true,
  });
  const result = await docClient.send(cmd);
  return result.Items || [];
}

export async function queryGSI(gsiName, pkValue, options = {}) {
  const { skBeginsWith, skBetween, filterExpression, expressionAttributeValues, limit, scanIndexForward } = options;
  const expressionAttributeNames = {};
  const eav = {};

  const pkAttr = `${gsiName}PK`;
  const skAttr = `${gsiName}SK`;

  let keyConditionExpression = `#pk = :pk`;
  expressionAttributeNames['#pk'] = pkAttr;
  eav[':pk'] = pkValue;

  if (skBeginsWith) {
    keyConditionExpression += ' AND begins_with(#sk, :sk)';
    expressionAttributeNames['#sk'] = skAttr;
    eav[':sk'] = skBeginsWith;
  }

  if (skBetween) {
    keyConditionExpression += ' AND #sk BETWEEN :sk1 AND :sk2';
    expressionAttributeNames['#sk'] = skAttr;
    eav[':sk1'] = skBetween[0];
    eav[':sk2'] = skBetween[1];
  }

  if (expressionAttributeValues) {
    Object.assign(eav, expressionAttributeValues);
  }

  const cmd = new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: gsiName,
    KeyConditionExpression: keyConditionExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: eav,
    FilterExpression: filterExpression,
    Limit: limit,
    ScanIndexForward: scanIndexForward !== undefined ? scanIndexForward : true,
  });
  const result = await docClient.send(cmd);
  return result.Items || [];
}

export async function scanTable(options = {}) {
  const { filterExpression, expressionAttributeValues, expressionAttributeNames, limit } = options;
  const cmd = new ScanCommand({
    TableName: TABLE_NAME,
    FilterExpression: filterExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ExpressionAttributeNames: expressionAttributeNames,
    Limit: limit,
  });
  const result = await docClient.send(cmd);
  return result.Items || [];
}

// ==================== TRANSACTIONS ====================

export async function transactWrite(transactItems) {
  const cmd = new TransactWriteCommand({
    TransactItems: transactItems,
  });
  await docClient.send(cmd);
}

// ==================== ID GENERATION ====================

export function generateId() {
  return uuidv4();
}

// ==================== KEY GENERATORS ====================

export const Keys = {
  user: (id) => ({ PK: `USER#${id}`, SK: `USER#${id}` }),
  bus: (id) => ({ PK: `BUS#${id}`, SK: `BUS#${id}` }),
  route: (id) => ({ PK: `ROUTE#${id}`, SK: `ROUTE#${id}` }),
  schedule: (id) => ({ PK: `SCHEDULE#${id}`, SK: `SCHEDULE#${id}` }),
  booking: (id) => ({ PK: `BOOKING#${id}`, SK: `BOOKING#${id}` }),
  review: (id) => ({ PK: `REVIEW#${id}`, SK: `REVIEW#${id}` }),
};

// ==================== GSI KEY GENERATORS ====================

export const GSIKeys = {
  userEmail: (email, userId) => ({
    GSI1PK: `USER_EMAIL#${email.toLowerCase()}`,
    GSI1SK: `USER#${userId}`,
  }),
  // For schedules: search by route cities + date
  scheduleByRoute: (fromCity, toCity, date, departureTime) => ({
    GSI1PK: `ROUTE_CITY#${fromCity.toLowerCase()}#${toCity.toLowerCase()}`,
    GSI1SK: `DATE#${date}#${departureTime}`,
  }),
  // For bookings: find by schedule ID (for booked seats)
  bookingBySchedule: (scheduleId, status, bookingId) => ({
    GSI1PK: `SCHEDULE#${scheduleId}`,
    GSI1SK: `BOOKING#${status}#${bookingId}`,
  }),
  // Bookings by user
  bookingByUser: (userId, createdAt) => ({
    GSI2PK: `USER#${userId}`,
    GSI2SK: `BOOKING#${createdAt}`,
  }),
  // Reviews by bus
  reviewByBus: (busId, createdAt) => ({
    GSI3PK: `BUS#${busId}`,
    GSI3SK: `REVIEW#${createdAt}`,
  }),
  // Schedules by bus
  scheduleByBus: (busId, date, departureTime) => ({
    GSI4PK: `BUS#${busId}`,
    GSI4SK: `SCHEDULE#${date}#${departureTime}`,
  }),
};

export default docClient;
