import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBService } from '../services/dynamodb.service';
import { createResponse, createErrorResponse } from '../utils/response.util';

export class StatsHandler {
  private dynamoDBService: DynamoDBService;

  constructor() {
    this.dynamoDBService = new DynamoDBService();
  }

  async handle(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const stats = await this.dynamoDBService.getStats();
      return createResponse(200, stats);
    } catch (error) {
      console.error('Error in stats handler:', error);
      return createErrorResponse('Internal Server Error');
    }
  }
} 