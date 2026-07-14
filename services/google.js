export function initialiseGoogleLogin(clientId, onSuccess) {
  if (!clientId) throw new Error("Add your Google OAuth client ID in Settings first.");
  const start = () => google.accounts.id.initialize({ client_id:clientId, callback:onSuccess });
  if (window.google?.accounts) return start();
  const script = document.createElement("script"); script.src="https://accounts.google.com/gsi/client"; script.async=true; script.onload=start; document.head.append(script);
}
