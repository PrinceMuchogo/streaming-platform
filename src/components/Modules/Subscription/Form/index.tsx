import React, { useEffect, useState } from "react";
import { Form, Field } from "react-final-form";
import { useSession } from "next-auth/react";
import { PackageType } from "@/types/package";
import { toast } from "react-toastify";

interface SubscriptionFormProps {
  setModalIsOpen: () => void;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  setModalIsOpen,
}) => {
  const { data: session } = useSession();
  const [packageTypes, setPackageTypes] = useState<PackageType[]>([]);
  const [packageType, setPackageType] = useState("");
  const [interval, setInterval] = useState("");
  const [amount, setAmount] = useState("");
  const [packageId, setPackageId] = useState("");

  useEffect(() => {
    const getPackages = async () => {
      const request = await fetch("/api/admin/packages/all", {
        method: "GET",
      });
      const result = await request.json();
      setPackageTypes(result);
    };

    getPackages();
  }, []);

  const onSubmit = async (values: any) => {
    const subscription = {
      userId: session?.user.id,
      packageId,
      status: "PENDING",
      amount,
    };

    try {
      const response = await fetch(
        `/api/admin/subscriptions/create/${session?.user.id}`,
        {
          method: "POST",
          body: JSON.stringify(subscription),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        return toast.error(`${data.message}`);
      }

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return toast.success(`${data.message}`);
      } else {
        return toast.success("No redirect URL received");
      }
    } catch (error) {
      toast.error("Failed to complete transaction.");
    }
  };

  const validate = (values: any) => {
    const errors: any = {};
    if (!values.package_type) errors.package_type = "Package type is required";
    return errors;
  };

  return (
    <Form
      onSubmit={onSubmit}
      validate={validate}
      render={({ handleSubmit, submitting }) => (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="rounded-lg border border-white/10 bg-black/40 p-4 backdrop-blur-xl sm:p-6">
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-300 sm:mb-2 sm:text-sm">
                  Package Type
                </label>
                <Field name="package_type">
                  {({ input, meta }) => (
                    <div>
                      <select
                        {...input}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 sm:px-4 sm:py-2.5 sm:text-sm"
                        onChange={(e) => {
                          input.onChange(e);
                          setPackageType(e.target.value);
                          packageTypes
                            .filter((item) => item.name === e.target.value)
                            .map((type) => {
                              setAmount(type.amount);
                              setInterval(type.interval);
                              setPackageId(type.id);
                            });
                        }}
                      >
                        <option value="" disabled>
                          Select package
                        </option>
                        {packageTypes.map((item) => (
                          <option
                            value={item.name}
                            key={item.name}
                            className="bg-gray-900"
                          >
                            {item.name}
                          </option>
                        ))}
                      </select>
                      {meta.error && meta.touched && (
                        <span className="mt-1 text-xs text-red-500 sm:text-sm">
                          {meta.error}
                        </span>
                      )}
                    </div>
                  )}
                </Field>
              </div>

              {packageType && (
                <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3 sm:mt-6 sm:p-4">
                  <h3 className="mb-3 text-xs font-medium text-gray-300 sm:mb-4 sm:text-sm">
                    Selected Package Details
                  </h3>

                  <div className="grid gap-3 text-xs sm:gap-4 sm:text-sm md:grid-cols-2">
                    <div>
                      <p className="text-gray-400">Package</p>
                      <p className="mt-0.5 font-medium text-white sm:mt-1">
                        {packageType}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-400">Duration</p>
                      <p className="mt-0.5 font-medium text-white sm:mt-1">
                        {interval.charAt(0).toUpperCase() + interval.slice(1)}ly
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-400">Amount</p>
                      <div className="mt-0.5 flex items-center gap-1.5 sm:mt-1 sm:gap-2">
                        <p className="font-medium text-white">${amount}</p>
                        <span className="text-[10px] text-gray-400 sm:text-xs">
                          (Tax not included)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 sm:gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-lg bg-gradient-to-r from-red-500 to-yellow-500 p-px font-medium text-white focus:outline-none"
            >
              <span className="block rounded-lg bg-black/40 px-3 py-2 text-xs transition-colors hover:bg-black/60 sm:px-4 sm:text-sm">
                {submitting ? "Processing..." : "Subscribe"}
              </span>
            </button>

            <button
              onClick={() => setModalIsOpen()}
              type="button"
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-white/10 sm:px-4 sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    />
  );
};

export default SubscriptionForm;
