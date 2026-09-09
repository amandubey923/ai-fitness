import { UserResource } from "@clerk/types";
import CornerElements from "./CornerElements";

const ProfileHeader = ({ user }: { user: UserResource | null | undefined }) => {
  if (!user) return null;
  return (
    <div className="mb-5 sm:mb-6 relative backdrop-blur-sm border border-border bg-card/40 rounded-lg p-4 sm:p-5">
      <CornerElements />

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
        <div className="relative shrink-0">
          {user.imageUrl ? (
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 overflow-hidden rounded-lg border border-primary/30">
              <img
                src={user.imageUrl}
                alt={user.fullName || "Profile"}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-lg bg-linear-to-br from-primary/30 to-secondary/30 flex items-center justify-center border border-primary/30">
              <span className="text-2xl font-bold text-primary font-mono">
                {user.fullName?.charAt(0) || "U"}
              </span>
            </div>
          )}
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-background"></div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground truncate">
              {user.fullName}
            </h1>
            <div className="flex items-center bg-cyber-terminal-bg backdrop-blur-sm border border-border rounded px-2.5 py-0.5 w-fit">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse mr-1.5"></div>
              <p className="text-xs font-mono text-primary font-semibold tracking-wider">USER ACTIVE</p>
            </div>
          </div>
          <div className="h-px w-full bg-linear-to-r from-primary/40 via-secondary/40 to-primary/40 opacity-40 my-1.5"></div>
          <p className="text-xs sm:text-sm text-muted-foreground font-mono truncate">
            {user.primaryEmailAddress?.emailAddress}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
