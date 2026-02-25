// ================================================
// MANAS360 Session Analytics - Sequelize Models
// Story 3.6: Session Analytics
// ================================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// =============================================
// 1. User Model
// =============================================
const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    fullName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'full_name'
    },
    role: {
        type: DataTypes.ENUM('admin', 'therapist', 'patient'),
        allowNull: false
    },
    specialization: {
        type: DataTypes.STRING(100)
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active'
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_verified'
    }
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// =============================================
// 1.1 Subscription Model
// =============================================
const Subscription = sequelize.define('Subscription', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id'
    },
    planName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'plan_name'
    },
    status: {
        type: DataTypes.ENUM('active', 'expired', 'cancelled', 'pending'),
        defaultValue: 'active'
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'start_date'
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'end_date'
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING(3),
        defaultValue: 'USD'
    }
}, {
    tableName: 'subscriptions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// =============================================
// 2. TherapySession Model
// =============================================
const TherapySession = sequelize.define('TherapySession', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    patientId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'patient_id'
    },
    therapistId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'therapist_id'
    },
    sessionType: {
        type: DataTypes.ENUM('CBT', 'DBT', 'Mindfulness', 'Psychotherapy', 'Counseling', 'Group'),
        allowNull: false,
        field: 'session_type'
    },
    scheduledAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'scheduled_at'
    },
    startedAt: {
        type: DataTypes.DATE,
        field: 'started_at'
    },
    endedAt: {
        type: DataTypes.DATE,
        field: 'ended_at'
    },
    durationMinutes: {
        type: DataTypes.INTEGER,
        field: 'duration_minutes'
    },
    status: {
        type: DataTypes.ENUM('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show'),
        defaultValue: 'scheduled'
    },
    sessionMode: {
        type: DataTypes.ENUM('video', 'audio', 'chat', 'in_person'),
        defaultValue: 'video',
        field: 'session_mode'
    },
    notes: {
        type: DataTypes.TEXT
    },
    rating: {
        type: DataTypes.INTEGER,
        validate: { min: 1, max: 5 }
    }
}, {
    tableName: 'therapy_sessions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// =============================================
// 3. SessionOutcome Model
// =============================================
const SessionOutcome = sequelize.define('SessionOutcome', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    sessionId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'session_id',
        references: { model: 'therapy_sessions', key: 'id' }
    },
    patientId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'patient_id'
    },
    assessmentType: {
        type: DataTypes.ENUM('PHQ-9', 'GAD-7', 'DASS-21', 'PSS-10', 'WHO-5'),
        allowNull: false,
        field: 'assessment_type'
    },
    preScore: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'pre_score',
        validate: { min: 0 }
    },
    postScore: {
        type: DataTypes.INTEGER,
        field: 'post_score',
        validate: { min: 0 }
    },
    improvementScore: {
        type: DataTypes.VIRTUAL,
        get() {
            const pre = this.preScore || 0;
            const post = this.postScore || pre;
            return pre - post;
        }
    },
    severityPre: {
        type: DataTypes.STRING(20),
        field: 'severity_pre'
    },
    severityPost: {
        type: DataTypes.STRING(20),
        field: 'severity_post'
    },
    assessedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'assessed_at'
    }
}, {
    tableName: 'session_outcomes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

// =============================================
// 4. TherapistMetric Model
// =============================================
const TherapistMetric = sequelize.define('TherapistMetric', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    therapistId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'therapist_id'
    },
    metricDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'metric_date'
    },
    totalSessions: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'total_sessions'
    },
    completedSessions: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'completed_sessions'
    },
    cancelledSessions: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'cancelled_sessions'
    },
    noShowSessions: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'no_show_sessions'
    },
    completionRate: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
        field: 'completion_rate'
    },
    avgSessionDuration: {
        type: DataTypes.DECIMAL(6, 2),
        defaultValue: 0,
        field: 'avg_session_duration'
    },
    avgRating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0,
        field: 'avg_rating'
    },
    totalPatients: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'total_patients'
    },
    avgOutcomeImprovement: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
        field: 'avg_outcome_improvement'
    }
}, {
    tableName: 'therapist_metrics',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// =============================================
// 5. SessionAnalyticsDaily Model
// =============================================
const SessionAnalyticsDaily = sequelize.define('SessionAnalyticsDaily', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    metricDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        unique: true,
        field: 'metric_date'
    },
    totalSessions: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'total_sessions'
    },
    completedSessions: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'completed_sessions'
    },
    cancelledSessions: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'cancelled_sessions'
    },
    noShowSessions: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'no_show_sessions'
    },
    completionRate: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
        field: 'completion_rate'
    },
    avgDurationMinutes: {
        type: DataTypes.DECIMAL(6, 2),
        defaultValue: 0,
        field: 'avg_duration_minutes'
    },
    totalUniquePatients: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'total_unique_patients'
    },
    activeTherapists: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'active_therapists'
    },
    sessionsByType: {
        type: DataTypes.JSONB,
        defaultValue: {},
        field: 'sessions_by_type'
    },
    sessionsByMode: {
        type: DataTypes.JSONB,
        defaultValue: {},
        field: 'sessions_by_mode'
    },
    avgPhq9Improvement: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
        field: 'avg_phq9_improvement'
    },
    avgGad7Improvement: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
        field: 'avg_gad7_improvement'
    },
    avgRating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0,
        field: 'avg_rating'
    }
}, {
    tableName: 'session_analytics_daily',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// =============================================
// Associations
// =============================================
TherapySession.belongsTo(User, { as: 'patient', foreignKey: 'patientId' });
TherapySession.belongsTo(User, { as: 'therapist', foreignKey: 'therapistId' });
TherapySession.hasMany(SessionOutcome, { foreignKey: 'sessionId' });

SessionOutcome.belongsTo(TherapySession, { foreignKey: 'sessionId' });
SessionOutcome.belongsTo(User, { as: 'patient', foreignKey: 'patientId' });

TherapistMetric.belongsTo(User, { as: 'therapist', foreignKey: 'therapistId' });

User.hasMany(Subscription, { foreignKey: 'userId' });
Subscription.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
    sequelize,
    User,
    TherapySession,
    SessionOutcome,
    TherapistMetric,
    SessionAnalyticsDaily,
    Subscription
};
