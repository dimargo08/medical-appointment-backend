import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand
} from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = process.env.DYNAMODB_TABLE || "Appointments";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export class DynamoService {
  async saveAppointment(item: {
    insuredId: string;
    scheduleId: number;
    countryISO: string;
    status: string;
    createdAt: string;
  }): Promise<void> {
    const params = {
      TableName: TABLE_NAME,
      Item: item
    };

    try {
      await docClient.send(new PutCommand(params));
    } catch (error) {
      console.error("Error saving appointment:", error);
      throw error;
    }
  }

  async getAppointmentsByInsuredId(insuredId: string): Promise<any[]> {
    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "insuredId = :id",
      ExpressionAttributeValues: {
        ":id": insuredId
      }
    };

    try {
      const result = await docClient.send(new QueryCommand(params));
      return result.Items || [];
    } catch (error) {
      console.error("Error fetching appointments:", error);
      throw error;
    }
  }
}
