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

router.post('/dashboard/budget', async (req, res) => {
    try {
        const newBudget = await Budget.create({
            amount: req.body.amount,
            user_id: req.session.user_id
        });
        res.status(200).json(newBudget);
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

router.post('/dashboard/category', async (req, res) => {
    try {
        const newCategory = await Category.create({
            ...req.body,
            user_id: req.session.user_id
        });
        res.status(200).json(newCategory);
    } catch (err) {
        res.status(400).json(err);
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
