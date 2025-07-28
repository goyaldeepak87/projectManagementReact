"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { ChevronDown, X } from "react-feather";
import { createMember, getAllMyProject } from "@/utils/APIs";
import { useEffect, useRef, useState } from "react";

const roles = [
    // { label: "MANAGER", value: "manager" },
    { label: "MEMBER", value: "member" },
];

// ✅ PROJECT DROPDOWN COMPONENT
function ProjectDropdown({ projects = [], touched, error, selectedProject, onSelect }) {
    const [isOpen, setIsOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(3);
    const [searchTerm, setSearchTerm] = useState("");
    const [manuallyTyping, setManuallyTyping] = useState(false);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    const filteredProjects = projects.filter((project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollTop + clientHeight >= scrollHeight - 5 && visibleCount < filteredProjects.length) {
            setVisibleCount((prev) => Math.min(prev + 3, filteredProjects.length));
        }
    };

    const handleSelect = (project) => {
        onSelect(project);
        setSearchTerm(project.name);
        setIsOpen(false);
        setManuallyTyping(false);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target) &&
                inputRef.current &&
                !inputRef.current.contains(e.target)
            ) {
                setIsOpen(false);
                if (!selectedProject) {
                    setSearchTerm("");
                } else {
                    setSearchTerm(selectedProject.name);
                }
                setManuallyTyping(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [selectedProject]);

    return (
        <div className="relative w-full">
            <label className="block text-sm font-medium mb-1 text-white">
                Project <span className="text-red-500">*</span>
            </label>

            <div className="relative w-full mb-2">
                <input
                    ref={inputRef}
                    type="text"
                    value={manuallyTyping ? searchTerm : selectedProject?.name || ""}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setManuallyTyping(true);
                        onSelect(null); // clear selection
                        setVisibleCount(3);
                        setIsOpen(true);
                    }}
                    onClick={() => setIsOpen(true)}
                    placeholder="Search projects..."
                    className="w-full px-3 py-2 pr-10 border border-white rounded-md bg-transparent text-white outline-none"
                />
                <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none"
                />
            </div>

            {touched && error && <p className="text-xs text-red-600 mt-1">{error}</p>}

            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute z-10 mt-1 w-full bg-[#0f172a] border border-gray-600 rounded-md shadow-lg"
                >
                    <div className="max-h-40 overflow-y-auto" onScroll={handleScroll}>
                        {filteredProjects.slice(0, visibleCount).map((project) => (
                            <div
                                key={project._id}
                                className="px-4 py-2 text-white cursor-pointer hover:bg-orange-500"
                                onClick={() => handleSelect(project)}
                            >
                                {project.name}
                            </div>
                        ))}
                        {filteredProjects.length === 0 && (
                            <div className="px-4 py-2 text-white">No projects found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ✅ ROLE DROPDOWN
function RoleDropdown({ roles = [], value, onChange, error, touched }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedLabel = roles.find((r) => r.value === value)?.label || "Choose role";

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className="relative w-full">
            <label className="block text-sm font-medium mb-1 text-white">
                Role <span className="text-red-500">*</span>
            </label>
            <div
                className={`flex justify-between items-center px-3 py-2 border rounded-md bg-transparent text-white cursor-pointer ${error && touched ? "border-red-500" : "border-white"
                    }`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{selectedLabel}</span>
                <ChevronDown size={16} />
            </div>
            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-[#0f172a] border border-gray-600 rounded-md shadow-lg">
                    {roles.map((role) => (
                        <div
                            key={role.value}
                            className="px-4 py-2 text-white cursor-pointer hover:bg-orange-500 hover:text-white"
                            onClick={() => {
                                onChange(role.value);
                                setIsOpen(false);
                            }}
                        >
                            {role.label}
                        </div>
                    ))}
                </div>
            )}
            {touched && error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
    );
}

// ✅ MAIN MODAL COMPONENT
export function AddPeopleModal({ project, open, onOpenChange }) {
    const [allProject, setAllProject] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const projects = await getAllMyProject();
                setAllProject(projects);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };
        fetchProjects();
    }, []);

    const initialValues = {
        email: "",
        role: "member",
        project: project || null, // ✅ prefill from props
    };

    const validate = (values) => {
        const errors = {};
        if (!values.email) errors.email = "Email is required";
        if (!values.role) errors.role = "Role is required";
        if (!values.project) errors.project = "Project selection is required";
        return errors;
    };

    const handleAddMember = async (values, { resetForm, setSubmitting }) => {
        try {
            await createMember({
                email: values.email,
                role: values.role,
                userID: values.project._id,
            });
            resetForm();
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to add member:", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#9b969475]">
            <div className="bg-[#0f172a] rounded-lg shadow-lg p-6 w-full max-w-md relative">
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
                    {({ values, errors, touched, setFieldValue, isSubmitting }) => (
                        <Form className="space-y-4">
                            <h2 className="text-lg font-semibold mb-4 text-white">
                                Add people to{" "}
                                <strong>{values.project?.name || "a project"}</strong>
                            </h2>

                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium mb-1 text-white">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <Field
                                    type="email"
                                    name="email"
                                    placeholder="e.g., maria@company.com"
                                    className="w-full px-3 py-2 border border-white rounded-md outline-none text-white bg-transparent"
                                />
                                <ErrorMessage name="email" component="p" className="text-xs text-red-600 mt-1" />
                            </div>

                            {/* Project Dropdown */}
                            {!project &&
                                <ProjectDropdown
                                    projects={allProject}
                                    selectedProject={values.project}
                                    onSelect={(project) => setFieldValue("project", project)}
                                    error={errors.project}
                                    touched={touched.project}
                                />
                            }
                            {/* Role Dropdown */}
                            <RoleDropdown
                                roles={roles}
                                value={values.role}
                                onChange={(val) => setFieldValue("role", val)}
                                error={errors.role}
                                touched={touched.role}
                            />

                            {/* Buttons */}
                            <div className="flex justify-end pt-2 gap-2">
                                <button
                                    type="button"
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded cursor-pointer"
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
                                    onMouseOver={(e) =>
                                        (e.currentTarget.style.backgroundColor = "lab(54% 57.1788 90.3583)")
                                    }
                                    onMouseOut={(e) =>
                                        (e.currentTarget.style.backgroundColor = "lab(64.272% 57.1788 90.3583)")
                                    }
                                    className="cursor-pointer text-white px-4 py-2 rounded"
                                >
                                    {isSubmitting ? "Adding..." : "Add"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
