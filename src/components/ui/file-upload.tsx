"use client";

import { IconX } from "@tabler/icons-react";
import {
  createContext,
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  type DropzoneOptions,
  type DropzoneState,
  type FileRejection,
  useDropzone,
} from "react-dropzone";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/ui";

type DirectionOptions = "rtl" | "ltr" | undefined;

interface FileUploaderContextType {
  activeIndex: number;
  direction: DirectionOptions;
  dropzoneState: DropzoneState;
  isFileTooBig: boolean;
  isLOF: boolean;
  orientation: "horizontal" | "vertical";
  removeFileFromSet: (index: number) => void;
  setActiveIndex: Dispatch<SetStateAction<number>>;
}

const FileUploaderContext = createContext<FileUploaderContextType | null>(null);

export const useFileUpload = () => {
  const context = useContext(FileUploaderContext);
  if (!context) {
    throw new Error("useFileUpload must be used within a FileUploaderProvider");
  }
  return context;
};

interface FileUploaderProps {
  dropzoneOptions: DropzoneOptions;
  onValueChange: (value: File[] | null) => void;
  orientation?: "horizontal" | "vertical";
  reSelect?: boolean;
  value: File[] | null;
}

export const FileUploader = ({
  className,
  dropzoneOptions,
  value,
  onValueChange,
  reSelect,
  orientation = "vertical",
  children,
  dir,
  ref,
  ...props
}: (FileUploaderProps & React.HTMLAttributes<HTMLDivElement>) & {
  ref?: RefObject<HTMLDivElement | null>;
}) => {
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
      const newFiles = value.filter((_, index) => index !== i);
      onValueChange(newFiles);
    },
    [value, onValueChange]
  );

  const handleRejectionErrors = useCallback(
    (rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length === 0) {
        return;
      }

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
      const newValues: File[] = value ? [...value] : [];

      if (reSelectAll) {
        newValues.splice(0, newValues.length);
      }

      for (const file of acceptedFiles) {
        if (newValues.length < maxFiles) {
          newValues.push(file);
        }
      }

      onValueChange(newValues);
      handleRejectionErrors(rejectedFiles);
    },
    [reSelectAll, value, maxFiles, onValueChange, handleRejectionErrors]
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

  const getPrevKey = useCallback(
    (orient: "horizontal" | "vertical", dir: DirectionOptions): string => {
      if (orient === "horizontal") {
        return dir === "ltr" ? "ArrowLeft" : "ArrowRight";
      }
      return "ArrowUp";
    },
    []
  );

  const getNextKey = useCallback(
    (orient: "horizontal" | "vertical", dir: DirectionOptions): string => {
      if (orient === "horizontal") {
        return dir === "ltr" ? "ArrowRight" : "ArrowLeft";
      }
      return "ArrowDown";
    },
    []
  );

  const handleNavigationKey = useCallback(
    (key: string) => {
      const nextIndex = activeIndex + 1;
      const prevIndex = activeIndex - 1;
      const nextKeyValue = getNextKey(orientation, direction);
      const prevKeyValue = getPrevKey(orientation, direction);

      if (key === nextKeyValue) {
        setActiveIndex(nextIndex > (value?.length ?? 0) - 1 ? 0 : nextIndex);
      } else if (key === prevKeyValue) {
        setActiveIndex(prevIndex < 0 ? (value?.length ?? 0) - 1 : prevIndex);
      }
    },
    [activeIndex, value, orientation, direction, getNextKey, getPrevKey]
  );

  const handleDeleteKey = useCallback(() => {
    if (activeIndex !== -1 && value) {
      removeFileFromSet(activeIndex);
      if (value.length - 1 === 0) {
        setActiveIndex(-1);
        return;
      }
      const prevIndex = activeIndex - 1;
      setActiveIndex(prevIndex < 0 ? value.length - 1 : prevIndex);
    }
  }, [activeIndex, value, removeFileFromSet]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (!value) {
        return;
      }

      const nextKey = getNextKey(orientation, direction);
      const prevKey = getPrevKey(orientation, direction);

      switch (e.key) {
        case nextKey:
        case prevKey:
          handleNavigationKey(e.key);
          break;
        case "Enter":
        case " ":
          if (activeIndex === -1) {
            dropzoneState.inputRef.current?.click();
          }
          break;
        case "Delete":
        case "Backspace":
          handleDeleteKey();
          break;
        case "Escape":
          setActiveIndex(-1);
          break;
        default:
          break;
      }
    },
    [
      value,
      activeIndex,
      dropzoneState,
      handleNavigationKey,
      handleDeleteKey,
      getNextKey,
      getPrevKey,
      orientation,
      direction,
    ]
  );

  useEffect(() => {
    if (!value) {
      return;
    }
    setIsLOF(value.length === maxFiles);
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
};

FileUploader.displayName = "FileUploader";

export const FileUploaderContent = ({
  children,
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  ref?: RefObject<HTMLDivElement | null>;
}) => {
  const { orientation } = useFileUpload();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      aria-description="content file holder"
      className={cn("w-full px-1")}
      ref={containerRef}
    >
      <div
        {...props}
        className={cn(
          "flex gap-1 rounded-xl",
          orientation === "horizontal" ? "flex-row flex-wrap" : "flex-col",
          className
        )}
        ref={ref}
      >
        {children}
      </div>
    </div>
  );
};

FileUploaderContent.displayName = "FileUploaderContent";

export const FileUploaderItem = ({
  className,
  index,
  children,
  ref,
  ...props
}: { index: number } & React.HTMLAttributes<HTMLDivElement> & {
    ref?: RefObject<HTMLDivElement | null>;
  }) => {
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
      <button
        className={cn(
          "absolute",
          direction === "rtl" ? "top-1 left-1" : "top-1 right-1"
        )}
        onClick={() => removeFileFromSet(index)}
        type="button"
      >
        <span className="sr-only">remove item {index}</span>
        <IconX className="h-4 w-4 duration-200 ease-in-out hover:stroke-destructive" />
      </button>
    </div>
  );
};

FileUploaderItem.displayName = "FileUploaderItem";

export const FileInput = ({
  className,
  children,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  ref?: RefObject<HTMLDivElement | null>;
}) => {
  const { dropzoneState, isFileTooBig, isLOF } = useFileUpload();
  const rootProps = isLOF ? {} : dropzoneState.getRootProps();

  const getBorderColor = (): string => {
    if (dropzoneState.isDragAccept) {
      return "border-green-500";
    }
    if (dropzoneState.isDragReject || isFileTooBig) {
      return "border-red-500";
    }
    return "border-gray-300";
  };

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
          `w-full rounded-lg duration-300 ease-in-out ${getBorderColor()}`,
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
};

FileInput.displayName = "FileInput";
