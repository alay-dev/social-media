import { GOOGLE_CLIENT_ID } from "@/config";
import { useContext, createContext, useEffect, useState, ReactNode } from "react";

export function AuthenticationProvider({ children }: { children?: ReactNode }) {
  return <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>{children}</GoogleOAuthProvider>;
}

export function useLoadGSIScript(options?: { nonce?: string; onSuccess?: () => void; onError?: () => void }): boolean {
  const [hasScriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");

    script.id = "gsi-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.defer = true;
    script.nonce = options?.nonce;

    script.onload = () => {
      setScriptLoaded(true);
      options?.onSuccess?.();
    };
    script.onerror = () => {
      setScriptLoaded(false);
      options?.onError?.();
    };

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return hasScriptLoaded;
}

export type GoogleOAuthContext = {
  clientId: string;
  isLoaded: boolean;
};

export const GoogleOAuthContext = createContext<GoogleOAuthContext | undefined>(undefined);
GoogleOAuthContext.displayName = "GoogleOAuthContext";

export function GoogleOAuthProvider({ clientId, children }: { clientId: string; children?: ReactNode }) {
  const isLoaded = useLoadGSIScript();
  const value = { clientId, isLoaded };
  return <GoogleOAuthContext.Provider value={value}>{children}</GoogleOAuthContext.Provider>;
}

export function useGoogleOAuth() {
  const context = useContext(GoogleOAuthContext);
  if (!context) throw new Error("Please wrap your component in Authentication Provider");
  return context;
}

export type UseInitializeGoogleAuthentication = {
  prompt?: boolean;
  button?: HTMLElement | null;
  onError?: () => void;
  onSuccess?: (response: string) => void;
};

export function useInitializeGoogleAuthentication({ prompt, button, onSuccess, onError }: UseInitializeGoogleAuthentication) {
  const context = useGoogleOAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!context.isLoaded) return;
    window.google?.accounts.id.initialize({
      client_id: context.clientId,
      callback: (response: Google.CredentialResponse) => {
        if (!response.credential) return onError?.();
        onSuccess?.(response.credential);
      },
    });
    setIsInitialized(true);
  }, [context]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isInitialized || !button) return;
    try {
      window.google?.accounts.id.renderButton(button, { type: "standard", shape: "rectangular", theme: "outline" });
    } catch (error) {
      console.log(error);
    }
  }, [isInitialized, button]);

  useEffect(() => {
    if (!prompt || !isInitialized) return;
    try {
      window.google?.accounts.id.prompt();
    } catch (error) {
      console.log(error);
    }
  }, [prompt, isInitialized]);

  return isInitialized;
}
