const express = require('express');
const router = express.Router();
const { 
  getEnteteTaches, 
  getEnteteTacheById, 
  createEnteteTache, 
  updateEnteteTache, 
  deleteEnteteTache 
} = require('../../controllers/enteteTachesController');
const forceLogout = require('../../middleware/forceLogout');

router.get('/', forceLogout, getEnteteTaches);
router.get('/:id', forceLogout, getEnteteTacheById);
router.post('/', forceLogout, createEnteteTache);
router.put('/:id', forceLogout, updateEnteteTache);
router.delete('/:id', forceLogout, deleteEnteteTache);

module.exports = router;
