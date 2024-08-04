const express = require('express');
const router = express.Router();
const { 
  getFamilleUtilisateurs, 
  getFamilleUtilisateurById, 
  createFamilleUtilisateur, 
  updateFamilleUtilisateur, 
  deleteFamilleUtilisateur 
} = require('../../controllers/familleController');
const forceLogout = require('../../middleware/forceLogout');

router.get('/', forceLogout, getFamilleUtilisateurs);
router.get('/:id', forceLogout, getFamilleUtilisateurById);
router.post('/', forceLogout, createFamilleUtilisateur);
router.put('/:id', forceLogout, updateFamilleUtilisateur);
router.delete('/:id', forceLogout, deleteFamilleUtilisateur);

module.exports = router;
