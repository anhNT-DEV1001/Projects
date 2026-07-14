"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  ImagePlus,
  UserPlus,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiErrorMessage, registerUser } from "@/lib";

const USERNAME_PATTERN = /^[a-zA-Z0-9._]+$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

type Step = 1 | 2;

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  function validateStepOne() {
    if (fullName.trim().length < 2) {
      return "Họ và tên phải có ít nhất 2 ký tự.";
    }

    if (username.trim().length < 3 || !USERNAME_PATTERN.test(username.trim())) {
      return "Tài khoản chỉ chứa chữ cái, số, dấu chấm và dấu gạch dưới.";
    }

    if (password.length < 6) {
      return "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    if (password !== confirmPassword) {
      return "Mật khẩu nhập lại chưa trùng khớp.";
    }

    return "";
  }

  function validateStepTwo() {
    if (!email.trim()) {
      return "Vui lòng nhập email.";
    }

    if (!EMAIL_PATTERN.test(email.trim())) {
      return "Email không đúng định dạng.";
    }

    if (avatar && avatar.size > MAX_AVATAR_SIZE) {
      return "Avatar không được vượt quá 5MB.";
    }

    return "";
  }

  function goToStepTwo() {
    const message = validateStepOne();

    if (message) {
      setError(message);
      return;
    }

    setError("");
    setStep(2);
  }

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setAvatar(null);
      setAvatarPreview("");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Avatar chỉ hỗ trợ JPG, PNG hoặc WEBP.");
      setAvatar(null);
      setAvatarPreview("");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setError("Avatar không được vượt quá 5MB.");
      setAvatar(null);
      setAvatarPreview("");
      event.target.value = "";
      return;
    }

    setError("");
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const stepOneMessage = validateStepOne();
    const stepTwoMessage = step === 2 ? validateStepTwo() : "";
    const message = stepOneMessage || stepTwoMessage;

    if (message) {
      setError(message);
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      await registerUser({
        fullName,
        username,
        password,
        email,
        phone,
        gender,
        address,
        avatar,
      });
      toast.success("Đăng ký thành công. Vui lòng đăng nhập.");
      router.push("/login");
    } catch (err) {
      const errorMessage = getApiErrorMessage(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-2xl items-center">
        <section className="w-full rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <UserPlus className="size-5" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">Đăng ký tài khoản</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Hoàn thành 2 bước để tạo tài khoản mới.
                </p>
              </div>
            </div>

            <div className="flex w-full max-w-48 items-center gap-2 sm:pt-1">
              <div
                className={
                  step === 1
                    ? "h-2 flex-1 rounded-full bg-primary"
                    : "h-2 flex-1 rounded-full bg-primary/40"
                }
              />
              <div
                className={
                  step === 2
                    ? "h-2 flex-1 rounded-full bg-primary"
                    : "h-2 flex-1 rounded-full bg-muted"
                }
              />
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {step === 1 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="fullName">Họ và tên</Label>
                  <Input
                    id="fullName"
                    autoComplete="name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="username">Tài khoản</Label>
                  <Input
                    id="username"
                    autoComplete="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="nguyenvana"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Tối thiểu 6 ký tự"
                      className="pr-9"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="absolute right-0.5 top-0.5"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={
                        showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Nhập lại mật khẩu</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      placeholder="Nhập lại mật khẩu"
                      className="pr-9"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="absolute right-0.5 top-0.5"
                      onClick={() =>
                        setShowConfirmPassword((value) => !value)
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Ẩn mật khẩu nhập lại"
                          : "Hiện mật khẩu nhập lại"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    autoComplete="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+84901234567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Giới tính</Label>
                  <select
                    id="gender"
                    className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    value={gender}
                    onChange={(event) => setGender(event.target.value)}
                  >
                    <option value="">Không chọn</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Input
                    id="address"
                    autoComplete="street-address"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder="Ho Chi Minh City"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="avatar">Avatar</Label>
                  <div className="flex flex-col gap-3 rounded-lg border border-dashed p-4 sm:flex-row sm:items-center">
                    <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                      {avatarPreview ? (
                        <Image
                          alt="Avatar preview"
                          className="size-full object-cover"
                          height={80}
                          src={avatarPreview}
                          unoptimized
                          width={80}
                        />
                      ) : (
                        <ImagePlus className="size-7 text-muted-foreground" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-2">
                      <Input
                        id="avatar"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleAvatarChange}
                      />
                      <p className="text-xs text-muted-foreground">
                        Hỗ trợ JPG, PNG, WEBP. Dung lượng tối đa 5MB.
                      </p>
                    </div>

                    {avatar ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setAvatar(null);
                          setAvatarPreview("");
                        }}
                        aria-label="Xóa avatar"
                      >
                        <X className="size-4" />
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            )}

            {error ? (
              <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
              {step === 1 ? (
                <Link
                  className="inline-flex h-8 items-center justify-center rounded-lg px-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  href="/login"
                >
                  Đã có tài khoản
                </Link>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setError("");
                    setStep(1);
                  }}
                >
                  <ArrowLeft className="size-4" />
                  Quay lại
                </Button>
              )}

              {step === 1 ? (
                <Button type="button" onClick={goToStepTwo}>
                  Tiếp tục
                  <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Đang đăng ký..." : "Hoàn tất đăng ký"}
                </Button>
              )}
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
