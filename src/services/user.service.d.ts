import { UseQueryResult } from "@tanstack/react-query";

interface SearchParams {
  q?: string;
  page?: number;
  per_page?: number;
}

interface UserData {
  user_id: number;
  username: string;
  name: string;
  surname: string;
  avatar_data: { url: string } | null;
  background_image_data: { url: string } | null;
  status: string | null;
  initials?: string;
  capacity: string;
  friends_amount: number;
  followers_amount: number;
  following_amount: number;
  bio: string | null;
  is_email_public: boolean;
  email: string;
  dob: string | null;
  is_rel_status_public: boolean;
  relationship_status: number | string;
  friend_status?: string;
  follow_status?: string;
}



interface SearchResponse {
  data: UserData[];
  message: string;
  meta: Meta;
}

export declare const useSearchUsers: (params: SearchParams) => UseQueryResult<SearchResponse, Error>;

export declare const useUserProfile: (userId: string | undefined) => UseQueryResult<{ data: UserData }, Error>;

export declare const updateProfileImage: (type: 'avatar' | 'bg_img', file: File) => Promise<any>;

export declare const useProfileImage: (type: 'avatar' | 'bg_img', userId: string | undefined, options?: any) => UseQueryResult<any, Error>;

export declare const updateUserProfile: (data: any) => Promise<any>;

export declare const requestFriend: (receiverId: number | string) => Promise<any>;

export declare const requestFollow: (receiverId: number | string) => Promise<any>;
