const { poolPromise, sql } = require('../utils/poolPromise');


const getAverageMinMaxTaskTime = async (req, res) => {
    try {
      const pool = await poolPromise;
      const query = `
        SELECT 
          MIN(TempsDiff) AS MinTaskTime,
          MAX(TempsDiff) AS MaxTaskTime,
          AVG(TempsDiff) AS AverageTaskTime
        FROM DetailsTache
      `;
      const result = await pool.request().query(query);
      res.status(200).json(result.recordset[0]);
    } catch (err) {
      console.error("Error in getAverageMinMaxTaskTime:", err.message);
      res.status(500).json({ error: err.message });
    }
  };

  const getAverageTasksPerUser = async (req, res) => {
    try {
      const pool = await poolPromise;
      const query = `
        SELECT ROUND(AVG(tasksPerUser), 0) AS AverageTasksPerUser
        FROM (
          SELECT u.UtilisateurID, COUNT(d.DetailsTacheID) AS tasksPerUser
          FROM Utilisateurs u
          LEFT JOIN EnteteTache e ON e.UtilisateurID = u.UtilisateurID
          LEFT JOIN DetailsTache d ON d.EnteteTacheID = e.EnteteTacheID
          GROUP BY u.UtilisateurID
        ) AS subquery
      `;
      const result = await pool.request().query(query);
      const averageTasksPerUser = result.recordset[0].AverageTasksPerUser;
      res.status(200).json(averageTasksPerUser);
    } catch (err) {
      console.error("Error in getAverageTasksPerUser:", err.message);
      res.status(500).json({ error: err.message });
    }
  };
  
  
  const getAverageMinMaxTaskCost = async (req, res) => {
    try {
      const pool = await poolPromise;
      const query = `
        SELECT 
          MIN(PrixCalc) AS MinTaskCost,
          MAX(PrixCalc) AS MaxTaskCost,
          CAST(AVG(PrixCalc) AS DECIMAL(10, 2)) AS AverageTaskCost
        FROM DetailsTache
      `;
      const result = await pool.request().query(query);
      
      const { MinTaskCost, MaxTaskCost, AverageTaskCost } = result.recordset[0];
      const formattedResult = {
        MinTaskCost: parseFloat(MinTaskCost).toFixed(2),
        MaxTaskCost: parseFloat(MaxTaskCost).toFixed(2),
        AverageTaskCost: parseFloat(AverageTaskCost).toFixed(2)
      };
      
      res.status(200).json(formattedResult);
    } catch (err) {
      console.error("Error in getAverageMinMaxTaskCost:", err.message);
      res.status(500).json({ error: err.message });
    }
  };

const getTasksPerWeekForMonth = async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: 'Month parameter is required' });
  }
  
  const currentYear = new Date().getFullYear();

  try {
    const pool = await poolPromise;
    const query = `
      SELECT DATEPART(WEEK, e.DateOperation) AS WeekNumber, COUNT(*) AS TasksCompleted
      FROM DetailsTache d
      INNER JOIN EnteteTache e ON d.EnteteTacheID = e.EnteteTacheID
      WHERE MONTH(e.DateOperation) = @Month AND YEAR(e.DateOperation) = @Year
      GROUP BY DATEPART(WEEK, e.DateOperation)
    `;
    const result = await pool.request()
      .input('Month', sql.Int, month)
      .input('Year', sql.Int, currentYear)
      .query(query);
    
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error in getTasksPerWeekForMonth:", err.message);
    res.status(500).json({ error: err.message });
  }
};

  
  const getTasksPerMonthForYear = async (req, res) => {
    const { year } = req.query; 
  
    try {
      const pool = await poolPromise;
      const query = `
        SELECT MONTH(e.DateOperation) AS MonthNumber, COUNT(*) AS TasksCompleted
        FROM DetailsTache d
        INNER JOIN EnteteTache e ON d.EnteteTacheID = e.EnteteTacheID
        WHERE YEAR(e.DateOperation) = @Year
        GROUP BY MONTH(e.DateOperation)
      `;
      const result = await pool.request()
        .input('Year', sql.Int, year)
        .query(query);
      res.status(200).json(result.recordset);
    } catch (err) {
      console.error("Error in getTasksPerMonthForYear:", err.message);
      res.status(500).json({ error: err.message });
    }
  };

  const getTasksStatusForDay = async (req, res) => {
    try {
        const pool = await poolPromise;

        // Log the current server time
        const timeQuery = 'SELECT GETDATE() AS CurrentTime';
        const timeResult = await pool.request().query(timeQuery);
        const currentTime = timeResult.recordset[0].CurrentTime;

        // Check passed tasks
        const passedQuery = `
            SELECT COUNT(*) AS TasksPassed
            FROM DetailsTache
            WHERE HFin < @CurrentTime
              AND CONVERT(DATE, HDebut) = CONVERT(DATE, @CurrentTime)
        `;
        const passedResult = await pool.request()
            .input('CurrentTime', sql.DateTime, currentTime)
            .query(passedQuery);

        // Check in-progress tasks
        const inProgressQuery = `
            SELECT COUNT(*) AS TasksInProgress
            FROM DetailsTache
            WHERE HDebut <= @CurrentTime
              AND HFin >= @CurrentTime
              AND CONVERT(DATE, HDebut) = CONVERT(DATE, @CurrentTime)
        `;
        const inProgressResult = await pool.request()
            .input('CurrentTime', sql.DateTime, currentTime)
            .query(inProgressQuery);

        // Check yet-to-start tasks
        const yetToStartQuery = `
            SELECT COUNT(*) AS TasksYetToStart
            FROM DetailsTache
            WHERE HDebut > @CurrentTime
              AND CONVERT(DATE, HDebut) = CONVERT(DATE, @CurrentTime)
        `;
        const yetToStartResult = await pool.request()
            .input('CurrentTime', sql.DateTime, currentTime)
            .query(yetToStartQuery);

        res.status(200).json({
            CurrentTime: currentTime,
            TasksPassed: passedResult.recordset[0].TasksPassed,
            TasksInProgress: inProgressResult.recordset[0].TasksInProgress,
            TasksYetToStart: yetToStartResult.recordset[0].TasksYetToStart
        });
    } catch (err) {
        console.error("Error in getTasksStatusForDay:", err.message);
        res.status(500).json({ error: err.message });
    }
};

  const getTaskPercentages = async (req, res) => {
    try {
      const pool = await poolPromise;
      const query = `
        SELECT 
          t.LibelleTache AS TaskName,
          COUNT(d.DetailsTacheID) * 100.0 / SUM(COUNT(d.DetailsTacheID)) OVER () AS TaskPercentage
        FROM Tache t
        LEFT JOIN DetailsTache d ON d.TacheID = t.TacheID
        GROUP BY t.LibelleTache
      `;
      const result = await pool.request().query(query);
      res.status(200).json(result.recordset);
    } catch (err) {
      console.error("Error in getTaskPercentages:", err.message);
      res.status(500).json({ error: err.message });
    }
  };
  

  const getDashboardData = async (req, res) => {
    try {
      const pool = await poolPromise;
      // Query to fetch counts
      const query = `
        SELECT
          (SELECT COUNT(*) FROM Utilisateurs) AS UsersCount,
          (SELECT COUNT(*) FROM FamilleUtilisateur) AS FamilleUsersCount,
          (SELECT COUNT(*) FROM Tache) AS TachesCount,
          (SELECT COUNT(*) FROM EnteteTache) AS EntetesTachesCount,
          (SELECT COUNT(*) FROM DetailsTache) AS DetailsTachesCount
      `;
      const result = await pool.request().query(query);
      res.status(200).json(result.recordset[0]);
    } catch (err) {
      console.error("Error in getDashboardData:", err.message);
      res.status(500).json({ error: err.message });
    }
  };
  
  module.exports = { getTaskPercentages,getTasksStatusForDay,getTasksPerMonthForYear,
    getTasksPerWeekForMonth,getAverageMinMaxTaskCost, getAverageTasksPerUser,
    getAverageMinMaxTaskTime, getDashboardData}