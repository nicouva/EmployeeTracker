const inquirer = require('inquirer')
const mysql = require('mysql2')
require('console.table')

const db = mysql.createConnection('mysql://root:NUcode2020!114@localhost/employees_db')

const companyMenu = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'option',
      message: 'What would you like to do?',
      choices: ['View Company Directory', 'Add to Company Directory', 'EXIT']
    }
  ])
    .then(({ option }) => {
      switch (option) {
        case 'View Company Directory':
          viewCompany()
          break
        case 'Add to Company Directory':
          addCompany()
          break
        case 'EXIT':
          process.exit()
          break
      }
    })
    .catch(err => console.log(err))
}

const viewCompany = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'option',
      message: 'What would you like to view?',
      choices: ['View Departments', 'View Roles', 'View Employees', 'Return to Company Menu']
    }
  ])
    .then(({ option }) => {
      switch (option) {
        case 'View Departments':
          viewDept()
          break
        case 'View Roles':
          viewRoles()
          break
        case 'View Employees':
          viewEmployees()
          break
        case 'Return to Company Menu':
          companyMenu()
          break
      }
    })
    .catch(err => console.log(err))
}

const viewDept = () => {
  db.query('SELECT name AS Department FROM departments', (err, departments) => {
    if (err) { console.log(err) }
    console.table(departments)
    companyMenu()
  })
}

const viewRoles = () => {
  db.query(`
  SELECT roles.id, roles.title, roles.salary, departments.name AS department 
  FROM roles
  LEFT JOIN departments
  ON roles.departmentId = departments.id
`, (err, roles) => {
    if (err) { console.log(err) }
    console.table(roles)
    companyMenu()
  })
}

const viewEmployees = () => {
  db.query(`
  SELECT employees.id, employees.firstName, employees.lastName, roles.title, roles.salary, departments.name AS department, CONCAT(manager.firstName, '', manager.lastName) AS manager
  FROM employees LEFT JOIN on employees.roleId = roles.id
  LEFT JOIN departments ON roles.departmentId = departments.id
  LEFT JOIN employees manager on manager.id = employees.managerId
`, (err, employees) => {
    if (err) { console.log(err) }
    console.table(employees)
    companyMenu()
  })
}


const addCompany = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'option',
      message: 'Which of the following would you like to add?',
      choices: ['Add Department', 'Add Role', 'Add Employee', 'Return to Company Menu']
    }
  ])
    .then(({ option }) => {
      switch (option) {
        case 'Add Department':
          addDept()
          break
        case 'Add Role':
          addRole()
          break
        case 'Add Employee':
          addEmployee()
          break
        case 'Return to Company Menu':
          companyMenu()
      }
    })
    .catch(err => console.log(err))
}

const addDept = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'department',
      message: 'Enter New Department Name'
    }
  ])
    .then(department => {
      db.query('SELECT name AS Department FROM departments', (err, departments) => {
        if (err) { console.log(err) }
        console.table(departments)
        companyMenu()
      })
    })
    .catch(err => console.log(err))
}

const addRole = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'role',
      message: 'New Role Title'
    },
    {
      type: 'input',
      name: 'salary',
      message: 'What is the yearly salary of the role?'
    },
    {
      type: 'input',
      name: 'departmentId',
      message: 'Submit the Department ID'
    }
  ])
    .then(role => {
      db.query(`INSERT INTO role SET ?`, role, err => {
        if (err) { console.log(err) }
        console.log('New Role Added!')
        companyMenu()
      })
    })
    .catch(err => console.log(err))
}

const addEmployee = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: 'Please enter the first name of the new employee'
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'Please enter the last name of the new employee'
    },
    {
      type: 'input',
      name: 'roleId',
      message: 'Please enter the role id of the new employee'
    },
    {
      type: 'input',
      name: 'managerId',
      message: 'Please enter the manager of the new employee if applicable'
    }
  ])
    .then(employee => {
      if (employee.managerId === '') {
        employee.managerId = null
      }
      db.query(`INSERT INTO employees SET ?`, employee, err => {
        if (err) { console.log(err) }
        console.log('New Employee Added!')
        companyMenu()
      })
    })
    .catch(err => console.log(err))
}


companyMenu()
