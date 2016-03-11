# Material Tic-Tac-Toe

A Material Design twist on a popular childhood game.

Quick Links:

*  [Run](#run)
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

Open your browser and point it to [http://localhost:3000](http://localhost:3000)

## <a name="todo"></a> TODO

* Run a server for people to easily test out the app.
* Allow users to play network games in real-time.
* node-sass-compiler doesn't add prefixes like CodeKit does.
* Ensure only the board is in a container that can overflow, then the entire game content.
* Move the avatar logic inside GAME factory.
* Highlight winning tiles on game completion.
* Better API error handling.