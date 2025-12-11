export enum AppState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface GeneratedImageResult {
  imageUrl: string;
  originalUrl: string;
}

export interface GenerationError {
  message: string;
  details?: string;
}