import { drizzle } from "drizzle-orm/libsql";
import * as schema from "$lib/db/schema";
import { env } from "$env/dynamic/private";
import { notes } from "$lib/db/schema";
import ShortUniqueId from "short-unique-id";
import type { NewNote } from "../../routes/api/new/+server";
import { generateSalt, hash } from "$lib";
import { createClient } from "@libsql/client";

export async function saveNote({
  confirmBeforeViewing,
  mode,
  encrypted,
  exp,
  h,
  s,
}: NewNote) {
  const client = createClient({
    url: env.DATABASE_HOST,
    authToken: env.DATABASE_TOKEN,
  });

  const db = drizzle(client, { schema });

  // generate id
  const uid = new ShortUniqueId({ length: 10 });
  const noteId = uid.rnd();

  // convert exp option to actual exp

  const expiryTimes = {
    "1h": Date.now() + 1000 * 60 * 60,
    "24h": Date.now() + 1000 * 60 * 60 * 24,
    "7d": Date.now() + 1000 * 60 * 60 * 24 * 7,
    "30d": Date.now() + 1000 * 60 * 60 * 24 * 30,
    viewing: 0,
  };

  const _exp = expiryTimes[exp];

  const ss = await generateSalt();
  const sh = await hash(h, ss);

  const note = {
    id: noteId,
    confirmBeforeViewing: confirmBeforeViewing,
    mode: mode,
    encrypted: encrypted,
    exp: _exp,
    h: sh,
    cs: s,
    ss: ss,
  };

  try {
    await db.insert(notes).values(note);
  } catch (e) {
    console.error(e);
  }

  return noteId;
}
