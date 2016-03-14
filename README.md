# Material Tic-Tac-Toe

A Material Design twist on a popular childhood game. You can check out the [demo](http://tictactoe-benbeadle.rhcloud.com) to see it in action.

Quick Links:

*  [Run](#run)
*  [Develop](#develop)
*  [TODO](#todo)

## <a name="run"></a> Running

First download the app:
```bash
git clone https://github.com/benbeadle/Material-Tic-Tac-Toe.git
cd Material-Tic-Tac-Toe
```

Download all dependencies:
```bash
# Install all the NPM tools:
npm install

# Or update
npm update
```

Run the app:
```bash
node app.js
```

Open your browser and point it to [http://localhost:8080](http://localhost:8080)

## <a name="develop"></a> Develop

You can freely edit the app, but there's a couple things you should note:

 1. When you edit any Node.js server files (such as `app.js` and `routes/*.js`), you need to restart the Node app for your changes to be reflected.
 2. When editing any `*.scss` files, your changes won't be reflected unless you use a setup that compiles the Sass and turns it into CSS. I've chosen to use [CodeKit](https://incident57.com/codekit/), which automatically compiles the Sass into CSS and even uses [Autoprefixer](https://github.com/postcss/autoprefixer) to add those pesky browser-specific prefixes to CSS.

## <a name="todo"></a> TODO

* ~~Run a server for people to easily test out the app.~~
* Allow users to play network games in real-time.
* ~~node-sass-compiler doesn't add prefixes like CodeKit does.~~
* Ensure only the board is in a container that can overflow, then the entire game content.
* Move the avatar logic inside GAME factory.
* Highlight winning tiles on game completion.
* Better API error handling.