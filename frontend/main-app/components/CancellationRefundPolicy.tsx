import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const CancellationRefundPolicy: React.FC = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBack = () => {
    window.location.hash = `#/${i18n.language || 'en'}/home`;
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="crp-wrapper">
      <style>{`
        .crp-wrapper {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            line-height: 1.8;
            color: #333;
        }

        .crp-wrapper * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        .crp-container {
            max-width: 900px;
            margin: 0 auto;
            background: #fff;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }

        .crp-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px;
            text-align: center;
            color: #fff;
        }

        .crp-header h1 {
            font-size: 32px;
            margin-bottom: 10px;
            color: #fff !important;
        }

        .crp-header .crp-subtitle {
            font-size: 14px;
            opacity: 0.9;
            color: #fff !important;
        }

        .crp-header .crp-version {
            margin-top: 16px;
            font-size: 12px;
            opacity: 0.7;
            color: #fff !important;
        }

        .crp-content {
            padding: 40px;
        }

        .crp-legal-notice {
            background: linear-gradient(135deg, #fff3cd 0%, #ffeeba 100%);
            border-left: 4px solid #ffc107;
            padding: 20px;
            margin-bottom: 32px;
            border-radius: 0 8px 8px 0;
        }

        .crp-legal-notice h3 {
            color: #856404;
            margin-bottom: 8px;
            font-size: 14px;
        }

        .crp-legal-notice p {
            color: #856404;
            font-size: 13px;
        }

        .crp-section {
            margin-bottom: 32px;
        }

        .crp-section h2 {
            color: #667eea;
            font-size: 20px;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e9ecef;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .crp-section h3 {
            color: #333;
            font-size: 16px;
            margin: 20px 0 12px 0;
        }

        .crp-section p {
            color: #555;
            margin-bottom: 12px;
        }

        .crp-section ul, .crp-section ol {
            margin-left: 24px;
            color: #555;
            margin-bottom: 16px;
        }

        .crp-section li {
            margin-bottom: 8px;
        }

        .crp-highlight-box {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 16px 0;
            border: 1px solid #e9ecef;
        }

        .crp-highlight-box.crp-green {
            background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
            border-color: #28a745;
        }

        .crp-highlight-box.crp-red {
            background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
            border-color: #dc3545;
        }

        .crp-highlight-box.crp-blue {
            background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
            border-color: #17a2b8;
        }

        .crp-highlight-box h4 {
            margin-bottom: 12px;
            color: #333;
        }

        .crp-table {
            width: 100%;
            border-collapse: collapse;
            margin: 16px 0;
            font-size: 14px;
        }

        .crp-table th, .crp-table td {
            padding: 12px 16px;
            text-align: left;
            border: 1px solid #dee2e6;
        }

        .crp-table th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            font-weight: 600;
        }

        .crp-table tr:nth-child(even) {
            background: #f8f9fa;
        }

        .crp-refund-percentage {
            font-weight: 700;
            color: #28a745;
        }

        .crp-no-refund {
            font-weight: 700;
            color: #dc3545;
        }

        .crp-contact-box {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            padding: 24px;
            border-radius: 12px;
            margin-top: 32px;
        }

        .crp-contact-box h3 {
            color: #fff;
            margin-bottom: 16px;
        }

        .crp-contact-box p {
            color: rgba(255,255,255,0.9);
            margin-bottom: 8px;
        }

        .crp-contact-box a {
            color: #fff;
            text-decoration: underline;
        }

        .crp-footer {
            background: #333;
            color: #999;
            padding: 24px 40px;
            text-align: center;
            font-size: 12px;
        }

        .crp-footer a {
            color: #667eea;
        }

        .crp-toc {
            background: #f8f9fa;
            padding: 24px;
            border-radius: 12px;
            margin-bottom: 32px;
        }

        .crp-toc h3 {
            margin-bottom: 16px;
            color: #333;
        }

        .crp-toc ol {
            margin-left: 20px;
        }

        .crp-toc li {
            margin-bottom: 8px;
        }

        .crp-toc a {
            color: #667eea;
            text-decoration: none;
            cursor: pointer;
        }

        .crp-toc a:hover {
            text-decoration: underline;
        }

        @media print {
            .crp-wrapper {
                background: #fff;
                padding: 0;
            }
            .crp-container {
                box-shadow: none;
                border-radius: 0;
            }
        }
      `}</style>

      {/* Back Button */}
      <div style={{ maxWidth: '900px', margin: '0 auto 20px auto' }}>
        <button 
          onClick={handleBack} 
          style={{ 
            background: 'rgba(255,255,255,0.2)', 
            color: 'white', 
            border: '1px solid rgba(255,255,255,0.4)', 
            padding: '8px 16px', 
            borderRadius: '30px', 
            cursor: 'pointer', 
            fontWeight: 'bold', 
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backdropFilter: 'blur(4px)',
            fontSize: '14px',
            transition: 'background 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
        >
          <span>←</span> Back to Home
        </button>
      </div>

      <div className="crp-container">
        <div className="crp-header">
            <h1>📜 Cancellation & Refund Policy</h1>
            <p className="crp-subtitle">MANAS360 Digital Mental Health Platform</p>
            <p className="crp-version">Version 1.0 | Effective Date: January 2026 | Last Updated: January 22, 2026</p>
        </div>

        <div className="crp-content">
            {/* Legal Notice */}
            <div className="crp-legal-notice">
                <h3>⚖️ GOVERNING LAW</h3>
                <p>This Policy is governed by and construed in accordance with the laws of India, including the Consumer Protection Act, 2019, Information Technology Act, 2000, E-Commerce Rules, 2020, and the Digital Personal Data Protection Act, 2023. Any disputes arising shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka, India.</p>
            </div>

            {/* Table of Contents */}
            <div className="crp-toc">
                <h3>📑 Table of Contents</h3>
                <ol>
                    <li><a href="#definitions" onClick={(e) => scrollToSection(e, 'definitions')}>Definitions</a></li>
                    <li><a href="#session-cancellation" onClick={(e) => scrollToSection(e, 'session-cancellation')}>Session Cancellation by User</a></li>
                    <li><a href="#therapist-cancellation" onClick={(e) => scrollToSection(e, 'therapist-cancellation')}>Session Cancellation by Therapist</a></li>
                    <li><a href="#no-show" onClick={(e) => scrollToSection(e, 'no-show')}>No-Show Policy</a></li>
                    <li><a href="#subscription" onClick={(e) => scrollToSection(e, 'subscription')}>Subscription Cancellation</a></li>
                    <li><a href="#packages" onClick={(e) => scrollToSection(e, 'packages')}>Package & Bundle Refunds</a></li>
                    <li><a href="#refund-process" onClick={(e) => scrollToSection(e, 'refund-process')}>Refund Process & Timeline</a></li>
                    <li><a href="#non-refundable" onClick={(e) => scrollToSection(e, 'non-refundable')}>Non-Refundable Items</a></li>
                    <li><a href="#force-majeure" onClick={(e) => scrollToSection(e, 'force-majeure')}>Force Majeure</a></li>
                    <li><a href="#grievance" onClick={(e) => scrollToSection(e, 'grievance')}>Grievance Redressal</a></li>
                    <li><a href="#amendments" onClick={(e) => scrollToSection(e, 'amendments')}>Amendments to Policy</a></li>
                </ol>
            </div>

            {/* Section 1: Definitions */}
            <div className="crp-section" id="definitions">
                <h2>📖 1. Definitions</h2>
                <p>For the purposes of this Cancellation & Refund Policy:</p>
                <ul>
                    <li><strong>"Platform"</strong> refers to MANAS360, a digital mental health platform operated by [MANAS360 Legal Entity Name], a company incorporated under the laws of India.</li>
                    <li><strong>"User" / "Patient" / "Client"</strong> refers to any individual who registers on the Platform to access mental health services.</li>
                    <li><strong>"Service Provider" / "Therapist" / "Psychiatrist" / "Coach"</strong> refers to independent mental health professionals who offer services through the Platform.</li>
                    <li><strong>"Session"</strong> refers to a scheduled appointment between a User and a Service Provider, delivered via video, audio, or chat.</li>
                    <li><strong>"Subscription"</strong> refers to recurring payment plans that provide access to Platform features and/or sessions.</li>
                    <li><strong>"Package"</strong> refers to pre-paid bundles of sessions purchased at a discounted rate.</li>
                    <li><strong>"Working Days"</strong> refers to Monday through Friday, excluding public holidays in India.</li>
                </ul>
            </div>

            {/* Section 2: Session Cancellation by User */}
            <div className="crp-section" id="session-cancellation">
                <h2>🗓️ 2. Session Cancellation by User</h2>
                
                <p>Users may cancel scheduled sessions subject to the following terms:</p>

                <h3>2.1 Cancellation Timeline & Refund</h3>
                
                <table className="crp-table">
                    <thead>
                        <tr>
                            <th>Cancellation Window</th>
                            <th>Refund Amount</th>
                            <th>Credit Option</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>24+ hours</strong> before scheduled time</td>
                            <td className="crp-refund-percentage">100% Refund</td>
                            <td>Or full session credit</td>
                        </tr>
                        <tr>
                            <td><strong>12-24 hours</strong> before scheduled time</td>
                            <td className="crp-refund-percentage">75% Refund</td>
                            <td>Or full session credit</td>
                        </tr>
                        <tr>
                            <td><strong>4-12 hours</strong> before scheduled time</td>
                            <td className="crp-refund-percentage">50% Refund</td>
                            <td>Or 75% session credit</td>
                        </tr>
                        <tr>
                            <td><strong>Less than 4 hours</strong> before scheduled time</td>
                            <td className="crp-no-refund">No Refund</td>
                            <td>50% session credit (one-time courtesy)</td>
                        </tr>
                    </tbody>
                </table>

                <div className="crp-highlight-box crp-blue">
                    <h4>💡 Session Credit vs. Refund</h4>
                    <p>Users may choose to receive a <strong>Session Credit</strong> instead of a monetary refund. Session Credits:</p>
                    <ul>
                        <li>Are valid for 90 days from date of issue</li>
                        <li>Can be used with any available Service Provider</li>
                        <li>Are non-transferable and cannot be converted to cash</li>
                        <li>Provide higher value than refunds (as shown above)</li>
                    </ul>
                </div>

                <h3>2.2 How to Cancel</h3>
                <ol>
                    <li>Log in to your MANAS360 account</li>
                    <li>Navigate to "My Appointments" or "Upcoming Sessions"</li>
                    <li>Click "Cancel" on the relevant session</li>
                    <li>Select reason for cancellation (optional)</li>
                    <li>Choose Refund or Session Credit</li>
                    <li>Confirm cancellation</li>
                </ol>
                <p>Cancellation confirmation will be sent via email and SMS within 15 minutes.</p>

                <h3>2.3 Rescheduling</h3>
                <p>Users may reschedule sessions free of charge if done <strong>12+ hours</strong> before the scheduled time. Rescheduling within 12 hours is treated as a cancellation followed by a new booking, subject to the refund policy above.</p>
            </div>

            {/* Section 3: Therapist Cancellation */}
            <div className="crp-section" id="therapist-cancellation">
                <h2>👨‍⚕️ 3. Session Cancellation by Service Provider</h2>

                <p>If a Service Provider (Therapist/Psychiatrist/Coach) cancels a scheduled session:</p>

                <div className="crp-highlight-box crp-green">
                    <h4>✅ User is Entitled To:</h4>
                    <ul>
                        <li><strong>100% Refund</strong> processed within 5-7 working days, OR</li>
                        <li><strong>Immediate Rescheduling</strong> with the same Service Provider at no extra cost, OR</li>
                        <li><strong>Session Credit (110%)</strong> — an additional 10% credit as goodwill compensation</li>
                    </ul>
                </div>

                <p>MANAS360 will make reasonable efforts to notify Users of Service Provider cancellations at least 4 hours in advance. In case of emergency cancellations (less than 4 hours notice), Users will receive:</p>
                <ul>
                    <li>100% refund OR 110% session credit</li>
                    <li>Priority rebooking assistance</li>
                    <li>Option to connect with an alternative available Service Provider</li>
                </ul>
            </div>

            {/* Section 4: No-Show Policy */}
            <div className="crp-section" id="no-show">
                <h2>⏰ 4. No-Show Policy</h2>

                <h3>4.1 User No-Show</h3>
                <p>A "No-Show" occurs when a User fails to join a session within <strong>15 minutes</strong> of the scheduled start time without prior cancellation.</p>
                
                <div className="crp-highlight-box crp-red">
                    <h4>❌ No-Show Consequences:</h4>
                    <ul>
                        <li><strong>No refund</strong> will be provided</li>
                        <li>The session will be marked as "completed" for billing purposes</li>
                        <li>Service Provider will be compensated for their reserved time</li>
                    </ul>
                </div>

                <p><strong>First-Time Courtesy:</strong> Users who experience their first no-show due to genuine technical issues or emergencies may request a one-time courtesy credit by contacting support within 24 hours with valid documentation.</p>

                <h3>4.2 Service Provider No-Show</h3>
                <p>If a Service Provider fails to join within 10 minutes of the scheduled time:</p>
                <ul>
                    <li>User receives <strong>100% refund</strong> automatically</li>
                    <li>Additional <strong>₹200 credit</strong> as inconvenience compensation</li>
                    <li>Service Provider is subject to Platform review and potential penalties</li>
                </ul>
            </div>

            {/* Section 5: Subscription Cancellation */}
            <div className="crp-section" id="subscription">
                <h2>📅 5. Subscription Cancellation</h2>

                <h3>5.1 Monthly Subscriptions</h3>
                <table className="crp-table">
                    <thead>
                        <tr>
                            <th>Cancellation Timing</th>
                            <th>Effect</th>
                            <th>Refund</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Within <strong>48 hours</strong> of purchase</td>
                            <td>Immediate cancellation</td>
                            <td className="crp-refund-percentage">100% Refund</td>
                        </tr>
                        <tr>
                            <td>Within <strong>7 days</strong> of purchase</td>
                            <td>Immediate cancellation</td>
                            <td className="crp-refund-percentage">Pro-rata refund (minus days used)</td>
                        </tr>
                        <tr>
                            <td>After <strong>7 days</strong></td>
                            <td>Access continues until billing cycle ends</td>
                            <td className="crp-no-refund">No refund; no future charges</td>
                        </tr>
                    </tbody>
                </table>

                <h3>5.2 Annual Subscriptions</h3>
                <table className="crp-table">
                    <thead>
                        <tr>
                            <th>Cancellation Timing</th>
                            <th>Effect</th>
                            <th>Refund</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Within <strong>7 days</strong> of purchase</td>
                            <td>Immediate cancellation</td>
                            <td className="crp-refund-percentage">100% Refund</td>
                        </tr>
                        <tr>
                            <td>Within <strong>30 days</strong> of purchase</td>
                            <td>Immediate cancellation</td>
                            <td className="crp-refund-percentage">75% Refund</td>
                        </tr>
                        <tr>
                            <td><strong>31-90 days</strong> after purchase</td>
                            <td>Immediate cancellation</td>
                            <td className="crp-refund-percentage">50% Refund</td>
                        </tr>
                        <tr>
                            <td>After <strong>90 days</strong></td>
                            <td>Access continues until subscription ends</td>
                            <td className="crp-no-refund">No refund; no renewal</td>
                        </tr>
                    </tbody>
                </table>

                <h3>5.3 How to Cancel Subscription</h3>
                <ol>
                    <li>Log in to your MANAS360 account</li>
                    <li>Go to "Settings" → "Subscription & Billing"</li>
                    <li>Click "Cancel Subscription"</li>
                    <li>Complete the cancellation survey (optional)</li>
                    <li>Confirm cancellation</li>
                </ol>
                <p>Confirmation email will be sent within 1 hour. Auto-renewal will be disabled immediately.</p>
            </div>

            {/* Section 6: Package & Bundle Refunds */}
            <div className="crp-section" id="packages">
                <h2>📦 6. Package & Bundle Refunds</h2>

                <p>Pre-paid session packages (e.g., "4 Sessions Pack", "8 Sessions Pack") are subject to the following refund terms:</p>

                <table className="crp-table">
                    <thead>
                        <tr>
                            <th>Sessions Used</th>
                            <th>Refund Calculation</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>0 sessions</strong> used</td>
                            <td className="crp-refund-percentage">100% Refund (if requested within 30 days of purchase)</td>
                        </tr>
                        <tr>
                            <td><strong>1+ sessions</strong> used</td>
                            <td>Refund = [Package Price] - ([Sessions Used] × [Standard Single Session Price])</td>
                        </tr>
                    </tbody>
                </table>

                <div className="crp-highlight-box">
                    <h4>📐 Example Calculation:</h4>
                    <p>User purchases "4 Sessions Pack" for ₹3,200 (₹800/session vs. standard ₹1,000/session)</p>
                    <p>User uses 2 sessions, then requests refund.</p>
                    <p><strong>Refund = ₹3,200 - (2 × ₹1,000) = ₹1,200</strong></p>
                    <p><em>Note: Used sessions are charged at standard single-session rate, not discounted package rate.</em></p>
                </div>

                <p><strong>Package Validity:</strong> All session packages are valid for 180 days from date of purchase. Unused sessions after this period will expire and are non-refundable.</p>
            </div>

            {/* Section 7: Refund Process */}
            <div className="crp-section" id="refund-process">
                <h2>💳 7. Refund Process & Timeline</h2>

                <h3>7.1 Refund Timeline</h3>
                <table className="crp-table">
                    <thead>
                        <tr>
                            <th>Payment Method</th>
                            <th>Refund Timeline</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>UPI (Google Pay, PhonePe, Paytm, etc.)</td>
                            <td><strong>3-5 working days</strong></td>
                        </tr>
                        <tr>
                            <td>Debit Card</td>
                            <td><strong>5-7 working days</strong></td>
                        </tr>
                        <tr>
                            <td>Credit Card</td>
                            <td><strong>7-10 working days</strong></td>
                        </tr>
                        <tr>
                            <td>Net Banking</td>
                            <td><strong>5-7 working days</strong></td>
                        </tr>
                        <tr>
                            <td>Wallet (Paytm, Amazon Pay, etc.)</td>
                            <td><strong>1-3 working days</strong></td>
                        </tr>
                    </tbody>
                </table>

                <p><em>Note: Actual credit to your account depends on your bank's processing time. MANAS360 initiates refunds within 48 hours of approval.</em></p>

                <h3>7.2 Refund Method</h3>
                <p>Refunds will be processed to the <strong>original payment method</strong> used for the transaction. In exceptional cases where the original method is unavailable (e.g., expired card, closed bank account), Users may request an alternative refund method by contacting support with valid documentation.</p>

                <h3>7.3 Refund Tracking</h3>
                <p>Users can track refund status by:</p>
                <ol>
                    <li>Logging into MANAS360 account</li>
                    <li>Navigating to "Payment History" → "Refunds"</li>
                    <li>Viewing the ARN (Acquirer Reference Number) for bank tracking</li>
                </ol>
            </div>

            {/* Section 8: Non-Refundable Items */}
            <div className="crp-section" id="non-refundable">
                <h2>🚫 8. Non-Refundable Items</h2>

                <p>The following are <strong>NOT eligible</strong> for refunds under any circumstances:</p>

                <div className="crp-highlight-box crp-red">
                    <ul>
                        <li><strong>Completed Sessions:</strong> Sessions that have been fully delivered cannot be refunded.</li>
                        <li><strong>No-Show Sessions:</strong> Sessions where the User failed to attend without prior cancellation.</li>
                        <li><strong>Expired Session Credits:</strong> Session credits that have passed their 90-day validity period.</li>
                        <li><strong>Expired Packages:</strong> Unused sessions in packages that have exceeded the 180-day validity.</li>
                        <li><strong>Processing Fees:</strong> Payment gateway charges and transaction fees are non-refundable.</li>
                        <li><strong>Promotional/Free Services:</strong> Services obtained through promotional offers, coupons, or free trials.</li>
                        <li><strong>Third-Party Services:</strong> Services provided by external partners (e.g., diagnostic tests, external referrals).</li>
                        <li><strong>Fraudulent Requests:</strong> Refund requests where fraud or misuse is suspected.</li>
                    </ul>
                </div>
            </div>

            {/* Section 9: Force Majeure */}
            <div className="crp-section" id="force-majeure">
                <h2>🌪️ 9. Force Majeure</h2>

                <p>MANAS360 shall not be liable for any failure or delay in providing services due to circumstances beyond reasonable control, including but not limited to:</p>
                <ul>
                    <li>Natural disasters (earthquakes, floods, cyclones)</li>
                    <li>Epidemics or pandemics</li>
                    <li>Government actions, laws, or regulations</li>
                    <li>War, terrorism, civil unrest</li>
                    <li>Power outages or internet service disruptions affecting significant regions</li>
                    <li>Strikes or labor disputes</li>
                </ul>

                <p>In such events:</p>
                <ul>
                    <li>Affected sessions will be rescheduled at no additional cost</li>
                    <li>Package/subscription validity will be extended by the duration of the disruption</li>
                    <li>Users may request a full refund if services cannot be resumed within 30 days</li>
                </ul>
            </div>

            {/* Section 10: Grievance Redressal */}
            <div className="crp-section" id="grievance">
                <h2>📝 10. Grievance Redressal Mechanism</h2>

                <p>In accordance with the Consumer Protection Act, 2019 and E-Commerce Rules, 2020, MANAS360 has established the following grievance redressal mechanism:</p>

                <h3>10.1 Level 1: Customer Support</h3>
                <p>For general cancellation and refund queries:</p>
                <ul>
                    <li><strong>Email:</strong> support@manas360.com</li>
                    <li><strong>In-App:</strong> Help & Support → Refunds</li>
                    <li><strong>Response Time:</strong> Within 24 hours</li>
                    <li><strong>Resolution Time:</strong> Within 72 hours</li>
                </ul>

                <h3>10.2 Level 2: Grievance Officer</h3>
                <p>If your complaint is not resolved satisfactorily at Level 1:</p>

                <div className="crp-contact-box">
                    <h3>Grievance Officer Details</h3>
                    <p><strong>Name:</strong> [Grievance Officer Name]</p>
                    <p><strong>Designation:</strong> Grievance Officer, MANAS360</p>
                    <p><strong>Email:</strong> <a href="mailto:grievance@manas360.com">grievance@manas360.com</a></p>
                    <p><strong>Phone:</strong> [Phone Number]</p>
                    <p><strong>Address:</strong> [Registered Office Address], Bengaluru, Karnataka, India</p>
                    <p><strong>Working Hours:</strong> Monday to Friday, 10:00 AM to 6:00 PM IST</p>
                    <p><strong>Response Time:</strong> Within 48 hours of receipt</p>
                    <p><strong>Resolution Time:</strong> Within 30 days as per Consumer Protection Act, 2019</p>
                </div>

                <h3>10.3 Level 3: External Redressal</h3>
                <p>If the grievance remains unresolved, Users may approach:</p>
                <ul>
                    <li><strong>National Consumer Helpline:</strong> 1800-11-4000 (Toll-Free)</li>
                    <li><strong>Consumer Forum:</strong> District/State/National Consumer Disputes Redressal Commission</li>
                    <li><strong>Online:</strong> <a href="https://consumerhelpline.gov.in" target="_blank" rel="noreferrer">consumerhelpline.gov.in</a></li>
                </ul>
            </div>

            {/* Section 11: Amendments */}
            <div className="crp-section" id="amendments">
                <h2>✏️ 11. Amendments to this Policy</h2>

                <p>MANAS360 reserves the right to modify this Cancellation & Refund Policy at any time. Changes will be effective upon posting on the Platform with an updated "Last Updated" date.</p>

                <p>Material changes will be communicated to Users via:</p>
                <ul>
                    <li>Email notification to registered email address</li>
                    <li>In-app notification</li>
                    <li>Banner on the Platform homepage</li>
                </ul>

                <p>Continued use of the Platform after changes constitutes acceptance of the updated Policy. Users who do not agree to changes may discontinue use and request refunds as per the terms in effect at the time of their purchase.</p>
            </div>

            {/* Acceptance */}
            <div className="crp-highlight-box crp-blue" style={{marginTop: '40px'}}>
                <h4>📋 Acceptance of Policy</h4>
                <p>By registering on MANAS360, making a purchase, or using our services, you acknowledge that you have read, understood, and agree to be bound by this Cancellation & Refund Policy. This Policy forms an integral part of the MANAS360 Terms of Service.</p>
            </div>

        </div>

        <div className="crp-footer">
            <p>
                © 2026 MANAS360. All Rights Reserved.<br />
                <a href="#">Terms of Service</a> | <a href="#">Privacy Policy</a> | <a href="#">Cookie Policy</a><br /><br />
                Registered Address: [Company Address], Bengaluru, Karnataka, India<br />
                CIN: [Company Identification Number]
            </p>
        </div>
      </div>
    </div>
  );
};