document.addEventListener('DOMContentLoaded', () => {
    const addCategoryBtn = document.getElementById('add-category-btn');
    const newCategoryNameInput = document.getElementById('new-category-name');
    const budgetCategoriesDiv = document.getElementById('budget-categories');
    const goalCategoriesDivLeft = document.getElementById('goal-categories-left');
    //currently not using. Using left div instead. -tb
    // const goalCategoriesDivRight = document.getElementById('goal-categories-right');

    //grabbing the budget / goal chart id from the HTML, and having it render as a '2d' since it is a chart- tb
    const budgetPie = document.getElementById('budgetChart').getContext('2d');
    const goalBar = document.getElementById('goalChart').getContext('2d');


    //added empty arrays for category, goals and budget names. -tb
    let categoryNames = [];
    let categoryBudgets = [];
    let categoryGoals = [];
    //budget and goal chart will be let null -tb
    let budgetChart;
    let goalChart;

    //using function to prevent a another from replacing the category/budget/goal chart
    //this is so no other chart interferes with it -tb
    function initCharts() {
        if (budgetChart) {
            budgetChart.destroy();
        }
        if (goalChart) {
            goalChart.destroy();
        }


        //created a new chart using chart.js and making the chart a pie chart for budget/categories -tb
        budgetChart = new Chart(budgetPie, {
            type: 'pie',
            data: {
                //the labels on the chart will display the category the user types in. -tb
                labels: categoryNames,
                datasets: [{
                //taking data from the budget data -tb
                    label: 'Budget',
                    data: categoryBudgets,
                    //attributes for pie chart -tb 
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2
                }]
            },
            //added options to chart
            options: {
            //both the x and y axis will start at 0, so the user can enter a number that is >=0
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        //added chart graph for goals.
        goalChart = new Chart(goalBar, {
            type: 'bar',
            data: {
                labels: categoryNames,
                datasets: [{
                    label: "Goals",
                    data: categoryGoals,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }


    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
    
    function categoryExists(categoryName) {
        return !!document.querySelector(`[data-category="${categoryName.toLowerCase()}"]`);
    }

    function formatInputValue(inputElement) {
        if (inputElement) {
            inputElement.addEventListener('blur', () => {
                let value = parseFloat(inputElement.value);
                if (!isNaN(value)) {
                    inputElement.value = value.toFixed(2);
                }
            });
        }
    }

    //added budget = 0 when the user adds a new category so the new category is default starting off a 0. -tb
    function addNewCategory(categoryName, isDefault = false, budget = 0, goal = 0) {
        categoryName = capitalizeFirstLetter(categoryName);
        if (!isDefault && categoryExists(categoryName)) {
            alert('Category already exists.');
            return;
        }
        // User is expected to type in a number but if they do not, the budget will be put in as zero -tb
        // parseInt will turn a string into a whole number when the user types in the budget -tb
        budget = parseInt(budget);
        goal = parseInt(goal);
        //however, if the user's entry does not end up turning into a whole number using parseInt, the budget/goal will automatically start at 0 -tb
        if (isNaN(budget)) {
            budget = 0;
        }
        if (isNaN(goal)) {
            goal = 0;
        }
        //if successful (or not), push the name as well as the budget and goal amount -tb
        categoryNames.push(categoryName);
        categoryBudgets.push(budget);
        categoryGoals.push(goal);

        const categoryId = categoryName.toLowerCase().replace(/\s+/g, '-');
        const budgetHTML = `
            <div class="d-flex justify-content-between align-items-center mb-2 budget-item" data-category="${categoryId}">
                <label class="form-label">${categoryName}:</label>
                <div class="input-group">
                    <span class="input-group-text" style="color:#793842; font-weight:600;">$</span>
                    <input type="text" class="form-control money-input budget-input" placeholder="0.00" value="${budget.toFixed(2)}">
                    <button class="btn remove-budget-btn" aria-label="Remove budget">
                        <i class="fas fa-times" style="color:red;"></i>
                    </button>
                </div>
            </div>`;
        //added HTML for goal section and
        const goalHTML = `
            <div class="d-flex justify-content-between align-items-center mb-2 goal-item" data-category="${categoryId}">
                <label class="form-label">${categoryName}:</label>
                <div class="input-group">
                    <span class="input-group-text" style="color:#793842; font-weight:600;">$</span>
                    <input type="text" class="form-control money-input goal-input" placeholder="0.00" value="${goal.toFixed(2)}">
                    <button class="btn remove-goal-btn" aria-label="Remove goal">
                        <i class="fas fa-times" style="color:red;"></i>
                    </button>
                </div>
            </div>`;

        budgetCategoriesDiv.insertAdjacentHTML('beforeend', budgetHTML);
        goalCategoriesDivLeft.insertAdjacentHTML('beforeend', goalHTML);
        const newBudgetInput = budgetCategoriesDiv.querySelector(`[data-category="${categoryId}"] .budget-input`);
        //variable grabs category data from html and class for goal items
        const newGoalInput = goalCategoriesDivLeft.querySelector(`[data-category="${categoryId}"] .goal-input`);
        newBudgetInput.addEventListener('input', () => {
            //variable for finding the category name
            //used indexOf to search for the element in the array
            //uses capitalizeFirstLetter so it matches the the same category name once it was added to the array, which also has a capital first letter- tb
            const index = categoryNames.indexOf(capitalizeFirstLetter(categoryName));
            //if NO element(category name) is found via indexOf, it returns -1. -tb
            // However, if the category name is found, the category budget will be updated with the user entry-tb
            //a parseInt is used to ensure the user entry converts to a whole number -tb
            //if it does not convert to a whole number, the entry will be 0 instead -tb
            if (index > -1) {
                categoryBudgets[index] = parseInt(newBudgetInput.value) || 0;
                //the chart function is called -tb
                initCharts()
            }
        });
        //added the ability to add a new goal amount to the chart -tb
        newGoalInput.addEventListener('input', () => {
            const index = categoryNames.indexOf(categoryName);
            if (index > -1) {
                categoryGoals[index] = parseInt(newGoalInput.value) || 0;
                initCharts();
            }
        });

        attachRemoveEventListeners();
        //added the chart function to be called -tb
        initCharts();
    }

    function attachRemoveEventListeners() {
        //configured the ability to deleted the goals as well as the budgets, including the amounts -tb
        document.querySelectorAll('.remove-budget-btn, .remove-goal-btn').forEach(button => {
            button.removeEventListener('click', removeCategory);
            button.addEventListener('click', removeCategory);
        });
    }
    
    function removeCategory(event) {
        //added goal items to be removed and used the class budget item instead of category -tb
        const getBudget = event.target.closest('.budget-item, .goal-item');
        if (getBudget) {
            //created variable that grabs the value of the data-category attributes from the data-category class and converts it to lowercase -tb
            //this is to make sure it matches the categoryName that was added to the array -tb
            const categoryName = capitalizeFirstLetter(getBudget.getAttribute('data-category').toLowerCase());
            //created variable that searches for the categoryName in the categoryNames array -tb
            const index = categoryNames.indexOf(categoryName);
            //if indexOf does not find the category name, it returns -1 -tb
            //if the category name is found, it will be > -1, thus it removes the category name and then removes the budget for the category from the categoryNames array -tb 
            if (index > -1) {
                //budget, goals and category data will be deleted from array -tb
                categoryBudgets.splice(index, 1);
                categoryGoals.splice(index, 1);
                categoryNames.splice(index, 1);
                
                //variable that grabs the budget item and the category name created, converts it to lowercase
                //then the item is removed
                const budgetItem = document.querySelector(`.budget-item[data-category="${categoryName.toLowerCase()}"]`);
                if (budgetItem) {
                    budgetItem.remove();
                }
                //variable that grabs the goal item in the HTML and the category name, converts it to lowercase and is deleted -tb
                const goalItem = document.querySelector(`.goal-item[data-category="${categoryName.toLowerCase()}"]`);
                if (goalItem) {
                    goalItem.remove();
                }
                //calling the chart -tb
                initCharts()
            }
        }
    }
    
    addCategoryBtn.addEventListener('click', () => {
        const categoryName = newCategoryNameInput.value.trim();
        if (categoryName) {
            addNewCategory(categoryName);
            newCategoryNameInput.value = '';
        } else {
            alert('Please enter a category name.');
        }
    });


    ['Housing', 'Groceries', 'Transportation', 'Dining', 'Entertainment', 'Travels'].forEach(category => {
        addNewCategory(category, true);
    });

    attachRemoveEventListeners();
    //calling chart function
    initCharts()
});
