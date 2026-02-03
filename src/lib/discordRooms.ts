// src/lib/discordRooms.ts

export type DiscordAccessMode = "placeholder" | "open" | "request";

export type DiscordRoom = {
  title: string;
  mode: DiscordAccessMode;
  url?: string;
  description?: string;
};

export function getDiscordRoom(firm: string, phase: string): DiscordRoom {
  return {
    title: `${capitalize(firm)} · ${capitalize(phase)} Trading Room`,
    mode: "placeholder",
    description:
      "Phase-specific Discord rooms will live here. Access and links will be enabled soon.",
  };
}

function capitalize(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
