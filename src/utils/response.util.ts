import { APIGatewayProxyResult } from 'aws-lambda';

export const createResponse = (
  statusCode: number,
  body: any,
  headers: Record<string, string> = {}
): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      ...headers
    },
    body: JSON.stringify(body)
  };
};

export const createErrorResponse = (message: string, statusCode: number = 500): APIGatewayProxyResult => {
  return createResponse(statusCode, { message });
};

export const createNotFoundResponse = (): APIGatewayProxyResult => {
  return createErrorResponse('Not Found', 404);
}; 