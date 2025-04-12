export interface Song {
    id: string;
    title: string;
    artist: string;
    album: string;
    cover_url: string;
    audio_url: string;
    duration: number;
    plays: number;
    likes: number;
    musicComments: Comment[];
    favourite_songs: FavouriteSong[];
    userID: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Comment {
    id: string;
    content: string;
    userID: string;
    songID: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface FavouriteSong {
    id: string;
    userID: string;
    songID: string;
    createdAt: Date;
    updatedAt: Date;
  }