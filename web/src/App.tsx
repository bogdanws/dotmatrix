import { motion, AnimatePresence } from 'framer-motion'
import { QRGenerator } from './components/QRGenerator'
import { QRDecode } from './components/QRDecode'
import { ErrorProvider } from './context/ErrorContext'
import { BrowserRouter, Routes, Route, NavLink, useLocation, Navigate } from 'react-router-dom'

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence initial={false} mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={<Navigate to="/generate" replace />} 
        />
        <Route 
          path="/generate" 
          element={
            <motion.section
              key="generator"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.5 }}
              transition={{ duration: 0.15 }}
              className="mb-12"
            >
              <QRGenerator />
            </motion.section>
          } 
        />
        <Route 
          path="/decode" 
          element={
            <motion.section
              key="decoder"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.5 }}
              transition={{ duration: 0.15 }}
            >
              <QRDecode />
            </motion.section>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ErrorProvider>
      <BrowserRouter>
        <main className="min-h-screen min-w-full flex flex-col items-center bg-gradient-to-br from-gray-100 to-gray-200">
          <div className="container mx-auto px-4 py-12">
            <header className="mb-8 text-center">
              <h1 className="text-4xl font-extrabold text-gray-900">DotMatrix</h1>
              <p className="text-gray-600">Step by Step QR Code Generator & Decoder</p>
            </header>
            <div className="flex justify-center space-x-4 mb-8">
              <NavLink
                to="/generate"
                className={({ isActive }) =>
                  `px-4 py-2 border border-gray-300 font-semibold rounded-lg ${
                    isActive ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                  }`
                }
              >
                QR Generator
              </NavLink>
              <NavLink
                to="/decode"
                className={({ isActive }) =>
                  `px-4 py-2 border border-gray-300 font-semibold rounded-lg ${
                    isActive ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                  }`
                }
              >
                QR Decoder
              </NavLink>
            </div>
            <AnimatedRoutes />
          </div>
        </main>
      </BrowserRouter>
    </ErrorProvider>
  )
}

export default App
