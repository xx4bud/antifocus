"use client";

import { IconTrash } from "@tabler/icons-react";
import {
  createContext,
  type Dispatch,
  forwardRef,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  type DropzoneOptions,
  type DropzoneState,
  type FileRejection,
  useDropzone,
} from "react-dropzone";
import { toast } from "sonner";
import { buttonVariants } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/utils/styles";

type DirectionOptions = "rtl" | "ltr" | undefined;

type FileUploaderContextType = {
  dropzoneState: DropzoneState;
  isLOF: boolean;
  isFileTooBig: boolean;
  removeFileFromSet: (index: number) => void;
  activeIndex: number;
  setActiveIndex: Dispatch<SetStateAction<number>>;
  orientation: "horizontal" | "vertical";
  direction: DirectionOptions;
};

const FileUploaderContext = createContext<FileUploaderContextType | null>(null);

export const useFileUpload = () => {
  const context = useContext(FileUploaderContext);
  if (!context) {
    throw new Error("useFileUpload must be used within a FileUploaderProvider");
  }
  return context;
};

type FileUploaderProps = {
  value: File[] | null;
  reSelect?: boolean;
  onValueChange: (value: File[] | null) => void;
  dropzoneOptions: DropzoneOptions;
  orientation?: "horizontal" | "vertical";
};

export const FileUploader = forwardRef<
  HTMLDivElement,
  FileUploaderProps & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      className,
      dropzoneOptions,
      value,
      onValueChange,
      reSelect,
      orientation = "vertical",
      children,
      dir,
      ...props
    },
    ref
  ) => {
    const [isFileTooBig, setIsFileTooBig] = useState(false);
    const [isLOF, setIsLOF] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const {
      accept = {
        "image/*": [".jpg", ".jpeg", ".png", ".gif"],
      },
      maxFiles = 1,
      maxSize = 4 * 1024 * 1024,
      multiple = true,
    } = dropzoneOptions;

    const reSelectAll = maxFiles === 1 ? true : reSelect;
    const direction: DirectionOptions = dir === "rtl" ? "rtl" : "ltr";

    const removeFileFromSet = useCallback(
      (i: number) => {
        if (!value) {
          return;
        }
        onValueChange(value.filter((_, index) => index !== i));
      },
      [value, onValueChange]
    );

    const handleRejections = useCallback(
      (rejectedFiles: FileRejection[]) => {
        for (const rejection of rejectedFiles) {
          const error = rejection.errors[0];
          if (error?.code === "file-too-large") {
            toast.error(
              `File is too large. Max size is ${maxSize / 1024 / 1024}MB`
            );
            break;
          }
          if (error?.message) {
            toast.error(error.message);
            break;
          }
        }
      },
      [maxSize]
    );

    const onDrop = useCallback(
      (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        if (!acceptedFiles) {
          toast.error("file error, probably too big");
          return;
        }

        const newValues = reSelectAll ? [] : [...(value ?? [])];

        for (const file of acceptedFiles) {
          if (newValues.length < maxFiles) {
            newValues.push(file);
          } else {
            break;
          }
        }

        onValueChange(newValues);

        if (rejectedFiles.length > 0) {
          handleRejections(rejectedFiles);
        }
      },
      [reSelectAll, value, maxFiles, onValueChange, handleRejections]
    );

    const opts = dropzoneOptions
      ? dropzoneOptions
      : { accept, maxFiles, maxSize, multiple };

    const dropzoneState = useDropzone({
      ...opts,
      onDrop,
      onDropRejected: () => setIsFileTooBig(true),
      onDropAccepted: () => setIsFileTooBig(false),
    });

    const getNavigationKeys = useCallback(() => {
      const isHorizontal = orientation === "horizontal";
      const isRtl = direction === "rtl";

      if (!isHorizontal) {
        return { prevKey: "ArrowUp", nextKey: "ArrowDown" };
      }

      return {
        prevKey: isRtl ? "ArrowRight" : "ArrowLeft",
        nextKey: isRtl ? "ArrowLeft" : "ArrowRight",
      };
    }, [orientation, direction]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!value) {
          return;
        }

        const moveNext = () => {
          const nextIndex = activeIndex + 1;
          setActiveIndex(nextIndex > value.length - 1 ? 0 : nextIndex);
        };

        const movePrev = () => {
          const nextIndex = activeIndex - 1;
          setActiveIndex(nextIndex < 0 ? value.length - 1 : nextIndex);
        };

        const { prevKey, nextKey } = getNavigationKeys();

        switch (e.key) {
          case nextKey:
            moveNext();
            break;
          case prevKey:
            movePrev();
            break;
          case "Enter":
          case "Space":
            if (activeIndex === -1) {
              dropzoneState.inputRef.current?.click();
            }
            break;
          case "Delete":
          case "Backspace":
            if (activeIndex !== -1) {
              removeFileFromSet(activeIndex);
              if (value.length - 1 === 0) {
                setActiveIndex(-1);
              } else {
                movePrev();
              }
            }
            break;
          case "Escape":
            setActiveIndex(-1);
            break;
          default:
            break;
        }
      },
      [value, activeIndex, removeFileFromSet, getNavigationKeys, dropzoneState]
    );

    useEffect(() => {
      setIsLOF(value?.length === maxFiles);
    }, [value, maxFiles]);

    return (
      <FileUploaderContext.Provider
        value={{
          dropzoneState,
          isLOF,
          isFileTooBig,
          removeFileFromSet,
          activeIndex,
          setActiveIndex,
          orientation,
          direction,
        }}
      >
        <div
          className={cn(
            "grid w-full overflow-hidden focus:outline-none",
            className,
            {
              "gap-2": value && value.length > 0,
            }
          )}
          dir={dir}
          onKeyDownCapture={handleKeyDown}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </FileUploaderContext.Provider>
    );
  }
);

FileUploader.displayName = "FileUploader";

export const FileUploaderContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const { orientation } = useFileUpload();

  return (
    <div
      aria-description="content file holder"
      {...props}
      className={cn(
        "flex w-full gap-1 rounded-xl px-1",
        orientation === "horizontal" ? "flex-raw flex-wrap" : "flex-col",
        className
      )}
      ref={ref}
    >
      {children}
    </div>
  );
});

FileUploaderContent.displayName = "FileUploaderContent";

export const FileUploaderItem = forwardRef<
  HTMLDivElement,
  { index: number } & React.HTMLAttributes<HTMLDivElement>
>(({ className, index, children, ...props }, ref) => {
  const { removeFileFromSet, activeIndex, direction } = useFileUpload();
  const isSelected = index === activeIndex;
  return (
    <div
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "relative h-6 cursor-pointer justify-between p-1",
        className,
        isSelected ? "bg-muted" : ""
      )}
      ref={ref}
      {...props}
    >
      <div className="flex h-full w-full items-center gap-1.5 font-medium leading-none tracking-tight">
        {children}
      </div>
      <div className="absolute" style={{ display: "contents" }}>
        <button
          className={cn(
            "absolute",
            direction === "rtl" ? "top-1 left-1" : "top-1 right-1"
          )}
          onClick={() => removeFileFromSet(index)}
          type="button"
        >
          <span className="sr-only">remove item {index}</span>
          <IconTrash className="h-4 w-4 duration-200 ease-in-out hover:stroke-destructive" />
        </button>
      </div>
    </div>
  );
});

FileUploaderItem.displayName = "FileUploaderItem";

export const FileInput = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { dropzoneState, isFileTooBig, isLOF } = useFileUpload();
  const rootProps = isLOF ? {} : dropzoneState.getRootProps();
  return (
    <div
      ref={ref}
      {...props}
      className={`relative w-full ${
        isLOF ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
    >
      <div
        className={cn(
          `w-full rounded-lg duration-300 ease-in-out ${
            dropzoneState.isDragAccept
              ? "border-green-500"
              : dropzoneState.isDragReject || isFileTooBig
                ? "border-red-500"
                : "border-gray-300"
          }`,
          className
        )}
        {...rootProps}
      >
        {children}
      </div>
      <Input
        disabled={isLOF}
        ref={dropzoneState.inputRef}
        {...dropzoneState.getInputProps()}
        className={`${isLOF ? "cursor-not-allowed" : ""}`}
      />
    </div>
  );
});

FileInput.displayName = "FileInput";
