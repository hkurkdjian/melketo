'use client';

import { useEffect, useState } from 'react';
import {
  Bookmark,
  CheckCircle2,
  LogOut,
  MessageSquareText,
  Phone,
  ShieldCheck,
  User,
} from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import {
  formatNumberFa,
  toPersianDigits,
  validateIranianPhone,
  validateOtpCode,
} from '@/lib/propertyLogic';

export interface UserProfile {
  name: string;
  phone: string;
}

interface AuthProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserProfile | null;
  favoritesCount: number;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
  onOpenFavorites: () => void;
  onOpenConsultation: () => void;
}

export function AuthProfileDialog({
  open,
  onOpenChange,
  user,
  favoritesCount,
  onLogin,
  onLogout,
  onOpenFavorites,
  onOpenConsultation,
}: AuthProfileDialogProps) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setError(null);
      setStep('phone');
      setOtp('');
    }
  }, [open]);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateIranianPhone(phone)) {
      setError('لطفاً شماره موبایل معتبر ۱۱ رقمی با ۰۹ وارد کنید.');
      return;
    }
    if (name.trim().length < 2) {
      setError('لطفاً نام و نام خانوادگی خود را وارد کنید.');
      return;
    }
    setError(null);
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateOtpCode(otp)) {
      setError('کد تایید ۴ رقمی را وارد کنید (کد آزمایشی: ۱۲۳۴).');
      return;
    }
    setError(null);
    onLogin({
      name: name.trim(),
      phone: phone.trim(),
    });
    setStep('phone');
    setOtp('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid="auth-profile-dialog"
        className="max-h-[90vh] overflow-y-auto p-5 sm:max-w-md sm:p-6 max-sm:top-auto max-sm:bottom-0 max-sm:right-0 max-sm:left-0 max-sm:w-full max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-t-2xl max-sm:rounded-b-none"
      >
        <div className="mx-auto mb-1 h-1.5 w-12 rounded-full bg-border sm:hidden" aria-hidden="true" />

        {user ? (
          <div className="space-y-5">
            <DialogHeader className="pl-8 text-right">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                <ShieldCheck className="size-4" aria-hidden="true" />
                <span>حساب کاربری ملک تو</span>
              </div>
              <DialogTitle className="font-heading text-xl font-bold text-foreground">
                پروفایل کاربری
              </DialogTitle>
              <DialogDescription>
                مدیریت املاک نشان‌شده و درخواست‌های مشاوره شما
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-3.5 rounded-xl border border-border bg-secondary/40 p-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-white font-heading text-lg font-bold">
                {user.name.slice(0, 1)}
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="font-heading text-base font-bold text-foreground truncate">
                  {user.name}
                </p>
                <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
                  <Phone className="size-3.5 text-primary" aria-hidden="true" />
                  <span dir="ltr">{toPersianDigits(user.phone)}</span>
                </p>
              </div>
              <CheckCircle2 className="size-5 shrink-0 text-primary" aria-hidden="true" />
            </div>

            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                onOpenFavorites();
              }}
              className="flex min-h-[56px] w-full items-center justify-between gap-3 rounded-xl border border-border bg-white p-3.5 text-right transition-colors hover:border-primary/40 tabular-nums"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF1ED] text-primary">
                  <Bookmark className="size-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-heading text-base font-bold text-foreground">
                    {formatNumberFa(favoritesCount)}
                  </p>
                  <p className="text-[11px] text-muted-foreground">ملک نشان‌شده</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-primary">مشاهده فهرست</span>
            </button>

            <Separator />

            <div className="space-y-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  onOpenConsultation();
                }}
                className="min-h-[44px] w-full gap-2 text-sm font-semibold"
              >
                <MessageSquareText className="size-4 text-primary" aria-hidden="true" />
                <span>ثبت درخواست مشاوره اختصاصی</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  onLogout();
                  onOpenChange(false);
                }}
                className="min-h-[44px] w-full gap-2 text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="size-4" aria-hidden="true" />
                <span>خروج از حساب کاربری</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <DialogHeader className="pl-8 text-right">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                <User className="size-4" aria-hidden="true" />
                <span>حساب کاربری</span>
              </div>
              <DialogTitle className="font-heading text-xl font-bold text-foreground">
                {step === 'phone' ? 'ورود یا ثبت‌نام در ملک تو' : 'تایید شماره موبایل'}
              </DialogTitle>
              <DialogDescription>
                {step === 'phone'
                  ? 'برای ذخیره همیشگی فایل‌ها و پیگیری درخواست‌های بازدید وارد شوید.'
                  : `کد تایید ۴ رقمی ارسال‌شده به شماره ${toPersianDigits(phone)} را وارد کنید.`}
              </DialogDescription>
            </DialogHeader>

            {step === 'phone' ? (
              <form onSubmit={handleSendCode} noValidate className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="auth-name">نام و نام خانوادگی</Label>
                  <Input
                    id="auth-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثلاً مهسا کریمی"
                    className="min-h-[44px] bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="auth-phone">شماره موبایل</Label>
                  <Input
                    id="auth-phone"
                    type="tel"
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09123456789"
                    className="min-h-[44px] bg-white text-right"
                  />
                </div>

                {error && <p className="text-xs font-medium text-destructive">{error}</p>}

                <Button
                  type="submit"
                  className="min-h-[46px] w-full text-sm font-semibold bg-primary text-white hover:bg-[#14523E]"
                >
                  دریافت کد تایید
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} noValidate className="space-y-4">
                <div className="rounded-lg border border-primary/20 bg-[#EAF1ED]/60 px-3.5 py-2.5 text-xs text-primary">
                  برای ورود سریع می‌توانید کد آزمایشی <strong className="tabular-nums">۱۲۳۴</strong> را وارد کنید.
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="auth-otp">کد تایید ۴ رقمی</Label>
                  <Input
                    id="auth-otp"
                    type="text"
                    inputMode="numeric"
                    dir="ltr"
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="1234"
                    className="min-h-[44px] bg-white text-center text-lg font-bold tracking-[0.5em]"
                  />
                </div>

                {error && <p className="text-xs font-medium text-destructive">{error}</p>}

                <div className="flex flex-col gap-2">
                  <Button
                    type="submit"
                    className="min-h-[46px] w-full text-sm font-semibold bg-primary text-white hover:bg-[#14523E]"
                  >
                    تایید و ورود به حساب
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setStep('phone');
                      setError(null);
                    }}
                    className="min-h-[40px] w-full text-xs text-muted-foreground"
                  >
                    تغییر شماره موبایل
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
