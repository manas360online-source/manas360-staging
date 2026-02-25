// ================================================
// MANAS360 Session Analytics - Admin Controller
// Story 3.6: Session Analytics
// ================================================

const { User, Subscription, TherapySession, TherapistMetric, sequelize } = require('../models');
const { Op } = require('sequelize');

/**
 * GET /api/v1/admin/users
 * List all users with optional filtering
 */
const getUsers = async (req, res) => {
    try {
        const { role, isActive, search } = req.query;
        let where = {};

        if (role) where.role = role;
        if (isActive !== undefined) where.isActive = isActive === 'true';
        if (search) {
            where[Op.or] = [
                { fullName: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const users = await User.findAll({
            where,
            attributes: { exclude: ['password'] }, // assuming there might be one later
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch users' });
    }
};

/**
 * GET /api/v1/admin/users/:id
 * Get single user details
 */
const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            include: [
                { model: Subscription }
            ]
        });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch user' });
    }
};

/**
 * PATCH /api/v1/admin/therapists/:id/verify
 * Verify a therapist
 */
const verifyTherapist = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, error: 'Therapist not found' });
        }

        if (user.role !== 'therapist') {
            return res.status(400).json({ success: false, error: 'User is not a therapist' });
        }

        await user.update({ isVerified: true });

        res.json({
            success: true,
            message: 'Therapist verified successfully',
            data: user
        });
    } catch (error) {
        console.error('Error verifying therapist:', error);
        res.status(500).json({ success: false, error: 'Failed to verify therapist' });
    }
};

/**
 * GET /api/v1/admin/metrics
 * Aggregated platform metrics for admin
 */
const getPlatformMetrics = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalPatients = await User.count({ where: { role: 'patient' } });
        const totalTherapists = await User.count({ where: { role: 'therapist' } });
        const verifiedTherapists = await User.count({ where: { role: 'therapist', isVerified: true } });

        const totalSessions = await TherapySession.count();
        const completedSessions = await TherapySession.count({ where: { status: 'completed' } });

        const activeSubscriptions = await Subscription.count({ where: { status: 'active' } });

        // Revenue calculation (simple sum for now)
        const totalRevenue = await Subscription.sum('amount', { where: { status: 'active' } });

        res.json({
            success: true,
            data: {
                users: {
                    total: totalUsers,
                    patients: totalPatients,
                    therapists: totalTherapists,
                    verifiedTherapists
                },
                sessions: {
                    total: totalSessions,
                    completed: completedSessions,
                    completionRate: totalSessions > 0 ? ((completedSessions / totalSessions) * 100).toFixed(2) : 0
                },
                subscriptions: {
                    active: activeSubscriptions,
                    revenue: totalRevenue || 0
                }
            }
        });
    } catch (error) {
        console.error('Error fetching platform metrics:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch platform metrics' });
    }
};

/**
 * GET /api/v1/admin/subscriptions
 * List all subscriptions
 */
const getSubscriptions = async (req, res) => {
    try {
        const { status, plan } = req.query;
        let where = {};

        if (status) where.status = status;
        if (plan) where.planName = plan;

        const subscriptions = await Subscription.findAll({
            where,
            include: [
                { model: User, attributes: ['id', 'fullName', 'email'] }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            count: subscriptions.length,
            data: subscriptions
        });
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch subscriptions' });
    }
};

module.exports = {
    getUsers,
    getUserById,
    verifyTherapist,
    getPlatformMetrics,
    getSubscriptions
};
