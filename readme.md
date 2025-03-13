
# Blogging Platform Backend

## Overview

The goal of this project is to develop a backend for a blogging platform where users can create, update, and delete blogs. The system has two user roles: Admin and User. Admins have permissions to manage users and blogs, while regular users can perform CRUD operations on their own blogs. The platform includes secure authentication, role-based access control, and a public API for viewing blogs with search, sort, and filter functionalities.


## Technologies Used

 -TypeScript

 -Node.js

 -Express.js

 -MongoDB with Mongoose and `etc`


## Features


1. **Admin Role**

   -Created manually in the database with predefined credentials.

   -Can delete any blog.
   
   -Can block any user by updating their `isBlocked` status.
   
   -Cannot update any blog.

2. **User Role**

   -Can register and log in.

   -Can create, update, and delete their own blogs.

   -Cannot perform admin actions.

3. **Authentication & Authorization**

   -Authentication: Users must log in to perform any write, update, or delete operations.

   -Authorization: Role-based access control ensures Admins and Users can only perform actions permitted by their roles.

4. **Blog API**

   -Publicly accessible API to view blogs.

   `Supports`:

   -Search: Filter blogs by title or content.

   -Sorting: Sort blogs by fields like createdAt or title.

   -Filtering: Filter blogs by author or other attributes.


## Installation $ Scripts


The following npm scripts are available for development, building, and running the project:


1. **Clone the repository:**
```bash
   git clone https://github.com/dev-siyamahmed/blog-project-A3.git
```

2. **Change CD:**
```bash
cd blog-project-A3
```

3. **Install dependencies:**
```bash
npm install
```

4.  ***Set up MongoDB: Ensure that MongoDB is running locally or set up a cloud database (e.g., MongoDB Atlas). Update the database URI in `.env`***


5. `start:dev`: **Runs the application in development mode with TypeScript support, automatically restarting on changes**.


6. **Start the server:**
```bash
npm run start:dev
```


7. `build`: Compiles the TypeScript files into JavaScript.
```bash
npm run build
```


8. `lint`: Lints the codebase using ESLint, checking for any style or syntax issues.

```bash
npm run lint
```

9. `lint:fix`: Automatically fixes linting issues where possible.

```bash
npm run lint:fix
```


10. `prettier`: Formats the codebase using Prettier, according to the settings in `.prettierrc` and 
`.gitignore`.

```bash
npm run prettier
```


11. `prettier:fix`: Automatically formats the codebase using Prettier.

```bash
npm run prettier:fix
```


12. `start:prod`: Runs the application in production mode.
  ```bash
  npm run start:prod
  ```
***The server will run at `http://localhost:5000`.***