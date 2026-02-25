// ================================================
// MANAS360 Session Analytics - Analytics Controller
// Story 3.6: Session Analytics
// ================================================

const analyticsService = require('../services/analyticsService');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

class AnalyticsController {
    
    // =========================================
    // GET /api/analytics/overview
    // Dashboard overview metrics
    // =========================================
    async getOverview(req, res) {
        try {
            const { startDate, endDate } = this._parseDateRange(req.query);
            const metrics = await analyticsService.getOverviewMetrics(startDate, endDate);
            
            res.json({
                success: true,
                data: metrics,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Overview Error:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // =========================================
    // GET /api/analytics/sessions
    // Session metrics by type/mode
    // =========================================
    async getSessions(req, res) {
        try {
            const { startDate, endDate } = this._parseDateRange(req.query);
            const groupBy = req.query.groupBy || 'type';
            
            const [byType, byMode] = await Promise.all([
                analyticsService.getSessionMetrics(startDate, endDate, 'type'),
                analyticsService.getSessionMetrics(startDate, endDate, 'mode')
            ]);
            
            res.json({
                success: true,
                data: { byType, byMode },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Sessions Error:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // =========================================
    // GET /api/analytics/outcomes
    // Patient outcome analytics
    // =========================================
    async getOutcomes(req, res) {
        try {
            const { startDate, endDate } = this._parseDateRange(req.query);
            const outcomes = await analyticsService.getOutcomeAnalytics(startDate, endDate);
            
            res.json({
                success: true,
                data: outcomes,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Outcomes Error:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // =========================================
    // GET /api/analytics/therapists
    // Therapist performance rankings
    // =========================================
    async getTherapists(req, res) {
        try {
            const { startDate, endDate } = this._parseDateRange(req.query);
            const limit = parseInt(req.query.limit) || 10;
            const therapists = await analyticsService.getTherapistPerformance(startDate, endDate, limit);
            
            res.json({
                success: true,
                data: therapists,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Therapists Error:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // =========================================
    // GET /api/analytics/trends
    // Time-based trend analysis
    // =========================================
    async getTrends(req, res) {
        try {
            const { startDate, endDate } = this._parseDateRange(req.query);
            const interval = req.query.interval || 'day';
            const trends = await analyticsService.getTrends(startDate, endDate, interval);
            
            res.json({
                success: true,
                data: trends,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Trends Error:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // =========================================
    // GET /api/analytics/dropoff
    // Drop-off analysis
    // =========================================
    async getDropoff(req, res) {
        try {
            const { startDate, endDate } = this._parseDateRange(req.query);
            const dropoff = await analyticsService.getDropoffAnalysis(startDate, endDate);
            
            res.json({
                success: true,
                data: dropoff,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Dropoff Error:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // =========================================
    // GET /api/analytics/export/excel
    // Export analytics to Excel
    // =========================================
    async exportExcel(req, res) {
        try {
            const { startDate, endDate } = this._parseDateRange(req.query);
            
            const [overview, sessions, outcomes, therapists, trends] = await Promise.all([
                analyticsService.getOverviewMetrics(startDate, endDate),
                analyticsService.getSessionMetrics(startDate, endDate, 'type'),
                analyticsService.getOutcomeAnalytics(startDate, endDate),
                analyticsService.getTherapistPerformance(startDate, endDate, 50),
                analyticsService.getTrends(startDate, endDate, 'day')
            ]);

            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'MANAS360 Analytics';
            workbook.created = new Date();

            // Sheet 1: Overview
            const overviewSheet = workbook.addWorksheet('Overview');
            overviewSheet.columns = [
                { header: 'Metric', key: 'metric', width: 30 },
                { header: 'Value', key: 'value', width: 20 }
            ];
            overviewSheet.addRows([
                { metric: 'Total Sessions', value: overview.totalSessions },
                { metric: 'Completed Sessions', value: overview.completedSessions },
                { metric: 'Completion Rate (%)', value: overview.completionRate },
                { metric: 'Avg Duration (min)', value: overview.avgDuration },
                { metric: 'Avg Rating', value: overview.avgRating },
                { metric: 'Unique Patients', value: overview.uniquePatients },
                { metric: 'Active Therapists', value: overview.activeTherapists },
                { metric: 'Avg PHQ-9 Improvement', value: overview.avgPhq9Improvement },
                { metric: 'Avg GAD-7 Improvement', value: overview.avgGad7Improvement }
            ]);
            this._styleHeaderRow(overviewSheet);

            // Sheet 2: Sessions by Type
            const sessionsSheet = workbook.addWorksheet('Sessions by Type');
            sessionsSheet.columns = [
                { header: 'Session Type', key: 'category', width: 20 },
                { header: 'Total', key: 'total', width: 15 },
                { header: 'Completed', key: 'completed', width: 15 },
                { header: 'Completion Rate (%)', key: 'completionRate', width: 20 },
                { header: 'Avg Duration', key: 'avgDuration', width: 15 },
                { header: 'Avg Rating', key: 'avgRating', width: 15 }
            ];
            sessionsSheet.addRows(sessions);
            this._styleHeaderRow(sessionsSheet);

            // Sheet 3: Outcomes
            const outcomesSheet = workbook.addWorksheet('Outcomes');
            outcomesSheet.columns = [
                { header: 'Assessment Type', key: 'type', width: 20 },
                { header: 'Count', key: 'count', width: 15 },
                { header: 'Avg Pre Score', key: 'avgPreScore', width: 15 },
                { header: 'Avg Post Score', key: 'avgPostScore', width: 15 },
                { header: 'Avg Improvement', key: 'avgImprovement', width: 18 },
                { header: 'Improvement Rate (%)', key: 'improvementRate', width: 20 }
            ];
            outcomesSheet.addRows(outcomes.byAssessmentType);
            this._styleHeaderRow(outcomesSheet);

            // Sheet 4: Therapist Performance
            const therapistSheet = workbook.addWorksheet('Therapist Performance');
            therapistSheet.columns = [
                { header: 'Name', key: 'name', width: 25 },
                { header: 'Specialization', key: 'specialization', width: 20 },
                { header: 'Total Sessions', key: 'totalSessions', width: 15 },
                { header: 'Completion Rate (%)', key: 'completionRate', width: 18 },
                { header: 'Unique Patients', key: 'uniquePatients', width: 15 },
                { header: 'Avg Rating', key: 'avgRating', width: 12 },
                { header: 'Outcome Improvement', key: 'avgOutcomeImprovement', width: 20 }
            ];
            therapistSheet.addRows(therapists);
            this._styleHeaderRow(therapistSheet);

            // Sheet 5: Daily Trends
            const trendsSheet = workbook.addWorksheet('Daily Trends');
            trendsSheet.columns = [
                { header: 'Date', key: 'period', width: 15 },
                { header: 'Total Sessions', key: 'totalSessions', width: 15 },
                { header: 'Completed', key: 'completed', width: 12 },
                { header: 'Completion Rate (%)', key: 'completionRate', width: 18 },
                { header: 'Unique Patients', key: 'uniquePatients', width: 15 },
                { header: 'Avg Rating', key: 'avgRating', width: 12 }
            ];
            trendsSheet.addRows(trends.sessions);
            this._styleHeaderRow(trendsSheet);

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=MANAS360_Analytics_${startDate}_${endDate}.xlsx`);
            
            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            console.error('Excel Export Error:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // =========================================
    // GET /api/analytics/export/pdf
    // Export analytics to PDF
    // =========================================
    async exportPDF(req, res) {
        try {
            const { startDate, endDate } = this._parseDateRange(req.query);
            
            const [overview, therapists] = await Promise.all([
                analyticsService.getOverviewMetrics(startDate, endDate),
                analyticsService.getTherapistPerformance(startDate, endDate, 10)
            ]);

            const doc = new PDFDocument({ margin: 50 });
            
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=MANAS360_Analytics_${startDate}_${endDate}.pdf`);
            
            doc.pipe(res);

            // Title
            doc.fontSize(24).font('Helvetica-Bold').text('MANAS360 Session Analytics Report', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).font('Helvetica').text(`Date Range: ${startDate} to ${endDate}`, { align: 'center' });
            doc.moveDown(2);

            // Overview Section
            doc.fontSize(16).font('Helvetica-Bold').text('Overview Metrics');
            doc.moveDown(0.5);
            doc.fontSize(11).font('Helvetica');
            doc.text(`Total Sessions: ${overview.totalSessions}`);
            doc.text(`Completed Sessions: ${overview.completedSessions}`);
            doc.text(`Completion Rate: ${overview.completionRate}%`);
            doc.text(`Average Duration: ${overview.avgDuration} minutes`);
            doc.text(`Average Rating: ${overview.avgRating}/5`);
            doc.text(`Unique Patients: ${overview.uniquePatients}`);
            doc.text(`Active Therapists: ${overview.activeTherapists}`);
            doc.moveDown();

            // Outcomes Section
            doc.fontSize(16).font('Helvetica-Bold').text('Treatment Outcomes');
            doc.moveDown(0.5);
            doc.fontSize(11).font('Helvetica');
            doc.text(`Avg PHQ-9 Improvement: ${overview.avgPhq9Improvement} points`);
            doc.text(`Avg GAD-7 Improvement: ${overview.avgGad7Improvement} points`);
            doc.moveDown();

            // Top Therapists Section
            doc.fontSize(16).font('Helvetica-Bold').text('Top Therapists (by session count)');
            doc.moveDown(0.5);
            doc.fontSize(10).font('Helvetica');
            therapists.slice(0, 5).forEach((t, i) => {
                doc.text(`${i + 1}. ${t.name} (${t.specialization || 'General'})`);
                doc.text(`   Sessions: ${t.totalSessions} | Completion: ${t.completionRate}% | Rating: ${t.avgRating}/5`);
            });

            doc.moveDown(2);
            doc.fontSize(9).fillColor('gray').text(`Generated on ${new Date().toISOString()}`, { align: 'center' });

            doc.end();
        } catch (error) {
            console.error('PDF Export Error:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // =========================================
    // Helper: Parse Date Range
    // =========================================
    _parseDateRange(query) {
        const endDate = query.endDate || new Date().toISOString().split('T')[0];
        const startDate = query.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        return { startDate, endDate };
    }

    // =========================================
    // Helper: Style Excel Header Row
    // =========================================
    _styleHeaderRow(sheet) {
        const headerRow = sheet.getRow(1);
        headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '4472C4' }
        };
        headerRow.alignment = { horizontal: 'center' };
    }
}

module.exports = new AnalyticsController();
