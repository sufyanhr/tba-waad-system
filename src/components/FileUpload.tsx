import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UploadSimple, X, FilePdf, FileXls, FileDoc, File as FileIcon, DownloadSimple } from '@phosphor-icons/react'
import { UploadedFile, FileCategory } from '@/types'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'

interface FileUploadProps {
  category: FileCategory
  entityId: string
  entityReference: string
  onUploadComplete?: (file: UploadedFile) => void
  maxSizeMB?: number
  acceptedTypes?: string[]
}

export function FileUpload({
  category,
  entityId,
  entityReference,
  onUploadComplete,
  maxSizeMB = 10,
  acceptedTypes = ['.pdf', '.xlsx', '.xls', '.doc', '.docx'],
}: FileUploadProps) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSizeMB}MB`)
      return
    }

    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
    if (!acceptedTypes.includes(fileExtension)) {
      toast.error(`File type ${fileExtension} is not supported`)
      return
    }

    setUploading(true)

    try {
      const dataUrl = await readFileAsDataURL(file)
      
      const uploadedFile: UploadedFile = {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        filename: `${entityId}-${Date.now()}-${file.name}`,
        originalName: file.name,
        fileType: file.type || 'application/octet-stream',
        fileSize: file.size,
        category,
        entityId,
        entityReference,
        uploadedBy: user?.id || 'unknown',
        uploadedByName: user?.name || 'Unknown User',
        uploadDate: new Date().toISOString(),
        dataUrl,
      }

      const existingFiles = await window.spark.kv.get<UploadedFile[]>('uploaded_files') || []
      await window.spark.kv.set('uploaded_files', [...existingFiles, uploadedFile])

      toast.success('File uploaded successfully')
      onUploadComplete?.(uploadedFile)
      
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('File upload error:', error)
      toast.error('Failed to upload file')
    } finally {
      setUploading(false)
    }
  }

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full"
      >
        <UploadSimple size={18} className="mr-2" />
        {uploading ? 'Uploading...' : 'Upload File'}
      </Button>
      <p className="text-xs text-muted-foreground">
        Accepted: {acceptedTypes.join(', ')} (max {maxSizeMB}MB)
      </p>
    </div>
  )
}

interface FileListProps {
  category: FileCategory
  entityId: string
  onDelete?: (fileId: string) => void
  showDelete?: boolean
}

export function FileList({ category, entityId, onDelete, showDelete = true }: FileListProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFiles()
  }, [category, entityId])

  const loadFiles = async () => {
    try {
      const allFiles = await window.spark.kv.get<UploadedFile[]>('uploaded_files') || []
      const entityFiles = allFiles.filter(
        (f) => f.category === category && f.entityId === entityId
      )
      setFiles(entityFiles)
    } catch (error) {
      console.error('Failed to load files:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (fileId: string) => {
    try {
      const allFiles = await window.spark.kv.get<UploadedFile[]>('uploaded_files') || []
      const updatedFiles = allFiles.filter((f) => f.id !== fileId)
      await window.spark.kv.set('uploaded_files', updatedFiles)
      setFiles(files.filter((f) => f.id !== fileId))
      toast.success('File deleted successfully')
      onDelete?.(fileId)
    } catch (error) {
      console.error('Failed to delete file:', error)
      toast.error('Failed to delete file')
    }
  }

  const handleDownload = (file: UploadedFile) => {
    const link = document.createElement('a')
    link.href = file.dataUrl
    link.download = file.originalName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('File downloaded')
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FilePdf size={20} className="text-red-500" />
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return <FileXls size={20} className="text-green-600" />
    if (fileType.includes('word') || fileType.includes('document')) return <FileDoc size={20} className="text-blue-600" />
    return <FileIcon size={20} className="text-gray-500" />
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="text-sm text-muted-foreground">Loading files...</div>
    )
  }

  if (files.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">No files uploaded yet</div>
    )
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <Card key={file.id} className="p-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">{getFileIcon(file.fileType)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.originalName}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.fileSize)} • Uploaded by {file.uploadedByName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(file.uploadDate)}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(file)}
                    className="h-8 px-2"
                  >
                    <DownloadSimple size={16} />
                  </Button>
                  {showDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(file.id)}
                      className="h-8 px-2 text-destructive hover:text-destructive"
                    >
                      <X size={16} />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
