"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useToast } from "../components/ui/use-toast"
import { uploadApi } from "../lib/api/upload"
import { getIdToken, waitForTokenReady } from "../lib/auth"

export function useFileUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null

    if (!file) {
      return
    }

    const fileType = file.type
    const isValidType = fileType === "application/pdf" || fileType.startsWith("image/")

    if (!isValidType) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or image file only.",
        variant: "destructive",
      })
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      return
    }

    const maxSize = 10 * 1024 * 1024 // 10MB in bytes
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "File size must be less than 10MB.",
        variant: "destructive",
      })
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      return
    }

    setSelectedFile(file)
    try {
      setIsUploading(true)
      const idToken = getIdToken()
      if (!idToken) {
        throw new Error("Not authenticated")
      }

      await waitForTokenReady()

      const uploadResult = await uploadApi.uploadFile(file, idToken)
      setUploadedFileId(uploadResult.file_id)

      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully.`,
      })
    } catch (error) {
      console.error("File upload error:", error)
      toast({
        title: "Upload failed",
        description: "Failed to upload the file. Please try again.",
        variant: "destructive",
      })
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setUploadedFileId(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return {
    selectedFile,
    uploadedFileId,
    isUploading,
    fileInputRef,
    handleFileSelect,
    handleRemoveFile,
  }
}
