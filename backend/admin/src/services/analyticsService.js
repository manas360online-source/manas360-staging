// ================================================
// MANAS360 Session Analytics - Analytics Service
// Story 3.6: Session Analytics
// Business logic for computing all analytics metrics
// ================================================

const { Op, fn, col, literal } = require('sequelize');
const { sequelize, TherapySession, SessionOutcome, User, TherapistMetric, SessionAnalyticsDaily } = require('../models');

class AnalyticsService {
    
    // =========================================
    // 1. Dashboard Overview Metrics
    // =========================================
    async getOverviewMetrics(startDate, endDate) {
        const whereClause = this._buildDateFilter(startDate, endDate);
        
        const [sessionStats, outcomeStats, uniqueCounts] = await Promise.all([
            // Session statistics
            TherapySession.findOne({
                attributes: [
                    [fn('COUNT', col('id')), 'totalSessions'],
                    [fn('COUNT', literal("CASE WHEN status = 'completed' THEN 1 END")), 'completedSessions'],
                    [fn('COUNT', literal("CASE WHEN status = 'cancelled' THEN 1 END")), 'cancelledSessions'],
                    [fn('COUNT', literal("CASE WHEN status = 'no_show' THEN 1 END")), 'noShowSessions'],
                    [fn('AVG', literal("CASE WHEN status = 'completed' THEN duration_minutes END")), 'avgDuration'],
                    [fn('AVG', col('rating')), 'avgRating']
                ],
                where: whereClause,
                raw: true
            }),
            
            // Outcome improvements
            SessionOutcome.findOne({
                attributes: [
                    [fn('AVG', literal("pre_score - COALESCE(post_score, pre_score)")), 'avgImprovement'],
                    [fn('AVG', literal("CASE WHEN assessment_type = 'PHQ-9' THEN pre_score - COALESCE(post_score, pre_score) END")), 'avgPhq9Improvement'],
                    [fn('AVG', literal("CASE WHEN assessment_type = 'GAD-7' THEN pre_score - COALESCE(post_score, pre_score) END")), 'avgGad7Improvement']
                ],
                where: { assessedAt: { [Op.between]: [startDate, endDate] } },
                raw: true
            }),
            
            // Unique counts
            TherapySession.findOne({
                attributes: [
                    [fn('COUNT', fn('DISTINCT', col('patient_id'))), 'uniquePatients'],
                    [fn('COUNT', fn('DISTINCT', col('therapist_id'))), 'activeTherapists']
                ],
                where: whereClause,
                raw: true
            })
        ]);

        const totalSessions = parseInt(sessionStats.totalSessions) || 0;
        const completedSessions = parseInt(sessionStats.completedSessions) || 0;
        
        return {
            totalSessions,
            completedSessions,
            cancelledSessions: parseInt(sessionStats.cancelledSessions) || 0,
            noShowSessions: parseInt(sessionStats.noShowSessions) || 0,
            completionRate: totalSessions > 0 ? ((completedSessions / totalSessions) * 100).toFixed(1) : 0,
            avgDuration: parseFloat(sessionStats.avgDuration || 0).toFixed(1),
            avgRating: parseFloat(sessionStats.avgRating || 0).toFixed(2),
            avgImprovement: parseFloat(outcomeStats.avgImprovement || 0).toFixed(2),
            avgPhq9Improvement: parseFloat(outcomeStats.avgPhq9Improvement || 0).toFixed(2),
            avgGad7Improvement: parseFloat(outcomeStats.avgGad7Improvement || 0).toFixed(2),
            uniquePatients: parseInt(uniqueCounts.uniquePatients) || 0,
            activeTherapists: parseInt(uniqueCounts.activeTherapists) || 0,
            dateRange: { startDate, endDate }
        };
    }

    // =========================================
    // 2. Session Metrics by Type/Mode
    // =========================================
    async getSessionMetrics(startDate, endDate, groupBy = 'type') {
        const whereClause = this._buildDateFilter(startDate, endDate);
        const groupByField = groupBy === 'mode' ? 'session_mode' : 'session_type';
        
        const sessionsByGroup = await TherapySession.findAll({
            attributes: [
                [col(groupByField), 'category'],
                [fn('COUNT', col('id')), 'total'],
                [fn('COUNT', literal("CASE WHEN status = 'completed' THEN 1 END")), 'completed'],
                [fn('AVG', col('duration_minutes')), 'avgDuration'],
                [fn('AVG', col('rating')), 'avgRating']
            ],
            where: whereClause,
            group: [groupByField],
            raw: true
        });

        return sessionsByGroup.map(item => ({
            category: item.category,
            total: parseInt(item.total),
            completed: parseInt(item.completed),
            completionRate: item.total > 0 ? ((item.completed / item.total) * 100).toFixed(1) : 0,
            avgDuration: parseFloat(item.avgDuration || 0).toFixed(1),
            avgRating: parseFloat(item.avgRating || 0).toFixed(2)
        }));
    }

    // =========================================
    // 3. Patient Outcome Analytics
    // =========================================
    async getOutcomeAnalytics(startDate, endDate) {
        const outcomes = await SessionOutcome.findAll({
            attributes: [
                'assessmentType',
                [fn('COUNT', col('id')), 'assessmentCount'],
                [fn('AVG', col('pre_score')), 'avgPreScore'],
                [fn('AVG', col('post_score')), 'avgPostScore'],
                [fn('AVG', literal('pre_score - COALESCE(post_score, pre_score)')), 'avgImprovement'],
                [fn('COUNT', literal("CASE WHEN (pre_score - COALESCE(post_score, pre_score)) > 0 THEN 1 END")), 'improvedCount']
            ],
            where: { assessedAt: { [Op.between]: [startDate, endDate] } },
            group: ['assessment_type'],
            raw: true
        });

        // Severity distribution
        const severityDist = await SessionOutcome.findAll({
            attributes: [
                'assessmentType',
                'severityPre',
                [fn('COUNT', col('id')), 'count']
            ],
            where: { assessedAt: { [Op.between]: [startDate, endDate] } },
            group: ['assessment_type', 'severity_pre'],
            raw: true
        });

        return {
            byAssessmentType: outcomes.map(o => ({
                type: o.assessmentType,
                count: parseInt(o.assessmentCount),
                avgPreScore: parseFloat(o.avgPreScore || 0).toFixed(1),
                avgPostScore: parseFloat(o.avgPostScore || 0).toFixed(1),
                avgImprovement: parseFloat(o.avgImprovement || 0).toFixed(2),
                improvementRate: o.assessmentCount > 0 
                    ? ((parseInt(o.improvedCount) / parseInt(o.assessmentCount)) * 100).toFixed(1) 
                    : 0
            })),
            severityDistribution: severityDist
        };
    }

    // =========================================
    // 4. Therapist Performance Rankings
    // =========================================
    async getTherapistPerformance(startDate, endDate, limit = 10) {
        const whereClause = this._buildDateFilter(startDate, endDate);
        
        const therapistStats = await TherapySession.findAll({
            attributes: [
                'therapistId',
                [fn('COUNT', col('TherapySession.id')), 'totalSessions'],
                [fn('COUNT', literal("CASE WHEN status = 'completed' THEN 1 END")), 'completedSessions'],
                [fn('COUNT', fn('DISTINCT', col('patient_id'))), 'uniquePatients'],
                [fn('AVG', col('duration_minutes')), 'avgDuration'],
                [fn('AVG', col('rating')), 'avgRating']
            ],
            include: [{
                model: User,
                as: 'therapist',
                attributes: ['fullName', 'email', 'specialization']
            }],
            where: whereClause,
            group: ['therapist_id', 'therapist.id', 'therapist.full_name', 'therapist.email', 'therapist.specialization'],
            order: [[literal('COUNT(*)'), 'DESC']],
            limit,
            raw: false
        });

        // Get outcome improvements for each therapist
        const therapistIds = therapistStats.map(t => t.therapistId);
        const outcomesByTherapist = await sequelize.query(`
            SELECT 
                ts.therapist_id,
                AVG(so.pre_score - COALESCE(so.post_score, so.pre_score)) as avg_improvement
            FROM session_outcomes so
            JOIN therapy_sessions ts ON so.session_id = ts.id
            WHERE ts.therapist_id = ANY($1)
            AND so.assessed_at BETWEEN $2 AND $3
            GROUP BY ts.therapist_id
        `, {
            bind: [therapistIds, startDate, endDate],
            type: sequelize.QueryTypes.SELECT
        });

        const improvementMap = new Map(outcomesByTherapist.map(o => [o.therapist_id, o.avg_improvement]));

        return therapistStats.map(t => ({
            therapistId: t.therapistId,
            name: t.therapist?.fullName || 'Unknown',
            email: t.therapist?.email,
            specialization: t.therapist?.specialization,
            totalSessions: parseInt(t.dataValues.totalSessions),
            completedSessions: parseInt(t.dataValues.completedSessions),
            completionRate: t.dataValues.totalSessions > 0 
                ? ((t.dataValues.completedSessions / t.dataValues.totalSessions) * 100).toFixed(1) 
                : 0,
            uniquePatients: parseInt(t.dataValues.uniquePatients),
            avgDuration: parseFloat(t.dataValues.avgDuration || 0).toFixed(1),
            avgRating: parseFloat(t.dataValues.avgRating || 0).toFixed(2),
            avgOutcomeImprovement: parseFloat(improvementMap.get(t.therapistId) || 0).toFixed(2)
        }));
    }

    // =========================================
    // 5. Time-based Trend Analysis
    // =========================================
    async getTrends(startDate, endDate, interval = 'day') {
        const dateFormat = {
            day: 'YYYY-MM-DD',
            week: 'IYYY-IW',
            month: 'YYYY-MM'
        };
        const format = dateFormat[interval] || dateFormat.day;
        
        // Session trends
        const sessionTrends = await sequelize.query(`
            SELECT 
                TO_CHAR(scheduled_at, '${format}') as period,
                COUNT(*) as total_sessions,
                COUNT(*) FILTER (WHERE status = 'completed') as completed,
                COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
                COUNT(*) FILTER (WHERE status = 'no_show') as no_show,
                ROUND(AVG(duration_minutes) FILTER (WHERE status = 'completed'), 1) as avg_duration,
                ROUND(AVG(rating), 2) as avg_rating,
                COUNT(DISTINCT patient_id) as unique_patients
            FROM therapy_sessions
            WHERE scheduled_at BETWEEN $1 AND $2
            GROUP BY TO_CHAR(scheduled_at, '${format}')
            ORDER BY period ASC
        `, {
            bind: [startDate, endDate],
            type: sequelize.QueryTypes.SELECT
        });

        // Outcome trends
        const outcomeTrends = await sequelize.query(`
            SELECT 
                TO_CHAR(assessed_at, '${format}') as period,
                assessment_type,
                COUNT(*) as assessments,
                ROUND(AVG(pre_score - COALESCE(post_score, pre_score)), 2) as avg_improvement
            FROM session_outcomes
            WHERE assessed_at BETWEEN $1 AND $2
            GROUP BY TO_CHAR(assessed_at, '${format}'), assessment_type
            ORDER BY period ASC
        `, {
            bind: [startDate, endDate],
            type: sequelize.QueryTypes.SELECT
        });

        return {
            sessions: sessionTrends.map(t => ({
                period: t.period,
                totalSessions: parseInt(t.total_sessions),
                completed: parseInt(t.completed),
                cancelled: parseInt(t.cancelled),
                noShow: parseInt(t.no_show),
                completionRate: t.total_sessions > 0 
                    ? ((parseInt(t.completed) / parseInt(t.total_sessions)) * 100).toFixed(1) 
                    : 0,
                avgDuration: parseFloat(t.avg_duration || 0),
                avgRating: parseFloat(t.avg_rating || 0),
                uniquePatients: parseInt(t.unique_patients)
            })),
            outcomes: outcomeTrends.map(o => ({
                period: o.period,
                type: o.assessment_type,
                assessments: parseInt(o.assessments),
                avgImprovement: parseFloat(o.avg_improvement || 0)
            }))
        };
    }

    // =========================================
    // 6. Drop-off Analysis
    // =========================================
    async getDropoffAnalysis(startDate, endDate) {
        // Patients who had sessions but stopped
        const dropoffs = await sequelize.query(`
            WITH patient_last_session AS (
                SELECT 
                    patient_id,
                    MAX(scheduled_at) as last_session,
                    COUNT(*) as total_sessions
                FROM therapy_sessions
                WHERE status = 'completed'
                GROUP BY patient_id
            )
            SELECT 
                CASE 
                    WHEN last_session < NOW() - INTERVAL '30 days' THEN '30+ days inactive'
                    WHEN last_session < NOW() - INTERVAL '14 days' THEN '14-30 days inactive'
                    WHEN last_session < NOW() - INTERVAL '7 days' THEN '7-14 days inactive'
                    ELSE 'Active'
                END as status,
                COUNT(*) as patient_count,
                AVG(total_sessions) as avg_sessions_before_dropout
            FROM patient_last_session
            GROUP BY 
                CASE 
                    WHEN last_session < NOW() - INTERVAL '30 days' THEN '30+ days inactive'
                    WHEN last_session < NOW() - INTERVAL '14 days' THEN '14-30 days inactive'
                    WHEN last_session < NOW() - INTERVAL '7 days' THEN '7-14 days inactive'
                    ELSE 'Active'
                END
            ORDER BY patient_count DESC
        `, { type: sequelize.QueryTypes.SELECT });

        // Cancellation reasons by session type
        const cancellationsByType = await TherapySession.findAll({
            attributes: [
                'sessionType',
                [fn('COUNT', literal("CASE WHEN status = 'cancelled' THEN 1 END")), 'cancelled'],
                [fn('COUNT', literal("CASE WHEN status = 'no_show' THEN 1 END")), 'noShow'],
                [fn('COUNT', col('id')), 'total']
            ],
            where: this._buildDateFilter(startDate, endDate),
            group: ['session_type'],
            raw: true
        });

        return {
            patientActivity: dropoffs,
            cancellationsByType: cancellationsByType.map(c => ({
                type: c.sessionType,
                cancelled: parseInt(c.cancelled),
                noShow: parseInt(c.noShow),
                total: parseInt(c.total),
                cancellationRate: c.total > 0 
                    ? (((parseInt(c.cancelled) + parseInt(c.noShow)) / parseInt(c.total)) * 100).toFixed(1) 
                    : 0
            }))
        };
    }

    // =========================================
    // 7. Helper: Date Filter Builder
    // =========================================
    _buildDateFilter(startDate, endDate) {
        return {
            scheduledAt: {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            }
        };
    }
}

module.exports = new AnalyticsService();
