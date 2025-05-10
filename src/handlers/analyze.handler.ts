import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { BedrockService } from '../services/bedrock.service';
import { DynamoDBService } from '../services/dynamodb.service';
import { createResponse, createErrorResponse } from '../utils/response.util';

export class AnalyzeHandler {
  private bedrockService: BedrockService;
  private dynamoDBService: DynamoDBService;

  constructor() {
    this.bedrockService = new BedrockService();
    this.dynamoDBService = new DynamoDBService();
  }

  async handle(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      if (!event.body) {
        return createErrorResponse('Request body is required', 400);
      }

      const { text } = JSON.parse(event.body);
      if (!text) {
        return createErrorResponse('Text field is required', 400);
      }

      const result = await this.bedrockService.analyzeText(text);
      await this.dynamoDBService.saveAnalysis(result);
      return createResponse(200, result);
    } catch (error) {
      console.error('Error in analyze handler:', error);
      return createErrorResponse('Internal Server Error');
    }
  }
} 