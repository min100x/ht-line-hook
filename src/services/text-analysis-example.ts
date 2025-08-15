import LineAIService from './lineAIService';

// Example usage of Line AI text analysis and problem-solving capabilities
export class TextAnalysisExample {
  private lineAIService: LineAIService;

  constructor() {
    this.lineAIService = new LineAIService();
  }

  // Example: Basic text analysis
  async analyzeTextBasic(text: string, userId: string): Promise<void> {
    try {
      console.log(`📝 Starting basic text analysis for user: ${userId}`);

      await this.lineAIService.analyzeTextAndReply(
        text,
        userId,
        'Please help analyze this text and provide helpful insights or solutions.'
      );

      console.log('✅ Basic text analysis completed');
    } catch (error) {
      console.error('❌ Error in basic text analysis:', error);
    }
  }

  // Example: Problem solving
  async solveProblem(
    text: string,
    userId: string,
    context: string = 'general'
  ): Promise<void> {
    try {
      console.log(`🔧 Starting problem solving for user: ${userId}`);

      await this.lineAIService.solveProblemAndReply(text, userId, context);

      console.log('✅ Problem solving completed');
    } catch (error) {
      console.error('❌ Error in problem solving:', error);
    }
  }

  // Example: Educational help
  async provideEducationalHelp(
    question: string,
    userId: string,
    subject: string = 'general',
    gradeLevel?: string
  ): Promise<void> {
    try {
      console.log(`📚 Starting educational help for user: ${userId}`);

      await this.lineAIService.provideEducationalHelpAndReply(
        question,
        userId,
        subject,
        gradeLevel
      );

      console.log('✅ Educational help provided');
    } catch (error) {
      console.error('❌ Error in educational help:', error);
    }
  }

  // Example: Query analysis with specific response type
  async analyzeQueryWithType(
    query: string,
    userId: string,
    responseType: 'helpful' | 'educational' | 'problem-solving' | 'encouraging'
  ): Promise<void> {
    try {
      console.log(
        `💭 Starting ${responseType} query analysis for user: ${userId}`
      );

      await this.lineAIService.analyzeQueryAndReply(
        query,
        userId,
        responseType
      );

      console.log(`✅ ${responseType} query analysis completed`);
    } catch (error) {
      console.error(`❌ Error in ${responseType} query analysis:`, error);
    }
  }

  // Example: Intelligent message handling
  async handleMessageIntelligently(
    message: string,
    userId: string
  ): Promise<void> {
    try {
      console.log(
        `🧠 Starting intelligent message handling for user: ${userId}`
      );

      await this.lineAIService.handleMessageIntelligently(message, userId);

      console.log('✅ Intelligent message handling completed');
    } catch (error) {
      console.error('❌ Error in intelligent message handling:', error);
    }
  }

  // Example: Process different message types
  async processMessageByType(
    text: string,
    userId: string,
    messageType: 'general' | 'problem' | 'question' | 'encouragement'
  ): Promise<void> {
    try {
      console.log(`📝 Processing ${messageType} message for user: ${userId}`);

      await this.lineAIService.processTextMessage(text, userId, messageType);

      console.log(`✅ ${messageType} message processing completed`);
    } catch (error) {
      console.error(`❌ Error processing ${messageType} message:`, error);
    }
  }

  // Example: Comprehensive text assistance workflow
  async comprehensiveTextAssistance(
    text: string,
    userId: string
  ): Promise<void> {
    try {
      console.log(
        `🔄 Starting comprehensive text assistance for user: ${userId}`
      );

      // First, try intelligent handling
      await this.lineAIService.handleMessageIntelligently(text, userId);

      // You can also add additional processing here
      // For example, save to database, log analytics, etc.

      console.log('✅ Comprehensive text assistance completed');
    } catch (error) {
      console.error('❌ Error in comprehensive text assistance:', error);
    }
  }

  // Example: Batch text processing
  async batchProcessTexts(
    textMessages: Array<{ text: string; userId: string; type?: string }>
  ): Promise<void> {
    try {
      console.log(
        `📦 Starting batch text processing for ${textMessages.length} messages...`
      );

      for (const message of textMessages) {
        try {
          if (message.type) {
            await this.lineAIService.processTextMessage(
              message.text,
              message.userId,
              message.type as
                | 'general'
                | 'problem'
                | 'question'
                | 'encouragement'
            );
          } else {
            await this.lineAIService.handleMessageIntelligently(
              message.text,
              message.userId
            );
          }

          console.log(`✅ Processed message for user: ${message.userId}`);
        } catch (error) {
          console.error(
            `❌ Error processing message for user ${message.userId}:`,
            error
          );
        }
      }

      console.log('✅ Batch text processing completed');
    } catch (error) {
      console.error('❌ Error in batch text processing:', error);
    }
  }

  // Example: Subject-specific educational help
  async provideSubjectHelp(
    question: string,
    userId: string,
    subject: string,
    gradeLevel?: string
  ): Promise<void> {
    try {
      console.log(`📚 Providing ${subject} help for user: ${userId}`);

      await this.lineAIService.provideEducationalHelpAndReply(
        question,
        userId,
        subject,
        gradeLevel
      );

      console.log(`✅ ${subject} help provided`);
    } catch (error) {
      console.error(`❌ Error providing ${subject} help:`, error);
    }
  }

  // Example: Context-specific problem solving
  async solveContextProblem(
    problemText: string,
    userId: string,
    context: 'academic' | 'personal' | 'technical' | 'emotional' | 'general'
  ): Promise<void> {
    try {
      console.log(`🔧 Solving ${context} problem for user: ${userId}`);

      await this.lineAIService.solveProblemAndReply(
        problemText,
        userId,
        context
      );

      console.log(`✅ ${context} problem solving completed`);
    } catch (error) {
      console.error(`❌ Error solving ${context} problem:`, error);
    }
  }
}

// Example usage in webhook handler
export async function handleTextMessageInWebhook(
  text: string,
  userId: string,
  assistanceType:
    | 'intelligent'
    | 'problem-solving'
    | 'educational'
    | 'encouraging' = 'intelligent'
): Promise<void> {
  const example = new TextAnalysisExample();

  try {
    switch (assistanceType) {
      case 'intelligent':
        await example.handleMessageIntelligently(text, userId);
        break;

      case 'problem-solving':
        await example.solveProblem(text, userId, 'general');
        break;

      case 'educational':
        await example.provideEducationalHelp(text, userId, 'general');
        break;

      case 'encouraging':
        await example.analyzeQueryWithType(text, userId, 'encouraging');
        break;

      default:
        console.log(`📝 Unknown assistance type: ${assistanceType}`);
        await example.handleMessageIntelligently(text, userId);
    }
  } catch (error) {
    console.error('❌ Error in webhook text message handler:', error);
  }
}

// Example: Process different types of student messages
export async function processStudentMessage(
  text: string,
  userId: string
): Promise<void> {
  const example = new TextAnalysisExample();

  try {
    // Analyze the message content to determine the best approach
    const lowerText = text.toLowerCase();

    if (
      lowerText.includes('ปัญหา') ||
      lowerText.includes('แก้') ||
      lowerText.includes('ช่วย')
    ) {
      // Student has a problem - provide problem-solving assistance
      await example.solveProblem(text, userId, 'academic');
    } else if (
      lowerText.includes('เรียน') ||
      lowerText.includes('สอน') ||
      lowerText.includes('อธิบาย')
    ) {
      // Student has a question - provide educational help
      await example.provideEducationalHelp(text, userId, 'general');
    } else if (
      lowerText.includes('เหนื่อย') ||
      lowerText.includes('ท้อ') ||
      lowerText.includes('กำลังใจ')
    ) {
      // Student needs encouragement - provide supportive response
      await example.analyzeQueryWithType(text, userId, 'encouraging');
    } else {
      // General message - use intelligent handling
      await example.handleMessageIntelligently(text, userId);
    }

    console.log('✅ Student message processed successfully');
  } catch (error) {
    console.error('❌ Error processing student message:', error);
  }
}

export default TextAnalysisExample;
