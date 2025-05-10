import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { AnalyzeHandler } from './handlers/analyze.handler';
import { HistoryHandler } from './handlers/history.handler';
import { StatsHandler } from './handlers/stats.handler';
import { createNotFoundResponse, createErrorResponse } from './utils/response.util';

const analyzeHandler = new AnalyzeHandler();
const historyHandler = new HistoryHandler();
const statsHandler = new StatsHandler();

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const path = event.path;
  const method = event.httpMethod;

  try {
    if (path === '/analyze' && method === 'POST') {
      return await analyzeHandler.handle(event);
    }

    if (path === '/history' && method === 'GET') {
      return await historyHandler.handle(event);
    }

    if (path === '/stats' && method === 'GET') {
      return await statsHandler.handle(event);
    }

    return createNotFoundResponse();

  } catch (error) {
    console.error('Error in main handler:', error);
    return createErrorResponse('Internal Server Error');
  }
}; 