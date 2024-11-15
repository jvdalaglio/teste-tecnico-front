import { useLoading } from "@/contexts/LoadingContext";
import { login, register } from "@/lib/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import cookieService from "@/app/api/cookie";
import { FirebaseError } from "firebase/app";
import {
  Alert,
  Button,
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
  const [error, setError] = useState("");
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  async function loginSubmit($event: React.FormEvent) {
    $event.preventDefault();
    setLoading(true);
    try {
      const userCredentials = login(email, password);
      const user = (await userCredentials).user;
      const token = await user.getIdToken();
      cookieService.setAccessToken("authToken", token, {
        maxAge: 3600,
        path: "/",
      });
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/dashboard");
      setLoading(false);
      setError("");
    } catch (err) {
      setLoading(false);
      setError("loginError");
    }
  }

  async function registerSubmit($event: React.FormEvent) {
    $event.preventDefault();
    setLoading(true);
    try {
      if (password !== confirmPassword) {
        setError("differentPassword");
        return;
      } else {
        setError("");
      }
      const userCredentials = register(email, password);
      const user = (await userCredentials).user;
      const token = await user.getIdToken();
      cookieService.setAccessToken("authToken", token, {
        maxAge: 3600,
        path: "/",
      });
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/dashboard");
    } catch (err) {
      const erro = err as FirebaseError;
      setError(erro.code);
      handleClick();
    }
  }

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-[url('/background.jpg')] bg-cover">
      <div className="xl:w-1/3 text-center flex flex-col gap-8 rounded-xl bg-ft-gray bg-opacity-50 items-center py-20">
        <Image src="/logo.jpg" width={100} height={100} alt="" />
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
                href={
                  props.typeSubmit === "register"
                    ? "/auth/login"
                    : "/auth/register"
                }
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
        {error === "auth/invalid-credential" && (
          <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={open} autoHideDuration={3000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity="error"
              variant="filled"
              sx={{ width: "100%" }}
            >
              Sua senha deve ter letras maiúsculas, minúsculas, números e caracteres especiais.
            </Alert>
          </Snackbar>
        )}
        {!error && props.typeSubmit === "register" && (
          <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={open} autoHideDuration={3000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity="success"
              variant="filled"
              sx={{ width: "100%" }}
            >
              Usuário cadastrado com sucesso!
            </Alert>
          </Snackbar>
        )}
      </div>
    </div>
  );
};
