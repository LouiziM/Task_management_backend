const { poolPromise, sql } = require('../utils/poolPromise');

// Get all FamilleUtilisateurs
const getFamilleUtilisateurs = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM FamilleUtilisateur');
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: 'Erreur : ' + err.message });
  }
};

// Get a single FamilleUtilisateur by ID
const getFamilleUtilisateurById = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('FamilleUtilisateurID', sql.Int, req.params.id)
      .query('SELECT * FROM FamilleUtilisateur WHERE FamilleUtilisateurID = @FamilleUtilisateurID');
    res.status(200).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur : ' + err.message });
  }
};

// Create a new FamilleUtilisateur
const createFamilleUtilisateur = async (req, res) => {
  const { LibelleFamille, Coefficient, Remarques } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('LibelleFamille', sql.NVarChar, LibelleFamille)
      .input('Coefficient', sql.Int, Coefficient)
      .input('Remarques', sql.NVarChar, Remarques)
      .query('INSERT INTO FamilleUtilisateur (LibelleFamille, Coefficient, Remarques) VALUES (@LibelleFamille, @Coefficient, @Remarques)');
    res.status(201).json({ message: 'FamilleUtilisateur créée' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur : ' + err.message });
  }
};

// Update a FamilleUtilisateur by ID
const updateFamilleUtilisateur = async (req, res) => {
  const { LibelleFamille, Coefficient, Remarques } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('FamilleUtilisateurID', sql.Int, req.params.id)
      .input('LibelleFamille', sql.NVarChar, LibelleFamille)
      .input('Coefficient', sql.Int, Coefficient)
      .input('Remarques', sql.NVarChar, Remarques)
      .query('UPDATE FamilleUtilisateur SET LibelleFamille = @LibelleFamille, Coefficient = @Coefficient, Remarques = @Remarques WHERE FamilleUtilisateurID = @FamilleUtilisateurID');
    res.status(200).json({ message: 'FamilleUtilisateur mise à jour' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur : ' + err.message });
  }
};

// Delete a FamilleUtilisateur by ID
const deleteFamilleUtilisateur = async (req, res) => {
  const familleUtilisateurId = req.params.id;
  const pool = await poolPromise;

  try {
    // Delete associated Utilisateurs
    await pool.request()
      .input('FamilleUtilisateurID', sql.Int, familleUtilisateurId)
      .query('DELETE FROM Utilisateurs WHERE FamilleUtilisateurID = @FamilleUtilisateurID');

    // Delete the FamilleUtilisateur
    await pool.request()
      .input('FamilleUtilisateurID', sql.Int, familleUtilisateurId)
      .query('DELETE FROM FamilleUtilisateur WHERE FamilleUtilisateurID = @FamilleUtilisateurID');

    res.status(200).json({ message: 'FamilleUtilisateur et Utilisateurs associés supprimés' });
  } catch (err) {
    // Rollback transaction in case of error
    res.status(500).json({ error: 'Erreur : ' + err.message });
  }
};

module.exports = {
  getFamilleUtilisateurs,
  getFamilleUtilisateurById,
  createFamilleUtilisateur,
  updateFamilleUtilisateur,
  deleteFamilleUtilisateur
};
