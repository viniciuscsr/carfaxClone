const carController = {};

const car = require('../models/cars');
const bonsai_url = process.env.BONSAI_URL;
const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
  host: bonsai_url,
});

carController.index = function (req, res) {
  car.find({}, function (err, cars) {
    if (err) {
      console.log(err);
    } else {
      res.render('cars/index', { cars: cars });
    }
  });
};

carController.getNewCar = function (req, res) {
  res.render('cars/new');
};

carController.postNewCar = async function (req, res) {
  const newListing = new car({
    make: req.body.make,
    model: req.body.model,
    price: req.body.price,
    year: req.body.year,
    type: req.body.type,
    zip: req.body.zip,
    mileage: req.body.mileage,
    image: req.file.path,
    description: req.body.description,
    author: { id: req.user._id, email: req.user.email },
  });

  const indexEntry = {
    make: req.body.make,
    model: req.body.model,
    price: req.body.price,
    year: req.body.year,
    type: req.body.type,
    zip: req.body.zip,
    mileage: req.body.mileage,
    image: req.file.path,
    description: req.body.description,
  };

  let savedCar;
  try {
    savedCar = await newListing.save();
    console.log(newListing._id);
    console.log(savedCar);
    esIndexedItem = await client.index({
      index: 'cars',
      body: indexEntry,
      id: toString(savedCar._id),
    });
    console.log(esIndexedItem);
  } catch (err) {
    console.log(err);
    res.render('cars/new');
  }

  res.redirect(`/cars/${newListing._id}`);
};

carController.getCarById = function (req, res) {
  car
    .findById(req.params.id)
    .populate('comments')
    .exec(function (err, foundListing) {
      if (err) {
        console.log(err);
        res.redirect('/cars');
      } else {
        res.render('cars/show', { cars: foundListing });
      }
    });
};

carController.getEditPage = function (req, res) {
  car.findById(req.params.id, function (err, foundListing) {
    res.render('cars/edit', { cars: foundListing });
  });
};

carController.updateCar = async function (req, res) {
  car.findByIdAndUpdate(req.params.id, req.body.car, async function (
    err,
    updatedListing
  ) {
    if (err) {
      console.log(err);
      res.redirect('/cars');
    } else {
      let updateIndex;
      try {
        updateIndex = await client.update({
          index: 'cars',
          id: req.params.id,
          body: {
            doc: req.body.car,
          },
        });
      } catch (err) {
        console.log(err.meta.body.error);
      }
      res.redirect('/cars/' + req.params.id);
    }
  });
};

carController.deleteCar = async function (req, res) {
  // deleting from db
  try {
    await car.findByIdAndRemove(req.params.id);
  } catch (err) {
    console.log(err);
    res.redirect('/cars');
  }
  // deleting from elasticsearch index
  try {
    await client.delete({
      index: 'cars',
      id: tostring(req.params.id),
    });
  } catch (err) {
    console.log(err);
  }
  res.redirect('/cars');
};

carController.searchCar = async function (req, res) {
  const keyword = req.body.keyword;
  const q = req.query.q;
  console.log(q);
  let searchResponse;
  try {
    searchResponse = await client.search({
      index: 'cars',
      q: keyword,
    });
  } catch (err) {
    console.log(err);
  }
  console.log(searchResponse.hits.hits);
  res.render('search', { results: searchResponse.hits.hits });
};

module.exports = carController;
