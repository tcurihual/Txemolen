import React, {
    createContext,
    useState,
    useContext,
    type ReactNode,
} from "react"

type ModalSize = "sm" | "md" | "lg" | "xl" | "full"

type ModalType = {
    component: ReactNode
    title?: string
    size?: ModalSize
    onClose?: () => void
}

type ModalContextType = {
    isOpen: boolean
    modalContent: ModalType | null
    openModal: (modal: ModalType) => void
    closeModal: () => void
}

const modalSizes: Record<ModalSize, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full",
}

const ModalContext = createContext<ModalContextType>({
    isOpen: false,
    modalContent: null,
    openModal: () => {},
    closeModal: () => {},
})

export const ModalProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [modalContent, setModalContent] = useState<ModalType | null>(null)

    const openModal = (modalConfig: ModalType) => {
        setModalContent(modalConfig)
        setIsOpen(true)
    }

    const closeModal = () => {
        modalContent?.onClose?.()
        setIsOpen(false)
        setModalContent(null)
    }

    return (
        <ModalContext.Provider
            value={{ isOpen, openModal, closeModal, modalContent }}
        >
            {children}
            {isOpen && modalContent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                    <div
                        className={`w-full ${modalSizes[modalContent.size || "md"]} bg-white rounded-lg shadow-xl overflow-hidden`}
                    >
                        {modalContent.title && (
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {modalContent.title}
                                </h2>
                            </div>
                        )}
                        <div className="p-6">{modalContent.component}</div>
                        <div className="px-6 py-4 bg-gray-50 flex justify-end">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    )
}

export const useModal = () => {
    const context = useContext(ModalContext)
    if (context === undefined) {
        throw new Error("useModal debe usarse dentro de un ModalProvider")
    }
    return context
}
