"use client";

import { createProject } from "@/utils/APIs";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { X } from "react-feather";

export function CreateProjectModel({ open, onOpenChange }) {
    if (!open) return null;

    const initialValues = {
        name: "",
        description: "",
    };

    const validate = (values) => {
        const errors = {};
        if (!values.name) {
            errors.name = "Project Name is required";
        }
        return errors;
    };

    const handleAddMember = async (values, { resetForm, setSubmitting }) => {
        try {
            await createProject(values);
            resetForm();
            onOpenChange(false);
            // Optional: show toast success
        } catch (error) {
            console.error("Failed to add member:", error);
            // Optional: show toast error
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed pl-[0] inset-0 z-50 flex items-center justify-center bg-[#9b969475]">
            <div className="bg-[#0f172a] rounded-lg shadow-lg p-6 w-full max-w-md relative">
                {/* Close button */}
                <button
                    className="cursor-pointer absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
                    onClick={() => onOpenChange(false)}
                >
                    <X />
                </button>

                <Formik
                    initialValues={initialValues}
                    validate={validate}
                    onSubmit={handleAddMember}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4">
                            {/* Project Name Field */}
                            <div>
                                <label className="text-sm font-medium text-white block mb-1">
                                    Project Name <span className="text-red-500">*</span>
                                </label>
                                <Field
                                    type="text"
                                    name="name"
                                    placeholder="Enter project name"
                                    className="w-full border border-gray-300 rounded text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <ErrorMessage
                                    name="name"
                                    component="div"
                                    className="text-xs text-red-600 mt-1"
                                />
                            </div>

                            {/* Description Field */}
                            <div>
                                <label className="text-sm font-medium text-white block mb-1">
                                    Description
                                </label>
                                <Field
                                    as="textarea"
                                    name="description"
                                    placeholder="Write short description (optional)"
                                    className="w-full border border-gray-300 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    className="cursor-pointer bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
                                    onClick={() => onOpenChange(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    style={{
                                        backgroundColor: "lab(64.272% 57.1788 90.3583)",
                                        transition: "background 0.2s",
                                    }}
                                    onMouseOver={e =>
                                        e.currentTarget.style.backgroundColor = "lab(54% 57.1788 90.3583)"
                                    }
                                    onMouseOut={e =>
                                        e.currentTarget.style.backgroundColor = "lab(64.272% 57.1788 90.3583)"
                                    }
                                    className="cursor-pointer text-white px-4 py-2 rounded"
                                >
                                    {isSubmitting ? "Creating..." : "Create"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
