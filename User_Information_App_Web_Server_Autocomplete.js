  // User Information App - Web Server

  // Create a Node.js application that is the beginning of a user management system. Your users are all saved in a "users.json" file, and you can currently do the following:
  // - search for users
  // - add new users to your users file.
  // - get your starter file here: users.json

  // Part 0
  // Create one route:
  // - route 1: renders a page that displays all your users.

  const express = require('express');
  const app = express();
  const bodyParser = require('body-parser');
  const fs = require('fs');

  app.set('view engine', 'ejs');
  app.set('views', './views');

  app.use(express.static('./public'));
  app.use(bodyParser.urlencoded({
    extended: false
  }))

  app.get('/', (req, res) => {
    fs.readFile('resources/users.json', (err, data) => {
      if (err) {
        throw err;
      }
      data = JSON.parse(data);
      sorted = data.sort(function(a, b) {
        if (a.lastname < b.lastname) return -1;
        if (a.lastname > b.lastname) return 1;
        return 0;
      });
      res.render('home', {
        sorted: sorted
      });
    })
  })

  //////////////  //////////////  //////////////  //////////////  //////////////

  // Part 1
  // Create two more routes:
  // - route 2: renders a page that displays a form which is your search bar.
  // - route 3: takes in the post request from your form, then displays matching users on a new page.
  //   Users should be matched based on whether either their first or last name contains the input string.

  app.get('/search', (req, res) => {
    res.render('search');
  })

  app.post('/search', (req, res) => {

    fs.readFile('resources/users.json', (err, data) => {
      if (err) {
        throw err;
      }
      let myUsers = JSON.parse(data);
      var suggest = {};

      for (let i = 0; i < myUsers.length; i++) {
        var compfirst = myUsers[i].firstname.toLowerCase();
        var complast = myUsers[i].lastname.toLowerCase();
        if (compfirst.includes(req.body.firstname) || complast.includes(req.body.lastname)) {
          suggest[i] = compfirst + " " + complast;
        }
      }
      res.send(suggest)
    })
  })

app.post('/matched', (req, res) => {
  let matchedUser = null;
  fs.readFile('resources/users.json', (err, data) => {
    if (err) {
      throw err;
    }
    let myUsers = JSON.parse(data);

    for (let i = 0; i < myUsers.length; i++) {
      if (req.body.firstname.toLowerCase() == myUsers[i].firstname.toLowerCase() || req.body.lastname.toLowerCase() == myUsers[i].lastname.toLowerCase()) {
        matchedUser = myUsers[i];
        res.render('matched', {
          match: matchedUser
        });
      }
    }
    if (matchedUser === null) {
      res.render('no_match');
    }
  });
});

  //////////////  //////////////  //////////////  //////////////  //////////////

  // Part 2
  // Create two more routes:
  // - route 4: renders a page with three inputs on it (first name, last name, and email) that allows you to add new users to the users.json file.
  // - route 5: takes in the post request from the 'create user' form, then adds the user to the users.json file.
  //   Once that is complete, redirects to the route that displays all your users (from part 0).

  app.get('/create_new_users', (req, res) => {
    res.render('create_new_users');
  })

  app.post('/show_new_users', (req, res) => {
    fs.readFile('resources/users.json', (err, data) => {
      if (err) {
        throw err;
      }
      let users = JSON.parse(data);
      let newUser = req.body;
      users.push(newUser);
      let text = JSON.stringify(users);
      fs.writeFile('resources/users.json', text, (err, data) => {
        if (err) {
          throw err;
        }
        res.redirect('/')
      })
    })
  })

  //////////////  //////////////  //////////////  //////////////  //////////////

  app.listen(3006, () => {
    console.log('App is running on port 3006');
  })
