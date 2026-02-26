export function requestPrivateRoom(receiverId: number | string): Promise<any>;
export function getPrivateRooms(status: string, page?: number, perPage?: number): Promise<any>;
export function usePrivateRooms(status: string, page?: number, perPage?: number): any;
