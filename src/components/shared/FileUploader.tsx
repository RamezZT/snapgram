import { useCallback, useState, forwardRef, useEffect } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../ui/button";

type FileUploaderProps = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl: string;
};

const FileUploader = forwardRef<HTMLDivElement, FileUploaderProps>(
  ({ fieldChange, mediaUrl }, ref) => {
    const [, setFile] = useState<File[]>([]);
    const [fileUrl, setFileUrl] = useState();
    useEffect(() => setFileUrl(mediaUrl), [mediaUrl]);

    const onDrop = useCallback(
      (acceptedFiles: FileWithPath[]) => {
        // Do something with the files
        setFile(acceptedFiles);
        fieldChange(acceptedFiles);
        setFileUrl(URL.createObjectURL(acceptedFiles[0]));
      },
      [fieldChange, setFile, setFileUrl]
    );

    const { getRootProps, getInputProps } = useDropzone({
      onDrop,
      accept: {
        "image/*": [".png", ".jpg", ".jpeg", ".svg"],
      },
    });

    return (
      <div
        {...getRootProps()}
        ref={ref}
        className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer"
      >
        <input {...getInputProps()} className="cursor-pointer" />
        {fileUrl ? (
          <>
            <div className="flex flex-1 justify-center w-full p-5 l:p10">
              <img
                src={fileUrl}
                alt="logo"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="file_uploader-label">
              Click, or drop a photo to replace
            </p>
          </>
        ) : (
          <div className="file_uploader-box">
            <img
              src="/assets/icons/file-upload.svg"
              alt="upload"
              width={96}
              height={77}
            />
            <h3 className="base-medium text-light-2 mb-2 mt-6">
              Drag photo here
            </h3>
            <p className="text-light-4 small-regular mb-6">SVG, PNG, JBG</p>
            <Button className="shad-button_dark_4">Selct from computer</Button>
          </div>
        )}
      </div>
    );
  }
);

export default FileUploader;
