"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TopNavBar from "@/components/shared/TopNavBar";
import Footer from "@/components/shared/Footer";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden bg-background text-on-background selection:bg-teal-accent/30 font-body-main">
      <style dangerouslySetInnerHTML={{__html: `
        /* CorMetrics ECG Grid */
        .ecg-grid {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
        }
        /* ECG Line Animation */
        .ecg-line {
          stroke-dasharray: 2000;
          stroke-dashoffset: 2000;
          animation: dash 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes dash {
          0% { stroke-dashoffset: 2000; }
          100% { stroke-dashoffset: 0; }
        }
        .glass-panel {
          background: rgba(28, 32, 32, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .grid-overlay { background-size: 40px 40px; background-image: linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px); }
`}} />

      <TopNavBar />
<main className="flex-grow">

{/*  Hero Section  */}
<section className="relative min-h-[90vh] flex items-center overflow-hidden pt-12">
<div className="absolute inset-0 grid-overlay z-0"></div>
<div className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-1 md:grid-cols-12 gap-gutter items-center relative z-10">
<div className="md:col-span-7 space-y-8">
<div className="space-y-4 transition-all duration-700 opacity-100 translate-y-0">
<span className="font-label-caps text-label-caps text-teal-accent tracking-widest block">AI-POWERED CARDIOVASCULAR SCREENING</span>
<h1 className="font-display-hero text-display-hero md:text-display-hero text-text-primary leading-tight">
                            Detect heart risk earlier with <br/>
<span className="text-primary italic">intelligent clinical screening.</span>
</h1>
<p className="font-body-main text-body-main text-text-muted max-w-xl">CorMetrics leverages an ensemble ML pipeline to provide precise, clinical-grade cardiovascular risk assessments in seconds. Designed for modern practitioners.</p>
</div>
<div className="flex flex-wrap gap-4 pt-4 transition-all duration-700 opacity-100 translate-y-0">
<button className="bg-teal-accent text-white font-title-card text-title-card px-8 py-4 rounded-xl hover:brightness-110 transition-all shadow-lg shadow-teal-accent/20 flex items-center gap-2">
                            Start Risk Assessment
                            <span className="material-symbols-outlined text-[18px]" data-icon="arrow_forward">arrow_forward</span>
</button>
<button className="border border-border text-text-primary font-title-card text-title-card px-8 py-4 rounded-xl hover:bg-surface-container-high transition-all">
                            View Dashboard
                        </button>
</div>
</div>
<div className="md:col-span-5 relative h-[500px] flex items-center justify-center">
{/*  Cinematic Visual  */}
<div className="w-full h-full relative glass-panel rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center bg-surface-container-lowest/50 transition-all duration-700 opacity-100 translate-y-0">
{/*  ECG Animation Background  */}
<svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 800 400">
<path className="ecg-line fill-none stroke-teal-accent stroke-2" d="M0,200 L100,200 L115,180 L130,220 L145,200 L250,200 L265,100 L280,300 L295,200 L400,200 L415,180 L430,220 L445,200 L550,200 L565,50 L580,350 L595,200 L800,200"></path>
</svg>
{/*  Floating Diagnostic Card  */}
<div className="absolute top-12 left-8 glass-panel p-6 rounded-xl border-l-4 border-risk-high animate-pulse transition-all">
<div className="flex justify-between items-start gap-4">
<div>
<p className="font-label-caps text-label-caps text-text-muted mb-1 uppercase">Patient Risk Index</p>
<h3 className="font-headline-section text-headline-section text-risk-high">High Alert (84%)</h3>
</div>
<span className="material-symbols-outlined text-risk-high" data-icon="warning" >warning</span>
</div>
</div>
{/*  Data Panels  */}
<div className="absolute bottom-12 right-8 glass-panel p-5 rounded-xl space-y-3 w-64 shadow-xl">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
<span className="material-symbols-outlined text-on-primary-container" data-icon="neurology">neurology</span>
</div>
<div>
<p className="font-label-caps text-label-caps text-text-muted">Ensemble Model</p>
<p className="text-body-compact font-semibold">Active Monitoring</p>
</div>
</div>
<div className="h-[2px] w-full bg-border"></div>
<div className="space-y-2">
<div className="flex justify-between text-xs">
<span className="text-text-muted">Confidence</span>
<span className="text-teal-accent">99.2%</span>
</div>
<div className="w-full bg-surface-container h-1 rounded-full overflow-hidden">
<div className="bg-teal-accent h-full w-[99%]"></div>
</div>
</div>
</div>
<img alt="Clinical Diagnostic Interface" className="w-full h-full object-cover mix-blend-overlay opacity-40" data-alt="A highly professional and cinematic medical visualization showing a dark, high-contrast cardiovascular diagnostic interface. The image features glowing teal and deep navy tones, with digital pulse waves and clinical data overlays. The lighting is low-key and dramatic, emphasizing medical precision and advanced AI technology within a sterile clinical environment. The atmosphere is intelligent and reassuring." src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6aVzMU19_Dhoep70imy3m_Lpa6349oLMpmwSfu1VlgHDy53XN0PDFAUJdU0gzcWmgYAAykjvne4IbGa9Bm3-AmXOJGUPdoEdP4imzid0p8n48NfCMbDaoZTseR2igI1naJbuHcRlKfayuB2w66TSkCn_gYImaBcNKRhwInz_5kAUV6Aq8HLs54VY-rVzZQDGvcrsPEFOZR3TzlDxLeNO5FNHr-d77s86eCRrbvq6wmH-U4vQ-Q6U2_xQOGxh3dycg123D9svjGO8T"/>
</div>
</div>
</div>
</section>
{/*  How It Works  */}
<section className="py-section-gap bg-surface-container-lowest">
<div className="max-w-container-max mx-auto px-margin-desktop">
<div className="mb-16 text-center max-w-2xl mx-auto">
<h2 className="font-headline-page text-headline-page text-text-primary mb-4">Why Clinicians Trust CorMetrics</h2>
<p className="text-text-muted">Our multi-stage diagnostic process ensures clinical reliability by combining diverse data inputs with verified neural architectures.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
{/*  Step 1  */}
<div className="group relative p-8 rounded-2xl bg-surface-container-low border border-border hover:border-teal-accent/40 transition-all hover:bg-surface-container duration-700 opacity-100 translate-y-0">
<div className="w-12 h-12 rounded-lg bg-teal-accent/10 flex items-center justify-center mb-6 text-teal-accent group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined" data-icon="input">input</span>
</div>
<h3 className="font-title-card text-title-card text-text-primary mb-3">1. Data Entry</h3>
<p className="font-body-compact text-body-compact text-text-muted">Import clinical vitals, patient history, and biomarker data through our secure, HIPAA-compliant interface.</p>
<span className="absolute top-4 right-8 font-display-hero text-[60px] opacity-5 text-on-surface">01</span>
</div>
{/*  Step 2  */}
<div className="group relative p-8 rounded-2xl bg-surface-container-low border border-border hover:border-teal-accent/40 transition-all hover:bg-surface-container duration-700 opacity-100 translate-y-0">
<div className="w-12 h-12 rounded-lg bg-teal-accent/10 flex items-center justify-center mb-6 text-teal-accent group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined" data-icon="psychology">psychology</span>
</div>
<h3 className="font-title-card text-title-card text-text-primary mb-3">2. AI Analysis</h3>
<p className="font-body-compact text-body-compact text-text-muted">Our ensemble ML pipeline cross-references data against 4.2M clinical records to identify subtle risk patterns.</p>
<span className="absolute top-4 right-8 font-display-hero text-[60px] opacity-5 text-on-surface">02</span>
</div>
{/*  Step 3  */}
<div className="group relative p-8 rounded-2xl bg-surface-container-low border border-border hover:border-teal-accent/40 transition-all hover:bg-surface-container duration-700 opacity-100 translate-y-0">
<div className="w-12 h-12 rounded-lg bg-teal-accent/10 flex items-center justify-center mb-6 text-teal-accent group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined" data-icon="fact_check">fact_check</span>
</div>
<h3 className="font-title-card text-title-card text-text-primary mb-3">3. Guided Results</h3>
<p className="font-body-compact text-body-compact text-text-muted">Receive a structured diagnostic summary with actionable risk scores and recommended clinical pathways.</p>
<span className="absolute top-4 right-8 font-display-hero text-[60px] opacity-5 text-on-surface">03</span>
</div>
</div>
</div>
</section>
{/*  Why Clinicians Trust It  */}
<section className="py-section-gap relative">
<div className="max-w-container-max mx-auto px-margin-desktop flex flex-col md:flex-row gap-16 items-center">
<div className="md:w-1/2">
<div className="relative w-full aspect-square rounded-3xl overflow-hidden glass-panel transition-all duration-700 opacity-100 translate-y-0">
<img alt="Clinical Data Visualization" className="w-full h-full object-cover opacity-60" data-alt="A clean and professional medical research setting showing a clinician interacting with a large, high-resolution diagnostic screen. The screen displays complex 3D heart modeling and real-time ensemble model calculations. The color scheme is dominated by sophisticated teal accents and deep clinical grays. The lighting is bright but soft, conveying a sense of trustworthiness, advanced science, and clinical authority." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtRSoeDjyavfC2H7cY-ufNYHCRnasYV1IZt-CSp4f4hxZSpCe85wbHI159ftB5rz2Aj56MRZeBSihSzlP-a31Zzv8E9_FKyP-UwonxjDMFlFW2lkjymfC5hfTqZoBqeym9dnRlZDI2pJh2RQekvdtFSti_KbcD21mn85ITIo63HZjyVammSw9Oa6wvsfhxPnblRQsCw-Ke60dvF9fHCW679e3WonycBGERzxnYmTHc_xr3BWXojFXnAA3PRRR3QE9U7kb9eK0MxtAw"/>
<div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
<div className="absolute bottom-8 left-8 right-8 p-6 glass-panel rounded-xl">
<p className="font-label-caps text-label-caps text-teal-accent mb-2">VALIDATED ACCURACY</p>
<h4 className="font-headline-section text-headline-section text-text-primary mb-2">98.4% Sensitivity</h4>
<p className="text-sm text-text-muted">In multi-center clinical validation trials across 12 hospitals.</p>
</div>
</div>
</div>
<div className="md:w-1/2 space-y-8">
<h2 className="font-headline-page text-headline-page text-text-primary">Why Clinicians Trust CorMetrics</h2>
<p className="text-text-muted">Unlike black-box algorithms, our platform provides explainable AI outputs, allowing cardiologists to understand exactly which biomarkers triggered a high-risk warning.</p>
<div className="space-y-6 transition-all duration-700 opacity-100 translate-y-0">
<div className="flex gap-4">
<div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-primary-container flex items-center justify-center">
<span className="material-symbols-outlined text-[14px] text-on-primary-container" data-icon="check" >check</span>
</div>
<div>
<h4 className="font-title-card text-title-card text-text-primary">Ensemble Model Strategy</h4>
<p className="text-body-compact text-text-muted">We combine four distinct neural architectures to eliminate bias and maximize predictive accuracy.</p>
</div>
</div>
<div className="flex gap-4">
<div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-primary-container flex items-center justify-center">
<span className="material-symbols-outlined text-[14px] text-on-primary-container" data-icon="check" >check</span>
</div>
<div>
<h4 className="font-title-card text-title-card text-text-primary">Data-Driven Explainability</h4>
<p className="text-body-compact text-text-muted">Visualize feature importance and contributing factors for every individual risk assessment.</p>
</div>
</div>
<div className="flex gap-4">
<div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-primary-container flex items-center justify-center">
<span className="material-symbols-outlined text-[14px] text-on-primary-container" data-icon="check" >check</span>
</div>
<div>
<h4 className="font-title-card text-title-card text-text-primary">Clinical Integration</h4>
<p className="text-body-compact text-text-muted">Built for FHIR/HL7 standards to integrate seamlessly with your existing EHR system.</p>
</div>
</div>
</div>
</div>
</div>
</section>
{/*  CTA Footer  */}
<section className="py-section-gap">
<div className="max-w-container-max mx-auto px-margin-desktop">
<div className="glass-panel p-12 md:p-20 rounded-[2rem] text-center space-y-8 relative overflow-hidden">
<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-accent to-transparent transition-all duration-700 opacity-100 translate-y-0"></div>
<h2 className="font-display-hero text-display-hero md:text-headline-page text-text-primary max-w-3xl mx-auto">Advance your practice with predictive heart care.</h2>
<div className="flex flex-wrap justify-center gap-6 transition-all duration-700 opacity-100 translate-y-0">
<button className="bg-teal-accent text-white font-title-card text-title-card px-10 py-4 rounded-xl hover:scale-[1.02] transition-all">Start Trial Assessment</button>
<button className="border border-border text-text-primary font-title-card text-title-card px-10 py-4 rounded-xl hover:bg-surface-container-high transition-all">Contact Sales</button>
</div>
<div className="flex justify-center gap-8 pt-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-700 opacity-100 translate-y-0">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-teal-accent" data-icon="verified_user">verified_user</span>
<span className="font-label-caps text-label-caps">HIPAA COMPLIANT</span>
</div>
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-teal-accent" data-icon="health_and_safety">health_and_safety</span>
<span className="font-label-caps text-label-caps">GDPR SECURE</span>
</div>
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-teal-accent" data-icon="medical_services">medical_services</span>
<span className="font-label-caps text-label-caps">CLINICAL GRADE AI</span>
</div>
</div>
</div>
</div>
</section>

</main>
<Footer />
    </div>
  );
}
