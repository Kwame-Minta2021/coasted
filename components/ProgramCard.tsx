"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ProgramCardProps {
  title: string;
  description: string;
  ageRange: string;
  duration: string;
  modules: string[];
  icon: ReactNode;
  color: string;
  delay?: number;
}

export default function ProgramCard({
  title,
  description,
  ageRange,
  duration,
  modules,
  icon,
  color,
  delay = 0
}: ProgramCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="group bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-200/20"
    >
      {/* Icon */}
      <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>

      {/* Content */}
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
        {description}
      </p>

      {/* Details */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-500">
          Ages {ageRange}
        </span>
        <span className="text-sm font-medium text-slate-500 dark:text-slate-500">
          {duration}
        </span>
      </div>

      {/* Modules */}
      <div className="space-y-2">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
          Sample Modules:
        </h4>
        <ul className="space-y-1">
          {modules.map((module, index) => (
            <li key={index} className="text-sm text-slate-600 dark:text-slate-400 flex items-center">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-3"></div>
              {module}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
