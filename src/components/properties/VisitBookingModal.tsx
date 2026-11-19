'use client';

import { useEffect, useState } from 'react';
import { CalendarCheck, CheckCircle2, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toPersianDigits, validateVisitForm } from '@/lib/propertyLogic';
import { Advisor, Property } from '@/types/property';

interface VisitBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: Property;
  advisor: Advisor;
}

const VISIT_SLOTS = [
  'فردا · ساعت ۱۰ تا ۱۲',
  'فردا · ساعت ۱۶ تا ۱۸',
  'پس‌فردا · ساعت ۱۰ تا ۱۲',
  'آخر هفته · ساعت ۱۱ تا ۱۳',
];

export function VisitBookingModal({
  open,
  onOpenChange,
  property,
  advisor,
}: VisitBookingModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState(VISIT_SLOTS[0]);
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bookingCode, setBookingCode] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setErrors({});
    }
  }, [open]);

  useEffect(() => {
    setName('');
    setPhone('');
    setPreferredDate(VISIT_SLOTS[0]);
    setNote('');
    setErrors({});
    setBookingCode(null);
  }, [property.id]);

  const handleBookVisit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateVisitForm({ name, phone, preferredDate });
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setErrors({});
    const randomNum = 4100 + Math.floor(Math.random() * 5800);
    setBookingCode(`MT-V-${toPersianDigits(randomNum)}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid="visit-booking-modal"
        className="max-h-[90vh] overflow-y-auto p-5 sm:max-w-lg sm:p-6 max-sm:top-auto max-sm:bottom-0 max-sm:right-0 max-sm:left-0 max-sm:w-full max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-t-2xl max-sm:rounded-b-none"
      >
        <div className="mx-auto mb-1 h-1.5 w-12 rounded-full bg-border sm:hidden" aria-hidden="true" />

        <DialogHeader className="pl-8 text-right">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary">
            <CalendarCheck className="size-4 shrink-0" aria-hidden="true" />
            <span>درخواست زمان بازدید</span>
          </div>
          <DialogTitle className="font-heading text-xl font-bold text-foreground">
            هماهنگی بازدید حضوری
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm leading-6">
            ملک کد{' '}
            <span className="font-semibold text-foreground tabular-nums">
              {toPersianDigits(property.code)}
            </span>{' '}
            در {property.neighborhood} · همراهی با کارشناس{' '}
            <span className="font-semibold text-foreground">{advisor.name}</span>
          </DialogDescription>
        </DialogHeader>

        {bookingCode ? (
          <div
            role="status"
            data-testid="visit-booking-success"
            className="mt-2 space-y-4 rounded-xl border border-primary/30 bg-[#EAF1ED]/65 p-5 text-center"
          >
            <CheckCircle2 className="mx-auto size-10 text-primary" />
            <div className="space-y-1.5">
              <h3 className="font-heading text-lg font-bold text-primary">
                درخواست بازدید شما با موفقیت ثبت شد
              </h3>
              <p className="text-sm leading-6 text-foreground">
                کارشناس <strong>{advisor.name}</strong> برای هماهنگی نهایی بازدید ملک در بازه{' '}
                <strong>{preferredDate}</strong> با شما تماس می‌گیرد.
              </p>
            </div>
            <p className="text-xs font-medium text-muted-foreground tabular-nums">
              کد پیگیری رزرو: <strong className="text-foreground">{bookingCode}</strong>
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                onClick={() => onOpenChange(false)}
                className="min-h-[44px] flex-1 bg-primary text-sm font-semibold text-white hover:bg-[#14523E]"
              >
                متوجه شدم
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setBookingCode(null)}
                className="min-h-[44px] flex-1 text-xs font-semibold"
              >
                ثبت زمان جدید
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleBookVisit} noValidate className="mt-1 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="modal-visit-name">نام و نام خانوادگی</Label>
                <Input
                  id="modal-visit-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثلاً سارا محمدی"
                  aria-invalid={Boolean(errors.name)}
                  className="min-h-[44px] bg-white"
                />
                {errors.name && (
                  <p className="text-xs font-medium text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="modal-visit-phone">شماره موبایل</Label>
                <Input
                  id="modal-visit-phone"
                  type="tel"
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09123456789"
                  aria-invalid={Boolean(errors.phone)}
                  className="min-h-[44px] bg-white text-right"
                />
                {errors.phone && (
                  <p className="text-xs font-medium text-destructive">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="modal-visit-date">بازه زمانی پیشنهادی</Label>
              <Select
                value={preferredDate}
                onValueChange={(value) => setPreferredDate(value ?? VISIT_SLOTS[0])}
              >
                <SelectTrigger id="modal-visit-date" className="min-h-[44px] w-full bg-white">
                  <SelectValue>{preferredDate}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {VISIT_SLOTS.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.preferredDate && (
                <p className="text-xs font-medium text-destructive">{errors.preferredDate}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="modal-visit-note">یادداشت برای مشاور (اختیاری)</Label>
              <Textarea
                id="modal-visit-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="نکات مدنظر یا ساعت دقیق‌تر برای بازدید..."
                rows={2}
                className="bg-white"
              />
            </div>

            <div className="flex flex-col gap-2.5 pt-1">
              <Button
                type="submit"
                className="min-h-[46px] w-full text-sm font-semibold bg-primary text-primary-foreground hover:bg-[#14523E]"
              >
                تایید و رزرو زمان بازدید
              </Button>
              <a
                href={`tel:${advisor.phone}`}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-border bg-secondary/45 text-xs font-semibold text-foreground hover:border-primary hover:text-primary"
              >
                <Phone className="size-3.5 text-primary" aria-hidden="true" />
                <span>تماس تلفنی سریع:</span>
                <span dir="ltr" className="tabular-nums">
                  {toPersianDigits(advisor.phone)}
                </span>
              </a>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
