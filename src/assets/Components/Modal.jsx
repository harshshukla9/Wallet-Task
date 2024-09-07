// Modal.jsx
import React from 'react';
import { Transition } from '@headlessui/react'; // Optional for smoother transitions

const Modal = ({ isOpen, onClose, children }) => {
    return (
        <Transition
            show={isOpen}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                    <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 "
                        onClick={onClose}
                    >
                        &times;
                    </button>
                    {children}
                </div>
            </div>
        </Transition>
    );
};

export default Modal;
