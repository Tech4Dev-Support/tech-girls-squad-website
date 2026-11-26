"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import CustomButton from "@/components/UI/CustomButton";

interface VerifyResponse {
  success: boolean;
  category: "success" | "failed" | "processing" | "unknown" | "invalid";
  status?: string;
  reference?: string;
  amount?: number;
  expectedAmount?: number | null;
  customer?: string;
  copiesForMe?: number;
  copiesToGift?: number;
  orderType?: "Purchase" | "Gift" | "Donation" | string;
  error?: string;
}

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_DURATION_MS = 60_000;

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference =
    searchParams.get("reference") || searchParams.get("trxref") || "";

  const [state, setState] = useState<
    | { kind: "loading" }
    | { kind: "processing_timeout"; reference: string }
    | { kind: "success"; data: VerifyResponse }
    | { kind: "error"; message: string; reference?: string }
  >(() =>
    reference
      ? { kind: "loading" }
      : {
        kind: "error",
        message: "No payment reference was provided.",
      }
  );

  useEffect(() => {
    if (!reference) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const startedAt = Date.now();

    const verify = async () => {
      try {
        const res = await fetch(
          `/api/payments/verify/${encodeURIComponent(reference)}`,
          { cache: "no-store" }
        );
        const data = (await res.json()) as VerifyResponse;

        if (cancelled) return;

        if (data.category === "success") {
          setState({ kind: "success", data });
          return;
        }

        if (data.category === "failed") {
          router.replace("/order/failed");
          return;
        }

        if (data.category === "processing") {
          if (Date.now() - startedAt >= MAX_POLL_DURATION_MS) {
            setState({ kind: "processing_timeout", reference });
            return;
          }
          timeoutId = setTimeout(verify, POLL_INTERVAL_MS);
          return;
        }

        setState({
          kind: "error",
          reference,
          message:
            data.error ||
            "We couldn't verify this payment reference. Please check your email or reach out to us.",
        });
      } catch (err) {
        console.error("Payment verification request failed:", err);
        if (cancelled) return;

        if (Date.now() - startedAt < MAX_POLL_DURATION_MS) {
          timeoutId = setTimeout(verify, POLL_INTERVAL_MS);
          return;
        }

        setState({ kind: "processing_timeout", reference });
      }
    };

    verify();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [reference, router]);

  if (state.kind === "loading") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 py-12 text-center">
        <div
          aria-hidden="true"
          className="h-14 w-14 rounded-full border-4 border-[#F9EAF2] border-t-primary animate-spin"
        />
        <div className="space-y-2 max-w-md">
          <h1 className="text-dark text-3xl md:text-4xl font-fredoka font-bold">
            Confirming your payment...
          </h1>
          <p className="text-foreground font-manrope text-base md:text-lg">
            Please wait a moment while we verify your transaction.
          </p>
        </div>
      </main>
    );
  }

  if (state.kind === "processing_timeout") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 py-12 text-center">
        <div className="w-full max-w-xl space-y-6">
          <h1 className="text-dark text-3xl md:text-5xl font-fredoka font-bold leading-[110%]">
            Still confirming your payment.
          </h1>
          <p className="text-dark font-manrope text-base md:text-lg">
            Your payment is taking a little longer than usual to confirm. Your
            reference is{" "}
            <span className="text-primary font-semibold">{state.reference}</span>{" "}
            — we&apos;ll email your confirmation once it clears, or you can
            reach us at{" "}
            <a
              href="mailto:techgirlssquad@tech4dev.com"
              className="text-primary hover:underline"
            >
              techgirlssquad@tech4dev.com
            </a>
            .
          </p>
          <div className="pt-2">
            <Link href="/">
              <CustomButton>Back to Tech Girls Squad</CustomButton>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (state.kind === "error") {
    return (
      <main className="min-h-screen flex flex-col md:flex-row gap-9 items-center justify-center py-8 px-4 md:p-16">
        <div className="w-full h-full max-w-65 md:max-w-169.5">
          <Image
            src="/payment-failed.png"
            alt="Verification issue"
            width={1000}
            height={1000}
            className="w-full object-center object-cover"
            priority
          />
        </div>
        <div className="w-full md:max-w-149.5 flex flex-col items-center md:items-start gap-5 md:gap-6 text-center md:text-start">
          <h1 className="text-dark text-[28px] md:text-[56px] font-fredoka font-bold leading-[110%]">
            We couldn&apos;t confirm that payment.
          </h1>
          <p className="text-dark font-manrope font-normal text-[15px] md:text-lg">
            {state.message}
          </p>
          {state.reference && (
            <p className="text-dark font-manrope font-normal text-[15px] md:text-lg">
              Reference: <span className="text-primary">{state.reference}</span>
            </p>
          )}
          <Link href="/" className="w-full! md:w-fit!">
            <CustomButton className="w-full! md:w-fit! text-lg!">
              Back to Tech Girls Squad
            </CustomButton>
          </Link>
          <p className="text-dark font-manrope font-normal text-[13px] md:text-base">
            Need help?{" "}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="mailto:techgirlssquad@tech4dev.com"
              className="text-primary"
            >
              techgirlssquad@tech4dev.com
            </Link>
          </p>
        </div>
      </main>
    );
  }

  // Success states matching the updated /donation/success, /order, and /order/gift designs
  const { data } = state;
  const displayReference = data.reference || reference;
  const customerEmail = data.customer || "";
  const copiesForMe = Number(data.copiesForMe ?? 0);
  const copiesToGift = Number(data.copiesToGift ?? 0);
  const amountNaira = Math.round(Number(data.amount ?? 0) / 100);
  const isDonation = data.orderType === "Donation";

  // 1. Donation success (matches /donation/success)
  if (isDonation) {
    return (
      <main className="min-h-screen flex flex-col md:flex-row gap-9 items-center justify-center py-8 px-3 md:p-16">
        <div className="w-full h-full max-w-65 md:max-w-169.5">
          <Image
            src="/donation-success.png"
            alt="donation success"
            width={1000}
            height={1000}
            className="w-full object-center object-cover"
            priority
          />
        </div>

        <div className="w-full md:max-w-149.5 flex flex-col items-center md:items-start gap-5 md:gap-6 text-center md:text-start">
          <h2 className="text-dark text-[28px] md:text-[56px] font-fredoka font-bold leading-[110%]">
            Thank you for backing the next volume.
          </h2>

          {customerEmail && (
            <p className="text-dark font-manrope font-normal text-[15px] md:text-lg">
              We&apos;ve sent a confirmation to{" "}
              <span className="text-primary">{customerEmail}.</span>
            </p>
          )}

          <div className="w-full bg-section rounded-xl flex flex-col py-2 px-5 gap-1">
            <div className="w-full flex items-center justify-between py-3">
              <h5 className="text-sm md:text-lg text-dark font-normal">
                Reference
              </h5>
              <h4 className="text-sm md:text-lg text-dark font-semibold">
                {displayReference}
              </h4>
            </div>

            <div className="w-full flex items-center justify-between border-t border-[#00000014] py-3">
              <h5 className="text-sm md:text-lg text-dark font-normal">
                Amount
              </h5>
              <h4 className="text-sm md:text-lg text-dark font-semibold">
                ₦{amountNaira.toLocaleString()}
              </h4>
            </div>
          </div>

          <p className="text-dark font-manrope font-normal text-[15px] md:text-lg">
            Your support helps us write the next volume and put it in more
            girls&rsquo; hands.
          </p>

          <Link href="/" className="w-full! md:w-fit!">
            <CustomButton className="w-full! md:w-fit! text-lg!">
              Back to Tech Girls Squad
            </CustomButton>
          </Link>

          <p className="text-dark font-manrope font-normal text-[13px] md:text-base">
            Need help?{" "}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="mailto:techgirlssquad@tech4dev.com"
              className="text-primary"
            >
              techgirlssquad@tech4dev.com
            </Link>
          </p>
        </div>
      </main>
    );
  }

  // 2. Purchase success (matches /order, with extra gift rows if copiesToGift > 0)
  if (copiesForMe > 0) {
    return (
      <main className="min-h-screen flex flex-col md:flex-row gap-9 items-center justify-center py-8 px-3 md:p-16">
        <div className="w-full h-full max-w-65 md:max-w-169.5">
          <Image
            src="/order.png"
            alt="order"
            width={1000}
            height={1000}
            className="w-full object-center object-cover"
            priority
          />
        </div>

        <div className="w-full md:max-w-149.5 flex flex-col items-center md:items-start gap-5 md:gap-6 text-center md:text-start">
          <h2 className="text-dark text-[28px] md:text-[56px] font-fredoka font-bold leading-[110%]">
            Thank you for your order.
          </h2>

          {customerEmail && (
            <p className="text-dark font-manrope font-normal text-[15px] md:text-lg">
              We&apos;ve sent a confirmation to{" "}
              <span className="text-primary">{customerEmail}.</span>
            </p>
          )}

          <div className="w-full bg-section rounded-xl flex flex-col py-2 px-5 gap-1">
            <div className="w-full flex items-center justify-between py-3">
              <h5 className="text-sm md:text-lg text-dark font-normal">
                Order number
              </h5>
              <h4 className="text-sm md:text-lg text-dark font-semibold">
                {displayReference}
              </h4>
            </div>

            <div className="w-full flex items-center justify-between border-t border-[#00000014] py-3">
              <h5 className="text-sm md:text-lg text-dark font-normal">
                Copies
              </h5>
              <h4 className="text-sm md:text-lg text-dark font-semibold">
                {copiesForMe}
              </h4>
            </div>

            {copiesToGift > 0 && (
              <>
                <div className="w-full flex items-center justify-between border-t border-[#00000014] py-3">
                  <h5 className="text-sm md:text-lg text-dark font-normal">
                    Gifted copies
                  </h5>
                  <h4 className="text-sm md:text-lg text-dark font-semibold">
                    {copiesToGift}
                  </h4>
                </div>

                <div className="w-full flex items-center justify-between border-t border-[#00000014] py-3">
                  <h5 className="text-sm md:text-lg text-dark font-normal">
                    Goes to
                  </h5>
                  <h4 className="text-sm md:text-lg text-dark font-semibold">
                    Girls or school libraries in need
                  </h4>
                </div>
              </>
            )}

            <div className="w-full flex items-center justify-between border-t border-[#00000014] py-3">
              <h5 className="text-sm md:text-lg text-dark font-normal">
                Delivery
              </h5>
              <h4 className="text-sm md:text-lg text-dark font-semibold">
                Within 7 working days
              </h4>
            </div>
          </div>

          <Link href="/" className="w-full! md:w-fit!">
            <CustomButton className="w-full! md:w-fit! text-lg!">
              Back to Tech Girls Squad
            </CustomButton>
          </Link>

          <p className="text-dark font-manrope font-normal text-[13px] md:text-base">
            Need help?{" "}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="mailto:techgirlssquad@tech4dev.com"
              className="text-primary"
            >
              techgirlssquad@tech4dev.com
            </Link>
          </p>
        </div>
      </main>
    );
  }

  // 3. Gift-only order (matches /order/gift)
  return (
    <main className="min-h-screen flex flex-col md:flex-row gap-9 items-center justify-center py-8 px-4 md:p-16">
      <div className="w-full h-full max-w-65 md:max-w-169.5">
        <Image
          src="/order-gift.png"
          alt="order"
          width={1000}
          height={1000}
          className="w-full object-center object-cover"
          priority
        />
      </div>

      <div className="w-full md:max-w-149.5 flex flex-col items-center md:items-start gap-5 md:gap-6 text-center md:text-start">
        <h2 className="text-dark text-[28px] md:text-[56px] font-fredoka font-bold leading-[110%]">
          Thank you for your order.
        </h2>

        {customerEmail && (
          <p className="text-dark font-manrope font-normal text-[15px] md:text-lg">
            We&apos;ve sent a confirmation to{" "}
            <span className="text-primary">{customerEmail}.</span>
          </p>
        )}

        <div className="w-full bg-section rounded-xl flex flex-col py-2 px-5 gap-1">
          <div className="w-full flex items-center justify-between py-3">
            <h5 className="text-sm md:text-lg text-dark font-normal">
              Order number
            </h5>
            <h4 className="text-sm md:text-lg text-dark font-semibold">
              {displayReference}
            </h4>
          </div>

          <div className="w-full flex items-center justify-between border-b border-t border-[#00000014] py-3">
            <h5 className="text-sm md:text-lg text-dark font-normal">Copies</h5>
            <h4 className="text-sm md:text-lg text-dark font-semibold">
              {copiesToGift}
            </h4>
          </div>

          <div className="w-full flex items-center justify-between py-3">
            <h5 className="text-sm md:text-lg text-dark font-normal">
              Goes to
            </h5>
            <h4 className="text-sm md:text-lg text-dark font-semibold">
              Girls or school libraries in need
            </h4>
          </div>
        </div>

        <Link href="/" className="w-full! md:w-fit!">
          <CustomButton className="w-full! md:w-fit! text-lg!">
            Back to Tech Girls Squad
          </CustomButton>
        </Link>

        <p className="text-dark font-manrope font-normal text-[13px] md:text-base">
          Need help?{" "}
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="mailto:techgirlssquad@tech4dev.com"
            className="text-primary"
          >
            techgirlssquad@tech4dev.com
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 py-12 text-center">
          <div
            aria-hidden="true"
            className="h-14 w-14 rounded-full border-4 border-[#F9EAF2] border-t-primary animate-spin"
          />
          <p className="text-foreground font-manrope text-base md:text-lg">
            Confirming your payment...
          </p>
        </main>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}
