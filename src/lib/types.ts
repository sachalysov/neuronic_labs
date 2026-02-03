export interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
  imageUrl?: string
  imageBase64?: string
  imageUploadStatus?: "uploading" | "ready"
  replyToId?: string
  replyToText?: string
}

