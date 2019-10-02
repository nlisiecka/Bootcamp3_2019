 /* Dependencies */
var mongoose = require('mongoose'), 
Listing = require('../models/listings.server.model.js'),
coordinates = require('./coordinates.server.controller.js');

/* Create a listing */
exports.create = function(req, res) {
/* Instantiate a Listing */
var listing = new Listing(req.body);
/* save the coordinates (located in req.results if there is an address property) */
if(req.results) {
listing.coordinates = {
  latitude: req.results.lat, 
  longitude: req.results.lng
};
}
/* Then save the listing */
listing.save(function(err) {
if(err) {
  console.log(err);
  res.status(400).send(err);
} else {
  res.json(listing);
  console.log(listing)
}
});
};


/* Show the current listing */
exports.read = function(req, res) {
/* send back the listing as json from the request */
res.json(req.listing);
};

/* Update a listing - note the order in which this function is called by the router*/
exports.update = function(req, res) {
var listing = req.listing;

if(req.body) {
  listing.code = req.body.code;
  listing.name = req.body.name;
  listing.address = req.body.address;
  listing.coordinates = req.body.coordinates;
};

/* Then save the listing */
listing.save(function(err) {
if(err) {
  console.log(err);
  res.status(400).send(err);
} else {
  res.json(listing);
}
});
};



/* Delete a listing */
exports.delete = function(req, res) {
var listing = req.listing;

listing.remove(function(error) {
  if (error){
    console.log(err);
    res.status(400).send(err);
  } else {
    res.json(listing);
  }
});
};

/* Retreive all the directory listings, sorted alphabetically by listing code */
exports.list = function(req, res) {

Listing.find({}).sort('code').exec(function(err, listings) {
  if(err) {
      res.status(400).send(err);
  }
  else {
      res.status(200).json(listings);    
  }
});

};

/* 
Middleware: find a listing by its ID, then pass it to the next request handler. 
HINT: Find the listing using a mongoose query, 
    bind it to the request object as the property 'listing', 
    then finally call next
*/
exports.listingByID = function(req, res, next, id) {
Listing.findById(id).exec(function(err, listing) {
if(err) {
  res.status(400).send(err);
} else {
  req.listing = listing;
  next();
}
});
};