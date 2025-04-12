"use client";

import React, { useEffect, useState } from "react";
import { FaMoneyBill, FaHistory, FaCog } from "react-icons/fa";
import LeftBarLayout from "@/components/Layouts/LeftBarLayout";
import DynamicModal from "@/components/Modal/FormModal";
import SubscriptionForm from "@/components/Modules/Subscription/Form";
import { Subscription } from "@/types/subscription";
import { useSession } from "next-auth/react";

export default function Subscriptions() {
  const [isModalOpen, setModalIsOpen] = useState(false);
  const modalIsOpen = () => {
    setModalIsOpen((prev) => !prev);
  };
  const { data: session } = useSession();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    const getStore = async () => {
      const res = await fetch(`/api/user/subscriptions/${session?.user.id}`, {
        method: "GET",
      });

      const data = await res.json();
      console.log("subscriptions: ", data);
      setSubscriptions(data);
    };
    getStore();
  }, []);

  return (
    <LeftBarLayout>
      <div className="min-h-screen bg-black/95">
        <DynamicModal
          isOpen={isModalOpen}
          setModalIsOpen={modalIsOpen}
          formHeading="Subscription"
          FormComponent={<SubscriptionForm setModalIsOpen={modalIsOpen} />}
        />

        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-white/10 bg-black/40 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
            <h1 className="bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 bg-clip-text text-lg font-bold text-transparent sm:text-xl">
              Manage Subscriptions
            </h1>
          </div>
        </header>

        {/* Navigation Options */}
        <div className="border-b border-white/10 bg-black/40 py-3 backdrop-blur-xl sm:py-4">
          <div className="grid grid-cols-2 gap-2 px-3 sm:flex sm:justify-around sm:px-4">
            <button
              onClick={modalIsOpen}
              className="group flex flex-col items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 p-2.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white sm:border-0 sm:bg-transparent sm:p-0"
            >
              <div className="rounded-full bg-white/5 p-2 transition-colors group-hover:bg-white/10 sm:p-3">
                <FaMoneyBill className="text-lg sm:text-2xl" />
              </div>
              <span className="text-xs sm:text-sm">New subscription</span>
            </button>
            <button className="group flex flex-col items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 p-2.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white sm:border-0 sm:bg-transparent sm:p-0">
              <div className="rounded-full bg-white/5 p-2 transition-colors group-hover:bg-white/10 sm:p-3">
                <FaHistory className="text-lg sm:text-2xl" />
              </div>
              <span className="text-xs sm:text-sm">Payment History</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="space-y-4 p-4 sm:space-y-6 sm:p-6">
          {/* Subscription Details */}
          <section>
            <h2 className="mb-3 text-sm font-medium text-gray-400 sm:mb-4">
              Your Subscription
            </h2>
            <div className="rounded-lg border border-white/10 bg-black/40 p-4 backdrop-blur-xl sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs text-gray-400 sm:text-sm">
                    Current Plan
                  </p>
                  <p className="mt-0.5 text-lg font-semibold text-white sm:mt-1 sm:text-xl">
                    Premium
                  </p>
                </div>
                <span className="w-fit rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-500 sm:px-3 sm:text-sm">
                  Active
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-4 sm:flex sm:items-center sm:gap-4">
                <div>
                  <p className="text-xs text-gray-400 sm:text-sm">
                    Next Payment
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-white sm:mt-1">
                    27th Dec 2024
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 sm:text-sm">Amount</p>
                  <p className="mt-0.5 text-sm font-medium text-white sm:mt-1">
                    $15.99/month
                  </p>
                </div>
              </div>

              <button className="mt-4 w-full rounded-lg bg-gradient-to-r from-red-500 to-yellow-500 p-px font-medium text-white focus:outline-none sm:mt-6">
                <span className="block rounded-lg bg-black/40 px-3 py-2 text-xs transition-colors hover:bg-black/60 sm:px-4 sm:text-sm">
                  Cancel Subscription
                </span>
              </button>
            </div>
          </section>

          {/* Payment History */}
          <section>
            <h2 className="mb-3 text-sm font-medium text-gray-400 sm:mb-4">
              Payment History
            </h2>
            <div className="overflow-hidden rounded-lg border border-white/10 bg-black/40 backdrop-blur-xl">
              <div className="divide-y divide-white/10">
                {
                  subscriptions.map((sub, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 sm:p-4"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">
                        {sub.status}
                        </p>
                        <p className="text-xs text-gray-400 sm:text-sm">
                          {/* {subscription.expiresOn?.toDateString()}  */}
                        </p>
                      </div>
                      <p className="text-sm text-white">$15.99</p>
                    </div>
                  ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </LeftBarLayout>
  );
}
