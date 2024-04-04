document.addEventListener('DOMContentLoaded', () => {
    const addCategoryBtn = document.getElementById('add-category-btn');
    const newCategoryNameInput = document.getElementById('new-category-name');
    const budgetCategoriesDiv = document.getElementById('budget-categories');
    const goalCategoriesDivLeft = document.getElementById('goal-categories-left');
    const budgetPie = document.getElementById('budgetChart').getContext('2d');
    const goalBar = document.getElementById('goalChart').getContext('2d');
    const saveBtn = document.getElementById('save-btn')

    let categoryNames = [];
    let categoryBudgets = [];
    let categoryGoals = [];
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
                labels: categoryNames, // Shared labels for both datasets
                datasets: [{
                    label: 'Expenses',
                    data: categoryBudgets, // Use updated budget data
                    backgroundColor: budgetBackgroundColors, // Or any color scheme
                    borderColor: budgetBackgroundColors.map(color => color.replace('0.6', '1')), // Optional: Adjust border color
                    borderWidth: 1
                }, {
                    label: 'Goals',
                    data: categoryGoals, // Use updated goal data
                    backgroundColor: goalBackgroundColors, // Different color scheme for goals
                    borderColor: goalBackgroundColors.map(color => color.replace('0.6', '1')), // Optional: Adjust border color
                    borderWidth: 1
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

    const updateBudgetData = async (categoryName, budget) => {
        const response = await fetch('/api/dashboard/budget', { // Make sure this is the correct endpoint
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: categoryName, amount: budget}),
        })

    }

    const updateGoalData = async (categoryName, goal) => {
        const response = await fetch('/api/dashboard/goal', { // Make sure this is the correct endpoint
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: categoryName, amount: goal}),
        })

    }
    

    function addNewCategory(categoryName, isDefault = false, budget , goal ) {
        categoryName = capitalizeFirstLetter(categoryName);
        if (!isDefault && categoryExists(categoryName)) {
            alert('Category already exists.');
            return;
        }

        budget = parseInt(budget);
        goal = parseInt(goal);
        if (isNaN(budget)) { budget = 0; }
        if (isNaN(goal)) { goal = 0; }

        categoryNames.push(categoryName);
        categoryBudgets.push(budget);
        categoryGoals.push(goal);

        const categoryId = categoryName.toLowerCase().replace(/\s+/g, '-');
        const budgetHTML = `
            <div class="d-flex justify-content-between align-items-center mb-2 budget-item" data-category="${categoryId}">
                <label class="form-label">${categoryName}:</label>
                <div class="input-group">
                    <span class="input-group-text" style="color:#793842; font-weight:600;">$</span>
                    <input type="text" class="form-control money-input budget-input" placeholder="0.00" value="${budget.toFixed(2)}" data-category="${categoryId}">
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
                    <input type="text" class="form-control money-input goal-input" placeholder="0.00" value="${goal.toFixed(2)}" data-category="${categoryId}">
                    <button class="btn remove-goal-btn" aria-label="Remove goal">
                        <i class="fas fa-times" style="color:red;"></i>
                    </button>
                </div>
            </div>`;

        budgetCategoriesDiv.insertAdjacentHTML('beforeend', budgetHTML);
        goalCategoriesDivLeft.insertAdjacentHTML('beforeend', goalHTML);

        const newBudgetInput = document.querySelector(`[data-category="${categoryId}"] .budget-input`);
        const newGoalInput = document.querySelector(`[data-category="${categoryId}"] .goal-input`);

        

        newBudgetInput.addEventListener('blur', () => {
            const index = categoryNames.indexOf(categoryName);
            if (index !== -1) {
                categoryBudgets[index] = parseFloat(newBudgetInput.value) || 0; // Update the budget array
            }
            initCharts(); // Refresh charts with updated data
        });

        newGoalInput.addEventListener('blur', () => {
            const index = categoryNames.indexOf(categoryName);
            if (index !== -1) {
                // Ensure this logic correctly updates the categoryGoals array
                categoryGoals[index] = parseFloat(newGoalInput.value) || 0;
                console.log("Updated goals array: ", categoryGoals);
            }
            initCharts(); // This call should redraw the chart with the updated goals
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

    // ['Housing', 'Groceries', 'Transportation', 'Dining', 'Entertainment', 'Travels'].forEach(category => {
    //     addNewCategory(category, true);
    // });

    attachRemoveEventListeners();
    initCharts();

});
