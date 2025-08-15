import LineClient from './lineClient';

// Example usage of Line content methods
export class LineContentExample {
  private lineClient: LineClient;

  constructor() {
    this.lineClient = new LineClient();
  }

  // Example: Get image content as base64
  async getImageAsBase64(messageId: string): Promise<void> {
    try {
      console.log(`🖼️ Getting image content for message: ${messageId}`);

      const base64 = await this.lineClient.getContentBase64(messageId);
      console.log(`✅ Base64 content length: ${base64.length}`);
      console.log(`📊 Base64 preview: ${base64.substring(0, 100)}...`);
    } catch (error) {
      console.error('❌ Error getting base64 content:', error);
    }
  }

  // Example: Get image content as data URL
  async getImageAsDataURL(messageId: string): Promise<void> {
    try {
      console.log(`🖼️ Getting image data URL for message: ${messageId}`);

      const dataURL = await this.lineClient.getContentAsDataURL(
        messageId,
        'image/jpeg'
      );
      console.log(`✅ Data URL length: ${dataURL.length}`);
      console.log(`🔗 Data URL preview: ${dataURL.substring(0, 100)}...`);

      // You can use this dataURL directly in HTML img tags
      // <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..." />
    } catch (error) {
      console.error('❌ Error getting data URL:', error);
    }
  }

  // Example: Get content with full information
  async getContentInfo(messageId: string, fileName?: string): Promise<void> {
    try {
      console.log(`📁 Getting full content info for message: ${messageId}`);

      const contentInfo = await this.lineClient.getContentWithMimeType(
        messageId,
        fileName
      );

      console.log('✅ Content information:');
      console.log(`  📏 Size: ${contentInfo.size} bytes`);
      console.log(`  🏷️  MIME Type: ${contentInfo.mimeType}`);
      console.log(`  🔢 Base64 Length: ${contentInfo.base64.length}`);
      console.log(`  🔗 Data URL Length: ${contentInfo.dataURL.length}`);

      // Use the content in different ways:
      // 1. Save to file
      // const fs = require('fs');
      // const extension = contentInfo.mimeType.split('/')[1];
      // const outputFile = `./downloads/content_${messageId}.${extension}`;
      // fs.writeFileSync(outputFile, contentInfo.buffer);
      // console.log(`💾 Saved to: ${outputFile}`);

      // 2. Send to another API
      // await this.sendToExternalAPI(contentInfo.base64, contentInfo.mimeType);

      // 3. Process with image manipulation library
      // const sharp = require('sharp');
      // const processedBuffer = await sharp(contentInfo.buffer)
      //   .resize(800, 600)
      //   .jpeg({ quality: 80 })
      //   .toBuffer();
    } catch (error) {
      console.error('❌ Error getting content info:', error);
    }
  }

  // Example: Handle different file types
  async handleFileContent(messageId: string, fileName: string): Promise<void> {
    try {
      console.log(`📄 Handling file content: ${fileName}`);

      const contentInfo = await this.lineClient.getContentWithMimeType(
        messageId,
        fileName
      );

      switch (contentInfo.mimeType.split('/')[0]) {
        case 'image':
          console.log('🖼️ Processing image file...');
          // Handle image processing
          break;

        case 'video':
          console.log('🎥 Processing video file...');
          // Handle video processing
          break;

        case 'audio':
          console.log('🎵 Processing audio file...');
          // Handle audio processing
          break;

        case 'text':
          console.log('📝 Processing text file...');
          const textContent = contentInfo.buffer.toString('utf-8');
          console.log(`📄 Text content: ${textContent.substring(0, 200)}...`);
          break;

        default:
          console.log('📦 Processing binary file...');
        // Handle other file types
      }
    } catch (error) {
      console.error('❌ Error handling file content:', error);
    }
  }
}

// Example usage in webhook handler
export async function handleLineWebhookContent(
  messageId: string,
  messageType: string
): Promise<void> {
  const example = new LineContentExample();

  try {
    switch (messageType) {
      case 'image':
        await example.getContentInfo(messageId, 'image.jpg');
        break;

      case 'video':
        await example.getContentInfo(messageId, 'video.mp4');
        break;

      case 'audio':
        await example.getContentInfo(messageId, 'audio.mp3');
        break;

      case 'file':
        await example.getContentInfo(messageId, 'document.pdf');
        break;

      default:
        console.log(`📝 Text message or unsupported type: ${messageType}`);
    }
  } catch (error) {
    console.error('❌ Error in webhook content handler:', error);
  }
}

export default LineContentExample;
