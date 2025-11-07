# File Upload Feature Documentation

## Overview
The TBA-WAAD platform now includes comprehensive file upload functionality for Claims, Members, and Pre-Authorization Approvals. This feature allows users to attach supporting documents (PDF and Excel files) to various entities within the system.

## Implementation Details

### Storage Solution
Since this is a **browser-based application without a backend server**, the file upload system uses:
- **Spark KV Storage API** for file metadata and content storage
- **Base64 Data URLs** for storing file content (suitable for PDFs and Excel files up to 10MB)
- All files are stored client-side and persist across browser sessions

### Supported File Types
- PDF documents (`.pdf`)
- Excel spreadsheets (`.xlsx`, `.xls`)
- Word documents (`.doc`, `.docx`)

### File Size Limits
- Maximum file size: **10MB per file**
- Clear error messages displayed when limit is exceeded

## Features

### 1. File Upload Component (`FileUpload.tsx`)
A reusable component that provides:
- File selection via button click
- File type validation
- File size validation
- Progress feedback during upload
- Toast notifications for success/error states
- Automatic storage in Spark KV

**Usage:**
```tsx
<FileUpload
  category="CLAIM"           // CLAIM | MEMBER | APPROVAL
  entityId={claim.id}        // ID of the entity
  entityReference={claim.claimNumber}  // Display reference
  maxSizeMB={10}            // Optional: default 10MB
/>
```

### 2. File List Component (`FileList`)
Displays uploaded files with:
- File type icons (PDF, Excel, Word)
- File name and size
- Upload timestamp and user
- Download button
- Delete button (conditional)

**Usage:**
```tsx
<FileList
  category="CLAIM"
  entityId={claim.id}
  showDelete={true}  // Optional: default true
/>
```

## Integration Points

### Claims Module
- **File Upload**: Available in the Claim Dialog when reviewing/editing existing claims
- **File View**: Displayed in the Claim View Dialog with download capability
- **Access**: Files can be uploaded during claim review
- **Restriction**: Documents can only be uploaded to saved claims (not during initial creation)

### Members Module
- **File Upload**: Available in the Member Profile Dialog under "Documents" tab
- **File View**: Displayed in a dedicated tab with full document management
- **Use Cases**: ID cards, medical records, insurance documents
- **Access**: Available to all users viewing member profiles

### Pre-Authorization Approvals Module
- **File Upload**: Available in the Approval Details Dialog
- **File View**: Displayed with download capability
- **Access**: Files can be uploaded for any approval request
- **Restriction**: Delete only allowed for pending approvals

## Data Structure

### UploadedFile Type
```typescript
interface UploadedFile {
  id: string                    // Unique file identifier
  filename: string              // Stored filename
  originalName: string          // Original filename from user
  fileType: string             // MIME type
  fileSize: number             // Size in bytes
  category: FileCategory       // CLAIM | MEMBER | APPROVAL
  entityId: string             // ID of associated entity
  entityReference: string      // Display reference (claim#, member name, etc.)
  uploadedBy: string           // User ID
  uploadedByName: string       // User display name
  uploadDate: string           // ISO timestamp
  dataUrl: string              // Base64 data URL
}
```

### Storage Key
All files are stored under the key: `uploaded_files`

## User Experience

### Upload Flow
1. User clicks "Upload File" button
2. File picker opens with type restrictions
3. User selects file
4. System validates file type and size
5. File is converted to base64
6. File metadata and content saved to KV storage
7. Success toast displayed
8. File appears in list immediately

### Download Flow
1. User clicks download button on file card
2. Browser downloads file with original filename
3. Success toast displayed

### Delete Flow
1. User clicks delete button (X icon)
2. File removed from KV storage
3. File removed from display
4. Success toast displayed

## Technical Considerations

### Browser Storage Limits
- Modern browsers support ~5-10MB in localStorage
- Files are stored as base64 (increases size by ~33%)
- Recommend keeping total uploaded files under system limits
- Consider implementing cleanup for old files if needed

### Security
- Files are scoped to entities (Claims, Members, Approvals)
- User context captured on upload (name and ID)
- No file content validation beyond type/size
- Files stored in user's browser only

### Performance
- Files load on-demand when viewing entity details
- Lazy loading implemented for file lists
- No impact on initial app load time
- Download is instant (no server roundtrip)

## Future Enhancements (Not Implemented)
The original task requested Spring Boot backend integration. Since this is a frontend-only application, the following backend features are NOT available:
- ❌ Server-side file storage in `/uploads/` directory
- ❌ Database table `uploaded_files` with metadata
- ❌ `/api/files/upload` REST endpoint
- ❌ Server-side file validation
- ❌ File compression
- ❌ Virus scanning

These features would require a backend server, which is outside the scope of this Spark application.

## Testing the Feature

1. **Test Claims File Upload:**
   - Navigate to Claims module
   - Click "Review" on any pending claim
   - Scroll to "Supporting Documents" section
   - Click "Upload File" and select a PDF/Excel file
   - Verify file appears in list
   - Click download icon to verify download works

2. **Test Members File Upload:**
   - Navigate to Members module
   - Click view (eye icon) on any member
   - Click "Documents" tab
   - Upload and verify files

3. **Test Approvals File Upload:**
   - Navigate to Pre-Authorizations module
   - Click view (eye icon) on any approval
   - Scroll to documents section
   - Upload and verify files

## Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support with native file pickers
