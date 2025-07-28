'use client';
import React, { useEffect } from "react";
// import GifComp from "./GifComp";
import { LoginData } from "@/lang";
import { useRouter } from 'next/navigation';
import LoginFormModel from "../auth/LoginFormModel";
import GifComp from "../commanComp/GifComp";
import { RdirectUrlData } from "@/lang/RdirectUrl";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import RegisterFormModel from "../auth/RegisterFormModel";

const RegisterPage = () => {
  const router = useRouter(); // Initialize the router
  const { isAuthenticated, error } = useSelector((state) => state.auth);

  // Redirect to home page if user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push(RdirectUrlData.Home);
    }
  }, [isAuthenticated, router]);

  // If user is already authenticated, don't render the login form
  if (isAuthenticated) {
    return null; // Return nothing while redirecting to prevent flash of login form
  }

  // Only render the login form if user is not authenticated
  console.log("LoginPage rendered", isAuthenticated);
  return (
    <>
      <RegisterFormModel />
    </>
  );
};

export default RegisterPage;