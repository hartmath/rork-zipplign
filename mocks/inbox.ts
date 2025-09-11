export const mockMessages = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    lastMessage: "Your Zippclip is trending! 🔥 Want to collab?",
    time: "2m",
    unread: true,
  },
  {
    id: "2",
    name: "Mike Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    lastMessage: "Just added to your Zipp line! Check it out 🎬",
    time: "15m",
    unread: true,
  },
  {
    id: "3",
    name: "Emma Wilson",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    lastMessage: "Love the music choice in your latest clip!",
    time: "1h",
    unread: true,
  },
  {
    id: "4",
    name: "Alex Turner",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150",
    lastMessage: "Thanks for riding my Zipp! 🚀",
    time: "3h",
    unread: false,
  },
  {
    id: "5",
    name: "Zoe Martinez",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
    lastMessage: "Your dance moves are insane! Tutorial please? 💃",
    time: "5h",
    unread: false,
  },
  {
    id: "6",
    name: "Jake Williams",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    lastMessage: "Saw you at the Zipplign event! Great performance",
    time: "1d",
    unread: false,
  },
  {
    id: "7",
    name: "Luna Park",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
    lastMessage: "Can we use your beat for our next Zippclip?",
    time: "2d",
    unread: false,
  },
  {
    id: "8",
    name: "David Kim",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    lastMessage: "Your comedy skits always make my day 😂",
    time: "3d",
    unread: false,
  },
];

export interface MessageType {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: boolean;
}

export interface NotificationType {
  id: string;
  type: 'zipp' | 'heart' | 'follow' | 'comment' | 'zipp_trend' | 'remix' | 'collab';
  user: string;
  action: string;
  time: string;
  thumbnail: string | null;
}

export const mockNotifications = [
  {
    id: "1",
    type: "zipp",
    user: "dancer_sarah",
    action: "added to your Zipp line",
    time: "5m ago",
    thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=150",
  },
  {
    id: "2",
    type: "heart",
    user: "foodie_mike",
    action: "hearted your Zippclip",
    time: "15m ago",
    thumbnail: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=150",
  },
  {
    id: "3",
    type: "follow",
    user: "tech_guru",
    action: "started following you",
    time: "1h ago",
    thumbnail: null,
  },
  {
    id: "4",
    type: "comment",
    user: "artist_emma",
    action: "commented: Your creativity is off the charts! 🎨",
    time: "2h ago",
    thumbnail: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=150",
  },
  {
    id: "5",
    type: "zipp_trend",
    user: "zipplign_official",
    action: "Your Zippclip is trending! 🔥 234 Zippers joined your line",
    time: "3h ago",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150",
  },
  {
    id: "6",
    type: "remix",
    user: "music_lover",
    action: "remixed your Zippclip with new beats",
    time: "4h ago",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150",
  },
  {
    id: "7",
    type: "collab",
    user: "creative_duo",
    action: "invited you to collaborate on a Zippclip",
    time: "6h ago",
    thumbnail: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=150",
  },
];