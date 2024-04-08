import { drizzle } from "drizzle-orm/libsql";
import * as schema from "$lib/db/schema";
import { env } from "$env/dynamic/private";
import { eq } from "drizzle-orm";
import { notes } from "$lib/db/schema";
import { createClient } from "@libsql/client";

export async function readNote(id: string) {
  console.log("hi", env.DATABASE_HOST);
  const client = createClient({
    url: env.DATABASE_HOST,
    authToken: env.DATABASE_TOKEN,
  });

  const db = drizzle(client, { schema });

  const note = await db.query.notes.findFirst({
    where: eq(notes.id, id),
  });

  if (!note) {
    return null;
  }

  if (note.exp == 0) {
    await db.delete(notes).where(eq(notes.id, id));
  } else if (note.exp < Date.now()) {
    await db.delete(notes).where(eq(notes.id, id));
    return null;
  }

  return note;
}
