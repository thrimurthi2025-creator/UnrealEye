import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export function EmergencyCardLink() {
  return (
    <Link href="/emergency-help" className={cn("emergency-card-link-new")}>
      <div className="card-content-new">
        <span className="card-icon-new">🛡️</span>
        <div className="card-text-new">
          <h3 className="card-title-new">Emergency Help Center</h3>
          <p className="card-desc-new">If you are a victim of image-based abuse, get help here.</p>
        </div>
        <ArrowRight className="card-arrow-new" />
      </div>
    </Link>
  )
}
