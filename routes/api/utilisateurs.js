const express = require('express');
const router = express.Router();
const { 
  getUtilisateurs, 
  getUtilisateurById, 
  createUtilisateur, 
  updateUtilisateur, 
  deleteUtilisateur 
} = require('../../controllers/utilisateursController');
const forceLogout = require('../../middleware/forceLogout');

router.get('/', forceLogout, getUtilisateurs);
router.get('/:id', forceLogout, getUtilisateurById);
router.post('/', forceLogout, createUtilisateur);
router.put('/:id', forceLogout, updateUtilisateur);
router.delete('/:id', forceLogout, deleteUtilisateur);

module.exports = router;
