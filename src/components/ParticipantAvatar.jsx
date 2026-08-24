// ==========================================
// PARTICIPANT AVATAR
// ==========================================
// Renders a participant's uploaded profile picture. Falls
// back to an initials circle (the pattern used everywhere
// before profile pictures existed) if `src` is missing —
// e.g. legacy data, or an image that failed to load.
//
// Usage:
//   <ParticipantAvatar
//     src={leader?.profileImage}
//     name={leader?.name}
//     size="h-16 w-16"
//     className="rounded-2xl border border-primary/30 bg-primary/10"
//     textClassName="text-2xl font-bold text-primary"
//   />

import { useState } from "react";

function ParticipantAvatar({
  src,
  name,
  size = "h-12 w-12",
  className = "",
  textClassName = "font-semibold text-primary",
}) {
  const [imageFailed, setImageFailed] = useState(false);

  const initial =
    name?.trim()?.charAt(0)?.toUpperCase() || "?";

  const showImage = Boolean(src) && !imageFailed;

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden ${size} ${className}`}
    >
      {showImage ? (
        <img
          src={src}
          alt={name ? `${name}'s profile picture` : "Profile picture"}
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span className={textClassName}>{initial}</span>
      )}
    </div>
  );
}

export default ParticipantAvatar;
