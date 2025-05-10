export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class BedrockError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BedrockError';
  }
} 