var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : "recipes.cffddarmshqp.us-east-1.rds.amazonaws.com",
  user     : "guest",
  password : "guesteats",
  port     : 3306,
  database : "master"
});

connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database.');
});

// connection.end();

// config.connectionLimit = 10;


function filterRestaurants(req, res) {
  let city = req.params.city;
  let tag = req.params.tag;
  if (city!='All' && tag!='All') {
  
    var query = `
  SELECT Restaurants.id, name, city, stars
  FROM Restaurants
  JOIN RestaurantCategories ON Restaurants.id=RestaurantCategories.id
  WHERE Restaurants.city = '${city}'
  and RestaurantCategories.categories= '${tag}' 
  order by stars desc, RAND ()
  limit 20;
  `;
  } else if (city!='All' && tag=='All') {
    var query = `
    SELECT Restaurants.id, name, city, stars
    FROM Restaurants
    WHERE Restaurants.city = '${city}'
    order by stars desc, RAND ()
    limit 20;
    `;
  } else if (tag!='All'&& city=='All') {
    var query = `
  SELECT Restaurants.id, name, city, stars
  FROM Restaurants
  JOIN RestaurantCategories ON Restaurants.id=RestaurantCategories.id
  WHERE RestaurantCategories.categories= '${tag}' 
  order by stars desc, RAND ()
  limit 20;
  `;
  }
  else{
    var query = `
    SELECT Restaurants.id, name, city, stars
    FROM Restaurants
    order by stars desc, RAND ()
    limit 20;
    `;
  }
  
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};
function getCityOptions(req, res) {

    let tag = req.params.tag;
    if (tag=='All') 
    {
      var query = `
    SELECT distinct Restaurants.city
    FROM Restaurants
    order by Restaurants.city;
    `;
    }
    else {
      var query = `
      SELECT distinct Restaurants.city
      FROM Restaurants
      JOIN RestaurantCategories ON Restaurants.id=RestaurantCategories.id
      WHERE RestaurantCategories.categories= '${tag}' 
      order by Restaurants.city;
      `;
    }

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};
function getTagOptions(req, res) {
  let city = req.params.city;
    
  if (city=='All') 
  {
    var query = `
  SELECT distinct RestaurantCategories.categories as tag
  FROM RestaurantCategories
  order by RestaurantCategories.categories;
  `;
  }
  else {
    var query = `
    SELECT distinct RestaurantCategories.categories as tag
    FROM Restaurants
    JOIN RestaurantCategories ON Restaurants.id=RestaurantCategories.id
    WHERE Restaurants.city= '${city}' 
    order by RestaurantCategories.categories;
    `;
  }
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function searchRestaurants(req, res) {
  let term = req.params.term;
  
    var query = `
  SELECT Restaurants.id, name, city, stars
  FROM Restaurants
  WHERE Restaurants.name LIKE '${term}%'
  order by Restaurants.name
  limit 20;
  `;

  
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function getRandRecipes(req, res) {
  
  var query = `
    SELECT id, name, description
    FROM Recipes
    LIMIT 10
  `
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

// The exported functions, which can be accessed in index.js.
module.exports = {
  getRandRecipes,
  filterRestaurants,
  getCityOptions,
  getTagOptions,
  searchRestaurants
}