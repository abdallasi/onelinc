const ONELINC_RESET_ORIGIN = "https://onelinc.xyz";

export const getPasswordResetRedirectUrl = () => {
  const hostname = window.location.hostname;
  const isLocal = hostname === "localhost" || hostname === "127.0.0.1";
  const isOnelincDomain = hostname === "onelinc.xyz" || hostname.endsWith(".onelinc.xyz");
  const origin = isLocal || isOnelincDomain ? window.location.origin : ONELINC_RESET_ORIGIN;

  return `${origin}/reset-password`;
};

export const getResetRequestErrorMessage = (message?: string) => {
  const normalized = message?.toLowerCase() || "";

  if (normalized.includes("rate") || normalized.includes("too many")) {
    return "Too many reset attempts. Please wait a minute, then try again.";
  }

  if (normalized.includes("redirect") || normalized.includes("not allowed")) {
    return "Reset emails are not accepting the Onelinc link yet. Please try again after the reset domain is approved.";
  }

  return "We could not send a reset email right now. Please try again.";
};

export const getResetLinkErrorMessage = (message?: string) => {
  const normalized = message?.toLowerCase() || "";

  if (normalized.includes("expired") || normalized.includes("invalid") || normalized.includes("otp")) {
    return "This reset link has expired or was already used. Request a fresh link below.";
  }

  return "This reset link could not be verified. Request a fresh link below.";
};