const db = require('../config/db');

const Patient = {
    
    getMaxEmployeeId: (callback) => {
        const sql = `SELECT employeeId FROM employees ORDER BY employeeId DESC LIMIT 1`;
        db.query(sql, callback);
    },

};