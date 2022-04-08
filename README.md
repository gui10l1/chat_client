# Chat Client v1

This client was made to **work with Chat API** (which is also 
**available in my repositories**).

I developed this client using **HTML, SCSS, and Typescript**. To compile 
Typescript I used Babel to compile the whole code and Watchify to make possible 
to use `required()` and work with modules and ES6 syntax. For SASS I used their
CLI to do the work.

# Pre requisites

| System      | Required |
| ----------- | ----------- |
| Node.js      | :heavy_check_mark: |
| Yarn   | :heavy_check_mark: |
| SASS Cli   | :heavy_check_mark: |

This project **has some dependencies** that work along with it. To install all
required packages just run `yarn install` **in the console**.

```shell 
yarn install
```

# SASS

SASS package **is not included** in `package.json` file, so you will need to install
it via **NPM** (make sure to install it globally). After the installation you are 
now **able to run** `sass` in the console and compile .sass files (if you want to
change any files of this project).

# Typescript

Typescript is also a dependency that is used to build the core. To compile it I used Babel which will be installed along with all the others packages.

After the packages installations, all you need is run:

```shell
yarn watch
```

to compile everything in the same time you change the file, or run:

```shell
yarn build
```

to compile just one time after your changes.

# Running

To run this client you just need to open the `index.html` file in the source, or
use a server to run it for you!

# Conclusions

This project is just for educational reasons (study and fun) so it does not have
a method to build all the code up, neither a complicated design pattern.

I hope you enjoyed, and thanks for visiting!
