import React from 'react';
import InputField from "@/components/commanComp/InputField";
import { Formik, Form } from 'formik';
import { useDispatch } from "react-redux";
import { memberVerifyJoin, registerUser } from "@/reudux/slice/authSlice";
import { toast } from 'react-toastify';
import { useRouter, useSearchParams } from 'next/navigation';

const validateLoginForm = (values, props) => {
    const errors = {};
    if (!values.name) {
        errors.name = "Name is required";
    }
    if (!props?.isVerifyJoin && !values.email) {
        errors.email = "Email is required";
    }
    if (!values.password) {
        errors.password = "Password is required";
    }
    return errors;
};

export default function RegisterFormModel(props) {
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
      const token = searchParams.get("token");

    return (
        <div className={`${props?.with || "w-1/2"} relative p-10`}>
            {props?.with && (
                <div
                    className="absolute right-[17px] top-[14px] text-[22px] font-black cursor-pointer"
                    onClick={() => props?.setUserLogin?.(false)}
                >
                    X
                </div>
            )}
            <h2 className="text-2xl font-bold text-orange-600">Login</h2>

            <Formik
                initialValues={{ name: '', email: '', password: '' }}
                validate={(values) => validateLoginForm(values, props)}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        const payload = { ...values };
                        if (props?.isVerifyJoin) {
                            delete payload.email;
                            payload.token = token;
                        }

                        const result = props?.isVerifyJoin
                            ? await dispatch(memberVerifyJoin(payload)).unwrap()
                            : await dispatch(registerUser(payload)).unwrap();

                        if (result?.statusCode === 201) {
                            toast.success(result.message);
                            router.push('/login');
                        }
                    } catch (error) {
                        toast.error(error.message || "Something went wrong.");
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {() => (
                    <Form className="mt-6">
                        {/* ✅ Name Field */}
                        <div className="mb-4">
                            <InputField
                                label="Full Name"
                                name="name"
                                type="text"
                                placeholder="Enter your name"
                            />
                        </div>

                        {/* ✅ Email Field (only if not in verifyJoin mode) */}
                        {!props?.isVerifyJoin && (
                            <div>
                                <InputField
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                />
                            </div>
                        )}

                        {/* ✅ Password Field */}
                        <div className="mt-4">
                            <InputField
                                label="Password"
                                name="password"
                                type="password"
                                placeholder="Enter 6 characters or more"
                            />
                        </div>

                        {/* ✅ Submit Button */}
                        <button
                            type="submit"
                            className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg transition duration-300 shadow-md"
                        >
                            LOGIN
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
