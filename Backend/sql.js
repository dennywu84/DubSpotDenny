const sql = require('mssql')

/**
 * sets up MS Azure SQL server and all prepared statements for use by index.js
  */

const config = {
  user: 'dubspot',
  password: '1zjknqajkzSx',
  server: 'dubspot.database.windows.net',
  database: 'dubspot',
  encrypt: true
}

const pool = new sql.ConnectionPool(config)
const getCourseStatement = new sql.PreparedStatement(pool)
const getReviewsStatement = new sql.PreparedStatement(pool)
const addReviewStatement = new sql.PreparedStatement(pool)
const createAccountStatement = new sql.PreparedStatement(pool)
const findPlannedClassesStatement = new sql.PreparedStatement(pool)
const updateProfilePageStatement = new sql.PreparedStatement(pool)
const fetchProfileInfoStatement = new sql.PreparedStatement(pool)
const insertPlannedClassesStatement = new sql.PreparedStatement(pool)

pool.connect(err => {
  if (err) {
    console.log(err)
    return;
  }
  console.log('Connected to Azure SQL Database')

  // -------------------------------------
  // ---------Login/Signup--------------------
  // -------------------------------------

  // prepared statement for creating a new account
  createAccountStatement.input('createAccountEmail', sql.VarChar(100))
  createAccountStatement.input('createAccountUsername', sql.VarChar(100))
  createAccountStatement.input('createAccountPassword', sql.VarBinary(144))
  createAccountStatement.prepare(
      'INSERT INTO Users (email, username, major, standing, password) ' +
      'VALUES(@createAccountEmail, @createAccountUsername, null, null, @createAccountPassword)'
  )

  // -------------------------------------
  // ---------Calendar--------------------
  // -------------------------------------

  // prepared statement for finding the planned classes based off the session ID
  findPlannedClassesStatement.input('findPlannedEmail', sql.VarChar(100))
  findPlannedClassesStatement.prepare(
      'SELECT course_id, quarter, activity_id FROM PlanningToTake WHERE email = @findPlannedEmail'
  )

  // prepared statement for inserting planned classes
  insertPlannedClassesStatement.input('insertPlannedEmail', sql.VarChar(100))
  insertPlannedClassesStatement.input('insertPlannedCourseID', sql.VarChar(100))
  insertPlannedClassesStatement.input('insertPlannedQuarter', sql.VarChar(6))
  insertPlannedClassesStatement.input('insertPlannedActivityID', sql.VarChar(10))
  insertPlannedClassesStatement.prepare('INSERT INTO PlanningToTake (email, course_id, quarter, activity_id) ' + 'VALUES (@insertPlannedEmail, @insertPlannedCourseID, @insertPlannedQuarter, @insertPlannedActivityID)'
  )

  // -------------------------------------
  // ---------CourseFinder--------------------
  // -------------------------------------

  // prepared statement for getting course information
  getCourseStatement.input('getCourseCourseID', sql.VarChar(100))
  getCourseStatement.input('getCourseQuarter', sql.VarChar(6))
  getCourseStatement.prepare(
      'SELECT * FROM Courses WHERE course_id = @getCourseCourseID AND quarter = @getCourseQuarter'
  )

  // prepared statement for getting reviews for a specific course
  getReviewsStatement.input('getReviewsCourseID', sql.VarChar(100))
  getReviewsStatement.prepare('SELECT * FROM Reviews WHERE course_id = @getReviewsCourseID')

  // prepared statement for adding a review for a specific course
  addReviewStatement.input('addReviewCourseID', sql.VarChar(100))
  addReviewStatement.input('addReviewUsername', sql.VarChar(100))
  addReviewStatement.input('rating', sql.Int)
  addReviewStatement.input('review', sql.VarChar(1000))
  addReviewStatement.prepare(
      'INSERT INTO Reviews (course_id, username, rating, review) ' +
      'VALUES(@addReviewCourseID, @addReviewUsername, @rating, @review)'
  )

  // -------------------------------------
  // ---------Profile--------------------
  // -------------------------------------

  updateProfilePageStatement.input('updateMajor', sql.VarChar(100))
  updateProfilePageStatement.input('updateStanding', sql.VarChar(20))
  updateProfilePageStatement.input('updateUsername', sql.VarChar(100))
  updateProfilePageStatement.input('updateProfileEmail', sql.VarChar(100))
  updateProfilePageStatement.prepare(
      'UPDATE Users SET major = @updateMajor, standing = @updateStanding, username = @updateUsername WHERE email = @updateProfileEmail'
  )

  fetchProfileInfoStatement.input('fetchProfileEmail', sql.VarChar(100))
  fetchProfileInfoStatement.prepare(
      'SELECT username, major, standing, email, password FROM Users WHERE email = @fetchProfileEmail'
  )

})


module.exports = {
  pool,
  getCourseStatement,
  getReviewsStatement,
  addReviewStatement,
  createAccountStatement,
  findPlannedClassesStatement,
  updateProfilePageStatement,
  fetchProfileInfoStatement,
  insertPlannedClassesStatement
}