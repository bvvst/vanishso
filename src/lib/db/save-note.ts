import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import * as schema from "$lib/db/schema";
import { env } from "$env/dynamic/private";
import { notes } from "$lib/db/schema";
import ShortUniqueId from "short-unique-id";
import type { NewNote } from "../../routes/api/new/+server";
import { generateSalt, hash } from "$lib";

export async function saveNote({
  confirmBeforeViewing,
  mode,
  encrypted,
  exp,
  h,
  s,
}: NewNote) {
  const connection = connect({
    host: env.DATABASE_HOST,
    username: env.DATABASE_USERNAME,
    password: env.DATABASE_PASSWORD,
  });

  const db = drizzle(connection, { schema });

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
  } catch (e) {}

  return noteId;
}
