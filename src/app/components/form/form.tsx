import { useLoading } from "@/contexts/LoadingContext";
import { login, register } from "@/lib/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FirebaseError } from "firebase/app";
import {
  Alert,
  IconButton,
  Snackbar,
  SnackbarCloseReason,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  getAccessTokenFromCookie,
  setAccessTokenInCookie
} from "@/app/api/cookieService";

type Props = {
  typeSubmit: string;
};

export const Form = (props: Props) => {
  const { setLoading } = useLoading();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [haveToken, setHaveToken] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkToken() {
      try {
        const data = await getAccessTokenFromCookie();
        if (data?.success) {
          router.push("/home");
        }
        setHaveToken(data?.success || false);
      } catch (err) {
        console.error("Error checking token:", err);
        setHaveToken(false);
      }
    }

    checkToken();
  }, [router]);

  if (haveToken === null) {
    return null;
  }

  const handleClick = () => setOpen(true);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const loginSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const userCredentials = await login(email, password);
      const user = userCredentials.user;

      const token = await user.getIdToken();
      await setAccessTokenInCookie(token);
      setHaveToken(true);
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/home");
      setError(null);
    } catch (err) {
      setError("loginError");
    } finally {
      setLoading(false);
    }
  };

  const registerSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    if (password !== confirmPassword) {
      setError("differentPassword");
      setLoading(false);
      return;
    }

    try {
      const userCredentials = await register(email, password);
      const user = userCredentials.user;

      const token = await user.getIdToken();
      await setAccessTokenInCookie(token);
      setHaveToken(true);
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/home");
      setError(null);
    } catch (err) {
      const firebaseError = err as FirebaseError;
      setError(firebaseError.code);
      handleClick();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!haveToken ? (
        <div className="h-screen w-screen flex justify-center items-center bg-[url('/background.webp')] bg-cover">
          <div className="h-full grid place-items-center md:w-[40%]">
            <div className="grid place-items-center p-8 max-h-100 w-full bg-ft-gray bg-opacity-70 rounded text-ft-secondary text-lg font-bold">
              <Image src="/logo.webp" width={100} height={100} alt="" />
              <h1 className="text-[20px] text-ft-secondary font-bold">
                Bem-vindo ao Finan Track
              </h1>
              <form
                onSubmit={
                  props.typeSubmit === "register" ? registerSubmit : loginSubmit
                }
                method="post"
              >
                <div className="grid place-items-center gap-2 sm:gap-4">
                  <span>
                    {props.typeSubmit === "register" ? "Registrar" : "Login"}
                  </span>
                  <input
                    type="email"
                    className="bg-ft-secondary text-ft-platinum py-2 px-4 rounded-lg"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    type="password"
                    className="bg-ft-secondary text-ft-platinum py-2 px-4 rounded-lg"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {props.typeSubmit === "register" && (
                    <div>
                      <input
                        type="password"
                        className="bg-ft-secondary text-ft-platinum py-2 px-4 rounded-lg"
                        placeholder="Confirme sua senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      {error === "differentPassword" && (
                        <p className="text-red-500 pt-3">
                          ❗ As senhas não são iguais.
                        </p>
                      )}
                    </div>
                  )}
                  <div className="text-center">
                    <button
                      type="submit"
                      className="bg-ft-platinum text-ft-tertiary py-2 rounded-lg w-full mb-4"
                    >
                      {props.typeSubmit === "register" ? "Registrar" : "Entrar"}
                    </button>
                    <p>
                      {props.typeSubmit === "register"
                        ? "Já possui uma conta?"
                        : "Não possui uma conta?"}
                    </p>
                    <a
                      href={
                        props.typeSubmit === "register"
                          ? "/auth/login"
                          : "/auth/register"
                      }
                      className="underline underline-offset-4"
                    >
                      {props.typeSubmit === "register"
                        ? "Faça login"
                        : "Registre-se"}
                    </a>
                  </div>
                </div>
              </form>
              {error === "loginError" && (
                <p className="text-ft-platinum font-bold bg-red-700 bg-opacity-50 py-2 px-4 rounded-lg">
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};
