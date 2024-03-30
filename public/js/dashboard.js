document.addEventListener('DOMContentLoaded', () => {
    const addCategoryBtn = document.getElementById('add-category-btn');
    const newCategoryNameInput = document.getElementById('new-category-name');
    const budgetCategoriesDiv = document.getElementById('budget-categories');
    const goalCategoriesDivLeft = document.getElementById('goal-categories-left'); // Assuming there's a left division
    const goalCategoriesDivRight = document.getElementById('goal-categories-right'); // Assuming there's a right division

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

    function addNewCategory(categoryName, isDefault = false) {
        categoryName = capitalizeFirstLetter(categoryName);
        if (!isDefault && categoryExists(categoryName)) {
            alert('Category already exists.');
            return;
        }

        const categoryId = categoryName.toLowerCase().replace(/\s+/g, '-');
        const categoryHTML = `
            <div class="d-flex justify-content-between align-items-center mb-2 category-item" data-category="${categoryId}">
                <label class="form-label">${categoryName}:</label>
                <div class="input-group">
                    <span class="input-group-text" style="color:#793842; font-weight:600;">$</span>
                    <input type="text" class="form-control money-input" placeholder="0.00">
                    <button class="btn remove-category-btn" aria-label="Remove category">
                        <i class="fas fa-times" style="color:red;"></i>
                    </button>
                </div>
            </div>`;

        budgetCategoriesDiv.insertAdjacentHTML('beforeend', categoryHTML);
        
        // Logic to alternate between left and right columns for goals
        if (goalCategoriesDivLeft.childElementCount <= goalCategoriesDivRight.childElementCount) {
            goalCategoriesDivLeft.insertAdjacentHTML('beforeend', categoryHTML);
        } else {
            goalCategoriesDivRight.insertAdjacentHTML('beforeend', categoryHTML);
        }

        document.querySelectorAll('.money-input').forEach(input => formatInputValue(input));

        attachRemoveEventListeners();
    }

    function attachRemoveEventListeners() {
        document.querySelectorAll('.remove-category-btn').forEach(button => {
            button.removeEventListener('click', removeCategory);
            button.addEventListener('click', removeCategory);
        });
    }

    function removeCategory(event) {
        const categoryItem = event.target.closest('.category-item');
        if (categoryItem) {
            const categoryName = categoryItem.getAttribute('data-category');
            document.querySelectorAll(`[data-category="${categoryName}"]`).forEach(el => el.remove());
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

    // Initially populate default categories
    ['Housing', 'Groceries', 'Transportation', 'Dining', 'Entertainment', 'Travels'].forEach(category => addNewCategory(category, true));

    attachRemoveEventListeners();
});
