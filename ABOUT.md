# Rememio

The app is called "Rememio" (domain rememio.com)

## Description

Rememio is an online memorial service. The service allows users to create pages dedicated to deceased individuals, where invited contributors can share memories through stories, thoughts, and photos. The style, content and copy should be written in a way that is meant to celebrate and enjoy the memories of the person while they were alive and not focus on the grief that they are now dead while also being sensitive to the situation.

## Tech stack

- **full-stack**: [Nuxt 4](https://nuxt.com/docs/getting-started/introduction) and [Vue.js](https://vuejs.org/api/)
- **ui components**: [Nuxt UI](https://ui4.nuxt.com/docs/components)
- **css styling**: [tailwind css 4.1](https://tailwindcss.com/docs/installation/using-vite)
- **database**: postgres
- **auth**: [WorkOS](https://workos.com/docs/reference)
- **node package manager**: pnpm
- **database-orm**: [drizzle-orm](https://orm.drizzle.team/docs/overview)

## Design

Use simple, clean, modern designs. There will be no dark mode of the application so DO NOT include that in the design.

## Web Application Pages

The app includes the following pages:

- Home page
  - mostly used for marketing to describe what the service with a call to action of creating a page and start sharing.
- User Profile
  - used to update the user's first and last name and profile photo.
  - contains a list of memorials that they have access to
  - a button where they can create a new page
- Memorials Page
  - memorial page dedicated to the life of the dead person
    - Rememio branding should be minimized on a memorial page since the focus is the deceased individual.
  - has profile and cover images that can be added and updated by the page admins
  - users are able to invite others to the page
  - users can share a memory/post which can have the following:
    - text/memory with no photo (show more text)
    - text with one photo (larger photo with text)
    - text with multiple photos (smaller photos with text)
    - one photo with no text (large photo)
    - multiple photos with no text (larger photos)
  - users can comment on posts or individual photos
  - users can react (heart/like/favorite) a post or individual photos
  - Multiple views
    - Feed view which shows the latest posts that have been shared
    - Photos view which shows photos that have been shared by the users and should designed like a photo gallery
    - Post details view that shows the details about an individual post including comments
    - Photo details view which shows the photo larger as well as comments
    - Obituary view
