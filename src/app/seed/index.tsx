"use client";

import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const ADD_DEPARTMENT = gql`
  mutation AddDepartment($input: DepartmentInput!) {
    addDepartment(input: $input) {
      id
      name
    }
  }
`;

const departments: string[] = [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Engineering",
    "Business Administration",
    "Economics",
];

const SeedDepartmentsPage = () => {
    const router = useRouter();
    const [status, setStatus] = useState<string>("Seeding departments...");
    const [progress, setProgress] = useState<number>(0);
    const [addDept] = useMutation(ADD_DEPARTMENT);

    useEffect(() => {
        const seed = async (): Promise<void> => {
            let count = 0;
            const total = departments.length;

            for (const name of departments) {
                try {
                    await addDept({ variables: { input: { name } } });
                    count++;
                } catch (err: unknown) {
                    console.log(`Skipping "${name}": ${err instanceof Error ? err.message : 'Unknown error'}`);
                }
                setProgress(Math.round((count / total) * 100));
            }

            setStatus(`✅ Seeding complete! ${count} departments added.`);

            setTimeout(() => router.push("/"), 2000);
        };

        seed();
    }, [addDept, router]);

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-md w-full bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl shadow-2xl p-8 border border-gray-800"
            >
                <div className="text-center">
                    <motion.div
                        className="text-6xl mb-4"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                    >
                        🌱
                    </motion.div>

                    <motion.h1
                        key={status}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent"
                    >
                        {status}
                    </motion.h1>

                    <div className="w-full bg-gray-800 rounded-full h-4 mb-4 overflow-hidden">
                        <motion.div
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full"
                            style={{ width: `${progress}%` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        ></motion.div>
                    </div>

                    <AnimatePresence>
                        <motion.p
                            key={progress}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-gray-400 text-sm"
                        >
                            {progress}% complete
                        </motion.p>
                    </AnimatePresence>

                    <p className="text-gray-500 text-xs mt-4">
                        This page will auto-redirect to the Student Portal shortly...
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default SeedDepartmentsPage;
