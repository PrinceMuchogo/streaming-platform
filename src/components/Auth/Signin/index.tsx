"use client";
import Link from "next/link";
import React from "react";
import GoogleSigninButton from "../GoogleSigninButton";
import SigninWithPassword from "../SigninWithPassword";
import AuthProviders from "@/components/Provider/AuthProviders";

export default function Signin() {
  return (
    <>
      <div>
        <SigninWithPassword />
      </div>
    </>
  );
}
