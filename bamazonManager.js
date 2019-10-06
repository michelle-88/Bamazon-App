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

// Function that uses inquirer prompt to display menu of options to user
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

            // Switch that determines which function to call based on user's selected menu option
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

// Function that displays entire database table to user and then reloads initial prompt menu
function loadItems() {
    // Query database to return all entries
    connection.query("SELECT * FROM products", function(err, res) {
        if(err) throw err;

        // Display all items in console
        console.table(res);

        // Call function to display menu prompts again
        managerPrompts();
    });
}

// Function that displays the database items that have a low stock quantity
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

        // Call function to display menu prompts again
        managerPrompts();
    });
}

// Function that will allow user to select an item from the database and modify its stock quantity
function addStock() {
    // Query database for all items in products table
    connection.query("SELECT * FROM products", function(err, res) {
        if(err) throw err;

        // Prompt user to select a database item from list and input an updated stock quantity
        inquirer.prompt([
            {
                type: "list",
                message: "Which inventory item would you like to update?",
                // Choices array is a function that loops through the response from the database query and pushes each product name into a new array
                // This new 'itemArray' is then returned and displayed to the user in inquirer prompt
                choices: function() {
                    var itemArray = [];

                    for(var i = 0; i < res.length; i++) {
                        itemArray.push(res[i].product_name);
                    }
                    return itemArray;
                },
                name: "item"
            },
            {
                type: "input",
                message: "Please enter an updated stock quantity for this item.",
                name: "itemNum",
                validate: function(value) {
                    if(isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }])
            .then(function(answer) {
                // Use the product name and new stock quantity data submitted by user to update the database
                connection.query("UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: parseInt(answer.itemNum)
                    },
                    {
                        product_name: answer.item
                    }
                ],
                function(err, res){
                    if(err) throw err;
                    // Display below message to user when database has been updated successfully
                    console.log("");
                    console.log("----------------");
                    console.log(`${res.affectedRows} item updated!`);
                    console.log("----------------");
                    console.log("");

                    // Call function to display menu prompts again
                    managerPrompts();                    
                })
            })
    })
}

// Function that displays inquirer input prompts to collect data from user about new product to be added to database
function addItem() {
    inquirer.prompt([
        {
            type: "input",
            message: "What new product would you like to add to the store?",
            name: "itemName"
        },
        {
            type: "input",
            message: "What department should this product be added to?",
            name: "itemDept"
        },
        {
            type: "input",
            message: "What is the price of this new product?",
            name: "itemPrice",
            validate: function(value) {
                if(isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            type: "input",
            message: "What is the stock quantity for this new product?",
            name: "itemStock",
            validate: function(value) {
                if(isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ])
    .then(function(answer) {
        // Use input data from user to add a new item to products table in database
        connection.query("INSERT INTO products SET ?",
        {
            product_name: answer.itemName,
            department_name: answer.itemDept,
            price: parseFloat(answer.itemPrice),
            stock_quantity: parseInt(answer.itemStock)
        },
        function(err) {
            if(err) throw err;

            // Display below message to user when new item is successfully added
            console.log("");
            console.log("----------------------------------------");
            console.log("New product has been added successfully!");
            console.log("----------------------------------------");
            console.log("");

            // Call function to display menu prompts again
            managerPrompts();            
        })
    })
}