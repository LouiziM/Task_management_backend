const express = require('express');
const router = express.Router();
const { 
  getTaches, 
  getTacheById, 
  createTache, 
  updateTache, 
  deleteTache,
  getAllTachesWithDetails,
  getTacheByDate,
  getAllTachesWithDetailsById
} = require('../../controllers/tachesController');
const forceLogout = require('../../middleware/forceLogout');

router.get('/', forceLogout, getTaches);
router.get('/total', forceLogout, getAllTachesWithDetails);
// router.get('/by-id/:id', forceLogout, getAllTachesWithDetailsById);
router.get('/date/:date', forceLogout, getTacheByDate);
router.get('/one/:id', forceLogout, getTacheById);
router.post('/', forceLogout, createTache);
router.put('/:id', forceLogout, updateTache);
router.delete('/:id', forceLogout, deleteTache);
module.exports = router;
