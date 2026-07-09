"use client";
import React from "react";
import CustomTextField from "../components/CustomTextFields";
import FormBody from "../components/FormBody";
import CustomButton from "../components/CustomButton";
import sendLoginRequest from "../functions";

export default function loginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  return (
    <FormBody title="Login">
      <CustomTextField label="Email" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <CustomTextField
        label="Password"
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <h2 className="text-red-500 font-bold">{error}</h2>
      <CustomButton
        label="Login"
        onClick={async (e) => {
          e.preventDefault();
          try {
            const response = await sendLoginRequest({ email, password });
            if (response?.data?.token) {
              window.location.href = "/dashboard";
            }
          } catch (error) {
            setError(`${error}`);
          }
        }}
      />
    </FormBody>
  );
}
