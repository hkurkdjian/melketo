'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
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
import { toPersianDigits, validateConsultationForm } from '@/lib/propertyLogic';

interface ConsultationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const REQUEST_LABELS: Record<'buy' | 'rent' | 'sell', string> = {
  buy: 'مشاوره خرید ملک',
  rent: 'مشاوره رهن و اجاره',
  sell: 'سپاری و کارشناسی فروش ملک',
};

export function ConsultationDialog({ open, onOpenChange }: ConsultationDialogProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [requestType, setRequestType] = useState<'buy' | 'rent' | 'sell'>('buy');
  const [neighborhood, setNeighborhood] = useState('');
  const [details, setDetails] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateConsultationForm({ name, phone, neighborhood });
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setErrors({});
    const code = 2100 + Math.floor(Math.random() * 7800);
    setSubmittedCode(`AS-C-${toPersianDigits(code)}`);
  };

  const resetAndClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      setErrors({});
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-lg p-6">
        <DialogHeader className="pl-8 text-right">
          <DialogTitle className="font-heading text-xl font-bold text-foreground">
            ثبت درخواست مشاوره و کارشناسی ملک
          </DialogTitle>
          <DialogDescription>
            مشخصات ملک مدنظر یا درخواست سپاری خود را ثبت کنید تا کارشناس تخصصی همان محله با شما تماس بگیرد.
          </DialogDescription>
        </DialogHeader>

        {submittedCode ? (
          <div
            role="status"
            className="mt-4 rounded-xl border border-primary/30 bg-[#EAF1ED]/60 p-6 text-center space-y-3"
          >
            <CheckCircle2 className="mx-auto size-10 text-primary" />
            <h4 className="font-heading text-lg font-bold text-primary">
              درخواست شما با موفقیت ثبت شد
            </h4>
            <p className="text-sm leading-6 text-foreground">
              {name} گرامی، درخواست <strong>{REQUEST_LABELS[requestType]}</strong> برای محدوده{' '}
              <strong>{neighborhood}</strong> به کارشناس ارشد دپارتمان ارجاع داده شد.
            </p>
            <p className="text-xs text-muted-foreground tabular-nums">
              کد پیگیری: <strong className="text-foreground">{submittedCode}</strong>
            </p>
            <div className="pt-2 flex justify-center gap-2">
              <Button
                type="button"
                onClick={() => {
                  setSubmittedCode(null);
                  setName('');
                  setPhone('');
                  setNeighborhood('');
                  setDetails('');
                  onOpenChange(false);
                }}
                className="h-10 px-6 bg-primary text-primary-foreground"
              >
                بستن پنجره
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="consult-name">نام و نام خانوادگی</Label>
                <Input
                  id="consult-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثلاً علیرضا رضایی"
                  aria-invalid={Boolean(errors.name)}
                  className="h-10"
                />
                {errors.name && (
                  <p className="text-xs font-medium text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="consult-phone">شماره تماس</Label>
                <Input
                  id="consult-phone"
                  type="tel"
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09123456789"
                  aria-invalid={Boolean(errors.phone)}
                  className="h-10 text-right"
                />
                {errors.phone && (
                  <p className="text-xs font-medium text-destructive">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="consult-type">نوع درخواست</Label>
                <Select
                  value={requestType}
                  onValueChange={(value) =>
                    setRequestType((value ?? 'buy') as 'buy' | 'rent' | 'sell')
                  }
                >
                  <SelectTrigger id="consult-type" className="h-10 w-full">
                    <SelectValue>{REQUEST_LABELS[requestType]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">مشاوره خرید ملک</SelectItem>
                    <SelectItem value="rent">مشاوره رهن و اجاره</SelectItem>
                    <SelectItem value="sell">سپاری و کارشناسی فروش ملک</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="consult-neighborhood">محله یا محدوده</Label>
                <Input
                  id="consult-neighborhood"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="مثلاً زعفرانیه، شهرک غرب"
                  aria-invalid={Boolean(errors.neighborhood)}
                  className="h-10"
                />
                {errors.neighborhood && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.neighborhood}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="consult-details">شرح بودجه، متراژ یا ویژگی‌های مدنظر</Label>
              <Textarea
                id="consult-details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="متراژ تقریبی، تعداد خواب، بودجه یا نکات مورد انتظار..."
              />
            </div>

            <Button
              type="submit"
              className="h-11 w-full text-sm font-semibold bg-primary text-primary-foreground hover:bg-[#14523E]"
            >
              ثبت و ارسال درخواست مشاوره
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
