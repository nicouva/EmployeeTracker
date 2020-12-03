const inquirer = require('inquirer')
const mysql = require('mysql2')
require('console.table')

const db = mysql.createConnection('mysql://root:NUcode2020!114@localhost/employees_db')

const viewDeparment = () => {
  db.query('SELECT * FROM departments', (err, departments) => {
    if (err) { console.log(err) }
    console.log(departments)
    viewCompany()
  })
}



const viewCompany  = () => {
  inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: ['View Department', 'Add New Department', 'Add New Roles', 'Add New Employee', 'EXIT']
  })
    .then(({ action }) => {
      switch (action) {
        case 'View Department':
          viewDeparment()
          break
        case 'Add New Department':
          addDepartment()
          break
        case 'Add New Roles':
          addRoles()
          break
        case 'Add New Employee':
          addEmployee()
          break
        case 'EXIT':
          process.exit()
          break
      }
    })
    .catch(err => console.log(err))
}













//db.query(`
  //SELECT roles.id, roles.title, roles.salary, departments.name AS department 
  //FROM roles
  //LEFT JOIN departments
 // ON roles.departmentId = departments.id
//`, (err, roles) => {
 // if (err) { console.log(err) }
  //console.log(roles)
//})

//db.query(`
  //SELECT employees.id, employees.firstName, employees.lastName, roles.title, roles.salary, departments.name AS department, CONCAT(manager.firstName, '', manager.lastName) AS manager
  //FROM employees LEFT JOIN on employees.roleId = roles.id
  //LEFT JOIN departments ON roles.departmentId = departments.id
  //LEFT JOIN employees manager on manager.id = employees.managerId
//`, (err, employees) => {
  //if (err) { console.log(err) }
  //console.log(employees)
//})