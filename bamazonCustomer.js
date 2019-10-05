// Require mysql and inquirer npm modules
var mysql = require("mysql");
var inquirer = require("inquirer");

// Variable that will store the total cost of a user's purchase
var cost;

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

// Function that will use inquirer to prompt user with options to make a purchase or exit the app
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
                // Choosing 'Make a Purchase' option will cause promptForItem to run, which will initiate new prompts
                case "Make a Purchase":
                    promptForItem();
                break;
                
                // Choosing 'Exit' option will end the connection
                case "Exit Bamazon":
                    connection.end();
            }
        })
}

// Function that will prompt user to input the item_id and quantity of the item they would like to purchase
// The database is then queried and updated accordingly
function promptForItem() {
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

            // Use user's answers to prompts to query database for item stock_quantity and price
            connection.query("SELECT stock_quantity, price FROM products WHERE ?",
            {
                item_id: answer.itemId
            },
            function(err, res) {
                if(err) throw err;
                
                // Compare user's desired quantity against available stock in database
                // If user's request exceeds available stock, log message in console and call initial function to display products database
                else if(answer.itemNum > res[0].stock_quantity) {
                    console.log("");
                    console.log("-----------------------");
                    console.log("Insufficient Quantity!");
                    console.log("-----------------------");
                    console.log("");
        
                    loadProducts();
                }
                // Calculate cost of user's purchase by multiplying item price by desired quantity
                cost = res[0].price * answer.itemNum;
                
                // Make UPDATE query to database to subtract necessary amount from stock_quantity
                connection.query("UPDATE products SET ? WHERE ?",
                [{
                    stock_quantity: res[0].stock_quantity - answer.itemNum
                },
                {
                    item_id: answer.itemId
                }],
                function(err, res) {
                    if(err) throw err;
                    
                    // Log below message with total cost after successfully updating the database
                    console.log("");
                    console.log("-------------------------------------------------------------");
                    console.log(`${res.affectedRows} purchase made! The total cost of your purchase was $${cost.toFixed(2)}.`);
                    console.log("-------------------------------------------------------------");
                    console.log("");

                    // Call function to display all items in database again
                    loadProducts();
                })                
                
            })
        })
}