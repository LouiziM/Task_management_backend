const express = require('express');
const router = express.Router();
const {
  getAverageMinMaxTaskTime,
  getAverageTasksPerUser,
  getAverageMinMaxTaskCost,
  getTasksPerWeekForMonth,
  getTasksPerMonthForYear,
  getTasksStatusForDay,
  getTaskPercentages,
  getDashboardData
} = require('../../controllers/dashboardController');
const forceLogout = require('../../middleware/forceLogout');

router.get('/average-task-time', forceLogout, getAverageMinMaxTaskTime);
router.get('/average-tasks-per-user', forceLogout, getAverageTasksPerUser);
router.get('/average-task-cost', forceLogout, getAverageMinMaxTaskCost);
router.get('/tasks-per-week', forceLogout, getTasksPerWeekForMonth);
router.get('/tasks-per-month', forceLogout, getTasksPerMonthForYear);
router.get('/tasks-status-for-day', forceLogout, getTasksStatusForDay);
router.get('/task-percentages', forceLogout, getTaskPercentages);
router.get('/overall', forceLogout, getDashboardData);


module.exports = router;
