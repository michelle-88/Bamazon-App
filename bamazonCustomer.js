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

    // Call function to display all products in console
    loadProducts();
});

// Function that will display all products in console and then prompt user to purchase an item
function loadProducts() {
    // Query database to return all entries
    connection.query("SELECT * FROM products", function(err, res) {
        if(err) throw err;

        // Display all items in console
        console.table(res);

        // Call function to prompt user to purchase an item
        promptToPurchase();
    });
}

function promptToPurchase() {
    inquirer.prompt(
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["Make a Purchase", "Exit Bamazon"],
            name: "userInput"
        })
        .then(function(answer) {
            var command = answer.userInput;

            switch(command) {
                case "Make a Purchase":
                    promptForId();
                break;
                
                case "Exit Bamazon":
                    connection.end();
            }
        })
}

function promptForId() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the item_id of the product you would like to purchase?",
            name: "itemId"
        },
        {
            type: "input",
            message: "How many units of this product would you like to purchase?",
            name: "itemNum"
        }])
        .then(function(answer) {
            
            connection.query("SELECT stock_quantity FROM products WHERE ?",
            {
                item_id: answer.itemId
            },
            function(err, res) {
                if(err) throw err;
                
                else if(answer.itemNum > res[0].stock_quantity) {
                    console.log("");
                    console.log("-----------------------");
                    console.log("Insufficient Quantity!");
                    console.log("-----------------------");
                    console.log("");
        
                    loadProducts();
                }
                
                
            })
        })
}