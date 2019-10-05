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

function managerPrompts() {
    inquirer.prompt(
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
            name: "action"
        })
        .then(function(answer) {
            var command = answer.action;

            switch(command) {
                case "View Products for Sale":
                    loadItems();
                break;

                case "View Low Inventory":
                    showLowStock();
                break;

                case "Add to Inventory":
                    addStock();
                break;

                case "Add New Product":
                    addItem();
                break;

                case "Exit":
                    connection.end();
            }
        });
}

function loadItems() {
    // Query database to return all entries
    connection.query("SELECT * FROM products", function(err, res) {
        if(err) throw err;

        // Display all items in console
        console.table(res);

        // Call function to prompt user to purchase an item
        managerPrompts();
    });
}

function showLowStock() {
    // Query database for all items with a stock_quantity less than 5
    connection.query("SELECT * FROM products HAVING stock_quantity < 5",
    function(err, res) {
        if(err) throw err;

        console.log("");
        console.log("-------------------------------------------");
        console.log("Displaying all items with low inventory...");
        console.log("-------------------------------------------");
        console.log("");
        
        // Display low quantity items in console
        console.table(res);

        // Prompt manager to make a choice from main menu again
        managerPrompts();
    });
}

// On connection, load inquirer prompt list of options for manager to choose from (change loadProducts above)
// View Products for Sale - Display database to manager and then reload initial prompt menu
// View Low Inventory - make SELECT query to datbase for all items where stock_quantity < 5
// Add to Inventory - load new inquirer prompt to generate list of database items for manager to select from and then prompt for an amount to add to stock_quantity
    // then make UPDATE query to specified item in database
// Add New Product - load new inquirer prompt that asks for inputs for each item to be added to DB and then do INSERT INTO query to database