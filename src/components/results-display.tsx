'use client';
import { Card, CardContent } from './ui/card';
import { CheckCircle, XCircle } from 'lucide-react';

interface ResultsDisplayProps {
  isAiGenerated: boolean;
  confidence: number;
}

export function ResultsDisplay({ isAiGenerated, confidence }: ResultsDisplayProps) {
  const confidencePercentage = (confidence * 100).toFixed(1);

  return (
    <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-border/20 shadow-xl shadow-black/10 overflow-hidden rounded-2xl">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
            {isAiGenerated ? (
                <XCircle className="w-16 h-16 text-destructive mb-4" />
            ) : (
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            )}
            <h3 className="text-2xl font-bold mb-2">
                {isAiGenerated ? 'AI Generated Image Detected' : 'Likely a Real Image'}
            </h3>
            <p className="text-foreground/80 mb-6">
                Our analysis suggests this image was {isAiGenerated ? 'created by an AI model.' : 'not created by an AI model.'}
            </p>

            <div className="w-full bg-muted rounded-full h-2.5 mb-2">
                <div 
                    className={`h-2.5 rounded-full ${isAiGenerated ? 'bg-destructive' : 'bg-green-500'}`}
                    style={{ width: `${confidencePercentage}%` }}
                ></div>
            </div>
            <p className="text-sm font-medium text-foreground">
                Confidence: {confidencePercentage}%
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
