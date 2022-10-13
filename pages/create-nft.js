import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useContext, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import images from "../assets";
import { Button, Input } from "../components";
import { NFTContext } from "../context/NFTContext";

const CreateNFT = () => {
  const { uploadTOIPFS, createNFT } = useContext(NFTContext);
  //
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, setFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  //
  const router = useRouter();
  //
  const handleChange = (e) => {
    setFormInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // setFormInput({ ...formInput, [e.target.name]: e.target.value });
  };
  // console.log(formInput);
  //
  const { theme } = useTheme();
  //
  const onDrop = useCallback(async (acceptedFile) => {
    // console.log({ acceptedFile });
    //upload image to the ipfs
    const url = await uploadTOIPFS(acceptedFile[0]);
    console.log({ url });
    setFileUrl(url);
    // console.log({ url });
  }, []);

  //
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ onDrop, accept: "image/*", maxSize: 5000000 });
  //
  const fileStyle = useMemo(
    () =>
      `dark:bg-nft-black-1 bg-white border dark:border-white border-nft-gray-2 flex flex-col items-center p-5 rounded-sm border-dashed 
      ${isDragActive && "border-file-active"}
      ${isDragAccept && "border-file-accept"}
      ${isDragReject && "border-file-reject"}`,
    [isDragActive, isDragAccept, isDragReject]
  );
  //
  //
  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-3/5 md:w-full">
        <h1 className="flex-1 before:first:font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold sm:mb-4">
          Create new NFT
        </h1>
        <div className="mt-16">
          <p className="flex-1 before:first:font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
            Upload File
          </p>
          <div className="mt-4">
            <div {...getRootProps()} className={fileStyle}>
              <input {...getInputProps()} />
              <div className="flexCenter flex-col text-center">
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
                  JPEG, PNG, GIF, SVG, WEBM, MAX 100mb.
                </p>
                <div className="my-12 w-full flex justify-center">
                  <Image
                    src={images.upload}
                    width={100}
                    height={100}
                    objectFit="contain"
                    alt="file upload"
                    className={theme === "light" && "filter invert"}
                  />
                </div>
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm">
                  Drag and Drop File
                </p>
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm mt-2">
                  or Browse media on your device
                </p>
              </div>
            </div>
            {fileUrl && (
              <aside>
                <div>
                  <img src={fileUrl} alt="asset_file" />
                </div>
              </aside>
            )}
          </div>
        </div>
        <div>
          <Input
            inputType="input"
            title="Name"
            placeholder="NFT Name"
            name="name"
            handleClick={handleChange}
          />
          <Input
            inputType="textarea"
            title="Description"
            name="description"
            placeholder="NFT Description"
            handleClick={handleChange}
          />
          <Input
            inputType="number"
            title="Price"
            name="price"
            placeholder="NFT Price"
            handleClick={handleChange}
          />
          <div className="mt-7 w-full flex justify-end">
            <Button
              btnName="Create NFT"
              className="rounded-xl"
              handleClick={() => createNFT(formInput.fileUrl.router)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateNFT;
