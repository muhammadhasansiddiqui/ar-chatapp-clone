"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

export const Message = ({
  text,
  userId,
  currentUserId,
  userImageUrl,
  userUsername,
  timestamp,
}) => {
  const isCurrentUser = userId === currentUserId;

  const formattedTimestamp = new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}  gap-3`}>
      {/* Avatar */}
      {!isCurrentUser && (
        <Avatar className="bg-gray-700 text-amber-50">
          {userImageUrl ? (
            <AvatarImage src={userImageUrl} alt={userUsername} />
          ) : (
            <AvatarFallback>{userUsername[0]?.toUpperCase()}</AvatarFallback>
          )}
        </Avatar>
      )}
      <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}>
        <div className="text-sm text-foreground mb-1">
          <span className="font-semibold">{userUsername}</span> | {" "}
          <span className="text-xs">{formattedTimestamp}</span>
        </div>
        <div
          className={`px-4 py-2 rounded-lg max-w-xs ${isCurrentUser ? "bg-primary text-black" : "bg-accent"
            }`}
        >
          {text}
        </div>
      </div>
      {isCurrentUser && (
        <Avatar>
          {userImageUrl ? (
            <AvatarImage src={userImageUrl} alt={userUsername} />
          ) : (
            <AvatarFallback>{userUsername[0]?.toUpperCase()}</AvatarFallback>
          )}
        </Avatar>
      )}
    </div>
  );
};
