import type { Request, Response } from 'express';
import type { KeystoneContext } from '@keystone-next/keystone/types';

/*
  This example route handler gets all the tasks in the database and returns
  them as JSON data, emulating what you'd normally do in a REST API.

  More sophisticated API routes might accept query params to select fields,
  map more params to `where` arguments, add pagination support, etc.

  We're also demonstrating how you can query related data through the schema.
*/

export async function getTranslations(req: Request, res: Response) {
  // This was added by the context middleware in ../keystone.ts
  const context = (req as any).context as KeystoneContext;

  const { project_id, lang } = req.query || { project_id: null, lang: null }

  // Now we can use it to query the Keystone Schema
  const phrases = await context.query.Phrase.findMany({
    query: `
      id
      key
      projects{
        id
        name
      }
    `,
  });

  let translations = await context.query.Translation.findMany({
    query: `
      id
      key {
        id
        key
      }
      translate
      language{
        region_code
      }
    `,
  });

  let words = new Array();
  const keys = new Array();
  console.log(phrases)
  phrases.forEach(p => {
    console.log(project_id+"  "+p.projects[0].id)
    if(p.projects[0].id === project_id && !keys.includes(p.projects[0].id)) {
      keys.push(p.id);
    }
  });

  translations.forEach(t => {
    if (keys.includes(t.key.id) && t.language.region_code === lang) {
      const word = {
        key: t.key.key,
        translate: t.translate,
        id: t.id
      };
      words.push(word);
    }
  })
  
  // And return the result as JSON
  res.json({words});
}
