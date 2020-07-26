const carController = {};

const car = require('../models/cars');
const elasticsearch = require('@elastic/elasticsearch');
const client = new elasticsearch.Client({
  node: 'http://localhost:9200',
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
  console.log(req.file);
  console.log(req.body);
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

  try {
    await newListing.save();
    res.redirect(`/cars/${newListing._id}`);
  } catch (err) {
    console.log(err);
    res.render('cars/new');
  }

  client.index(
    {
      index: 'cars',
      body: indexEntry,
      id: newListing._id,
    },
    function (err, resp, status) {
      if (err) {
        console.log(err);
      } else {
        console.log(resp);
      }
    }
  );
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

carController.deleteCar = function (req, res) {
  car.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      console.log(err);
      res.redirect('/cars');
    } else {
      client.delete(
        {
          index: 'cars',
          id: req.params.id,
        },
        function (err, resp, status) {
          if (err) {
            console.log(err);
          } else {
            console.log(resp);
          }
        }
      );
      res.redirect('/cars');
    }
  });
};

carController.searchCar = async function (req, res) {
  const keyword = req.body.keyword;
  client.search(
    {
      index: 'cars',
      q: keyword,
    },
    function (err, resp) {
      if (err) {
        console.log(err);
      }
      res.render('search', { results: resp.body.hits.hits });
      return console.log(resp.body.hits.hits);
    }
  );
};

module.exports = carController;
