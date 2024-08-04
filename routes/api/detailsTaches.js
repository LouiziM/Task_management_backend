const express = require('express');
const router = express.Router();
const { 
  getDetailsTaches, 
  getAllTachesWithDetailsById, 
  createDetailsTache, 
  updateDetailsTache, 
  deleteDetailsTache 
} = require('../../controllers/detailsTachesController');
const forceLogout = require('../../middleware/forceLogout');

router.get('/', forceLogout, getDetailsTaches);
router.get('/:id', forceLogout, getAllTachesWithDetailsById);
router.post('/', forceLogout, createDetailsTache);
router.put('/:id', forceLogout, updateDetailsTache);
router.delete('/:id', forceLogout, deleteDetailsTache);

module.exports = router;
