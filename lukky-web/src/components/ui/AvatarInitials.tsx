import Avatar from "@mui/material/Avatar";
import { initials } from "@/lib/format";

type AvatarInitialsProps = {
  name: string;
  size?: number;
  bg?: string;
  color?: string;
  square?: boolean;
};

export default function AvatarInitials({
  name,
  size = 38,
  bg = "#EBE1FF",
  color = "#8C57FF",
  square = false,
}: AvatarInitialsProps) {
  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        bgcolor: bg,
        color,
        fontWeight: 600,
        fontSize: size * 0.32,
        borderRadius: square ? 2 : "50%",
      }}
    >
      {initials(name)}
    </Avatar>
  );
}
