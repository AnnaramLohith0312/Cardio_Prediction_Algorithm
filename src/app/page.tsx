"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden">
      <style>{`
        /* Navy Gradient Animation */
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .bg-animated-navy {
          background: radial-gradient(circle at center, var(--surface-color) 0%, var(--bg-color) 100%);
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
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
      `}</style>

      <Navbar />

      {/* 2. Full-viewport Hero Section */}
      <section className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center bg-animated-navy py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* ECG Background Animation overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <svg className="w-full h-64 text-[var(--interactive-teal)]" viewBox="0 0 1000 200" preserveAspectRatio="none">
            <path 
              className="ecg-line"
              d="M0 100 L 200 100 L 230 40 L 280 170 L 330 20 L 380 180 L 410 100 L 600 100 L 630 60 L 680 150 L 730 30 L 780 190 L 810 100 L 1000 100" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="4" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-[var(--text-2xl)] font-[var(--font-display)] text-[var(--text-color)] tracking-tight leading-[1.1]">
            Know Your Heart Risk <br className="hidden sm:block" />
            <span className="text-[var(--accent-red)]">Before It's Too Late</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-[var(--text-lg)] text-[var(--text-muted)] font-light leading-relaxed">
            Medical-grade cardiovascular screening powered by advanced machine learning models. 
            Instantly predict your disease probability with non-invasive clinical inputs.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={() => router.push("/assessment")}
              className="w-full sm:w-auto px-8 py-4 rounded-[var(--radius-lg)] bg-[var(--interactive-teal)] hover:bg-[var(--interactive-hover)] text-white text-[var(--text-base)] font-bold shadow-[var(--shadow-lg)] transition-all hover:scale-105 active:scale-95"
            >
              Predict Now
            </button>
            <button 
              onClick={() => router.push("/dashboard")}
              className="w-full sm:w-auto px-8 py-4 rounded-[var(--radius-lg)] border-2 border-[var(--interactive-teal)] text-[var(--interactive-teal)] hover:bg-[var(--interactive-teal)] hover:text-white text-[var(--text-base)] font-bold shadow-[var(--shadow-md)] transition-all hover:scale-105 active:scale-95"
            >
              View Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* 3. Stat Row Section */}
      <section className="border-y border-[var(--border-color)] bg-[var(--surface-color)] relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[var(--border-color)]">
            <div className="flex flex-col items-center justify-center p-4">
              <span className="text-[var(--text-2xl)] font-bold text-[var(--interactive-teal)]">73,000+</span>
              <span className="text-[var(--text-sm)] text-[var(--text-muted)] font-medium uppercase tracking-wider mt-2">Patients Analyzed</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <span className="text-[var(--text-2xl)] font-bold text-[var(--interactive-teal)]">72%</span>
              <span className="text-[var(--text-sm)] text-[var(--text-muted)] font-medium uppercase tracking-wider mt-2">Average Model Accuracy</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <span className="text-[var(--text-2xl)] font-bold text-[var(--interactive-teal)]">5</span>
              <span className="text-[var(--text-sm)] text-[var(--text-muted)] font-medium uppercase tracking-wider mt-2">ML Models Compared</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Feature Section (Asymmetric Layout) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-[var(--text-xl)] font-[var(--font-display)] text-[var(--text-color)]">
            Advanced Intelligence for Your Heart
          </h2>
          <p className="text-[var(--text-base)] text-[var(--text-muted)] max-w-2xl mx-auto">
            Our platform utilizes multiple machine learning pipelines to give you the most accurate prediction possible without invasive testing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Feature 1: Full width card (12 cols) */}
          <div className="md:col-span-12 p-8 rounded-[var(--radius-xl)] bg-[var(--surface-color)] border border-[var(--border-color)] shadow-[var(--shadow-md)] flex flex-col md:flex-row items-center gap-8 group hover:border-[var(--interactive-teal)] transition-all">
            <div className="flex-1 space-y-4">
              <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-[var(--interactive-teal)]/10 flex items-center justify-center text-[var(--interactive-teal)]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <h3 className="text-[var(--text-lg)] font-bold text-[var(--text-color)]">Multi-Model Comparison</h3>
              <p className="text-[var(--text-base)] text-[var(--text-muted)]">
                We don't rely on a single algorithm. We run your data through Random Forest, Logistic Regression, Decision Trees, SVM, and KNN simultaneously to find the consensus prediction, ensuring maximum reliability.
              </p>
            </div>
            <div className="w-full md:w-1/3 aspect-video bg-[var(--bg-color)] rounded-[var(--radius-lg)] border border-[var(--border-color)] flex items-center justify-center relative overflow-hidden">
              {/* Dummy chart graphic */}
              <div className="absolute bottom-0 w-full h-1/2 flex items-end justify-between px-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <div className="w-1/6 bg-[var(--interactive-teal)] h-[40%] rounded-t-sm" />
                <div className="w-1/6 bg-[var(--interactive-teal)] h-[70%] rounded-t-sm" />
                <div className="w-1/6 bg-[var(--interactive-teal)] h-[60%] rounded-t-sm" />
                <div className="w-1/6 bg-[var(--interactive-teal)] h-[90%] rounded-t-sm" />
                <div className="w-1/6 bg-[var(--interactive-teal)] h-[85%] rounded-t-sm" />
              </div>
            </div>
          </div>

          {/* Feature 2: Half width (6 cols) */}
          <div className="md:col-span-6 p-8 rounded-[var(--radius-xl)] bg-[var(--surface-color)] border border-[var(--border-color)] shadow-[var(--shadow-md)] hover:border-[var(--interactive-teal)] transition-all">
            <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-[var(--accent-red)]/10 flex items-center justify-center text-[var(--accent-red)] mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="text-[var(--text-lg)] font-bold text-[var(--text-color)] mb-3">Instant Risk Score</h3>
            <p className="text-[var(--text-base)] text-[var(--text-muted)]">
              Get immediate feedback. Our AI processes your vitals and lifestyle habits in milliseconds to generate an easy-to-understand percentage risk score.
            </p>
          </div>

          {/* Feature 3: Half width (6 cols) */}
          <div className="md:col-span-6 p-8 rounded-[var(--radius-xl)] bg-[var(--surface-color)] border border-[var(--border-color)] shadow-[var(--shadow-md)] hover:border-[var(--interactive-teal)] transition-all">
            <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-[var(--accent-green)]/10 flex items-center justify-center text-[var(--accent-green)] mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="text-[var(--text-lg)] font-bold text-[var(--text-color)] mb-3">BMI Auto-Calc</h3>
            <p className="text-[var(--text-base)] text-[var(--text-muted)]">
              No need to do the math. Simply input your height and weight, and our system automatically calculates and utilizes your precise BMI for predictions.
            </p>
          </div>

          {/* Feature 4: Full width (12 cols) */}
          <div className="md:col-span-12 p-8 rounded-[var(--radius-xl)] bg-[var(--surface-color)] border border-[var(--border-color)] shadow-[var(--shadow-md)] flex items-start gap-6 hover:border-[var(--interactive-teal)] transition-all">
            <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-[var(--interactive-teal)]/10 flex-shrink-0 flex items-center justify-center text-[var(--interactive-teal)]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            </div>
            <div>
              <h3 className="text-[var(--text-lg)] font-bold text-[var(--text-color)] mb-2">Clinical-Grade Inputs</h3>
              <p className="text-[var(--text-base)] text-[var(--text-muted)]">
                Our model utilizes 11 specific clinical parameters including Systolic/Diastolic Blood Pressure, Cholesterol Levels, Glucose, and explicit lifestyle factors (smoking/alcohol) to ensure medical-grade accuracy that aligns with actual hospital screening standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA Banner Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full mb-12">
        <div className="rounded-[var(--radius-xl)] bg-[var(--bg-color)] border border-[var(--border-color)] p-12 text-center shadow-[var(--shadow-lg)] relative overflow-hidden">
          {/* subtle decoration */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[var(--interactive-teal)] opacity-5 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-[var(--accent-red)] opacity-5 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            <h2 className="text-[var(--text-xl)] font-[var(--font-display)] text-[var(--text-color)]">
              Ready to Check Your Risk?
            </h2>
            <p className="text-[var(--text-base)] text-[var(--text-muted)] max-w-lg mx-auto">
              Join thousands of users who have taken control of their heart health. It takes less than 2 minutes.
            </p>
            <div className="pt-4">
              <button 
                onClick={() => router.push("/assessment")}
                className="px-8 py-4 rounded-[var(--radius-lg)] bg-[var(--interactive-teal)] hover:bg-[var(--interactive-hover)] text-white text-[var(--text-base)] font-bold shadow-[var(--shadow-lg)] transition-all hover:scale-105 active:scale-95"
              >
                Start Prediction
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
