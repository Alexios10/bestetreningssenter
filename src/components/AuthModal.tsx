import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  actionMessage?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  actionMessage = "authenticate",
}) => {
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Reset all form fields and tab when modal closes
  useEffect(() => {
    if (!isOpen) {
      setActiveTab("login");
      // Clear all form fields
      setLoginEmail("");
      setLoginPassword("");
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
      setConfirmPassword("");
      setShowPassword(false);
    }
  }, [isOpen]);

  // Reset fields when tab changes
  useEffect(() => {
    // Clear fields when switching tabs
    if (activeTab === "login") {
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
      setConfirmPassword("");
    } else {
      setLoginEmail("");
      setLoginPassword("");
    }
    setShowPassword(false);
  }, [activeTab]);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(loginEmail, loginPassword);
      toast.success("Innlogging vellykket!");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(
        "Innlogging mislyktes. Vennligst prøv igjen senere eller kontakt utvikleren."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerPassword !== confirmPassword) {
      toast.error("Passordene stemmer ikke overens");
      return;
    }

    setIsLoading(true);

    try {
      await register(registerName, registerEmail, registerPassword);
      setSuccessMessage(
        "Registreringen er vellykket! Sjekk e-posten din for å bekrefte kontoen din."
      );
      setActiveTab("login"); // Switch to login tab
      // Do NOT close the modal
      // onSuccess?.();
      // onClose();
    } catch (error) {
      toast.error("Registreringen mislyktes. Prøv på nytt.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    setIsLoading(true);
    try {
      toast.success("Bekreftelses-e-post sendt på nytt! Sjekk innboksen din.");
    } catch (error) {
      toast.error(
        "Kunne ikke sende bekreftelses-e-posten på nytt. Prøv på nytt."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => !isLoading && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Logg inn for å fortsette
          </DialogTitle>
          <DialogDescription className="text-center">
            Du må være logget inn for å {actionMessage}
          </DialogDescription>
        </DialogHeader>

        {successMessage && (
          <div className="mb-4 p-2 rounded bg-green-100 text-green-800 text-center font-medium">
            {successMessage}
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Logg in</TabsTrigger>
            <TabsTrigger value="register">Registrer</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">E-post</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Passord</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logger inn..." : "Logg inn"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="mt-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">Navn</Label>
                <Input
                  id="register-name"
                  type="text"
                  placeholder="Ole Nordmann"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email">E-post</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="navn@eksempel.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password">Passord</Label>
                <div className="relative">
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    minLength={6}
                    className="pr-10"
                  />
                  <span className="text-gray-400 text-xs ml-1">
                    Bruk minst 8 tegn, inkludert en stor bokstav, et tall og et
                    symbol.
                  </span>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Bekreft Passord</Label>
                <Input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Oppretter konto..." : "Registrer"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-4 flex flex-col items-center">
          <span className="text-gray-500 mb-2">eller</span>
          <button
            onClick={() =>
              (window.location.href = `https://trainingcentersapi-production.up.railway.app/api/auth/google-login`)
            }
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center gap-2"
            // disabled={isLoading}
            disabled={true} // Temporarily disabled until Google login is fixed
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="h-5 w-5"
            />
            Kommer snart
          </button>
        </div>

        <DialogFooter className="mt-4 flex justify-center">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Avbryt
          </Button>
        </DialogFooter>

        {/* Show resend button only after successful registration */}
        {successMessage && activeTab === "login" && (
          <div className="mt-4 text-center">
            <button
              onClick={handleResendConfirmation}
              className="text-sm text-blue-600 hover:underline"
              disabled={isLoading}
            >
              Send bekreftelses-e-post på nytt
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
