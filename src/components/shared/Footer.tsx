export default function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-outline-variant/20 mt-auto">
      <div className="w-full py-section-padding px-gutter max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-stack-md">
        <div className="space-y-4 text-center md:text-left">
          <div className="font-headline-md text-headline-md font-bold text-primary">Cardio Risk Predictor</div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xs">
            AI-driven cardiovascular intelligence for clinical and personal health screening.
          </p>
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <span className="w-2 h-2 bg-risk-low rounded-full animate-pulse"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-tighter">
              Model Status: Online
            </span>
          </div>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-12 gap-y-4">
          <div className="flex flex-col gap-4">
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">
              Terms of Service
            </a>
          </div>
          <div className="flex flex-col gap-4">
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">
              HIPAA Compliance
            </a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">
              API Status
            </a>
          </div>
        </nav>
        <div className="text-center md:text-right">
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            &copy; {new Date().getFullYear()} Cardio Risk Predictor AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
