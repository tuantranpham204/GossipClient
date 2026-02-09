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
  status: string | null;
  initials?: string;
}



interface SearchResponse {
  data: UserData[];
  message: string;
  meta: Meta;
}

export declare const useSearchUsers: (params: SearchParams) => UseQueryResult<SearchResponse, Error>;
