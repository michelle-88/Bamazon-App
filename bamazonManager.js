// Require mysql and inquirer npm modules
var mysql = require("mysql");
var inquirer = require("inquirer");


// Define connection variable that will be used to make connection to bamazon database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "bamazonDB"
});

// Call mysql connect method to establish connection with bamazon database
connection.connect(err => {
    if(err) throw err;

    // Call function to menu options to manager
    managerPrompts();
});




// On connection, load inquirer prompt list of options for manager to choose from (change loadProducts above)
// View Products for Sale - Display database to manager and then reload initial prompt menu
// View Low Inventory - make SELECT query to datbase for all items where stock_quantity < 5
// Add to Inventory - load new inquirer prompt to generate list of database items for manager to select from and then prompt for an amount to add to stock_quantity
    // then make UPDATE query to specified item in database
// Add New Product - load new inquirer prompt that asks for inputs for each item to be added to DB and then do INSERT INTO query to database