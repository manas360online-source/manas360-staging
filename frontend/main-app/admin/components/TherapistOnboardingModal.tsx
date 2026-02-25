import React, { useState } from 'react';

interface TherapistOnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

export const TherapistOnboardingModal: React.FC<TherapistOnboardingModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        specialization: '',
        experience: '',
        licenseNumber: '',
        bio: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
        // Reset form
        setFormData({
            fullName: '',
            email: '',
            specialization: '',
            experience: '',
            licenseNumber: '',
            bio: ''
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-fadeIn">
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-calm-lavender">
                        <svg className="h-8 w-8 text-calm-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-calm-blue mb-2">Therapist Onboarding</h2>
                    <p className="text-calm-text/70">Register a new provider to the MANAS360 platform</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Full Name */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                required
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-calm-blue focus:ring-1 focus:ring-calm-blue transition-all"
                                placeholder="Dr. Sarah Johnson"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-calm-blue focus:ring-1 focus:ring-calm-blue transition-all"
                                placeholder="sarah.j@manas360.com"
                            />
                        </div>

                        {/* Specialization */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Specialization</label>
                            <select
                                name="specialization"
                                required
                                value={formData.specialization}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-calm-blue focus:ring-1 focus:ring-calm-blue transition-all bg-white"
                            >
                                <option value="">Select Specialization</option>
                                <option value="CBT">Cognitive Behavioral Therapy (CBT)</option>
                                <option value="DBT">Dialectical Behavior Therapy (DBT)</option>
                                <option value="Mindfulness">Mindfulness-Based Therapy</option>
                                <option value="Psychodynamic">Psychodynamic Therapy</option>
                                <option value="Trauma">Trauma-Informed Care</option>
                            </select>
                        </div>

                        {/* Experience */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Years of Experience</label>
                            <input
                                type="number"
                                name="experience"
                                required
                                min="0"
                                value={formData.experience}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-calm-blue focus:ring-1 focus:ring-calm-blue transition-all"
                                placeholder="e.g. 8"
                            />
                        </div>

                        {/* License Number */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-gray-700">License Number</label>
                            <input
                                type="text"
                                name="licenseNumber"
                                required
                                value={formData.licenseNumber}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-calm-blue focus:ring-1 focus:ring-calm-blue transition-all"
                                placeholder="LIC-12345678"
                            />
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Professional Bio</label>
                        <textarea
                            name="bio"
                            rows={4}
                            required
                            value={formData.bio}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-calm-blue focus:ring-1 focus:ring-calm-blue transition-all resize-none"
                            placeholder="Brief description of background and approach..."
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl border border-gray-200 bg-white px-6 py-3 font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 rounded-xl bg-calm-blue px-6 py-3 font-medium text-white shadow-lg shadow-blue-500/20 hover:bg-opacity-90 transition-all hover:transform hover:-translate-y-0.5"
                        >
                            Register Therapist
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
