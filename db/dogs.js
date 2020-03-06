const mongoose = require('mongoose');

// Create or access the database
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/dog_app', { useNewUrlParser: true });

// Structure of the data
const dogSchema = new mongoose.Schema({
  name: String,
  age: Number,
  breed: String,
});

// Take the schema and compile to a model
const Dog = mongoose.model('Dog', dogSchema);

// // Adding a new dog to the DB
// const mango = new Dog({
//   name: "Pheonix",
//   age: 4 ,
//   breed: "Golden"
// });

// mango.save((err, dog) => {
//   if (err) {
//     console.log("Something went wrong");
//   } else {
//     console.log("We just saved a dog to the DB");
//     console.log(dog);
//   }
// });

Dog.create(
  {
    name: 'Pheonix',
    age: 2,
    breed: 'Corgi',
  },
  (err, dog) => {
    if (err) {
      console.log(err);
    } else {
      console.log(dog);
    }
  },
);

// Retrieve all dogs from the DB and console.log

Dog.find({}, (err, dogs) => {
  if (err) {
    console.log('Error!');
    console.log(err);
  } else {
    console.log('All the dogs');
    console.log(dogs);
  }
});
