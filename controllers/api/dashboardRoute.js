const router = require('express').Router();
const { where } = require('sequelize');
const { Budget, Goals } = require('../../models');


router.post('/budget', async (req, res) => {
    try {

        // Check if the category exists
        let newBudget = await Budget.create({ ...req.body, user_id: req.session.user_id });

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
        let newGoal = await Goals.create({ ...req.body, user_id: req.session.user_id });

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

// Route to update the goals
router.put('/goal/:id', async (req, res) => {
    try {
        const updatedGoal = await Goals.update(
            {
                name: req.body.name,
                amount: req.body.amount
            },
            {
                where: {
                    id: req.params.id
                }
            }
        )

        res.status(200).json(updatedGoal)

    } catch (err) {
        res.status(500).json(err)
    }
})

// Route to update the budget
router.put('/budget/:id', async (req, res) => {
    try {
        const updatedBudget = await Budget.update(
            {
                name: req.body.name,
                amount: req.body.amount
            },
            {
                where: {
                    id: req.params.id
                }
            }
        )

        res.status(200).json(updatedBudget)

    } catch (err) {
        res.status(500).json(err)
    }
})


router.delete('/goal/:id', async (req, res) => {
    try {
        const deletedGoal = await Goals.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id
            }
        });

        if (!deletedGoal) {
            res.status(404).json({ message: 'No goal found with this id.' });
            return;
        }

        res.status(200).json(deletedGoal);
    } catch (err) {
        res.status(500).json(err);
    }
});


router.delete('/budget/:id', async (req, res) => {
    try {

        const deletedBudget = await Budget.destroy({
            where: {
                id: req.params.id
            }
        })

        if (!deletedBudget) {
            res.status(404).json({ message: 'No budget found with this id.' });
            return;
        }

        res.status(200).json(deletedBudget);
    } catch (err) {
        res.status(500).json(err);
    }
});




module.exports = router;