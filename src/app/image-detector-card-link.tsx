import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ScanSearch } from 'lucide-react';

export function ImageDetectorCardLink() {
  return (
    <Link href="/image-detector" className={cn("image-detector-card-link")}>
      <span className="border-light top"></span>
      <span className="border-light right"></span>
      <span className="border-light bottom"></span>
      <span className="border-light left"></span>
      <div className="card-content">
        <span className="card-icon"><ScanSearch /></span>
        <div className="card-text">
          <h3 className="card-title">AI Image Detector</h3>
          <p className="card-desc">Advanced neural network forensics to distinguish AI-generated imagery from authentic photographs.</p>
        </div>
      </div>
    </Link>
  )
}
