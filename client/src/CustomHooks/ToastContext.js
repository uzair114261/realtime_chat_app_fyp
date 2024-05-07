import React, { createContext, useContext } from 'react'
import toast, { Toaster } from 'react-hot-toast'

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext)

export const ToastProvider = ({ children }) => {
    const notifySuccess = (message) => toast.success(message);
    const notifyError = (message) => toast.error(message);
    return (
        <ToastContext.Provider value={{notifySuccess, notifyError}}>
            {children}
            <Toaster />
        </ToastContext.Provider>
    )
};