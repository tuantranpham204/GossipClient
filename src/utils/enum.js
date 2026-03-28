export const ROLES = {
  USER: 1,
  ADMIN: 2,
};

export const GENDER = {
  MALE: 1,
  FEMALE: 0,
};

export const CAPACITY = {
  USER: "user",
  HOST: "host",
};

export const IMAGE_TYPE = {
  AVATAR: "avatar",
  BG_IMG: "bg_img",
};

export const USER_RELATION_TYPE = {
  FRIEND: "friend",
  FOLLOW: "follow",
};

export const USER_RELATION_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  DECLINED: "declined",
  NOT_FRIEND: "not_friends",
  NOT_FOLLOW: "unfollowed",
  FOLLOWING: "following",
};

export const NOTIFICATION_TYPE = {
  UNREAD_MESSAGE: "unread_message",
  PRIVATE_MESSAGE_STRANGERS_REQUEST: "private_message_strangers_request",
  GROUP_JOIN_REQUEST: "group_join_request",
  FRIEND_REQUEST: "friend_request",
  FOLLOW_REQUEST: "follow_request",
  FRIEND_REQUEST_ACCEPTED: "friend_request_accepted",
  FOLLOW_REQUEST_ACCEPTED: "follow_request_accepted",
};

export const NOTIFICATION_STATUS = {
  UNREAD: "unread",
  READ: "read",
};

export const RELATIONSHIP_STATUS = {
  SINGLE: 0,
  IN_A_RELATIONSHIP: 1,
  MARRIED: 2,
};

export const MESSAGE_TYPE = {
  ORDINARY: 1,
  SYSTEM: 2,
};

export const ROOM_TYPE = {
  PRIVATE_STRANGERS_DECLINED: -1,
  PRIVATE_STRANGERS_PENDING: 0,
  PRIVATE_STRANGERS: 1,
  PRIVATE_FRIENDS: 2,
  GROUP_ROOM: 3,
};
