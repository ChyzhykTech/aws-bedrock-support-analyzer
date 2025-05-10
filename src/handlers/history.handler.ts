import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBService } from '../services/dynamodb.service';
import { createResponse, createErrorResponse } from '../utils/response.util';

export class HistoryHandler {
  private dynamoDBService: DynamoDBService;

  constructor() {
    this.dynamoDBService = new DynamoDBService();
  }

  async handle(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const limit = parseInt(event.queryStringParameters?.limit || '10');
      const history = await this.dynamoDBService.getHistory(limit);
      return createResponse(200, history);
    } catch (error) {
      console.error('Error in history handler:', error);
      return createErrorResponse('Internal Server Error');
    }
  }
} 