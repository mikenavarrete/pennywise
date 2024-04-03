document.addEventListener('DOMContentLoaded', () => {
    const addCategoryBtn = document.getElementById('add-category-btn');
    const newCategoryNameInput = document.getElementById('new-category-name');
    const budgetCategoriesDiv = document.getElementById('budget-categories');
    const goalCategoriesDivLeft = document.getElementById('goal-categories-left');
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

    function getRandomColor() {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        return `rgba(${r}, ${g}, ${b}, 0.6)`;
    }

    function initCharts() {
        const backgroundColors = categoryNames.map(() => getRandomColor());
        const borderColors = backgroundColors.map(color => color.replace('0.6', '1'));
        const budgetBackgroundColors = categoryNames.map(() => '#ff0000'); // Fixed color for budget bars
        const goalBackgroundColors = categoryNames.map(() => '#4CAF50'); // Fixed color for goals

    //using function to prevent a another from replacing the category/budget/goal chart
    //this is so no other chart interferes with it -tb
        if (budgetChart) budgetChart.destroy();
        if (goalChart) goalChart.destroy();
        //created a new chart using chart.js and making the chart a pie chart for budget/categories -tb
        budgetChart = new Chart(budgetPie, {
            type: 'doughnut',
            data: {
                labels: categoryNames,
                datasets: [{
                    data: categoryBudgets,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1
                }]
            }
        });
        //the labels on the chart will display the category the user types in. -tb
        goalChart = new Chart(goalBar, {
            type: 'bar',
            data: {
                labels: categoryNames,
                datasets: [{
                    //bar for the expenses
                    label: 'Expenses',
                    data: categoryBudgets,
                    backgroundColor: budgetBackgroundColors,
                    borderColor: budgetBackgroundColors, // Matching border color to background color
                    borderWidth: 1
                }, {
                    //bar for the goals (they compare)
                    label: 'Goals',
                    data: categoryGoals,
                    backgroundColor: goalBackgroundColors,
                    borderColor: goalBackgroundColors, // Matching border color to background color
                    borderWidth: 1
                }]
            },
            options: {
                //both the x and y axis will start at 0, so the user can enter a number that is >=0
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

        fetch('/dashboard/category', {
            method: 'POST', // Use PUT if updating an existing category
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: categoryName,
                budget: budget, // Ensure you have a budget field in your Category model
                goal: goal, // Ensure you have a goal field in your Category model (if you're using one)
            }),
        })
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch((error) => console.error('Error:', error));

        
        const categoryId = categoryName.toLowerCase().replace(/\s+/g, '-');
                //added HTML for goal section and budget -tb
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
            //variable grabs category data from html and class for goal items
        const newBudgetInput = budgetCategoriesDiv.querySelector(`[data-category="${categoryId}"] .budget-input`);
        const newGoalInput = goalCategoriesDivLeft.querySelector(`[data-category="${categoryId}"] .goal-input`);

        newBudgetInput.addEventListener('input', () => {
            const index = categoryNames.indexOf(capitalizeFirstLetter(categoryName));
            //searches for the element in the  array using its name property and if it is not found, there will be no return as index will be -1. 
            //if the indexOf finds array item then the value field will be updated as a whole number =tb
            if (index > -1) {
                categoryBudgets[index] = parseInt(newBudgetInput.value) || 0;
                //the chart function is called -tb
                initCharts();
            }
        });

        newGoalInput.addEventListener('input', () => {
            const index = categoryNames.indexOf(categoryName);
            if (index > -1) {
                categoryGoals[index] = parseInt(newGoalInput.value) || 0;
                initCharts();
            }
        });

        attachRemoveEventListeners();
        initCharts();
    }

    function attachRemoveEventListeners() {
        document.querySelectorAll('.remove-budget-btn, .remove-goal-btn').forEach(button => {
            button.removeEventListener('click', removeCategory);
            button.addEventListener('click', removeCategory);
        });
    }

    function removeCategory(event) {
        const getCategory = event.target.closest('.budget-item, .goal-item');
        if (getCategory) {
            const categoryName = capitalizeFirstLetter(getCategory.getAttribute('data-category').toLowerCase());
            //index looks for name in array and then removes it from array
            const index = categoryNames.indexOf(categoryName);
            if (index > -1) {
                categoryBudgets.splice(index, 1);
                categoryGoals.splice(index, 1);
                categoryNames.splice(index, 1);

                //grabs from id and removes budget
                const budgetItem = document.querySelector(`.budget-item[data-category="${categoryName.toLowerCase()}"]`);
                if (budgetItem) {
                    budgetItem.remove();
                }
                //grabs from id and removes goal
                const goalItem = document.querySelector(`.goal-item[data-category="${categoryName.toLowerCase()}"]`);
                if (goalItem) {
                    goalItem.remove();
                }
                initCharts();
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
    initCharts();
});
