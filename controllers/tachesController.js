const { poolPromise, sql } = require('../utils/poolPromise');

// Get all Taches with joined data from DetailsTache and EnteteTache
const getAllTachesWithDetails = async (req, res) => {
  try {
    const pool = await poolPromise;
    const query = `
      SELECT 
        d.[DetailsTacheID],
        d.[EnteteTacheID],
        d.[TacheID],
        d.[HDebut],
        d.[HFin],
        d.[TempsDiff],
        d.[Coefficient] AS DetailCoefficient,
        d.[PrixCalc],
        d.[Remarques] AS DetailRemarques,
        e.[LibelleJournee],
        e.[UtilisateurID],
        e.[DateOperation],
        e.[Remarques] AS EnteteRemarques,
        u.[Nom] AS UtilisateurNom,
        t.[LibelleTache],
        t.[Coefficient] AS TacheCoefficient,
        t.[Remarques] AS TacheRemarques
      FROM [TASKMANAGER].[dbo].[DetailsTache] d
      INNER JOIN [TASKMANAGER].[dbo].[EnteteTache] e
        ON d.[EnteteTacheID] = e.[EnteteTacheID]
      INNER JOIN [TASKMANAGER].[dbo].[Tache] t
        ON d.[TacheID] = t.[TacheID]
      INNER JOIN [TASKMANAGER].[dbo].[Utilisateurs] u
        ON e.[UtilisateurID] = u.[UtilisateurID]
    `;

    const result = await pool.request().query(query);
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get all Taches
const getTaches = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Tache');
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single Tache by ID
const getTacheById = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('TacheID', sql.Int, req.params.id)
      .query('SELECT * FROM Tache WHERE TacheID = @TacheID');
    res.status(200).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new Tache
const createTache = async (req, res) => {
  const { LibelleTache, Coefficient, Remarques } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('LibelleTache', sql.NVarChar, LibelleTache)
      .input('Coefficient', sql.Int, Coefficient)
      .input('Remarques', sql.NVarChar, Remarques)
      .query('INSERT INTO Tache (LibelleTache, Coefficient, Remarques) VALUES (@LibelleTache, @Coefficient, @Remarques)');
    res.status(201).json({ message: 'Tache created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a Tache by ID
const updateTache = async (req, res) => {
  const { LibelleTache, Coefficient, Remarques } = req.body;
  console.log("update tache",req.body)
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('TacheID', sql.Int, req.params.id)
      .input('LibelleTache', sql.NVarChar, LibelleTache)
      .input('Coefficient', sql.Int, Coefficient)
      .input('Remarques', sql.NVarChar, Remarques)
      .query('UPDATE Tache SET LibelleTache = @LibelleTache, Coefficient = @Coefficient, Remarques = @Remarques WHERE TacheID = @TacheID');
    res.status(200).json({ message: 'Tache updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a Tache by ID
const deleteTache = async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('TacheID', sql.Int, req.params.id)
      .query('DELETE FROM Tache WHERE TacheID = @TacheID');
    res.status(200).json({ message: 'Tache deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTacheByDate = async (req, res) => {
  try {
    const { date } = req.params;

    const pool = await poolPromise;

    const query = `
      SELECT 
        d.[DetailsTacheID],
        d.[EnteteTacheID],
        d.[TacheID],
        d.[HDebut],
        d.[HFin],
        d.[TempsDiff],
        d.[Coefficient] AS DetailCoefficient,
        d.[PrixCalc],
        d.[Remarques] AS DetailRemarques,
        e.[LibelleJournee],
        e.[UtilisateurID],
        e.[DateOperation],
        e.[Remarques] AS EnteteRemarques,
        u.[Nom] AS UtilisateurNom,
        t.[LibelleTache],
        t.[Coefficient] AS TacheCoefficient,
        t.[Remarques] AS TacheRemarques
      FROM [TASKMANAGER].[dbo].[DetailsTache] d
      INNER JOIN [TASKMANAGER].[dbo].[EnteteTache] e
        ON d.[EnteteTacheID] = e.[EnteteTacheID]
      INNER JOIN [TASKMANAGER].[dbo].[Tache] t
        ON d.[TacheID] = t.[TacheID]
      INNER JOIN [TASKMANAGER].[dbo].[Utilisateurs] u
        ON e.[UtilisateurID] = u.[UtilisateurID]
      WHERE CAST(e.[DateOperation] AS DATE) = @DateOperation
    `;

    const result = await pool.request()
      .input('DateOperation', sql.Date, date)
      .query(query);
    
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getTaches,
  getTacheById,
  createTache,
  updateTache,
  deleteTache,
  getAllTachesWithDetails,
  getTacheByDate ,
  
};
