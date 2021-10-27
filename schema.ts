import { list } from '@keystone-next/keystone';

import {
  text,
  relationship,
  password,
  timestamp,
  select,
} from '@keystone-next/keystone/fields';
// The document field is a more complicated field, so it's in its own package
// Keystone aims to have all the base field types, but you can make your own
// custom ones.
import { document } from '@keystone-next/fields-document';

// We have a users list, a blogs list, and tags for blog posts, so they can be filtered.
// Each property on the exported object will become the name of a list (a.k.a. the `listKey`),
// with the value being the definition of the list, including the fields.
export const lists = {
  // Here we define the user list.
  User: list({
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
        isFilterable: true,
      }),
      password: password({ validation: { isRequired: true } }),
      projects: relationship({ ref: 'Project.owner', many: true }),
    },
    ui: {
      listView: {
        initialColumns: ['name', 'email'],
      },
    },
  }),
  Project: list({
    fields: {
      name: text({ validation: { isRequired: true } }),
      description: text({
        validation: {
          isRequired: true
        },
        ui: { displayMode: 'textarea' },
      }),
      owner: relationship({ ref: 'User.projects', many: true })
    }
  }),
  Language: list({
    fields: {
      name: text({ validation: { isRequired: true } }),
      region_code: text({ validation: { isRequired: true } }),
    }
  }),
  Phrase: list({
    fields: {
      key: text({ validation: { isRequired: true } }),
      projects: relationship({ ref: 'Project', many: true }),
      translations: relationship({
        ref: 'Translation.key',
        many: true,
        ui: {
          displayMode: 'cards',
          cardFields: ['translate'],
          inlineEdit: { fields: ['translate', 'language'] },
          linkToItem: true,
          inlineCreate: { fields: ['translate', 'language'] },
        },
      }),
    },
    ui: {
      labelField: 'key'
    }
  }),
  Translation: list({
    fields: {
      key: relationship({
        ref: 'Phrase.translations',
        many: false,
      }),
      translate: text({
        validation: {
          isRequired: true
        },
        ui: { displayMode: 'textarea' },
      }),
      language: relationship({ ref: 'Language', many: false }),
    },
    ui: {
      labelField: 'translate'
    }
  }),

  

  /* Post: list({
    fields: {
      title: text(),
      // Having the status here will make it easy for us to choose whether to display
      // posts on a live site.
      status: select({
        options: [
          { label: 'Published', value: 'published' },
          { label: 'Draft', value: 'draft' },
        ],
        // We want to make sure new posts start off as a draft when they are created
        defaultValue: 'draft',
        // fields also have the ability to configure their appearance in the Admin UI
        ui: {
          displayMode: 'segmented-control',
        },
      }),
      // The document field can be used for making highly editable content. Check out our
      // guide on the document field https://keystonejs.com/docs/guides/document-fields#how-to-use-document-fields
      // for more information
      content: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
      }),
      publishDate: timestamp(),
      // Here is the link from post => author.
      // We've configured its UI display quite a lot to make the experience of editing posts better.
      author: relationship({
        ref: 'User.posts',
        ui: {
          displayMode: 'cards',
          cardFields: ['name', 'email'],
          inlineEdit: { fields: ['name', 'email'] },
          linkToItem: true,
          inlineCreate: { fields: ['name', 'email'] },
        },
      }),
      // We also link posts to tags. This is a many <=> many linking.
      tags: relationship({
        ref: 'Tag.posts',
        ui: {
          displayMode: 'cards',
          cardFields: ['name'],
          inlineEdit: { fields: ['name'] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ['name'] },
        },
        many: true,
      }),
    },
  }),
  // Our final list is the tag list. This field is just a name and a relationship to posts
  Tag: list({
    ui: {
      isHidden: true,
    },
    fields: {
      name: text(),
      posts: relationship({ ref: 'Post.tags', many: true }),
    },
  }), */
};
