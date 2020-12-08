const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const html = require("./templates/htmltemp");
const writeFileAsync = util.promisify(fs.writeFile);
const appendFileAsync = util.promisify(fs.appendFile);
let teamArray = [];
let teamstr = ``;

async function main() {
     try {
          await prompt()
          for (let i = 0; i < teamArray.length; i++) {
               teamstr = teamstr + html.generateCard(teamArray[i]);
          }
          let finalHTML = html.generateHTML(teamstr)
          console.log(teamstr)
          //write file 
          writeFileAsync("./output/index.html", finalHTML)
     } catch (err) {
          return console.log(err);
     }
};

async function prompt() {
     let responseDone = "";
     // prompt input
     do {
          try {
               response = await inquirer.prompt([
                    {
                         type: "input",
                         name: "name",
                         message: "Enter Employee Name: "
                    },
                    {
                         type: "input",
                         name: "id",
                         message: "Enter Employee ID: "
                    },
                    {
                         type: "input",
                         name: "email",
                         message: "Enter Employee Email address: "
                    },
                    {
                         type: "list",
                         name: "role",
                         message: "Select the Employee role:",
                         choices: [
                              "Engineer",
                              "Intern",
                              "Manager"
                         ]
                    }
               ]);

               let response2 = ""

               if (response.role === "Engineer") {
                    response2 = await inquirer.prompt([{
                         type: "input",
                         name: "x",
                         message: "What is the employee's github username?:",
                    }, ]);
                    const engineer = new Engineer(response.name, response.id, response.email, response2.x);
                    teamArray.push(engineer);
               } else if (response.role === "Intern") {
                    response2 = await inquirer.prompt([{
                         type: "input",
                         name: "x",
                         message: "What is the School of the selected Intern?:",
                    }, ]);
                    //store the object and push
                    const intern = new Intern(response.name, response.id, response.email, response2.x);
                    teamArray.push(intern);
               } else if (response.role === "Manager") {
                    response2 = await inquirer.prompt([{
                         type: "input",
                         name: "x",
                         message: "What is the Manager's Office Number?:",
                    }, ]);
                    const manager = new Manager(response.name, response.id, response.email, response2.x);
                    teamArray.push(manager);
               }
          } catch (err) {
               return console.log(err);
          }
          console.log(teamArray)

          responseDone = await inquirer.prompt([{
               type: "list",
               name: "finish",
               message: "Add another employee?: ",
               choices: [
                    "Yes",
                    "No"
               ]
          }, ]);

     } while (responseDone.finish === "Yes");
}

main();
