import LineClient from '../client/lineClient';
import OpenAIService from './openaiService';

export class LineAIService {
  private lineClient: LineClient;
  private openaiService: OpenAIService;

  constructor() {
    this.lineClient = new LineClient();
    this.openaiService = new OpenAIService();
  }

  // Analyze image from Line and reply to user
  async analyzeAndReplyToImage(
    messageId: string,
    userId: string,
    prompt: string = 'ครูเพ็ญศรวยช่วยแก้ปัญหานี้ให้กับนักเรียนด้วยจ้า'
  ): Promise<void> {
    try {
      console.log(`🔄 Analyzing and replying to image from user ${userId}...`);

      // Get image content from Line
      const contentInfo = await this.lineClient.getContentWithMimeType(
        messageId,
        'image.jpg'
      );

      if (!contentInfo.mimeType.startsWith('image/')) {
        throw new Error('Content is not an image');
      }

      // Analyze image with OpenAI
      const analysis = await this.openaiService.analyzeImage(
        contentInfo.dataURL,
        prompt
      );

      // Send reply back to user
      await this.lineClient.sendMessage(userId, analysis);

      console.log(`✅ Analysis sent to user ${userId}`);
    } catch (error) {
      console.error('Error in analyze and reply:', error);

      // Send error message to user
      try {
        await this.lineClient.sendErrorMessage(
          userId,
          'Sorry, I encountered an error while analyzing your image. Please try again.'
        );
      } catch (replyError) {
        console.error('Error sending error message to user:', replyError);
      }
    }
  }

  // Analyze image with custom instructions and reply to user
  async analyzeWithCustomInstructionsAndReply(
    messageId: string,
    userId: string,
    instructions: string,
    systemPrompt?: string
  ): Promise<void> {
    try {
      console.log(
        `🔄 Analyzing image with custom instructions for user ${userId}...`
      );

      const contentInfo = await this.lineClient.getContentWithMimeType(
        messageId,
        'image.jpg'
      );

      if (!contentInfo.mimeType.startsWith('image/')) {
        throw new Error('Content is not an image');
      }

      const analysis =
        await this.openaiService.analyzeImageWithCustomInstructions(
          contentInfo.dataURL,
          instructions,
          systemPrompt
        );

      await this.lineClient.sendMessage(
        userId,
        `🤖 Custom Analysis:\n\n${analysis}`
      );

      console.log(`✅ Custom analysis sent to user ${userId}`);
    } catch (error) {
      console.error('Error in custom analysis and reply:', error);

      try {
        await this.lineClient.sendErrorMessage(
          userId,
          'Sorry, I encountered an error while analyzing your image. Please try again.'
        );
      } catch (replyError) {
        console.error('Error sending error message to user:', replyError);
      }
    }
  }

  // Analyze image for specific use case and reply to user
  async analyzeForUseCaseAndReply(
    messageId: string,
    userId: string,
    useCase: string
  ): Promise<void> {
    try {
      console.log(
        `🎯 Analyzing image for use case '${useCase}' for user ${userId}...`
      );

      const contentInfo = await this.lineClient.getContentWithMimeType(
        messageId,
        'image.jpg'
      );

      if (!contentInfo.mimeType.startsWith('image/')) {
        throw new Error('Content is not an image');
      }

      const analysis = await this.openaiService.analyzeImageForUseCase(
        contentInfo.dataURL,
        useCase
      );

      await this.lineClient.sendMessage(
        userId,
        `🤖 ${useCase.charAt(0).toUpperCase() + useCase.slice(1)} Analysis:\n\n${analysis}`
      );

      console.log(`✅ ${useCase} analysis sent to user ${userId}`);
    } catch (error) {
      console.error(`Error in ${useCase} analysis and reply:`, error);

      try {
        await this.lineClient.sendErrorMessage(
          userId,
          `Sorry, I encountered an error while performing ${useCase} analysis. Please try again.`
        );
      } catch (replyError) {
        console.error('Error sending error message to user:', replyError);
      }
    }
  }

  // Get Line client for direct access
  getLineClient(): LineClient {
    return this.lineClient;
  }

  // Get OpenAI service for direct access
  getOpenAIService(): OpenAIService {
    return this.openaiService;
  }
}

export default LineAIService;
