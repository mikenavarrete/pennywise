const router = require('express').Router();
const { Budget, Category, Goals } = require('../../models');

router.get('/dashboard', async (req, res) => {
    try {
        const budgetData = await Budget.findAll({
            where: { user_id: req.session.user_id }
        });
        const categoryData = await Category.findAll({
            where: { user_id: req.session.user_id }
        });
        const goalData = await Goals.findAll({
            where: { user_id: req.session.user_id }
        });

        const budgets = budgetData.map(budget => budget.get({ plain: true }));
        const categories = categoryData.map(category => category.get({ plain: true }));
        const goals = goalData.map(goal => goal.get({ plain: true }));

        res.render('dashboard', { budgets, categories, goals, logged_in: req.session.logged_in });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/category', async (req, res) => {
    try {
        const { name, budget, goal } = req.body; // Extract new fields
        const newCategory = await Category.create({
            name,
            user_id: req.session.user_id,
            budget, // Make sure your Category model includes this field
            goal, // Ensure this field is included if necessary
        });
        res.status(200).json(newCategory);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.delete('/dashboard/budget/:id', async (req, res) => {
    try {
        const budget = await Budget.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id
            }
        });

        if (!budget) {
            res.status(404).json({ message: 'No budget found with this id.' });
            return;
        }

        res.status(200).json(budget);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/budget', async (req, res) => {
    try {
        
        // Check if the category exists
        let newBudget = await Budget.create({ ...req.body, user_id : req.session.user_id });
        
        // if (category) {
        //     // Update existing category
        //     await category.update({ budget, goal });
        // } else {
        //     // Or create a new category if it doesn't exist
        //     category = await Category.create({ name, budget, goal });
        // }

        res.json({ message: 'Budget updated successfully', newBudget });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'Error updating budget', error: error.message });
    }
});

router.post('/goal', async (req, res) => {
    try {
        
        // Check if the category exists
        let newGoal = await Goals.create({ ...req.body, user_id : req.session.user_id });
        
        // if (category) {
        //     // Update existing category
        //     await category.update({ budget, goal });
        // } else {
        //     // Or create a new category if it doesn't exist
        //     category = await Category.create({ name, budget, goal });
        // }

        res.json({ message: 'Goal updated successfully', newGoal });
    } catch (error) {
        console.error('Error updating goal:', error);
        res.status(500).json({ message: 'Error updating category', error: error.message });
    }
});

router.delete('/dashboard/category/:id', async (req, res) => {
    try {
        const category = await Category.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id
            }
        });

        if (!category) {
            res.status(404).json({ message: 'No category found with this id.' });
            return;
        }

        res.status(200).json(category);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/dashboard/goals', async (req, res) => {
    try {
        const newGoal = await Goals.create({
            ...req.body,
            user_id: req.session.user_id
        });
        res.status(200).json(newGoal);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.delete('/dashboard/goals/:id', async (req, res) => {
    try {
        const goal = await Goals.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id
            }
        });

        if (!goal) {
            res.status(404).json({ message: 'No goal found with this id.' });
            return;
        }

        res.status(200).json(goal);
    } catch (err) {
        res.status(500).json(err);
    }
});




module.exports = router;
