const inquirer = require('inquirer');
const mysql = require('mysql2');
const { printTable } = require('console-table-printer');


const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Ahona@21',
  database: 'company_db',
});


connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database.');
  startApp();
});


function startApp() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Exit',
        ],
      },
    ])
    .then((answer) => {
      switch (answer.action) {
        case 'View all departments':
          viewDepartments();
          break;
        case 'View all roles':
          viewRoles();
          break;
        case 'View all employees':
          viewEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        case 'Exit':
          console.log('Goodbye!');
          connection.end();
          break;
      }
    });
}


function viewDepartments() {
  connection.query('SELECT * FROM departments', (err, results) => {
    if (err) throw err;
    printTable(results);
    startApp(); 
  });
}


function viewRoles() {

  connection.query('SELECT * FROM roles', (err, results) => {
    if (err) throw err;
    printTable(results);
    startApp();
  });
}


function viewEmployees() {

  connection.query('SELECT * FROM employees', (err, results) => {
    if (err) throw err;
    printTable(results);
    startApp();
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'departmentName',
        message: 'Enter the name of the new department:',
      },
    ])
    .then((answers) => {
      const { departmentName } = answers;
      connection.query('INSERT INTO departments (name) VALUES (?)', [departmentName], (err) => {
        if (err) throw err;
        console.log(`Department "${departmentName}" added successfully!`);
        startApp();
      });
    });
}

function addRole() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'roleTitle',
          message: 'Enter the title of the new role:',
        },
        {
          type: 'input',
          name: 'roleSalary',
          message: 'Enter the salary for the new role:',
        },
        {
          type: 'input',
          name: 'departmentId',
          message: 'Enter the department ID for the new role:',
        },
      ])
      .then((answers) => {
        const { roleTitle, roleSalary, departmentId } = answers;
        connection.query(
          'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)',
          [roleTitle, roleSalary, departmentId],
          (err) => {
            if (err) throw err;
            console.log(`Role "${roleTitle}" added successfully!`);
            startApp(); 
          }
        );
      });
  }
  
  function addEmployee() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'firstName',
          message: "Enter the employee's first name:",
        },
        {
          type: 'input',
          name: 'lastName',
          message: "Enter the employee's last name:",
        },
        {
          type: 'input',
          name: 'roleId',
          message: "Enter the employee's role ID:",
        },
        {
          type: 'input',
          name: 'managerId',
          message: "Enter the employee's manager ID (optional):",
        },
      ])
      .then((answers) => {
        const { firstName, lastName, roleId, managerId } = answers;
        connection.query(
          'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
          [firstName, lastName, roleId, managerId || null],
          (err) => {
            if (err) throw err;
            console.log(`Employee "${firstName} ${lastName}" added successfully!`);
            startApp(); 
          }
        );
      });
  }
  
  
  function updateEmployeeRole() {
    
    connection.query('SELECT id, first_name, last_name FROM employees', (err, results) => {
      if (err) throw err;
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'employeeId',
            message: 'Select the employee to update:',
            choices: results.map((employee) => ({
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id,
            })),
          },
          {
            type: 'input',
            name: 'newRoleId',
            message: 'Enter the new role ID for the employee:',
          },
        ])
        .then((answers) => {
          const { employeeId, newRoleId } = answers;
          
          connection.query(
            'UPDATE employees SET role_id = ? WHERE id = ?',
            [newRoleId, employeeId],
            (err) => {
              if (err) throw err;
              console.log('Employee role updated successfully!');
              startApp(); 
            }
          );
        });
    });
  }
