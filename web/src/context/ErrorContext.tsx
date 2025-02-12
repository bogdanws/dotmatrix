import { createContext, useContext, useState, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaExclamationCircle } from "react-icons/fa";

type ErrorContextType = {
    showError: (title: string, message: string) => void
}

const ErrorContext = createContext<ErrorContextType>({
    showError: () => { },
})

export const useError = () => useContext(ErrorContext)

type ErrorProviderProps = {
    children: ReactNode
}

export const ErrorProvider = ({ children }: ErrorProviderProps) => {
    const [errorTitle, setErrorTitle] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const showError = (title: string, message: string) => {
        setErrorTitle(title)
        setErrorMessage(message)

        // Clear the error after 5 seconds
        setTimeout(() => {
            setErrorTitle(null)
            setErrorMessage(null)
        }, 5000)
    }
    return (
        <ErrorContext.Provider value={{ showError }}>
            {children}
            <AnimatePresence>
                {errorTitle && errorMessage && (
                    <div className="fixed top-4 left-0 w-full flex justify-center px-4 z-50">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="bg-red-100 rounded-xl p-4 sm:p-6 shadow-xl w-full max-w-md border-l-8 border-red-500"
                        >
                            <div className="flex flex-row items-center gap-2 mb-2">
                                <FaExclamationCircle className="text-red-500 text-2xl" />
                                <h2 className="text-xl font-semibold text-gray-900">{errorTitle}</h2>
                            </div>
                            <p className="text-gray-800">{errorMessage}</p>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </ErrorContext.Provider>
    )
}