# Tag-Up

## Closed due to Heroku new policy

#### Web: https://still-ocean-51261.herokuapp.com/

#### Description:
The website will get the user to post photos with small description and some tags
and users can interact with others posts either by saving it or commenting on it.

#### cloudinary: 
in cloudinary file is the configuration of cloudinary storage to store the images and the image allowed formats.

#### models:
contains each object schema, comments has a body and an author which is the user.
posts has an image, description, tags, author (user), date of posting, related comments, counter of number of saves.
users has username, email, bio, history and favorite photos and a counter for them.

#### controllers:
it iswhere the helper methods are exported each file contains the related methods, for example:
comments file contains the methods to create a comment and delete it and how it will be done in the database.
posts is for done with full CRUD, user can create, view, update and delete posts, they can also save others posts if they like it and reach it later in their profile.
searches is related to the search bar and how can a user search for a specific tag or a specific user, it is done with regular expression and search is case insenetive. 
users has multiple form for registering or logging in, they can preview and edit their profile icon and bio and view other users profile and their posts. 
User also has a history of his posts to reach for it whenever he wants, and also a favorite page where he can view saved posts.

#### middleware:
contains five fucntions, where each either checks validation or permissions.
validating posts, validating comments, verifying if a user is logged in, or if a user is the comment author, of if a user is the post author.

#### routers: 
just specifying each route with verfiying middlewares and a method from the controllers to get to the route with the authorization needed

#### public:
it contains css and javascript files which specifies the styles and behaviors of some elements in the document.

#### utils:
it has schemas to validate, try catch methods for async functions and an App erorr class extending error class.

#### views:
it has the html elements in embedded javascript files (ejs). it has a layout and partials for most of the pages in the app, and other specifed files for posts and users.


