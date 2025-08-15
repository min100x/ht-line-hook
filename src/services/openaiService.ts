import config from '../config/config';

import OpenAI from 'openai';

const MODEL = 'gpt-5-mini';

export class OpenAIService {
  private openaiClient: OpenAI;

  constructor() {
    this.openaiClient = new OpenAI({
      apiKey: config.openai.apiKey,
    });
  }

  // Analyze image with basic prompt
  async analyzeImage(
    imageDataURL: string,
    prompt: string = 'ครูเพ็ญศรวยช่วยแก้ปัญหานี้ให้กับนักเรียนด้วยจ้า'
  ): Promise<string> {
    try {
      console.log('🤖 Starting OpenAI image analysis...');

      const response = await this.openaiClient.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: 'user' as const,
            content: [
              {
                type: 'text' as const,
                text: prompt,
              },
              {
                type: 'image_url' as const,
                image_url: {
                  url: imageDataURL,
                },
              },
            ],
          },
        ],
        max_completion_tokens: 1000,
      });

      const analysis =
        response.choices[0]?.message?.content || 'ครูเพ็ญศรวยสมองแตกแล้วจ้า';
      console.log('✅ OpenAI analysis completed');

      return analysis;
    } catch (error) {
      console.error('Error analyzing image with OpenAI:', error);
      throw new Error(`Failed to analyze image with OpenAI: ${error}`);
    }
  }

  // Analyze image with custom instructions and system prompt
  async analyzeImageWithCustomInstructions(
    imageDataURL: string,
    instructions: string,
    systemPrompt?: string
  ): Promise<string> {
    try {
      console.log('🤖 Starting custom OpenAI image analysis...');

      const messages: any[] = [];

      // Add system message if provided
      if (systemPrompt) {
        messages.push({
          role: 'system' as const,
          content: systemPrompt,
        });
      }

      // Add user message with image and instructions
      messages.push({
        role: 'user' as const,
        content: [
          {
            type: 'text' as const,
            text: instructions,
          },
          {
            type: 'image_url' as const,
            image_url: {
              url: imageDataURL,
            },
          },
        ],
      });

      const response = await this.openaiClient.chat.completions.create({
        model: MODEL,
        messages,
        max_completion_tokens: 1500,
      });

      const analysis =
        response.choices[0]?.message?.content || 'No analysis available';
      console.log('✅ Custom OpenAI analysis completed');

      return analysis;
    } catch (error) {
      console.error('Error analyzing image with custom instructions:', error);
      throw new Error(
        `Failed to analyze image with custom instructions: ${error}`
      );
    }
  }

  // Analyze image for specific use cases
  async analyzeImageForUseCase(
    imageDataURL: string,
    useCase: string
  ): Promise<string> {
    try {
      console.log(`🎯 Analyzing image for use case: ${useCase}`);

      let prompt: string;
      let systemPrompt: string;

      switch (useCase) {
        case 'accessibility':
          prompt =
            'Describe this image in detail to help visually impaired users understand what is shown. Be comprehensive and descriptive.';
          systemPrompt =
            'You are an accessibility expert helping to make images accessible to visually impaired users.';
          break;

        case 'education':
          prompt =
            'Analyze this image for educational purposes. What concepts could be taught using this image? What questions could be asked about it?';
          systemPrompt =
            'You are an educational expert who helps teachers use images effectively in the classroom.';
          break;

        case 'business':
          prompt =
            'Analyze this image from a business perspective. What business insights can be derived? What opportunities or challenges does it represent?';
          systemPrompt =
            'You are a business analyst who helps identify business opportunities and insights from visual content.';
          break;

        case 'safety':
          prompt =
            'Analyze this image for safety concerns. Are there any potential hazards, unsafe practices, or safety violations visible?';
          systemPrompt =
            'You are a safety expert who identifies potential hazards and safety concerns in images.';
          break;

        case 'technical':
          prompt =
            'Analyze this image from a technical perspective. Consider composition, lighting, colors, and any technical details.';
          systemPrompt =
            'You are a professional photographer and image analyst.';
          break;

        case 'creative':
          prompt =
            'Provide a creative and artistic interpretation of this image. What emotions does it evoke? What story might it tell?';
          systemPrompt =
            'You are a creative writer and art critic with a poetic sensibility.';
          break;

        default:
          prompt = 'Please describe what you see in this image.';
          systemPrompt = 'You are a helpful image analyst.';
      }

      return await this.analyzeImageWithCustomInstructions(
        imageDataURL,
        prompt,
        systemPrompt
      );
    } catch (error) {
      console.error(`Error in ${useCase} analysis:`, error);
      throw new Error(`Failed to analyze image for ${useCase}: ${error}`);
    }
  }

  // Batch analyze multiple images
  async batchAnalyzeImages(
    imageDataURLs: string[],
    prompt: string = 'Please provide a brief description of this image.'
  ): Promise<Map<string, string>> {
    try {
      console.log(
        `📦 Starting batch analysis for ${imageDataURLs.length} images...`
      );

      const results = new Map<string, string>();

      for (let i = 0; i < imageDataURLs.length; i++) {
        try {
          const imageDataURL = imageDataURLs[i];
          if (imageDataURL) {
            const analysis = await this.analyzeImage(imageDataURL, prompt);
            results.set(`image_${i}`, analysis);
            console.log(`✅ Analyzed image ${i + 1}/${imageDataURLs.length}`);
          }
        } catch (error) {
          console.error(`❌ Error analyzing image ${i}:`, error);
          results.set(`image_${i}`, 'Analysis failed');
        }
      }

      console.log(
        `✅ Batch analysis completed. Processed ${results.size} images.`
      );
      return results;
    } catch (error) {
      console.error('Error in batch analysis:', error);
      throw new Error(`Failed to perform batch analysis: ${error}`);
    }
  }

  // Get the OpenAI client instance (if needed for advanced usage)
  getClient(): OpenAI {
    return this.openaiClient;
  }

  // Analyze text and provide solutions
  async analyzeText(
    text: string,
    prompt: string = 'ครูเพ็ญศรวยช่วยแก้ปัญหานี้ให้กับนักเรียนด้วยจ้า'
  ): Promise<string> {
    try {
      console.log('🤖 Starting OpenAI text analysis...');

      const response = await this.openaiClient.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: 'system' as const,
            content: prompt,
          },
          {
            role: 'user' as const,
            content: text,
          },
        ],
        max_completion_tokens: 1000,
      });

      const analysis =
        response.choices[0]?.message?.content || 'ครูเพ็ญศรวยสมองแตกแล้วจ้า';
      console.log('✅ OpenAI text analysis completed');

      return analysis;
    } catch (error) {
      console.error('Error analyzing text with OpenAI:', error);
      throw new Error(`Failed to analyze text with OpenAI: ${error}`);
    }
  }

  // Solve problems based on text input
  async solveProblem(
    problemText: string,
    context: string = 'general',
    systemPrompt?: string
  ): Promise<string> {
    try {
      console.log(`🔧 Starting problem solving for ${context} context...`);

      const defaultSystemPrompt =
        systemPrompt ||
        `You are ครูเพ็ญศรวย, a helpful and knowledgeable teacher who specializes in ${context} problems. 
      You help students understand and solve their problems step by step. 
      Be encouraging, clear, and provide practical solutions.`;

      const response = await this.openaiClient.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: 'system' as const,
            content: defaultSystemPrompt,
          },
          {
            role: 'user' as const,
            content: `นักเรียนมีปัญหานี้: "${problemText}"\n\nช่วยแก้ปัญหานี้ให้กับนักเรียนด้วยจ้า`,
          },
        ],
        max_completion_tokens: 1500,
      });

      const solution =
        response.choices[0]?.message?.content || 'ครูเพ็ญศรวยสมองแตกแล้วจ้า';
      console.log('✅ Problem solving completed');

      return solution;
    } catch (error) {
      console.error('Error solving problem with OpenAI:', error);
      throw new Error(`Failed to solve problem with OpenAI: ${error}`);
    }
  }

  // Provide educational assistance
  async provideEducationalHelp(
    question: string,
    subject: string = 'general',
    gradeLevel?: string
  ): Promise<string> {
    try {
      console.log(`📚 Providing educational help for ${subject}...`);

      const gradeContext = gradeLevel ? ` for ${gradeLevel} level` : '';
      const systemPrompt = `You are ครูเพ็ญศรวย, an expert ${subject} teacher${gradeContext}. 
      You help students understand concepts clearly and provide step-by-step explanations. 
      Use examples when helpful and encourage learning.`;

      const response = await this.openaiClient.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: 'system' as const,
            content: systemPrompt,
          },
          {
            role: 'user' as const,
            content: `นักเรียนมีคำถามเกี่ยวกับ ${subject}: "${question}"\n\nช่วยอธิบายให้เข้าใจง่ายๆ จ้า`,
          },
        ],
        max_completion_tokens: 1500,
      });

      const help =
        response.choices[0]?.message?.content || 'ครูเพ็ญศรวยสมองแตกแล้วจ้า';
      console.log('✅ Educational help provided');

      return help;
    } catch (error) {
      console.error('Error providing educational help:', error);
      throw new Error(`Failed to provide educational help: ${error}`);
    }
  }

  // Analyze and respond to general queries
  async analyzeQuery(
    query: string,
    responseType:
      | 'helpful'
      | 'educational'
      | 'problem-solving'
      | 'encouraging' = 'helpful'
  ): Promise<string> {
    try {
      console.log(`💭 Analyzing query for ${responseType} response...`);

      let systemPrompt: string;
      let userPrompt: string;

      switch (responseType) {
        case 'educational':
          systemPrompt =
            'You are ครูเพ็ญศรวย, a knowledgeable and patient teacher. Provide educational insights and explanations.';
          userPrompt = `นักเรียนถามว่า: "${query}"\n\nช่วยอธิบายให้เข้าใจง่ายๆ จ้า`;
          break;
        case 'problem-solving':
          systemPrompt =
            'You are ครูเพ็ญศรวย, a problem-solving expert. Help students work through their challenges step by step.';
          userPrompt = `นักเรียนมีปัญหานี้: "${query}"\n\nช่วยแก้ปัญหานี้ให้กับนักเรียนด้วยจ้า`;
          break;
        case 'encouraging':
          systemPrompt =
            'You are ครูเพ็ญศรวย, a supportive and encouraging teacher. Provide motivation and positive guidance.';
          userPrompt = `นักเรียนพูดว่า: "${query}"\n\nให้กำลังใจและคำแนะนำที่เป็นประโยชน์จ้า`;
          break;
        default:
          systemPrompt =
            'You are ครูเพ็ญศรวย, a helpful and knowledgeable teacher. Provide useful information and guidance.';
          userPrompt = `นักเรียนถามว่า: "${query}"\n\nช่วยตอบคำถามนี้ให้กับนักเรียนด้วยจ้า`;
      }

      const response = await this.openaiClient.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: 'system' as const,
            content: systemPrompt,
          },
          {
            role: 'user' as const,
            content: userPrompt,
          },
        ],
        max_completion_tokens: 1200,
      });

      const analysis =
        response.choices[0]?.message?.content || 'ครูเพ็ญศรวยสมองแตกแล้วจ้า';
      console.log(`✅ ${responseType} query analysis completed`);

      return analysis;
    } catch (error) {
      console.error('Error analyzing query with OpenAI:', error);
      throw new Error(`Failed to analyze query with OpenAI: ${error}`);
    }
  }
}

export default OpenAIService;
