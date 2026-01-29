"use client"

import React from 'react'
import { motion } from 'framer-motion'

export const EzioLogo = ({ size = 40, className = "" }: { size?: number, className?: string }) => {
    return (
        <motion.div
            className={`relative flex items-center justify-center ${className}`}
            style={{ width: size, height: size }}
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
            >
                <defs>
                    <linearGradient id="ezio-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#818CF8" />
                        <stop offset="100%" stopColor="#C084FC" />
                    </linearGradient>
                </defs>
                {/* Antigravity-inspired geometric logo */}
                <circle cx="50" cy="50" r="45" stroke="url(#ezio-grad)" strokeWidth="2" strokeDasharray="10 5" />
                <path
                    d="M50 20 L80 70 L20 70 Z"
                    fill="url(#ezio-grad)"
                    fillOpacity="0.2"
                    stroke="url(#ezio-grad)"
                    strokeWidth="4"
                    strokeLinejoin="round"
                />
                <circle cx="50" cy="50" r="8" fill="url(#ezio-grad)" />
                <motion.path
                    d="M50 10 L50 30 M90 50 L70 50 M50 90 L50 70 M10 50 L30 50"
                    stroke="url(#ezio-grad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />
            </svg>
        </motion.div>
    )
}
