import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const sns = new SNSClient({});
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN || "";

export class SnsService {
  async publishAppointment(appointment: {
    insuredId: string;
    scheduleId: number;
    countryISO: string;
    status: string;
    createdAt: string;
  }): Promise<void> {
    if (!SNS_TOPIC_ARN) {
      throw new Error("SNS_TOPIC_ARN no está configurado");
    }

    const params = {
      TopicArn: SNS_TOPIC_ARN,
      Message: JSON.stringify(appointment),
      MessageAttributes: {
        countryISO: {
          DataType: "String",
          StringValue: appointment.countryISO
        }
      }
    };

    try {
      await sns.send(new PublishCommand(params));
    } catch (error) {
      console.error("Error publicando a SNS:", error);
      throw error;
    }
  }
}
