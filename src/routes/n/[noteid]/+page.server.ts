import { getNoteData } from "$lib/db/get-note-data";

interface Params {
  params: {
    noteid: string;
  };
}

export async function load({ params }: Params) {
  return {
    noteData: await getNoteData(params.noteid),
  };
}
