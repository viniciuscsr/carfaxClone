const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});
const upload = multer({ storage: storage });

const carController = require('../controllers/carController');

// client.indices.create(
//   {
//     index: 'cars',
//   },
//   function (err, resp, status) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log('create', resp);
//     }
//   }
// );

// INDEX

router.get('/', carController.index);

// NEW ROUTES

router.get('/new', middleware.isLoggedIn, carController.getNewCar);

router.post(
  '/',
  middleware.isLoggedIn,
  upload.single('image'),
  carController.postNewCar
);

// SHOW ROUTE

router.get('/:id', carController.getCarById);

//EDIT ROUTE

router.get(
  '/:id/edit',
  middleware.checkListingOwnership,
  carController.getEditPage
);

//UPDATE ROUTE

router.put('/:id', middleware.checkListingOwnership, carController.updateCar);

// DELETE ROUTE

router.delete(
  '/:id',
  middleware.checkListingOwnership,
  carController.deleteCar
);

// SEARCH ROUTE
router.post('/search', carController.searchCar);

module.exports = router;
