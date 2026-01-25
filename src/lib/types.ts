export interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
  imageUrl?: string
  imageBase64?: string
  replyToId?: string
  replyToText?: string
}

