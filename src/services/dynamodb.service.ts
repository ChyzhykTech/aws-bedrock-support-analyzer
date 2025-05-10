import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { AnalysisResult, Stats } from '../types';
import { ValidationError, BedrockError } from '../utils/errors';

export class DynamoDBService {
  private docClient: DynamoDBDocumentClient;
  private tableName: string;

  constructor() {
    const client = new DynamoDBClient({});
    this.docClient = DynamoDBDocumentClient.from(client);
    this.tableName = process.env.DYNAMODB_TABLE || 'support-classifications';
  }

  async saveAnalysis(result: AnalysisResult): Promise<void> {
    try {
      if (!isAnalysisResult(result)) {
        throw new ValidationError('Invalid analysis result format');
      }
      await this.docClient.send(new PutCommand({
        TableName: this.tableName,
        Item: result
      }));
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new BedrockError('Failed to save analysis');
    }
  }

  async getHistory(limit: number = 10): Promise<AnalysisResult[]> {
    const response = await this.docClient.send(new ScanCommand({
      TableName: this.tableName,
      Limit: limit
    }));
    return response.Items as AnalysisResult[] || [];
  }

  async getStats(): Promise<Stats> {
    const response = await this.docClient.send(new ScanCommand({
      TableName: this.tableName
    }));

    const items = response.Items as AnalysisResult[] || [];
    const stats: Stats = {
      total_queries: items.length,
      categories: {},
      urgency_levels: {},
      tones: {}
    };

    items.forEach(item => {
      stats.categories[item.category] = (stats.categories[item.category] || 0) + 1;
      stats.urgency_levels[item.urgency] = (stats.urgency_levels[item.urgency] || 0) + 1;
      stats.tones[item.tone] = (stats.tones[item.tone] || 0) + 1;
    });

    return stats;
  }
}

function isAnalysisResult(obj: any): obj is AnalysisResult {
  return (
    typeof obj === 'object' &&
    typeof obj.query_id === 'string' &&
    typeof obj.text === 'string'
    // ... other validations
  );
} 