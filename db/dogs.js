const mongoose = require("mongoose");

mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost/dog_app", { useNewUrlParser: true });

const dogSchema = new mongoose.Schema({
  name: String,
  age: Number,
  breed: String
});

const Dog = mongoose.model("Dog", dogSchema);

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
    name: "Snow White",
    age: 15,
    breed: "Border Collie"
  },
  (err, dog) => {
    if (err) {
      console.log(err);
    } else {
      console.log(dog);
    }
  }
);

// Retrieve all dogs from the DB and console.log

Dog.find({}, (err, dogs) => {
  if (err) {
    console.log("Error!");
    console.log(error);
  } else {
    console.log("All the dogs");
    console.log(dogs);
  }
});
