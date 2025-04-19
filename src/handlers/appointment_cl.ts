import { SQSEvent } from "aws-lambda";
import { processAppointmentEvent } from "../services/appointmentProcessor.ts";

export const handler = async (event: SQSEvent) => {
  await processAppointmentEvent(event, "CL");
};
