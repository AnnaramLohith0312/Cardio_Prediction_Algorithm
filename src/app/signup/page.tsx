import AuthLayout from "@/components/auth/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import SignUpForm from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <AuthLayout>
      <AuthCard
        title="Create Account"
        description="Access personalized assessments and monitor heart health risk metrics."
      >
        <SignUpForm />
      </AuthCard>
    </AuthLayout>
  );
}
