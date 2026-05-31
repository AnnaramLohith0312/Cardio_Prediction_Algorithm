import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-8 border-t border-border bg-surface-container-low mt-auto">
      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-component-gap">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <span className="font-title-card text-title-card text-on-surface">CorMetrics</span>
          <p className="font-metadata text-metadata text-text-muted max-w-md">
            © {new Date().getFullYear()} CorMetrics. For clinical decision support only. Not a replacement for professional medical advice.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          <Link href="/privacy" className="font-metadata text-metadata text-text-muted hover:text-on-surface transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="font-metadata text-metadata text-text-muted hover:text-on-surface transition-colors">Terms of Service</Link>
          <Link href="/compliance" className="font-metadata text-metadata text-text-muted hover:text-on-surface transition-colors">HIPAA Compliance</Link>
          <Link href="/support" className="font-metadata text-metadata text-text-muted hover:text-on-surface transition-colors">Contact Support</Link>
        </div>
      </div>
    </footer>
  );
}
