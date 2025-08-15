import { Router, Request, Response } from "express";

const router: Router = Router();

// Line Webhook Event Types
interface LineTextMessage {
  id: string;
  type: "text";
  text: string;
  quoteToken?: string;
}

interface LineImageMessage {
  id: string;
  type: "image";
  contentProvider?: {
    type: "line" | "external";
    originalContentUrl?: string;
    previewImageUrl?: string;
  };
}

interface LineVideoMessage {
  id: string;
  type: "video";
  duration: number;
  contentProvider?: {
    type: "line" | "external";
    originalContentUrl?: string;
    previewImageUrl?: string;
  };
}

interface LineAudioMessage {
  id: string;
  type: "audio";
  duration: number;
  contentProvider?: {
    type: "line" | "external";
    originalContentUrl?: string;
  };
}

interface LineFileMessage {
  id: string;
  type: "file";
  fileName: string;
  fileSize: number;
}

interface LineLocationMessage {
  id: string;
  type: "location";
  title: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface LineStickerMessage {
  id: string;
  type: "sticker";
  packageId: string;
  stickerId: string;
  stickerResourceType:
    | "STATIC"
    | "ANIMATION"
    | "SOUND"
    | "ANIMATION_SOUND"
    | "POPUP"
    | "POPUP_SOUND"
    | "CUSTOM"
    | "MESSAGE";
  keywords?: string[];
}

type LineMessage =
  | LineTextMessage
  | LineImageMessage
  | LineVideoMessage
  | LineAudioMessage
  | LineFileMessage
  | LineLocationMessage
  | LineStickerMessage;

interface LineUser {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

interface LineGroup {
  groupId: string;
  groupName?: string;
  pictureUrl?: string;
}

interface LineRoom {
  roomId: string;
  roomName?: string;
  pictureUrl?: string;
}

interface LineSource {
  type: "user" | "group" | "room";
  userId?: string;
  groupId?: string;
  roomId?: string;
}

interface LineEvent {
  type:
    | "message"
    | "follow"
    | "unfollow"
    | "join"
    | "leave"
    | "memberJoined"
    | "memberLeft"
    | "postback"
    | "videoPlayComplete"
    | "beacon"
    | "accountLink"
    | "things";
  mode: "active" | "standby";
  timestamp: number;
  source: LineSource;
  webhookEventId: string;
  deliveryContext: {
    isRedelivery: boolean;
  };
  replyToken?: string;
  message?: LineMessage;
  user?: LineUser;
  group?: LineGroup;
  room?: LineRoom;
}

interface LineWebhookRequest {
  destination: string;
  events: LineEvent[];
}

interface WebhookResponse {
  success: boolean;
  message: string;
  timestamp: string;
  eventCount: number;
  eventTypes: string[];
}

// Line webhook endpoint
router.post("/", (req: Request, res: Response) => {
  try {
    const webhookData: LineWebhookRequest = req.body;

    // Validate webhook data
    if (
      !webhookData ||
      !webhookData.events ||
      !Array.isArray(webhookData.events)
    ) {
      res.status(400).json({
        success: false,
        error: "Invalid webhook data format",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Process webhook events
    const events = webhookData.events;
    const eventTypes = events.map((event) => event.type);

    console.log(
      `📨 Received Line webhook with ${events.length} events:`,
      eventTypes
    );

    // Process each event
    events.forEach((event: LineEvent) => {
      switch (event.type) {
        case "message":
          handleMessageEvent(event);
          break;
        case "follow":
          handleFollowEvent(event);
          break;
        case "unfollow":
          handleUnfollowEvent(event);
          break;
        case "join":
          handleJoinEvent(event);
          break;
        case "leave":
          handleLeaveEvent(event);
          break;
        case "postback":
          handlePostbackEvent(event);
          break;
        default:
          console.log(`📝 Unhandled event type: ${event.type}`);
      }
    });

    // Send success response
    const response: WebhookResponse = {
      success: true,
      message: "Webhook processed successfully",
      timestamp: new Date().toISOString(),
      eventCount: events.length,
      eventTypes: eventTypes,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("❌ Error processing Line webhook:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      timestamp: new Date().toISOString(),
    });
  }
});

// Event handlers
function handleMessageEvent(event: LineEvent): void {
  if (event.message && event.type === "message") {
    const message = event.message;
    console.log(`💬 Message received:`, {
      type: message.type,
      id: message.id,
      source: event.source,
      timestamp: new Date(event.timestamp).toISOString(),
    });

    // Handle different message types
    switch (message.type) {
      case "text":
        console.log(`📝 Text message: ${(message as LineTextMessage).text}`);
        // Add your text message processing logic here
        break;
      case "image":
        console.log(`🖼️ Image message received`);
        // Add your image processing logic here
        break;
      case "video":
        console.log(`🎥 Video message received`);
        // Add your video processing logic here
        break;
      case "audio":
        console.log(`🎵 Audio message received`);
        // Add your audio processing logic here
        break;
      case "file":
        console.log(
          `📁 File message: ${(message as LineFileMessage).fileName}`
        );
        // Add your file processing logic here
        break;
      case "location":
        const locationMsg = message as LineLocationMessage;
        console.log(
          `📍 Location: ${locationMsg.title} at ${locationMsg.latitude}, ${locationMsg.longitude}`
        );
        // Add your location processing logic here
        break;
      case "sticker":
        const stickerMsg = message as LineStickerMessage;
        console.log(
          `😀 Sticker: ${stickerMsg.packageId}/${stickerMsg.stickerId}`
        );
        // Add your sticker processing logic here
        break;
    }
  }
}

function handleFollowEvent(event: LineEvent): void {
  console.log(`👋 User followed:`, {
    userId: event.source.userId,
    timestamp: new Date(event.timestamp).toISOString(),
  });
  // Add your follow event processing logic here
}

function handleUnfollowEvent(event: LineEvent): void {
  console.log(`👋 User unfollowed:`, {
    userId: event.source.userId,
    timestamp: new Date(event.timestamp).toISOString(),
  });
  // Add your unfollow event processing logic here
}

function handleJoinEvent(event: LineEvent): void {
  console.log(`🚪 Bot joined:`, {
    source: event.source,
    timestamp: new Date(event.timestamp).toISOString(),
  });
  // Add your join event processing logic here
}

function handleLeaveEvent(event: LineEvent): void {
  console.log(`🚪 Bot left:`, {
    source: event.source,
    timestamp: new Date(event.timestamp).toISOString(),
  });
  // Add your leave event processing logic here
}

function handlePostbackEvent(event: LineEvent): void {
  console.log(`🔘 Postback received:`, {
    source: event.source,
    timestamp: new Date(event.timestamp).toISOString(),
  });
  // Add your postback event processing logic here
}

// Health check for the webhook
router.get("/health", (_req: Request, res: Response): void => {
  res.json({
    status: "OK",
    message: "Line webhook endpoint is healthy",
    timestamp: new Date().toISOString(),
    endpoint: "/line-webhook",
    method: "POST",
  });
});

export default router;
