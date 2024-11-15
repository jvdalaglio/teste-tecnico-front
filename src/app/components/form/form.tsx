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
    async function fetchToken() {
      const response = await fetch("/api/auth/get-cookie");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          router.push("/dashboard");
        }
        setHaveToken(data.success);
      } else {
        setHaveToken(false);
      }
    }

    fetchToken();
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

  const action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleClose}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  const setTokenCookies = async (token: string) => {
    await fetch("/api/auth/set-cookie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    }).then((res) => res.json());
  };

  const loginSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const userCredentials = await login(email, password);
      const user = userCredentials.user;

      const token = await user.getIdToken();
      await setTokenCookies(token);
      setHaveToken(true);
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/dashboard");
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
      await setTokenCookies(token);
      setHaveToken(true);
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/dashboard");
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
          <div className="xl:w-1/3 text-center flex flex-col gap-8 rounded-xl bg-ft-gray bg-opacity-50 items-center py-20">
            <Image src="/logo.webp" width={100} height={100} alt="" />
            <h1 className="text-[2rem] text-ft-secondary font-bold">
              Bem-vindo ao Finan Track
            </h1>
            <form
              className="bg-ft-primary p-8 rounded-xl"
              onSubmit={
                props.typeSubmit === "register" ? registerSubmit : loginSubmit
              }
              method="post"
            >
              <div className=" flex flex-col items-center gap-8">
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
                      data-tooltip-target="tooltip-light"
                      data-tooltip-style="light"
                    />
                    {error === "differentPassword" && (
                      <p className="text-red-500 pt-3">
                        ❗ As senhas não são iguais.
                      </p>
                    )}
                  </div>
                )}
                <button
                  type="submit"
                  className="bg-ft-platinum text-ft-tertiary py-2 rounded-lg w-full"
                >
                  {props.typeSubmit === "register" ? "Registrar" : "Entrar"}
                </button>
                <div>
                  <p>
                    {props.typeSubmit === "register"
                      ? "Já possui uma conta?"
                      : "Não possui uma conta?"}
                  </p>
                  <a
                    href={props.typeSubmit === "register" ? "/auth/login" : "/auth/register"}
                    className="underline underline-offset-4"
                  >
                    {props.typeSubmit === "register" ? "Faça login" : "Registre-se"}
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
      ) : (
        <div>TESTE</div>
      )}
    </div>
  );
};
