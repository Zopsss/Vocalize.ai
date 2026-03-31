import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DownloadIcon,
  FileIcon,
  Loader2,
  TrashIcon,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";

import { useTRPC } from "@/trpc/client";

interface UserResumeFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const UserResumeForm = ({
  onSuccess,
  onCancel,
}: UserResumeFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [files, setFiles] = useState<File[]>([]);

  const { data: resume, isLoading: isResumeLoading } = useQuery({
    ...trpc.resume.get.queryOptions(),
    refetchInterval: (query) => {
      const data = query.state.data as { resumeObject: unknown } | undefined;
      if (data && !data.resumeObject) {
        return 2000;
      }
      return false;
    },
  });

  const deleteResume = useMutation({
    ...trpc.resume.delete.mutationOptions(),
    onSuccess: async () => {
      toast.success("Resume deleted successfully");
      await queryClient.invalidateQueries(trpc.resume.get.queryOptions());
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // @ts-nocheck
  const resumeObj = resume?.resumeObject as Record<string, unknown> | undefined;
  const resumeError =
    typeof resumeObj?.error === "string" ? resumeObj.error : undefined;

  useEffect(() => {
    // If there's an error block from the AI step, alert the user and auto-delete
    if (resumeError) {
      toast.error(resumeError);
      if (!deleteResume.isPending) {
        deleteResume.mutate();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resume]);

  const getPresignedUrl = useMutation(
    trpc.resume.getPresignedUrl.mutationOptions()
  );

  const saveResume = useMutation(
    trpc.resume.save.mutationOptions({
      onSuccess: async () => {
        toast.success("Resume saved successfully");
        await queryClient.invalidateQueries(trpc.resume.get.queryOptions());
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const handleDownload = async () => {
    try {
      const data = await queryClient.fetchQuery(
        trpc.resume.getDownloadUrl.queryOptions()
      );
      window.open(data.url, "_blank");
    } catch (error) {
      toast.error((error as Error).message || "Failed to get download URL");
    }
  };

  const handleSave = async () => {
    if (files.length === 0) {
      toast.error("Please select a file to upload");
      return;
    }

    const file = files[0];

    try {
      // 1. Get presigned URL
      const { url, key } = await getPresignedUrl.mutateAsync({
        contentType: file.type,
      });

      // 2. Upload to S3
      const uploadResponse = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file to S3");
      }

      // 3. Save to database
      await saveResume.mutateAsync({
        key,
        fileName: file.name,
      });
    } catch (error) {
      toast.error(
        (error as Error).message || "Something went wrong during upload"
      );
    }
  };

  const isPending =
    getPresignedUrl.isPending || saveResume.isPending || deleteResume.isPending;

  return (
    <div className="flex flex-col items-center gap-y-4 flex-1">
      {isResumeLoading || (resume && !resume.resumeObject) ? (
        <div className="flex w-full justify-center p-4">
          <div className="flex flex-col items-center gap-y-2">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Uploading and analyzing resume...
            </p>
          </div>
        </div>
      ) : resume && !(resume.resumeObject as Record<string, unknown>)?.error ? (
        <div className="flex w-full items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-start gap-x-5 min-w-0">
            <span className="bg-primary text-primary-foreground p-3 rounded-md [&>svg]:size-5">
              <FileIcon />
            </span>
            <div className="min-w-0">
              <p className="text-sm text-zinc-700">Current Resume</p>
              <h3 className="font-semibold wrap-break-word">
                {resume.fileName}
              </h3>
            </div>
          </div>
          <div className="flex items-center">
            <Button
              variant={"ghost"}
              className="hover:bg-muted-foreground/4"
              onClick={handleDownload}
              disabled={isPending}
            >
              <DownloadIcon />
            </Button>
            <Button
              variant={"ghost"}
              className="hover:bg-muted-foreground/4"
              onClick={() => deleteResume.mutate()}
              disabled={isPending}
            >
              {deleteResume.isPending ? (
                <Loader2 className="size-4 animate-spin text-destructive" />
              ) : (
                <TrashIcon className="text-destructive" />
              )}
            </Button>
          </div>
        </div>
      ) : null}

      <ResumeUpload files={files} setFiles={setFiles} />

      <div className="flex w-full items-center justify-between">
        <Button variant={"outline"} onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isPending || files.length === 0}>
          {isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
          Save
        </Button>
      </div>
    </div>
  );
};

interface ResumeUploadProps {
  files: File[];
  setFiles: (files: File[]) => void;
}

const ResumeUpload = ({ files, setFiles }: ResumeUploadProps) => {
  const onValueChange = useCallback(
    (newFiles: File[]) => {
      // Always keep only the latest file
      setFiles(newFiles.slice(-1));
    },
    [setFiles]
  );

  const onFileReject = useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);

  const file = files[0];

  return (
    <FileUpload
      maxFiles={1}
      maxSize={5 * 1024 * 1024}
      className="w-full max-w-md"
      value={files}
      onValueChange={onValueChange}
      onFileReject={onFileReject}
    >
      <FileUploadDropzone>
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex items-center justify-center rounded-full border p-2.5">
            <Upload className="size-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">Drag & drop your resume here</p>
          <p className="text-xs text-muted-foreground">
            Or click to browse (max 5MB file size)
          </p>
        </div>
        <FileUploadTrigger asChild>
          <Button variant="outline" size="sm" className="mt-2 w-fit">
            Browse files
          </Button>
        </FileUploadTrigger>
      </FileUploadDropzone>
      <FileUploadList>
        {file && (
          <FileUploadItem value={file}>
            <FileUploadItemPreview />
            <FileUploadItemMetadata />
            <FileUploadItemDelete asChild>
              <Button variant="ghost" size="icon" className="size-7">
                <X className="size-4" />
              </Button>
            </FileUploadItemDelete>
          </FileUploadItem>
        )}
      </FileUploadList>
    </FileUpload>
  );
};
