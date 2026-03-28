export interface Post {
  id: string;
  username: string;
  userAvatar: string;
  thumbnail: string;
  description: string;
  music: string;
  musicCover: string;
  likes: string;
  comments: string;
  shares: string;
  bookmarks: string;
  hearts: string;
  zippers: string;
  duration: number;
  location?: string;
  isPGN?: boolean;
  originalPost?: {
    id: string;
    username: string;
    userAvatar: string;
    thumbnail: string;
    description: string;
  };
  isRemix?: boolean;
  zipLine?: Post[];
}

export interface ZipperUser {
  id: string;
  username: string;
  avatar: string;
  displayName: string;
  followers: string;
  following: string;
  zippclips: string;
  bio: string;
  isVerified: boolean;
  location?: string;
}

export interface ZippLine {
  id: string;
  originalPost: Post;
  zippers: Post[];
  totalZippers: number;
  isActive: boolean;
}