import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoService } from '../services/dynamoService';
import { SnsService } from '../services/snsService';
import { validateAppointmentRequest } from '../utils/validators';

const dynamo = new DynamoService();
const sns = new SnsService();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const method = event.httpMethod;
    if (method === 'POST') return await handlePost(event);
    if (method === 'GET') return await handleGet(event);
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  } catch (err: any) {
    console.error('Error in appointment handler:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' })
    };
  }
};

const handlePost: APIGatewayProxyHandler = async (event) => {
  const body = JSON.parse(event.body || '{}');

  const validation = validateAppointmentRequest(body);
  if (!validation.valid) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: validation.message })
    };
  }

  const { insuredId, scheduleId, countryISO } = body;
  const item = {
    insuredId,
    scheduleId,
    countryISO,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  await dynamo.saveAppointment(item);
  await sns.publishAppointment(item);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Agendamiento en proceso.' })
  };
};

const handleGet: APIGatewayProxyHandler = async (event) => {
  const insuredId = event.pathParameters?.insuredId;

  if (!insuredId || insuredId.length !== 5) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'insuredId inválido' })
    };
  }

  const appointments = await dynamo.getAppointmentsByInsuredId(insuredId);
  return {
    statusCode: 200,
    body: JSON.stringify(appointments)
  };
};
