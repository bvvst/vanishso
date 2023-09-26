import { json } from "@sveltejs/kit";
import { readNote } from "$lib/db/read-note";
import { saveNote } from "$lib/db/save-note.js";

const expiries = ["viewing", "1h", "24h", "7d", "30d"];
const modes = ["p", "k", "otp"];

export interface NewNote {
  confirmBeforeViewing: boolean;
  mode: "p" | "k" | "otp";
  encrypted: string;
  exp: "viewing" | "1h" | "24h" | "7d" | "30d";
  h: string;
  s: string;
}

export async function POST({ request }) {
  let { mode, encrypted, exp, h, confirmBeforeViewing, s }: NewNote =
    await request.json();

  if (!expiries.includes(exp)) {
    return new Response(null, { status: 400 });
  }

  if (!modes.includes(mode)) {
    return new Response(null, { status: 400 });
  }

  if (mode == "p") {
    confirmBeforeViewing = true;
  }
  if (exp !== "viewing") {
    confirmBeforeViewing = true;
  }

  const newNote = {
    confirmBeforeViewing: confirmBeforeViewing,
    mode: mode,
    encrypted: encrypted,
    exp: exp,
    h: h,
    s: s,
  };

  const noteId = await saveNote(newNote);

  return json({ noteid: noteId });
}
