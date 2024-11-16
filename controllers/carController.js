const Car = require("../models/Car");
const fs = require("fs");
const path = require("path");

// Multer setup for image upload
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "./uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

/**
 * Add a new car
 */
const addCar = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const images = req.files.map((file) => file.path);

    const newCar = new Car({
      title,
      description,
      tags: tags ? tags.split(",") : [],
      images,
      ownerId: req.userId,
    });

    const savedCar = await newCar.save();
    res
      .status(201)
      .json({ message: "Car created successfully", car: savedCar });
  } catch (error) {
    res.status(500).json({ message: "Error adding car", error: error.message });
  }
};

/**
 * Get all cars
 */
const getCars = async (req, res) => {
  try {
    const cars = await Car.find({ ownerId: req.userId });
    res.status(200).json({ cars });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching cars", error: error.message });
  }
};

/**
 * Get car by ID
 */
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.status(200).json({ car });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching car", error: error.message });
  }
};

/**
 * Update car
 */
const updateCar = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const images = req.files ? req.files.map((file) => file.path) : undefined;

    const updatedFields = {
      ...(title && { title }),
      ...(description && { description }),
      ...(tags && { tags: tags.split(",") }),
      ...(images && { images }),
    };

    const updatedCar = await Car.findByIdAndUpdate(
      req.params.carId,
      updatedFields,
      { new: true }
    );
    if (!updatedCar) {
      return res.status(404).json({ message: "Car not found" });
    }
    res
      .status(200)
      .json({ message: "Car updated successfully", car: updatedCar });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating car", error: error.message });
  }
};

/**
 * Delete car
 */
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Delete images associated with the car
    car.images.forEach((imagePath) => {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });

    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting car", error: error.message });
  }
};

module.exports = {
  addCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
  upload,
};
