const inquirer = require('inquirer')
const { syncBuiltinESMExports } = require('module')
const mysql = require('mysql2')
require('console.table')

const db = mysql.createConnection('mysql://root:NUcode2020!114@localhost/employees_db')

const companyMenu = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'option',
      message: 'What would you like to do?',
      choices: ['View Company Directory', 'Add to Company Directory', 'Update Employee Directory', 'Delete from Employee Directory', 'EXIT']
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
        case 'Update Company Directory':
          updateEmployee()
          break
        case 'Delete from Employee Directory':
          deleteEmployee()
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
  FROM employees LEFT JOIN roles ON employees.roleId = roles.id
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
      name: 'title',
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
      db.query(`INSERT INTO roles SET ?`, role, err => {
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

const updateEmployee = () => {
  db.query('SELECT * FROM employees', (err, employees) => {
    if (err) { console.log(err) }
    db.query('SELECT * FROM roles', (err, roles) => {
      if (err) { console.log(err) }

      inquirer.prompt([
        {
          type: 'list',
          name: 'id',
          message: 'Select the employee you wish to update.'
          choices: employees.map(employee => ({
            name: `${employee.firstName} ${employee.lastName}`,
            value: employee.id
          }))
        },
        {
          type: 'list',
          name: 'roleId',
          message: 'What is the updated role of the selected employee?'
          choices: roles.map(role => ({
            name: `${roles.title}`,
            value: role.id
          }))
        }
      ])
        .then(data => {
          db.query('UPDATE employees SET ? WHERE ?', [{ roleId: data.roleId }, { id: data.id }], err => {
            if (err) { console.log(err) }
            console.log('Employee Role Updated!')
            companyMenu()
          })
        })
        .catch(err => console.log(err))
    })
  })
}

const deleteEmployee = () => {
  db.query('SELECT * FROM employees', (err, employees) => {
    if (err) { console.log(err) }

    inquirer.prompt([
      {
        type: 'list',
        name: 'id',
        message: 'Select the employee you wish to delete.'
        choices: employees.map(employee => ({
          name: `${employee.firstName} ${employee.lastName}`,
          value: employee.id
        }))
      }
    ])
      .then(data => {
        db.query('DELETE FROM employee WHERE ?', { employee.id }, err => {
          if (err) { console.log(err) }
          console.log('Employee Deleted!')
          companyMenu()
        })
      })
      .catch(err => console.log(err))
  })
}


companyMenu()
