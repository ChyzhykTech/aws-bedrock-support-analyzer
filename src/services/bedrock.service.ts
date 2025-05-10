import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

export class BedrockService {
  private client: BedrockRuntimeClient;

  constructor() {
    this.client = new BedrockRuntimeClient({});
  }

  async analyzeText(text: string): Promise<any> {
    const prompt = `Analyze the following customer support query and provide a structured response:
      Query: ${text}
      
      Please analyze and provide:
      1. Intent (what the customer wants)
      2. Urgency (low/medium/high)
      3. Tone (positive/neutral/negative)
      4. Category (billing/technical/general/other)
      5. Confidence score (0-1)
      
      Respond in JSON format.`;

    try {
      const command = new InvokeModelCommand({
        modelId: 'anthropic.claude-v2',
        body: JSON.stringify({
          prompt,
          max_tokens_to_sample: 500,
          temperature: 0.1,
        }),
      });

      const response = await this.client.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      return JSON.parse(responseBody.completion);
    } catch (error) {
      console.error('Error analyzing text:', error);
      throw error;
    }
  }
} 