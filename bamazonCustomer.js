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
        promptToPurchase(res);
    })
}

