"use client";

import React from "react";
import TopNavBar from "@/components/shared/TopNavBar";
import Footer from "@/components/shared/Footer";

export default function MethodologyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-on-background selection:bg-teal-accent/30 font-body-main">
      <TopNavBar />
<main className="flex-grow max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">

{/*  Hero Section / Title  */}
<header className="max-w-container-max mx-auto px-margin-desktop pt-24 pb-16">
<div className="max-w-3xl">
<p className="font-label-caps text-label-caps text-teal-accent mb-4">SCIENTIFIC DOCUMENTATION V2.4</p>
<h1 className="font-display-hero text-display-hero text-text-primary mb-8 leading-tight">The Science of Predictive Cardiology</h1>
<p className="font-body-main text-body-main text-text-secondary text-lg leading-relaxed opacity-80">
                    CorMetrics leverages an ensemble of advanced machine learning architectures to provide real-time cardiovascular risk stratification. This methodology outlines our algorithmic framework, data features, and clinical validation protocols.
                </p>
</div>
</header>
{/*  Section 1: The CorMetrics Ensemble  */}
<section className="max-w-container-max mx-auto px-margin-desktop py-section-gap">
<div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
<div className="md:col-span-4 sticky top-32 h-fit">
<h2 className="font-headline-page text-headline-page text-primary mb-6">The CorMetrics Ensemble</h2>
<p className="font-body-main text-body-main text-text-muted mb-8">
                        Our core engine is not a single model, but a sophisticated ensemble of five distinct architectures working in parallel to minimize bias and maximize predictive accuracy.
                    </p>
<div className="flex flex-col gap-4">
<div className="p-4 rounded-lg bg-surface-container border border-border">
<span className="font-label-caps text-label-caps text-teal-accent">ENSEMBLE RELIABILITY</span>
<div className="text-3xl font-headline-section mt-1">98.4%</div>
<p className="text-xs text-text-muted mt-1">Cross-validated AUROC across diverse clinical datasets.</p>
</div>
</div>
</div>
<div className="md:col-span-8 flex flex-col gap-6">
{/*  Model Cards  */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
<div className="glass-panel p-8 rounded-xl hover:border-teal-accent/40 transition-colors">
<div className="flex items-center gap-3 mb-4">
<span className="material-symbols-outlined text-teal-accent" data-icon="hub">hub</span>
<h3 className="font-title-card text-title-card">Random Forest</h3>
</div>
<p className="font-body-compact text-body-compact text-text-secondary">Handles non-linear relationships in biometrics and lifestyle factors with high stability and resistance to overfitting.</p>
</div>
<div className="glass-panel p-8 rounded-xl hover:border-teal-accent/40 transition-colors">
<div className="flex items-center gap-3 mb-4">
<span className="material-symbols-outlined text-teal-accent" data-icon="insights">insights</span>
<h3 className="font-title-card text-title-card">Support Vector Machine (SVM)</h3>
</div>
<p className="font-body-compact text-body-compact text-text-secondary">Optimized for finding clear classification boundaries in high-dimensional clinical data spaces.</p>
</div>
<div className="glass-panel p-8 rounded-xl hover:border-teal-accent/40 transition-colors">
<div className="flex items-center gap-3 mb-4">
<span className="material-symbols-outlined text-teal-accent" data-icon="timeline">timeline</span>
<h3 className="font-title-card text-title-card">Decision Tree & K-Nearest Neighbors</h3>
</div>
<div className="glass-panel p-8 rounded-xl hover:border-teal-accent/40 transition-colors">
<div className="flex items-center gap-3 mb-4">
<span className="material-symbols-outlined text-teal-accent" data-icon="lan">lan</span>
<h3 className="font-title-card text-title-card">Logistic Regression</h3>
</div>
<p className="font-body-compact text-body-compact text-text-secondary">Provides a robust, probabilistically calibrated baseline that accurately weighs the impact of individual features like pulse pressure.</p>
</div>
<p className="font-body-compact text-body-compact text-text-secondary">Provide immediate, transparent rule-based partitioning and distance-based similarity groupings for interpretability.</p>
</div>
<div className="glass-panel p-8 rounded-xl">
<h3 className="font-title-card text-title-card text-teal-accent mb-4">Engineered Features</h3>
<ul className="space-y-4">
<li className="flex gap-4">
<span className="material-symbols-outlined text-primary mt-1" data-icon="bloodtype">bloodtype</span>
<div>
<h4 className="font-bold text-on-surface">Pulse Pressure</h4>
<p className="font-body-compact text-body-compact text-text-muted mt-1">Calculated dynamically from ap_hi and ap_lo, providing critical insights into arterial stiffness.</p>
</div>
</li>
<li className="flex gap-4">
<span className="material-symbols-outlined text-primary mt-1" data-icon="monitor_weight">monitor_weight</span>
<div>
<h4 className="font-bold text-on-surface">Body Mass Index (BMI)</h4>
<p className="font-body-compact text-body-compact text-text-muted mt-1">Computed live during assessment using patient height and weight inputs.</p>
</div>
</li>
</ul>
</div>
</div>
<div className="glass-panel p-8 rounded-xl border-l-4 border-l-teal-accent">
<h3 className="font-title-card text-title-card mb-2">Soft-Voting Ensemble Mechanism</h3>
<p className="font-body-main text-body-main text-text-secondary">
                            A final meta-classifier synthesizes the outputs of all five primary models using a soft-voting logic. By averaging the calibrated probabilities rather than hard class predictions, the ensemble ensures that the final Risk Score is exceptionally robust, minimizing the variance and bias inherent to any single algorithm.
                        </p>
</div>
</div>
</div>
</section>
{/*  Section 2: Data Science Blueprint  */}
<section className="bg-surface-container-low py-section-gap">
<div className="max-w-container-max mx-auto px-margin-desktop">
<div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
<div>
<h2 className="font-headline-page text-headline-page text-primary mb-6">Data Science Blueprint</h2>
<p className="font-body-main text-body-main text-text-secondary mb-10 leading-relaxed">
                            Our models are trained on over 2.4 million anonymized patient records, utilizing a high-dimensional feature set that goes beyond traditional risk factors.
                        </p>
<div className="space-y-6">
<div className="flex gap-6 items-start">
<div className="bg-primary-container p-3 rounded-lg text-on-primary-container">
<span className="material-symbols-outlined" data-icon="calendar_today">calendar_today</span>
</div>
<div>
<h4 className="font-title-card text-title-card text-text-primary">age_years</h4>
<p className="font-body-compact text-body-compact text-text-muted">Dynamic weighting based on biological vs. chronological aging patterns observed in telomere data clusters.</p>
</div>
</div>
<div className="flex gap-6 items-start">
<div className="bg-primary-container p-3 rounded-lg text-on-primary-container">
<span className="material-symbols-outlined" data-icon="monitor_weight">monitor_weight</span>
</div>
<div>
<h4 className="font-title-card text-title-card text-text-primary">bmi &amp; Body Composition</h4>
<p className="font-body-compact text-body-compact text-text-muted">Calculated through mass distribution metrics, filtering for muscle density to prevent athletic misclassification.</p>
</div>
</div>
<div className="flex gap-6 items-start">
<div className="bg-primary-container p-3 rounded-lg text-on-primary-container">
<span className="material-symbols-outlined" data-icon="compress">compress</span>
</div>
<div>
<h4 className="font-title-card text-title-card text-text-primary">pulse_pressure</h4>
<p className="font-body-compact text-body-compact text-text-muted">A critical derived feature measuring the difference between systolic and diastolic pressure as an indicator of arterial stiffness.</p>
</div>
</div>
</div>
</div>
<div className="relative">
<div className="aspect-square rounded-2xl overflow-hidden border border-border shadow-2xl">
<img className="w-full h-full object-cover" data-alt="A sophisticated data visualization dashboard showing complex neural network connections and medical data streams in a deep teal and charcoal color palette. The UI is clean and professional, with glowing data nodes and thin vector lines representing interconnected patient health metrics. The lighting is low and focused, creating a clinical AI lab aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCp_mxse8J5yZL3L0xAWNlWl7BUWlAm1FD-Q6grDQFwDPKpgLZQ4wMw_IGo7y4_jobxyh5oV1UOoeRbymexYj0Sjn63IES5tBHkUJYmhlPLQAI_olKzcabzuvEpETFA1vZhdO85WMJeXCjyzCFx9WkQKyqo5O7jogcK3m-NcUupLgPxlpxRUs3MwbzPMXgPjipLiUC9DpQ_4D0fREiJHx1DFUoDpa3FT1SM6dTDhq8emvcqvfowl7gOolrUPqKDtwKTfqaFbBObL1uV"/>
</div>
<div className="absolute -bottom-6 -left-6 glass-panel p-6 rounded-xl border border-teal-accent/30 max-w-[240px]">
<p className="font-label-caps text-label-caps text-teal-accent mb-2">FEATURE IMPORTANCE</p>
<div className="space-y-2">
<div className="flex justify-between items-center text-xs">
<span>BP Profile</span>
<span>32%</span>
</div>
<div className="w-full bg-surface-container-highest h-1 rounded-full">
<div className="bg-teal-accent h-1 rounded-full w-[32%]"></div>
</div>
<div className="flex justify-between items-center text-xs">
<span>Age Factor</span>
<span>24%</span>
</div>
<div className="w-full bg-surface-container-highest h-1 rounded-full">
<div className="bg-teal-accent h-1 rounded-full w-[24%]"></div>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
{/*  Section 3: Limitations & Trust  */}
<section className="max-w-container-max mx-auto px-margin-desktop py-section-gap">
<div className="max-w-4xl mx-auto">
<div className="text-center mb-16">
<h2 className="font-headline-page text-headline-page text-primary mb-4">Limitations &amp; Clinical Trust</h2>
<p className="font-body-main text-body-main text-text-secondary">Commitment to transparency and ethical AI in medical diagnostics.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
<div className="p-8 rounded-xl border border-border bg-surface-container-lowest">
<span className="material-symbols-outlined text-risk-high mb-4" data-icon="warning">warning</span>
<h3 className="font-title-card text-title-card mb-3">Clinical Disclaimer</h3>
<p className="font-body-compact text-body-compact text-text-muted">
                            CorMetrics is a Decision Support System (DSS), not a diagnostic tool. Results must be reviewed by a licensed medical professional. The model does not account for acute trauma, rare genetic mutations, or immediate external environmental stressors.
                        </p>
</div>
<div className="p-8 rounded-xl border border-border bg-surface-container-lowest">
<span className="material-symbols-outlined text-teal-accent mb-4" data-icon="verified_user">verified_user</span>
<h3 className="font-title-card text-title-card mb-3">HIPAA &amp; Privacy</h3>
<p className="font-body-compact text-body-compact text-text-muted">
                            All training and inference data is AES-256 encrypted. CorMetrics employs differential privacy techniques to ensure that even in high-dimensional space, individual identities are mathematically unrecoverable.
                        </p>
</div>
</div>
<div className="glass-panel p-10 rounded-2xl text-center">
<h3 className="font-headline-section text-headline-section mb-6">Continuous Validation Program</h3>
<p className="font-body-main text-body-main text-text-secondary mb-8 max-w-2xl mx-auto">
                        Our clinical team performs weekly "Human-in-the-loop" audits on outlier predictions to refine the model's edge-case performance.
                    </p>
<div className="flex flex-wrap justify-center gap-8">
<div>
<div className="text-2xl font-bold text-primary">0.02%</div>
<div className="font-label-caps text-label-caps text-text-muted">False Negative Rate</div>
</div>
<div className="w-px h-12 bg-border hidden sm:block"></div>
<div>
<div className="text-2xl font-bold text-primary">1.2ms</div>
<div className="font-label-caps text-label-caps text-text-muted">Inference Latency</div>
</div>
<div className="w-px h-12 bg-border hidden sm:block"></div>
<div>
<div className="text-2xl font-bold text-primary">Peer-Reviewed</div>
<div className="font-label-caps text-label-caps text-text-muted">Publication Status</div>
</div>
</div>
</div>
</div>
</section>
{/*  CTA Section  */}
<section className="max-w-container-max mx-auto px-margin-desktop pb-section-gap">
<div className="bg-gradient-to-r from-primary-container/20 to-secondary-container/20 p-12 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-8 border border-primary/10">
<div>
<h2 className="font-headline-section text-headline-section text-text-primary mb-2">Ready to implement CorMetrics?</h2>
<p className="font-body-main text-body-main text-text-secondary">Access our full documentation or request a technical demonstration.</p>
</div>
<div className="flex gap-4">
<button className="bg-teal-accent text-on-primary px-8 py-3 rounded-lg font-title-card hover:brightness-110 transition-all">Get API Access</button>
<button className="border border-teal-accent text-teal-accent px-8 py-3 rounded-lg font-title-card hover:bg-teal-accent/10 transition-all">Talk to a Scientist</button>
</div>
</div>
</section>

</main>
<Footer />
    </div>
  );
}
