const { poolPromise, sql } = require('../utils/poolPromise');

// Get all Utilisateurs
const getUtilisateurs = async (req, res) => {
  try {
    const pool = await poolPromise;
    const query = `
      SELECT 
        U.UtilisateurID,
        U.Nom,
        U.Age,
        U.Email,
        U.FamilleUtilisateurID,
        F.LibelleFamille
      FROM 
        [TASKMANAGER].[dbo].[Utilisateurs] U
      LEFT JOIN 
        [TASKMANAGER].[dbo].[FamilleUtilisateur] F
      ON 
        U.FamilleUtilisateurID = F.FamilleUtilisateurID
    `;
    const result = await pool.request().query(query);
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: 'Erreur : ' + err.message });
  }
};

// Get a single Utilisateur by ID
const getUtilisateurById = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('UtilisateurID', sql.Int, req.params.id)
      .query('SELECT * FROM Utilisateurs WHERE UtilisateurID = @UtilisateurID');
    res.status(200).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur : ' + err.message });
  }
};

// Create a new Utilisateur
const createUtilisateur = async (req, res) => {
  const { Nom, Age, Email, FamilleUtilisateurID } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('Nom', sql.NVarChar, Nom)
      .input('Age', sql.Int, Age)
      .input('Email', sql.NVarChar, Email)
      .input('FamilleUtilisateurID', sql.Int, FamilleUtilisateurID)
      .query('INSERT INTO Utilisateurs (Nom, Age, Email, FamilleUtilisateurID) VALUES (@Nom, @Age, @Email, @FamilleUtilisateurID)');
    res.status(201).json({ message: 'Utilisateur créé' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur : ' + err.message });
  }
};

// Update a Utilisateur by ID
const updateUtilisateur = async (req, res) => {
  const { Nom, Age, Email, FamilleUtilisateurID } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('UtilisateurID', sql.Int, req.params.id)
      .input('Nom', sql.NVarChar, Nom)
      .input('Age', sql.Int, Age)
      .input('Email', sql.NVarChar, Email)
      .input('FamilleUtilisateurID', sql.Int, FamilleUtilisateurID)
      .query('UPDATE Utilisateurs SET Nom = @Nom, Age = @Age, Email = @Email, FamilleUtilisateurID = @FamilleUtilisateurID WHERE UtilisateurID = @UtilisateurID');
    res.status(200).json({ message: 'Utilisateur mis à jour' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur : ' + err.message });
  }
};

// Delete a Utilisateur by ID
const deleteUtilisateur = async (req, res) => {
  const utilisateurId = req.params.id;
  const pool = await poolPromise;

  try {
    // Delete associated EnteteTaches
    await pool.request()
      .input('UtilisateurID', sql.Int, utilisateurId)
      .query('DELETE FROM EnteteTache WHERE UtilisateurID = @UtilisateurID');

    // Delete the Utilisateur
    await pool.request()
      .input('UtilisateurID', sql.Int, utilisateurId)
      .query('DELETE FROM Utilisateurs WHERE UtilisateurID = @UtilisateurID');

    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur : ' + err.message });
  }
};

module.exports = {
  getUtilisateurs,
  getUtilisateurById,
  createUtilisateur,
  updateUtilisateur,
  deleteUtilisateur
};
