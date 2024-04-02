document.addEventListener('DOMContentLoaded', () => {
    const addCategoryBtn = document.getElementById('add-category-btn');
    const newCategoryNameInput = document.getElementById('new-category-name');
    const budgetCategoriesDiv = document.getElementById('budget-categories');
    const goalCategoriesDivLeft = document.getElementById('goal-categories-left');

    const budgetPie = document.getElementById('budgetChart').getContext('2d');
    const goalBar = document.getElementById('goalChart').getContext('2d');

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

        if (budgetChart) budgetChart.destroy();
        if (goalChart) goalChart.destroy();

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

        goalChart = new Chart(goalBar, {
            type: 'bar',
            data: {
                labels: categoryNames,
                datasets: [{
                    label: 'Budget',
                    data: categoryBudgets,
                    backgroundColor: budgetBackgroundColors,
                    borderColor: budgetBackgroundColors, // Matching border color to background color
                    borderWidth: 1
                }, {
                    label: 'Goals',
                    data: categoryGoals,
                    backgroundColor: goalBackgroundColors,
                    borderColor: goalBackgroundColors, // Matching border color to background color
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

    function addNewCategory(categoryName, isDefault = false, budget = 0, goal = 0) {
        categoryName = capitalizeFirstLetter(categoryName);
        if (!isDefault && categoryExists(categoryName)) {
            alert('Category already exists.');
            return;
        }
        budget = parseInt(budget);
        goal = parseInt(goal);
        if (isNaN(budget)) {
            budget = 0;
        }
        if (isNaN(goal)) {
            goal = 0;
        }
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
        const newGoalInput = goalCategoriesDivLeft.querySelector(`[data-category="${categoryId}"] .goal-input`);
        newBudgetInput.addEventListener('input', () => {
            const index = categoryNames.indexOf(capitalizeFirstLetter(categoryName));
            if (index > -1) {
                categoryBudgets[index] = parseInt(newBudgetInput.value) || 0;
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
            const index = categoryNames.indexOf(categoryName);
            if (index > -1) {
                categoryBudgets.splice(index, 1);
                categoryGoals.splice(index, 1);
                categoryNames.splice(index, 1);

                const budgetItem = document.querySelector(`.budget-item[data-category="${categoryName.toLowerCase()}"]`);
                if (budgetItem) {
                    budgetItem.remove();
                }

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
