import { json, fail } from "@sveltejs/kit";
import { readNote } from "$lib/db/read-note";
import { hash } from "$lib";

export async function POST({ request }) {
  const { id, auth } = await request.json();
  // validate id and auth prolly

  const note = await readNote(id);

  if (!note) {
    return json({}, { status: 400 });
  }

  if (note.mode == "otp") {
    return json({ content: note.encrypted });
  }

  const sh = await hash(auth, note.ss);

  if (note.h !== sh) {
    return json({}, { status: 400 });
  }

  return json({ content: note.encrypted });
}
