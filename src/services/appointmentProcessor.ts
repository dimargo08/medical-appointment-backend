import { SQSEvent } from "aws-lambda";
import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
import mysql from "mysql2/promise";

const eventBridge = new EventBridgeClient({});

export async function processAppointmentEvent(event: SQSEvent, country: string) {
  for (const record of event.Records) {
    const body = JSON.parse(record.body);

    // 1. Insertar en RDS
    await insertIntoRDS(body, country);

    // 2. Enviar evento a EventBridge
    await sendConfirmationEvent(body);
  }
}

async function insertIntoRDS(data: any, country: string) {
  const connection = await mysql.createConnection({
    host: process.env.RDS_HOST,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DB
  });

  const query = `
    INSERT INTO appointments 
    (insured_id, schedule_id, center_id, specialty_id, medic_id, date_time, country_iso, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const {
    insuredId,
    scheduleId,
    centerId,
    specialtyId,
    medicId,
    date,
  } = data;

  await connection.execute(query, [
    insuredId,
    scheduleId,
    centerId,
    specialtyId,
    medicId,
    date,
    country,
    'completed'
  ]);

  await connection.end();
}

async function sendConfirmationEvent(data: any) {
  const event = {
    Entries: [
      {
        Source: "appointment.service",
        DetailType: "appointment.confirmed",
        Detail: JSON.stringify(data),
        EventBusName: "default"
      }
    ]
  };

  try {
    await eventBridge.send(new PutEventsCommand(event));
  } catch (err) {
    console.error("Error al enviar evento a EventBridge", err);
    throw err;
  }
}
