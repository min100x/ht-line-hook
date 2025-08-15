import config from '../config/config';

import OpenAI from 'openai';

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
        model: 'gpt-4o',
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
        max_tokens: 1000,
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
        model: 'gpt-4o',
        messages,
        max_tokens: 1500,
        temperature: 0.7,
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
}

export default OpenAIService;
