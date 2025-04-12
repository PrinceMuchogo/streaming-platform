import { Store } from "@/types/store";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaSave } from "react-icons/fa";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { PackageType } from "@/types/package";

const VideoUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("Choose file");
  const [videoName, setVideoName] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [videoPublicID, setVideoPublicID] = useState<string>("");
  const [views, setViews] = useState<number>(0);
  const [likes, setLikes] = useState<number>(0);
  const [url, setUrl] = useState<string>("");
  const [userID, setUserID] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [stores, setStores] = useState<Store[]>([]);
  const { data: session } = useSession();

  const [filteredStores, setFilteredOwners] = useState(stores);
  const [storeID, setStoreID] = useState<string>("");
  const [storeName, setStoreOwnerName] = useState<string>("");

  //packages
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PackageType>();
  useEffect(() => {
    const getPackages = async () => {
      const res = await fetch("/api/packages/all", {
        method: "GET",
      });

      const data = await res.json();
      setPackages(data);
    };

    getPackages();
  }, []);

  useEffect(() => {
    const getStores = async () => {
      const res = await fetch("/api/store/all", {
        method: "GET",
      });

      const data = await res.json();
      setStores(data);
    };

    getStores();
  }, []);

  useEffect(() => {
    const getPackages = async () => {
      const res = await fetch("/api/subscriptions/all", {
        method: "GET",
      });

      const data = await res.json();
      setPackages(data);
    };

    getPackages();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStoreOwnerName(value);
    setStoreID(""); // Reset ID on new search
    const filtered = stores.filter((store) =>
      store.storeName.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredOwners(filtered);
  };

  const handleStoreSelect = (storeID: string, storeName: string) => {
    setStoreID(storeID);
    setStoreOwnerName(storeName);
    setFilteredOwners(stores); // Reset to original list
  };

  const onDrop = (acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setFileName(uploadedFile.name);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/mp4": [".mp4"],
      "video/x-m4v": [".m4v"],
      "video/*": [".avi", ".mov", ".wmv"],
    },
  });

  const uploadVideo = async () => {
    setIsUploading(true);
    if (!file) {
      setIsUploading(false);
      return;
    }

    if (!session) {
      toast.error(`User not logged in!`);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("videoName", videoName);
    formData.append("caption", caption);
    formData.append("storeID", storeID);
    formData.append("user", session?.user?.email!);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      toast.success(`${data.message}`);
      setIsUploading(false);
      resetForm();
    } else {
      setIsUploading(false);
      toast.error(`${data.message}`);
    }
  };

  const resetForm = () => {
    setFile(null);
    setFileName("Choose file");
    setVideoName("");
    setCaption("");
    setThumbnailUrl("");
    setVideoPublicID("");
    setViews(0);
    setLikes(0);
    setUrl("");
    setUserID("");
  };

  return (
    <div className="mx-auto mt-4 max-w-4xl rounded-md bg-black p-6 shadow-lg">
      <h2 className="mb-4 text-lg font-bold text-white">Video Upload</h2>

      <div
        {...getRootProps()}
        className={`mb-6 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all duration-200 ${isDragActive ? "border-primary bg-dark-2" : "border-primary bg-dark-2"}`}
      >
        <input {...getInputProps()} />
        <p className="text-sm font-semibold text-white">
          {isDragActive
            ? "Drop the video here..."
            : "Drag and drop a video, or click to select a file"}
        </p>
        <p className="mt-2 text-white">{fileName}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-white">
            Video Name:
          </label>
          <input
            type="text"
            value={videoName}
            onChange={(e) => setVideoName(e.target.value)}
            placeholder="enter text..."
            className="mt-1 w-full rounded-md border p-2 text-black focus:border-primary focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">
            Caption:
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="enter text..."
            className="mt-1 w-full rounded-md border p-2 text-black focus:border-primary focus:ring-primary"
            rows={1}
          />
        </div>
        <div className="mt-4 rounded-md pt-4">
          <label className="block text-sm font-medium text-white">
            Package
          </label>
          <select
            name="package"
            id="package"
            className="mt-1 w-full rounded-md border p-2 text-black focus:border-primary focus:ring-primary"
          >
            <option className="bg-white text-black" value="" selected disabled>
              select subscription package
            </option>
            <option className="bg-white text-black" value="">
              Basic
            </option>
            <option className="bg-white text-black" value="">
              Lite
            </option>
            <option className="bg-white text-black" value="">
              Premium
            </option>
          </select>
        </div>
        <div className="mt-4 rounded-md p-4">
          <label className="block text-sm font-medium text-white">
            Store Name
          </label>
          <input
            type="text"
            value={storeName}
            onChange={handleSearch}
            className="mt-1 w-full rounded-md border p-2 text-black focus:border-primary focus:ring-primary"
            placeholder="Type to search for store..."
          />
          <h2 className="mt-2 border-b border-t border-white">Stores</h2>
          {filteredStores.length > 0 && (
            <ul className="mt-2 max-h-40 overflow-auto rounded-md border border-gray-300">
              {filteredStores.map((store) => (
                <li
                  key={store.id}
                  onClick={() => handleStoreSelect(store.id, store.storeName)}
                  className="cursor-pointer p-2 text-white hover:bg-gray-800"
                >
                  {store.storeName}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <button
        className={`mt-6 text-sm font-medium  ${file ? "bg-blue-600 hover:bg-blue-700" : "bg-primary"} rounded-lg px-2 py-3 text-white  transition duration-200`}
        onClick={uploadVideo}
        disabled={file ? (isUploading ? true : false) : true}
      >
        <FaSave
          className={`mr-2 inline-block ${isUploading ? "animate-spin" : ""}`}
        />
        {isUploading ? "Uploading..." : "Upload Video"}
      </button>
    </div>
  );
};

export default VideoUpload;
