const { poolPromise, sql } = require('../utils/poolPromise');

// Get all EnteteTaches
const getEnteteTaches = async (req, res) => {
  try {
    const pool = await poolPromise;
    // SQL query with JOIN to include user names
    const query = `
      SELECT TOP (1000)
        et.[EnteteTacheID],
        et.[LibelleJournee],
        et.[DateOperation],
        et.[Remarques],
        u.[Nom] AS UtilisateurNom
      FROM [TASKMANAGER].[dbo].[EnteteTache] et
      INNER JOIN [TASKMANAGER].[dbo].[Utilisateurs] u
      ON et.[UtilisateurID] = u.[UtilisateurID]
    `;
    const result = await pool.request().query(query);
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get a single EnteteTache by ID
const getEnteteTacheById = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('EnteteTacheID', sql.Int, req.params.id)
      .query('SELECT * FROM EnteteTache WHERE EnteteTacheID = @EnteteTacheID');
    res.status(200).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createEnteteTache = async (req, res) => {
  const { LibelleJournee, UtilisateurID, DateOperation, Remarques } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('LibelleJournee', sql.NVarChar, LibelleJournee)
      .input('UtilisateurID', sql.Int, UtilisateurID)
      .input('DateOperation', sql.DateTime, DateOperation)
      .input('Remarques', sql.NVarChar, Remarques)
      .query(`
        DECLARE @InsertedEnteteTache TABLE (
          EnteteTacheID INT,
          LibelleJournee NVARCHAR(255),
          UtilisateurID INT,
          DateOperation DATETIME,
          Remarques NVARCHAR(MAX)
        );

        INSERT INTO EnteteTache (LibelleJournee, UtilisateurID, DateOperation, Remarques)
        OUTPUT INSERTED.EnteteTacheID, INSERTED.LibelleJournee, INSERTED.UtilisateurID, INSERTED.DateOperation, INSERTED.Remarques
        INTO @InsertedEnteteTache
        VALUES (@LibelleJournee, @UtilisateurID, @DateOperation, @Remarques);

        SELECT * FROM @InsertedEnteteTache;
      `);

    const newEnteteTache = result.recordset[0];
    console.log(newEnteteTache);
    res.status(201).json({ message: 'Entête de tâche créée avec succès', EnteteTache: newEnteteTache });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an EnteteTache by ID
const updateEnteteTache = async (req, res) => {
  const { LibelleJournee, UtilisateurID, DateOperation, Remarques } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('EnteteTacheID', sql.Int, req.params.id)
      .input('LibelleJournee', sql.NVarChar, LibelleJournee)
      .input('UtilisateurID', sql.Int, UtilisateurID)
      .input('DateOperation', sql.DateTime, DateOperation)
      .input('Remarques', sql.NVarChar, Remarques)
      .query('UPDATE EnteteTache SET LibelleJournee = @LibelleJournee, UtilisateurID = @UtilisateurID, DateOperation = @DateOperation, Remarques = @Remarques WHERE EnteteTacheID = @EnteteTacheID');
    res.status(200).json({ message: 'Entête de tâche mis à jour' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete an EnteteTache by ID
const deleteEnteteTache = async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('EnteteTacheID', sql.Int, req.params.id)
      .query('DELETE FROM EnteteTache WHERE EnteteTacheID = @EnteteTacheID');
    res.status(200).json({ message: 'Entête de tâche supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getEnteteTaches,
  getEnteteTacheById,
  createEnteteTache,
  updateEnteteTache,
  deleteEnteteTache
};
