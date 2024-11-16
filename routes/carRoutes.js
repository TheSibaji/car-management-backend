const express = require("express");
const {
  addCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
  upload,
} = require("../controllers/carController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/cars:
 *   post:
 *     summary: Add a new car
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Car created successfully
 *       500:
 *         description: Error adding car
 */
router.post("/", authMiddleware, upload.array("images", 10), addCar);

/**
 * @swagger
 * /api/cars:
 *   get:
 *     summary: Get all cars
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of cars
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                   images:
 *                     type: array
 *                     items:
 *                       type: string
 *                   ownerId:
 *                     type: string
 *       500:
 *         description: Error fetching cars
 */
router.get("/", authMiddleware, getCars);

/**
 * @swagger
 * /api/cars/{carId}:
 *   get:
 *     summary: Get car by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: carId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Car details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *                 ownerId:
 *                   type: string
 *       404:
 *         description: Car not found
 *       500:
 *         description: Error fetching car
 */
router.get("/:carId", authMiddleware, getCarById);

/**
 * @swagger
 * /api/cars/{carId}:
 *   put:
 *     summary: Update car
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: carId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Car updated successfully
 *       404:
 *         description: Car not found
 *       500:
 *         description: Error updating car
 */
router.put("/:carId", authMiddleware, upload.array("images", 10), updateCar);

/**
 * @swagger
 * /api/cars/{carId}:
 *   delete:
 *     summary: Delete car
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: carId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Car deleted successfully
 *       404:
 *         description: Car not found
 *       500:
 *         description: Error deleting car
 */
router.delete("/:carId", authMiddleware, deleteCar);

module.exports = router;
