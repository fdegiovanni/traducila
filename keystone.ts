/*
Welcome to Keystone! This file is what keystone uses to start the app.

It looks at the default export, and expects a Keystone config object.

You can find all the config options in our docs here: https://keystonejs.com/docs/apis/config
*/

import { config } from '@keystone-next/keystone';

// Look in the schema file for how we define our lists, and how users interact with them through graphql or the Admin UI
import { lists } from './schema';
import { getTranslations } from './routes/translations';

// Keystone auth is configured separately - check out the basic auth setup we are importing from our auth file.
import { withAuth, session } from './auth';

export default withAuth(
  // Using the config function helps typescript guide you to the available options.
  config({
    // the db sets the database provider - we're using sqlite for the fastest startup experience
    db: {
      provider: 'sqlite',
      url: 'file:./keystone.db',
    },
    // This config allows us to set up features of the Admin UI https://keystonejs.com/docs/apis/config#ui
    ui: {
      // For our starter, we check that someone has session data before letting them see the Admin UI.
      isAccessAllowed: (context) => !!context.session?.data,
    },
    server: {
      /*
        This is the main part of this example. Here we include a function that
        takes the express app Keystone created, and does two things:
        - Adds a middleware function that will run on requests matching our REST
          API routes, to get a keystone context on `req`. This means we don't
          need to put our route handlers in a closure and repeat it for each.
        - Adds a GET handler for tasks, which will query for tasks in the
          Keystone schema and return the results as JSON
      */
      extendExpressApp: (app, createContext) => {
        app.use('/rest', async (req, res, next) => {
          (req as any).context = await createContext(req, res);
          next();
        });
        app.get('/rest/translation', getTranslations);
      },
    },
    lists,
    session,
  })
);
