// returns note without the content

import { drizzle } from "drizzle-orm/libsql";
import * as schema from "$lib/db/schema";
import { env } from "$env/dynamic/private";
import { eq } from "drizzle-orm";
import { notes } from "$lib/db/schema";
import { createClient } from "@libsql/client";

export async function getNoteData(id: string) {
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

  const noteData = {
    ...note,
    encrypted: "",
    hash: "",
  };

  return noteData;
}
