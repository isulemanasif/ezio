"use client"

import React from 'react'
import { motion } from 'framer-motion'

export const EziogramLogo = ({ size = 40, className = "" }: { size?: number, className?: string }) => {
    return (
        <motion.div
            className={`relative flex items-center justify-center ${className}`}
            style={{ width: size, height: size }}
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
            <img
                src="/logo.png"
                alt="Eziogram Luxury Logo"
                className="w-full h-full object-contain drop-shadow-2xl"
            />
        </motion.div>
    )
}
