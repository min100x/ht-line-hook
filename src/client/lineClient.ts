import * as line from '@line/bot-sdk';

import config from '../config/config';

import axios from 'axios';

class LineClient {
  private messagingApiClient: line.messagingApi.MessagingApiClient;

  constructor() {
    this.messagingApiClient = new line.messagingApi.MessagingApiClient({
      channelAccessToken: config.lineMessagingApi.channelAccessToken,
    });
  }

  async getContentBase64(messageId: string): Promise<string> {
    try {
      const response = await axios.get(
        `https://api-data.line.me/v2/bot/message/${messageId}/content`,
        {
          headers: {
            Authorization: `Bearer ${config.lineMessagingApi.channelAccessToken}`,
          },
          responseType: 'arraybuffer', // Important: Get binary data
        }
      );

      // Convert binary data to base64
      const buffer = Buffer.from(response.data);
      const base64 = buffer.toString('base64');

      return base64;
    } catch (error) {
      console.error('Error getting content from Line API:', error);
      throw new Error(`Failed to get content: ${error}`);
    }
  }

  async getContentBuffer(messageId: string): Promise<Buffer> {
    try {
      const response = await axios.get(
        `https://api-data.line.me/v2/bot/message/${messageId}/content`,
        {
          headers: {
            Authorization: `Bearer ${config.lineMessagingApi.channelAccessToken}`,
          },
          responseType: 'arraybuffer',
        }
      );

      return Buffer.from(response.data);
    } catch (error) {
      console.error('Error getting content buffer from Line API:', error);
      throw new Error(`Failed to get content buffer: ${error}`);
    }
  }

  async getContentAsDataURL(
    messageId: string,
    mimeType: string = 'image/jpeg'
  ): Promise<string> {
    try {
      const base64 = await this.getContentBase64(messageId);
      return `data:${mimeType};base64,${base64}`;
    } catch (error) {
      console.error('Error getting content as data URL:', error);
      throw new Error(`Failed to get content as data URL: ${error}`);
    }
  }

  // Utility method to detect MIME type from file extension or content
  detectMimeType(fileName: string, contentType?: string): string {
    if (contentType) {
      return contentType;
    }

    const extension = fileName.split('.').pop()?.toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      mp4: 'video/mp4',
      mov: 'video/quicktime',
      avi: 'video/x-msvideo',
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      pdf: 'application/pdf',
      txt: 'text/plain',
    };

    return mimeTypes[extension || ''] || 'application/octet-stream';
  }

  // Get content with automatic MIME type detection
  async getContentWithMimeType(
    messageId: string,
    fileName?: string
  ): Promise<{
    base64: string;
    buffer: Buffer;
    dataURL: string;
    mimeType: string;
    size: number;
  }> {
    try {
      const buffer = await this.getContentBuffer(messageId);
      const base64 = buffer.toString('base64');
      const mimeType = this.detectMimeType(fileName || '');
      const dataURL = `data:${mimeType};base64,${base64}`;

      return {
        base64,
        buffer,
        dataURL,
        mimeType,
        size: buffer.length,
      };
    } catch (error) {
      console.error('Error getting content with MIME type:', error);
      throw new Error(`Failed to get content with MIME type: ${error}`);
    }
  }

  // Send message to user
  async sendMessage(userId: string, message: string): Promise<void> {
    try {
      await this.messagingApiClient.pushMessage({
        to: userId,
        messages: [
          {
            type: 'text',
            text: message,
          },
        ],
      });
      console.log(`✅ Message sent to user: ${userId}`);
    } catch (error) {
      console.error('Error sending message to user:', error);
      throw new Error(`Failed to send message to user: ${error}`);
    }
  }

  // Send error message to user
  async sendErrorMessage(
    userId: string,
    errorMessage: string = 'Sorry, I encountered an error. Please try again.'
  ): Promise<void> {
    try {
      await this.messagingApiClient.pushMessage({
        to: userId,
        messages: [
          {
            type: 'text',
            text: `❌ ${errorMessage}`,
          },
        ],
      });
      console.log(`✅ Error message sent to user: ${userId}`);
    } catch (error) {
      console.error('Error sending error message to user:', error);
      throw new Error(`Failed to send error message to user: ${error}`);
    }
  }

  async getMessagingApiClient() {
    return this.messagingApiClient;
  }
}

export default LineClient;
