# Bidding API

Bidding API is a service that gives you ability to run auction on some specific item (book, car, toy etc.)
This service doesn't use any kind of authentcation system. It is simple as is. It can only handle bids that you placing and
show you the latest bids made by other users in real-time.

## Getting started

Clone repo,

```bash
$ git clone git@github.com:julianusti/bidding.git
```

Make sure that Node.js and Mongodb are installed on your machine.
Run the command,

```bash
npm install
```
it will install all dependencies which application use.

Run the db/db.js script, to populate database with test item,
```bash
node db.js
```
Run the app,
```bash
nodemon app.js
```
Run the tests,
```bash
npm test
```

# License (MIT)

Copyright (c) 2014, 

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.