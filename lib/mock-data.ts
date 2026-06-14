// Mock data generators and constants for DocuMind AI

export interface Document {
  id: string
  filename: string
  uploadDate: Date
  pages: number
  chunks: number
  size: string
  status: 'indexed' | 'processing' | 'error'
  preview?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  sources?: Source[]
}

export interface Source {
  filename: string
  page: number
  confidence: number
  preview: string
}

export interface ChatSession {
  id: string
  title: string
  createdAt: Date
  lastMessage: string
  messageCount: number
  documentCount: number
}

// Mock documents
export const mockDocuments: Document[] = [
  {
    id: '1',
    filename: 'Neural Networks Fundamentals.pdf',
    uploadDate: new Date('2024-06-08'),
    pages: 156,
    chunks: 1240,
    size: '12.5 MB',
    status: 'indexed',
    preview: 'A comprehensive guide to understanding neural networks and deep learning...',
  },
  {
    id: '2',
    filename: 'Product Roadmap Q3-Q4 2024.docx',
    uploadDate: new Date('2024-06-07'),
    pages: 24,
    chunks: 189,
    size: '2.3 MB',
    status: 'indexed',
    preview: 'Strategic product planning document including features, timeline, and resources...',
  },
  {
    id: '3',
    filename: 'API Documentation v2.0.md',
    uploadDate: new Date('2024-06-05'),
    pages: 89,
    chunks: 712,
    size: '5.1 MB',
    status: 'indexed',
    preview: 'Complete API reference with endpoints, authentication, and code examples...',
  },
  {
    id: '4',
    filename: 'Financial Report 2024.xlsx',
    uploadDate: new Date('2024-06-04'),
    pages: 45,
    chunks: 356,
    size: '3.8 MB',
    status: 'processing',
    preview: 'Quarterly financial statements and performance metrics...',
  },
  {
    id: '5',
    filename: 'Compliance Guidelines.pdf',
    uploadDate: new Date('2024-06-01'),
    pages: 67,
    chunks: 534,
    size: '4.2 MB',
    status: 'indexed',
    preview: 'Legal and regulatory compliance requirements for operations...',
  },
]

// Mock chat sessions
export const mockChatSessions: ChatSession[] = [
  {
    id: 'chat-1',
    title: 'Understanding Neural Network Architecture',
    createdAt: new Date('2024-06-08T14:30:00'),
    lastMessage: 'What are the advantages of convolutional neural networks?',
    messageCount: 12,
    documentCount: 1,
  },
  {
    id: 'chat-2',
    title: 'Q3 Product Strategy Discussion',
    createdAt: new Date('2024-06-07T10:15:00'),
    lastMessage: 'Can you summarize the key features planned for Q3?',
    messageCount: 8,
    documentCount: 1,
  },
  {
    id: 'chat-3',
    title: 'API Integration Guide',
    createdAt: new Date('2024-06-05T16:45:00'),
    lastMessage: 'How do I authenticate with the REST API?',
    messageCount: 15,
    documentCount: 1,
  },
  {
    id: 'chat-4',
    title: 'Financial Analysis and Forecasting',
    createdAt: new Date('2024-06-04T09:20:00'),
    lastMessage: 'What were the revenue changes from Q2 to Q3?',
    messageCount: 6,
    documentCount: 1,
  },
]

// Mock conversation messages
export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'user',
    content: 'Explain the key differences between CNN and RNN architectures',
    timestamp: new Date('2024-06-08T14:30:00'),
  },
  {
    id: 'msg-2',
    role: 'assistant',
    content: 'CNNs and RNNs are designed for different types of data and problems.\n\n**Convolutional Neural Networks (CNN):**\n- Excel at processing grid-like data (images, 2D arrays)\n- Use convolution operations to detect local patterns\n- Share weights across the input, reducing parameters\n- Great for image classification, object detection\n\n**Recurrent Neural Networks (RNN):**\n- Process sequential data effectively\n- Maintain hidden state between time steps\n- Can handle variable-length sequences\n- Ideal for time series, language models, speech recognition',
    timestamp: new Date('2024-06-08T14:32:00'),
    sources: [
      {
        filename: 'Neural Networks Fundamentals.pdf',
        page: 45,
        confidence: 0.94,
        preview: 'Chapter 3: Convolutional architectures have revolutionized image processing...',
      },
      {
        filename: 'Neural Networks Fundamentals.pdf',
        page: 78,
        confidence: 0.89,
        preview: 'Recurrent networks maintain temporal information through hidden states...',
      },
    ],
  },
  {
    id: 'msg-3',
    role: 'user',
    content: 'What are some real-world applications of these?',
    timestamp: new Date('2024-06-08T14:35:00'),
  },
  {
    id: 'msg-4',
    role: 'assistant',
    content: 'Here are some practical applications:\n\n**CNN Applications:**\n- Medical imaging diagnosis\n- Autonomous vehicle perception\n- Facial recognition systems\n- Document scanning and OCR\n\n**RNN Applications:**\n- Stock price prediction\n- Machine translation\n- Chatbots and language models\n- Speech-to-text transcription',
    timestamp: new Date('2024-06-08T14:37:00'),
    sources: [
      {
        filename: 'Neural Networks Fundamentals.pdf',
        page: 120,
        confidence: 0.91,
        preview: 'Real-world implementations have demonstrated the effectiveness of both architectures...',
      },
    ],
  },
]

// Mock function to simulate document upload
export const generateNewDocument = (filename: string): Document => {
  return {
    id: Math.random().toString(36).substring(7),
    filename,
    uploadDate: new Date(),
    pages: Math.floor(Math.random() * 200) + 20,
    chunks: Math.floor(Math.random() * 1500) + 100,
    size: `${(Math.random() * 20 + 1).toFixed(1)} MB`,
    status: 'processing',
  }
}

// Search and filter utilities
export const filterDocuments = (
  documents: Document[],
  searchTerm: string,
  statusFilter?: 'all' | 'indexed' | 'processing' | 'error'
): Document[] => {
  return documents.filter((doc) => {
    const matchesSearch = doc.filename.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || statusFilter === 'all' || doc.status === statusFilter
    return matchesSearch && matchesStatus
  })
}

export const filterChatSessions = (sessions: ChatSession[], searchTerm: string): ChatSession[] => {
  return sessions.filter((session) =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase())
  )
}
