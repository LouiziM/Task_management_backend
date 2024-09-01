const { poolPromise, sql } = require('../utils/poolPromise');

// Get all DetailsTaches
const getDetailsTaches = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM DetailsTache');
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllTachesWithDetailsById = async (req, res) => {
  try {
    const { id } = req.params; 

    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    const pool = await poolPromise;
    const query = `
      SELECT 
        d.[DetailsTacheID],
        d.[EnteteTacheID],
        d.[TacheID],
        d.[HDebut],
        d.[HFin],
        d.[TempsDiff],
        d.[Coefficient] AS TacheCoefficient,
        d.[PrixCalc],
        d.[Remarques] AS DetailRemarques,
        e.[LibelleJournee],
        e.[UtilisateurID],
        e.[DateOperation],
        e.[Remarques] AS EnteteRemarques,
        u.[Nom] AS UtilisateurNom,
        t.[LibelleTache],
        t.[Remarques] AS TacheRemarques
      FROM [TASKMANAGER].[dbo].[DetailsTache] d
      INNER JOIN [TASKMANAGER].[dbo].[EnteteTache] e
        ON d.[EnteteTacheID] = e.[EnteteTacheID]
      INNER JOIN [TASKMANAGER].[dbo].[Tache] t
        ON d.[TacheID] = t.[TacheID]
      INNER JOIN [TASKMANAGER].[dbo].[Utilisateurs] u
        ON e.[UtilisateurID] = u.[UtilisateurID]
      WHERE d.[EnteteTacheID] = @EnteteTacheID
    `;

    const result = await pool.request()
      .input('EnteteTacheID', sql.Int, id) 
      .query(query);
    
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error in getAllTachesWithDetailsById:", err.message);
    res.status(500).json({ error: err.message });
  }
};
// Get a single DetailsTache by ID
const getDetailsTacheById = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('DetailsTacheID', sql.Int, req.params.id)
      .query('SELECT * FROM DetailsTache WHERE DetailsTacheID = @DetailsTacheID');
    res.status(200).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new DetailsTache
const createDetailsTache = async (req, res) => {
  const { EnteteTacheID, TacheID, HDebut, HFin, TempsDiff, DetailCoefficient, PrixCalc, DetailRemarques } = req.body;
  console.log(req.body)
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('EnteteTacheID', sql.Int, EnteteTacheID)
      .input('TacheID', sql.Int, TacheID)
      .input('HDebut', sql.DateTime, HDebut)
      .input('HFin', sql.DateTime, HFin)
      .input('TempsDiff', sql.Int, TempsDiff)
      .input('Coefficient', sql.Int, DetailCoefficient)
      .input('PrixCalc', sql.Decimal, PrixCalc)
      .input('Remarques', sql.NVarChar, DetailRemarques)
      .query('INSERT INTO DetailsTache (EnteteTacheID, TacheID, HDebut, HFin, TempsDiff, Coefficient, PrixCalc, Remarques) VALUES (@EnteteTacheID, @TacheID, @HDebut, @HFin, @TempsDiff, @Coefficient, @PrixCalc, @Remarques)');

    res.status(201).json({ message: 'Détails-tâche créés' });
  } catch (err) {
    console.log(err)

    res.status(500).json({ error: err.message });
  }
};



const updateDetailsTache = async (req, res) => {
  const { EnteteTacheID, TacheID, HDebut, HFin, TempsDiff, DetailCoefficient, PrixCalc, DetailRemarques } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('DetailsTacheID', sql.Int, req.params.id)
      .input('EnteteTacheID', sql.Int, EnteteTacheID)
      .input('TacheID', sql.Int, TacheID)
      .input('HDebut', sql.DateTime, HDebut)
      .input('HFin', sql.DateTime, HFin)
      .input('TempsDiff', sql.Int, TempsDiff)
      .input('Coefficient', sql.Int, DetailCoefficient) 
      .input('PrixCalc', sql.Decimal, PrixCalc)
      .input('Remarques', sql.NVarChar, DetailRemarques) 
      .query('UPDATE DetailsTache SET TacheID = @TacheID, HDebut = @HDebut, HFin = @HFin, TempsDiff = @TempsDiff, Coefficient = @Coefficient, PrixCalc = @PrixCalc, Remarques = @Remarques WHERE DetailsTacheID = @DetailsTacheID');
    res.status(200).json({ message: 'Détails-tâche mis à jour' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


// Delete a DetailsTache by ID
const deleteDetailsTache = async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('DetailsTacheID', sql.Int, req.params.id)
      .query('DELETE FROM DetailsTache WHERE DetailsTacheID = @DetailsTacheID');
    res.status(200).json({ message: 'Détails-tâche supprimés' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getDetailsTaches,
  getDetailsTacheById,
  createDetailsTache,
  updateDetailsTache,
  deleteDetailsTache,
  getAllTachesWithDetailsById
};
