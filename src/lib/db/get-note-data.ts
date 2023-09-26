// returns note without the content

import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import * as schema from "$lib/db/schema";
import { env } from "$env/dynamic/private";
import { eq } from "drizzle-orm";
import { notes } from "$lib/db/schema";

export async function getNoteData(id: string) {
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

  const noteData = {
    ...note,
    encrypted: "",
    hash: "",
  };

  return noteData;
}
