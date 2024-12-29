"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useInitializeGoogleAuthentication } from "@/context/authentication";
import { GOOGLE_LOGIN, LOGIN } from "@/graphql/mutation";
import { useAppStore } from "@/store/store";
import { User } from "@/types/user";
import { useMutation } from "@apollo/client";
import { Field, Form, Formik } from "formik";
import { useRef } from "react";

type Props = {
  setAuthType: (val: string) => void;
};

export type LoginInput = {
  email: string;
  password: string;
};

const Login = ({ setAuthType }: Props) => {
  const [login] = useMutation<{ login: User }>(LOGIN);
  const [loginWithGoogle] = useMutation<{ googleLogin: User }>(GOOGLE_LOGIN);
  const { setUser, setAuthenticated } = useAppStore((state) => state);
  const initializeGoogle = useRef<HTMLDivElement | null>(null);

  const onGoogleAuthenticationSuccess = async (access_token: string) => {
    try {
      const response = await fetch("/api/google-oauth", {
        method: "POST",
        body: JSON.stringify({
          token: access_token,
        }),
      });

      const userInfo = await response.json();

      const { email, name, picture } = userInfo;
      const { data } = await loginWithGoogle({ variables: { email, name, avatar: picture } });

      if (!data) return;
      setAuthenticated(true);
      setUser(data?.googleLogin.id);
      localStorage.setItem("auth", data?.googleLogin.id);
    } catch (error) {
      console.log(error);
    }
  };

  useInitializeGoogleAuthentication({
    button: initializeGoogle.current,
    prompt: true,
    onSuccess: async (access_token) => {
      await onGoogleAuthenticationSuccess(access_token);
    },
    onError: () => {
      // toast.enqueue({ title: "Unable to authenticate with Google", description: errorMessages.genericApiError, variant: "destructive" });
    },
  });

  const onLogin = async (values: LoginInput) => {
    try {
      const { data } = await login({ variables: values });
      if (!data) return;
      setAuthenticated(true);
      setUser(data?.login.id);
      localStorage.setItem("auth", data?.login.id);
    } catch (error) {
      console.log(error);
    }
  };

  const initialValues = {
    email: "",
    password: "",
  };

  return (
    <div className="lg:max-w-md w-full">
      <h3 className="text-gray-800 text-3xl font-extrabold mb-8">Login</h3>
      <div className="flex items-center justify-center ">
        <div className="col-span-2 sm:col-span-1 relative overflow-hidden h-12 rounded-lg flex items-center justify-center px-4">
          <div ref={initializeGoogle} id="google-login" className="rounded-xl"></div>
        </div>
      </div>
      <Separator className="my-5" />

      <Formik initialValues={initialValues} onSubmit={onLogin}>
        <Form className="lg:max-w-md w-full">
          <div className="space-y-6">
            <div>
              <label className="text-gray-800 text-sm mb-2 block">Email</label>
              <Field as={Input} name="email" type="text" placeholder="Enter email" />
            </div>
            <div>
              <label className="text-gray-800 text-sm mb-2 block">Password</label>
              <Field as={Input} name="password" type="password" placeholder="Enter password" />
            </div>
          </div>

          <div className="mt-6">
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
          <p className="text-sm text-gray-800 mt-6">
            Dont have an account?{" "}
            <a onClick={() => setAuthType("signup")} className="text-blue-600 font-semibold hover:underline ml-1 cursor-pointer">
              Sign up
            </a>
          </p>
        </Form>
      </Formik>
    </div>
  );
};

export default Login;
