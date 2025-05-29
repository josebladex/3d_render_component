export interface VideoItem {
  id: number;
  name: string;
  description: string[];
  src: string;
}

export type VideoData = VideoItem[];