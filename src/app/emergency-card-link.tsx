import Link from 'next/link';
import { cn } from '@/lib/utils';

export function EmergencyCardLink() {
  return (
    <Link href="/emergency-help" className={cn("emergency-card-link")}>
      <span className="border-light top"></span>
      <span className="border-light right"></span>
      <span className="border-light bottom"></span>
      <span className="border-light left"></span>
      <div className="emergency-card-content">
        <span className="emergency-card-icon">🛡️</span>
        <div className="emergency-card-text">
          <h3 className="emergency-card-title">Emergency Help Center</h3>
          <p className="emergency-card-desc">If you are a victim of image-based abuse, get help here.</p>
        </div>
      </div>
    </Link>
  )
}
