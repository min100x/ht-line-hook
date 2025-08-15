import LineAIService from '../services/lineAIService';

// Example usage of Line image analysis with OpenAI
export class LineImageAnalysisExample {
  private lineAIService: LineAIService;

  constructor() {
    this.lineAIService = new LineAIService();
  }

  // Example: Basic image analysis
  async analyzeImageBasic(messageId: string): Promise<void> {
    try {
      console.log(`🤖 Starting basic image analysis for message: ${messageId}`);

      const openaiService = this.lineAIService.getOpenAIService();
      const lineClient = this.lineAIService.getLineClient();

      // Get image content
      const contentInfo = await lineClient.getContentWithMimeType(
        messageId,
        'image.jpg'
      );

      // Analyze with OpenAI
      const analysis = await openaiService.analyzeImage(
        contentInfo.dataURL,
        'Please describe what you see in this image in detail.'
      );

      console.log('✅ Basic analysis completed:');
      console.log(analysis);
    } catch (error) {
      console.error('❌ Error in basic analysis:', error);
    }
  }

  // Example: Custom image analysis with specific instructions
  async analyzeImageWithCustomPrompt(
    messageId: string,
    customPrompt: string
  ): Promise<void> {
    try {
      console.log(`🤖 Starting custom analysis for message: ${messageId}`);

      const openaiService = this.lineAIService.getOpenAIService();
      const lineClient = this.lineAIService.getLineClient();

      const contentInfo = await lineClient.getContentWithMimeType(
        messageId,
        'image.jpg'
      );

      const analysis = await openaiService.analyzeImageWithCustomInstructions(
        contentInfo.dataURL,
        customPrompt,
        'You are an expert image analyst. Provide detailed, accurate descriptions.'
      );

      console.log('✅ Custom analysis completed:');
      console.log(analysis);
    } catch (error) {
      console.error('❌ Error in custom analysis:', error);
    }
  }

  // Example: Analyze image and send reply to user
  async analyzeAndReplyToUser(
    messageId: string,
    userId: string
  ): Promise<void> {
    try {
      console.log(`🔄 Analyzing image and replying to user: ${userId}`);

      await this.lineAIService.analyzeAndReplyToImage(
        messageId,
        userId,
        'Please analyze this image and provide a helpful description of what you see.'
      );

      console.log(`✅ Analysis and reply sent to user: ${userId}`);
    } catch (error) {
      console.error('❌ Error in analyze and reply:', error);
    }
  }

  // Example: Multiple analysis types for the same image
  async comprehensiveImageAnalysis(messageId: string): Promise<void> {
    try {
      console.log(
        `🔍 Starting comprehensive analysis for message: ${messageId}`
      );

      const openaiService = this.lineAIService.getOpenAIService();
      const lineClient = this.lineAIService.getLineClient();

      const contentInfo = await lineClient.getContentWithMimeType(
        messageId,
        'image.jpg'
      );

      // 1. Basic description
      const basicAnalysis = await openaiService.analyzeImage(
        contentInfo.dataURL,
        'Describe what you see in this image.'
      );
      console.log('📝 Basic Description:', basicAnalysis);

      // 2. Technical analysis
      const technicalAnalysis =
        await openaiService.analyzeImageWithCustomInstructions(
          contentInfo.dataURL,
          'Analyze this image from a technical perspective. Consider composition, lighting, colors, and any technical details.',
          'You are a professional photographer and image analyst.'
        );
      console.log('🔧 Technical Analysis:', technicalAnalysis);

      // 3. Creative interpretation
      const creativeAnalysis =
        await openaiService.analyzeImageWithCustomInstructions(
          contentInfo.dataURL,
          'Provide a creative and artistic interpretation of this image. What emotions does it evoke? What story might it tell?',
          'You are a creative writer and art critic with a poetic sensibility.'
        );
      console.log('🎨 Creative Interpretation:', creativeAnalysis);

      console.log('✅ Comprehensive analysis completed');
    } catch (error) {
      console.error('❌ Error in comprehensive analysis:', error);
    }
  }

  // Example: Batch image analysis
  async batchImageAnalysis(messageIds: string[]): Promise<Map<string, string>> {
    try {
      console.log(
        `📦 Starting batch analysis for ${messageIds.length} images...`
      );

      const results = new Map<string, string>();
      const openaiService = this.lineAIService.getOpenAIService();
      const lineClient = this.lineAIService.getLineClient();

      for (const messageId of messageIds) {
        try {
          const contentInfo = await lineClient.getContentWithMimeType(
            messageId,
            'image.jpg'
          );

          const analysis = await openaiService.analyzeImage(
            contentInfo.dataURL,
            'Provide a brief description of this image.'
          );
          results.set(messageId, analysis);
          console.log(`✅ Analyzed image ${messageId}`);
        } catch (error) {
          console.error(`❌ Error analyzing image ${messageId}:`, error);
          results.set(messageId, 'Analysis failed');
        }
      }

      console.log(
        `✅ Batch analysis completed. Processed ${results.size} images.`
      );
      return results;
    } catch (error) {
      console.error('❌ Error in batch analysis:', error);
      return new Map();
    }
  }

  // Example: Image analysis with specific use cases
  async analyzeImageForSpecificUseCase(
    messageId: string,
    useCase: string
  ): Promise<void> {
    try {
      console.log(`🎯 Analyzing image for use case: ${useCase}`);

      await this.lineAIService.analyzeForUseCaseAndReply(
        messageId,
        'dummy-user-id', // This would be the actual user ID in real usage
        useCase
      );

      console.log(`✅ ${useCase} analysis completed`);
    } catch (error) {
      console.error(`❌ Error in ${useCase} analysis:`, error);
    }
  }
}

// Example usage in webhook handler
export async function handleImageAnalysisInWebhook(
  messageId: string,
  userId: string,
  analysisType:
    | 'basic'
    | 'custom'
    | 'comprehensive'
    | 'accessibility'
    | 'education'
    | 'business'
    | 'safety' = 'basic'
): Promise<void> {
  const example = new LineImageAnalysisExample();

  try {
    switch (analysisType) {
      case 'basic':
        await example.analyzeImageBasic(messageId);
        break;

      case 'custom':
        await example.analyzeImageWithCustomPrompt(
          messageId,
          'Please provide a detailed analysis of this image focusing on the main subject and context.'
        );
        break;

      case 'comprehensive':
        await example.comprehensiveImageAnalysis(messageId);
        break;

      case 'accessibility':
      case 'education':
      case 'business':
      case 'safety':
        await example.analyzeImageForSpecificUseCase(messageId, analysisType);
        break;

      default:
        console.log(`📝 Unknown analysis type: ${analysisType}`);
    }

    // Send analysis to user
    await example.analyzeAndReplyToUser(messageId, userId);
  } catch (error) {
    console.error('❌ Error in webhook image analysis handler:', error);
  }
}

export default LineImageAnalysisExample;
