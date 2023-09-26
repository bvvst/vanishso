import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import * as schema from "$lib/db/schema";
import { env } from "$env/dynamic/private";
import { eq } from "drizzle-orm";
import { notes } from "$lib/db/schema";

export async function readNote(id: string) {
  const connection = connect({
    host: env.DATABASE_HOST,
    username: env.DATABASE_USERNAME,
    password: env.DATABASE_PASSWORD,
  });

  const db = drizzle(connection, { schema });

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
