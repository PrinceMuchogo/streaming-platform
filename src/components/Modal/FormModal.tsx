import {
  Dialog,
  Transition,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import { FaXmark } from "react-icons/fa6";

interface ModalProps {
  isOpen: boolean;
  setModalIsOpen: () => void;
  formHeading: string;
  FormComponent: React.ReactNode;
}

const DynamicModal: React.FC<ModalProps> = ({
  isOpen,
  setModalIsOpen,
  formHeading,
  FormComponent,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setModalIsOpen()}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4 text-left shadow-xl backdrop-blur-xl transition-all sm:p-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4">
                  <h3 className="bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 bg-clip-text text-base font-bold text-transparent sm:text-lg">
                    {formHeading}
                  </h3>
                  <button
                    onClick={() => setModalIsOpen()}
                    className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-white/5 hover:text-white sm:p-1.5"
                  >
                    <FaXmark className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>

                <div className="mt-4 sm:mt-6">{FormComponent}</div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DynamicModal;