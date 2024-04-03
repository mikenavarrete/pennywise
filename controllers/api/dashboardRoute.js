const router = require('express').Router();
const withAuth = require('../../utils/auth');
const { Budget, Category, Goals } = require('../../models');

router.get('/dashboard', withAuth, async (req, res) => {
    try {
        // Fetch all categories for the logged-in user with their budgets and goals
        const categoriesData = await Category.findAll({
            where: { user_id: req.session.user_id },
            include: [
                { model: Budget },
                { model: Goals }
            ]
        });

        // Serialize data so the template can read it
        const categories = categoriesData.map(category => category.get({ plain: true }));

        // Pass categories along with their budgets and goals to the dashboard view
        res.render('dashboard', { 
            categories, 
            logged_in: req.session.logged_in 
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Failed to load dashboard', error: error.message });
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

router.post('/budget', withAuth, async (req, res) => {
    try {
        const { categoryName, amount } = req.body;

        // Find the category by name for the current user
        const category = await Category.findOne({
            where: {
                name: categoryName,
                user_id: req.session.user_id
            }
        });

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Create or update the budget for the found category
        const [budget, created] = await Budget.findOrCreate({
            where: { categoryId: category.id },
            defaults: {
                amount: amount,
                user_id: req.session.user_id
            }
        });

        if (!created) {
            // If the budget already exists, update it
            budget.amount = amount;
            await budget.save();
        }

        res.json(budget);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Failed to update budget', error: error.message });
    }
});

router.post('/goal', withAuth, async (req, res) => {
    try {
        const { categoryName, amount } = req.body;

        // Find the category by name for the current user
        const category = await Category.findOne({
            where: {
                name: categoryName,
                user_id: req.session.user_id
            }
        });

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Check if a goal for the category exists
        let goal = await Goals.findOne({
            where: {
                categoryId: category.id
            }
        });

        if (goal) {
            // If the goal already exists, update it
            goal.amount = amount;
            await goal.save();
        } else {
            // Otherwise, create a new goal
            goal = await Goals.create({
                categoryId: category.id,
                amount: amount,
                user_id: req.session.user_id
            });
        }

        res.json(goal);
    } catch (error) {
        console.error('Error updating/creating goal:', error);
        res.status(500).json({ message: 'Error updating/creating goal', error: error.message });
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
