'use client';
import React from 'react';
import { Formik, Form } from 'formik';
import { useDispatch } from "react-redux";
import { loginUser } from "@/reudux/slice/authSlice";
import { toast } from 'react-toastify';
import InputField from "@/components/commanComp/InputField";

const validateLoginForm = (values) => {
  const errors = {};
  if (!values.email) errors.email = "Email is required";
  if (!values.password) errors.password = "Password is required";
  return errors;
};

export default function LoginFormModel(props) {
  const dispatch = useDispatch();

  return (
    <div className={`${props?.with ? props.with : "w-1/2"} relative p-10`}>
      <h2 className="text-2xl font-bold text-orange-600">Login</h2>

      <Formik
        initialValues={{ email: '', password: '' }}
        validate={validateLoginForm}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const result = await dispatch(loginUser(values)).unwrap();
            if (result.statusCode === 200) {
              toast.success("Login successful! Redirecting...");
              const searchParams = new URLSearchParams(window.location.search);
              const redirectUrl = searchParams.get("redirect") || "/";
              window.location.href = redirectUrl;
            }
          } catch (error) {
            toast.error(error.message);
          }
        }}
      >
        {({isSubmitting }) => (
          <Form className="mt-6">
            <InputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@example.com"
            />

            <div className="mt-4">
              <InputField
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full mt-6 bg-orange-500 cursor-pointer hover:bg-orange-600 text-white py-3 rounded-lg transition duration-300 shadow-md flex items-center justify-center ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "LOGIN"
              )}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}