'use client';

import { Button } from '@/components/ui/button';
import { useAppShell } from '@/hooks/useAppShell';

export function ConsultationTriggerButton({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const { setConsultationOpen } = useAppShell();

  return (
    <Button
      type="button"
      onClick={() => setConsultationOpen(true)}
      className={className}
    >
      {label}
    </Button>
  );
}
