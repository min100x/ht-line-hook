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

  // Analyze text message and reply to user
  async analyzeTextAndReply(
    text: string,
    userId: string,
    prompt: string = 'ครูเพ็ญศรวยช่วยแก้ปัญหานี้ให้กับนักเรียนด้วยจ้า'
  ): Promise<void> {
    try {
      console.log(`🔄 Analyzing text message from user ${userId}...`);

      // Analyze text with OpenAI
      const analysis = await this.openaiService.analyzeText(text, prompt);

      // Send reply back to user
      await this.lineClient.sendMessage(userId, analysis);

      console.log(`✅ Text analysis sent to user ${userId}`);
    } catch (error) {
      console.error('Error in text analysis and reply:', error);

      // Send error message to user
      try {
        await this.lineClient.sendErrorMessage(
          userId,
          'Sorry, I encountered an error while analyzing your text. Please try again.'
        );
      } catch (replyError) {
        console.error('Error sending error message to user:', replyError);
      }
    }
  }

  // Solve problem based on text and reply to user
  async solveProblemAndReply(
    problemText: string,
    userId: string,
    context: string = 'general'
  ): Promise<void> {
    try {
      console.log(
        `🔧 Solving problem for user ${userId} in ${context} context...`
      );

      // Solve problem with OpenAI
      const solution = await this.openaiService.solveProblem(
        problemText,
        context
      );

      // Send solution back to user
      await this.lineClient.sendMessage(userId, solution);

      console.log(`✅ Problem solution sent to user ${userId}`);
    } catch (error) {
      console.error('Error in problem solving and reply:', error);

      try {
        await this.lineClient.sendErrorMessage(
          userId,
          'Sorry, I encountered an error while solving your problem. Please try again.'
        );
      } catch (replyError) {
        console.error('Error sending error message to user:', replyError);
      }
    }
  }

  // Provide educational help and reply to user
  async provideEducationalHelpAndReply(
    question: string,
    userId: string,
    subject: string = 'general',
    gradeLevel?: string
  ): Promise<void> {
    try {
      console.log(
        `📚 Providing educational help for user ${userId} in ${subject}...`
      );

      // Get educational help from OpenAI
      const help = await this.openaiService.provideEducationalHelp(
        question,
        subject,
        gradeLevel
      );

      // Send help back to user
      await this.lineClient.sendMessage(userId, help);

      console.log(`✅ Educational help sent to user ${userId}`);
    } catch (error) {
      console.error('Error in educational help and reply:', error);

      try {
        await this.lineClient.sendErrorMessage(
          userId,
          'Sorry, I encountered an error while providing educational help. Please try again.'
        );
      } catch (replyError) {
        console.error('Error sending error message to user:', replyError);
      }
    }
  }

  // Analyze query and provide appropriate response
  async analyzeQueryAndReply(
    query: string,
    userId: string,
    responseType:
      | 'helpful'
      | 'educational'
      | 'problem-solving'
      | 'encouraging' = 'helpful'
  ): Promise<void> {
    try {
      console.log(
        `💭 Analyzing query for user ${userId} with ${responseType} response...`
      );

      // Analyze query with OpenAI
      const response = await this.openaiService.analyzeQuery(
        query,
        responseType
      );

      // Send response back to user
      await this.lineClient.sendMessage(userId, response);

      console.log(`✅ ${responseType} response sent to user ${userId}`);
    } catch (error) {
      console.error(
        `Error in ${responseType} query analysis and reply:`,
        error
      );

      try {
        await this.lineClient.sendErrorMessage(
          userId,
          `Sorry, I encountered an error while processing your ${responseType} request. Please try again.`
        );
      } catch (replyError) {
        console.error('Error sending error message to user:', replyError);
      }
    }
  }

  // Smart message handler that determines the best response type
  async handleMessageIntelligently(
    message: string,
    userId: string
  ): Promise<void> {
    try {
      console.log(`🧠 Intelligently handling message from user ${userId}...`);

      // Simple keyword detection to determine response type
      const lowerMessage = message.toLowerCase();
      let responseType:
        | 'helpful'
        | 'educational'
        | 'problem-solving'
        | 'encouraging' = 'helpful';

      if (
        lowerMessage.includes('ปัญหา') ||
        lowerMessage.includes('แก้') ||
        lowerMessage.includes('ช่วย')
      ) {
        responseType = 'problem-solving';
      } else if (
        lowerMessage.includes('เรียน') ||
        lowerMessage.includes('สอน') ||
        lowerMessage.includes('อธิบาย')
      ) {
        responseType = 'educational';
      } else if (
        lowerMessage.includes('เหนื่อย') ||
        lowerMessage.includes('ท้อ') ||
        lowerMessage.includes('กำลังใจ')
      ) {
        responseType = 'encouraging';
      }

      // Analyze and respond appropriately
      await this.analyzeQueryAndReply(message, userId, responseType);

      console.log(`✅ Intelligent response sent to user ${userId}`);
    } catch (error) {
      console.error('Error in intelligent message handling:', error);

      try {
        await this.lineClient.sendErrorMessage(
          userId,
          'Sorry, I encountered an error while processing your message. Please try again.'
        );
      } catch (replyError) {
        console.error('Error sending error message to user:', replyError);
      }
    }
  }

  // Handle different types of text messages automatically
  async processTextMessage(
    text: string,
    userId: string,
    messageType:
      | 'general'
      | 'problem'
      | 'question'
      | 'encouragement' = 'general'
  ): Promise<void> {
    try {
      console.log(
        `📝 Processing ${messageType} text message from user ${userId}...`
      );

      switch (messageType) {
        case 'problem':
          await this.solveProblemAndReply(text, userId, 'general');
          break;
        case 'question':
          await this.provideEducationalHelpAndReply(text, userId, 'general');
          break;
        case 'encouragement':
          await this.analyzeQueryAndReply(text, userId, 'encouraging');
          break;
        default:
          await this.handleMessageIntelligently(text, userId);
      }

      console.log(`✅ ${messageType} message processed for user ${userId}`);
    } catch (error) {
      console.error(`Error processing ${messageType} message:`, error);

      try {
        await this.lineClient.sendErrorMessage(
          userId,
          'Sorry, I encountered an error while processing your message. Please try again.'
        );
      } catch (replyError) {
        console.error('Error sending error message to user:', replyError);
      }
    }
  }
}

export default LineAIService;
