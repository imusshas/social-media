"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRef } from "react";
import { Cropper, ReactCropperElement } from "react-cropper";

import "cropperjs/dist/cropper.css";

type CropImageDialogProps = {
  src: string;
  cropAspectRatio: number;
  onCropped: (blob: Blob | null) => void;
  onClose: () => void;
};

export function CropImageDialog({
  src,
  cropAspectRatio,
  onCropped,
  onClose,
}: CropImageDialogProps) {
  const cropperRef = useRef<ReactCropperElement>(null);

  function crop() {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) {
      return;
    }

    cropper.getCroppedCanvas().toBlob((blob) => onCropped(blob), "image/webp");
    onClose();
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        <Cropper
          src={src}
          aspectRatio={cropAspectRatio}
          guides={false}
          zoomable={false}
          ref={cropperRef}
          className="mx-auto size-fit"
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"destructive"} onClick={onClose}>
              Cancel
            </Button>
          </DialogClose>

          <Button variant={"outline"} onClick={crop}>
            Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
