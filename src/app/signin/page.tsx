"use client";

import { Suspense } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import SignInForm from "@/components/auth/SignInForm";

export default function SignInPage() {
  return (
    <AuthLayout>
      <AuthCard
        title="Welcome back"
        description="Access your saved assessments and personalized heart health insights."
      >
        <Suspense fallback={
          <div className="flex justify-center p-4">
            <span className="material-symbols-outlined animate-spin text-primary text-2xl">
              progress_activity
            </span>
          </div>
        }>
          <SignInForm />
        </Suspense>
      </AuthCard>
    </AuthLayout>
  );
}

