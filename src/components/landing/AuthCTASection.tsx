import Link from "next/link";

export default function AuthCTASection() {
  return (
    <section className="py-12 bg-primary">
      <div className="max-w-container-max mx-auto px-gutter flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-on-primary text-center md:text-left">
          <h3 className="font-headline-md text-[24px] font-bold mb-2">Join 12,000+ users monitoring their heart health.</h3>
          <p className="font-body-md text-sm opacity-80">Take the first step toward preventive cardiac care today.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/signin">
            <button className="bg-surface text-primary px-8 py-3 rounded-lg font-label-md text-sm font-semibold hover:bg-surface-bright transition-all cursor-pointer">
              Sign In
            </button>
          </Link>
          <Link href="/signup">
            <button className="bg-secondary text-on-secondary px-8 py-3 rounded-lg font-label-md text-sm font-semibold hover:shadow-lg transition-all cursor-pointer">
              Create Account
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
