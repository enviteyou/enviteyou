I want you to build a complete Photographer Client Photo Selection System from scratch.

First understand the complete business requirement before writing code.

PROJECT IDEA

This platform is used by photographers/vendors to send compressed wedding/event photos to their clients so the client can select photos for an album.

The photographer has around 1000–5000 original high-quality photos stored locally on their computer.

The photographer will upload compressed/preview versions of those photos to the platform.

The original high-quality photos must remain on the photographer's local computer and must NOT be uploaded to the cloud.

The client receives a unique URL, views the compressed preview photos, selects the required number of photos, and submits the selection.

After the client submits the selection, the photographer opens the vendor dashboard.

The vendor clicks a button, selects the local folder containing the original high-quality photos, and the website automatically creates a new folder and copies all client-selected ORIGINAL photos into that folder.

IMPORTANT:

This is a web application.

Do NOT use CMD, PowerShell, shell commands, child_process, exec, or system-level commands.

Use the browser File System Access API for local folder access.

Use showDirectoryPicker().

==================================================
TECH STACK
==================================================

Frontend:
- Next.js App Router
- JavaScript
- Tailwind CSS

Backend:
- Node.js
- Express.js

Database:
- MongoDB
- Mongoose

Cloud Image Storage:
- Cloudinary

Use REST APIs.

==================================================
COMPLETE APPLICATION FLOW
==================================================

STEP 1: VENDOR CREATES A PHOTO SELECTION PROJECT

Vendor dashboard should have:

"My Photo Selections"

Button:

"+ Create Selection"

When clicked, ask:

- Project Name
- Client Name
- Client Email
- Maximum Photo Selection Limit

Example:

Project Name: Rahul & Priya Wedding
Client Name: Rahul
Selection Limit: 200

After creating the project, generate a unique project ID.

==================================================
STEP 2: VENDOR SELECTS PREVIEW PHOTOS
==================================================

Show:

"Upload Photos"

Allow the vendor to select multiple photos.

The vendor may select 1000–5000 photos.

For every selected photo, preserve the original filename.

Example:

Original selected file:

DSC_8492.JPG

The preview can be compressed and converted before uploading.

But the database MUST preserve:

photoId
projectId
originalFileName
originalBaseName
previewUrl
cloudinaryPublicId
isSelected

Example database record:

{
  photoId: "ph_unique_id",
  projectId: "project_id",
  originalFileName: "DSC_8492.JPG",
  originalBaseName: "DSC_8492",
  previewUrl: "cloudinary_url",
  cloudinaryPublicId: "cloudinary_id",
  isSelected: false
}

IMPORTANT:

Never lose the original filename.

The original filename is required later to match the preview photo with the original high-quality local photo.

==================================================
STEP 3: UPLOAD PREVIEW PHOTOS
==================================================

Upload preview photos to Cloudinary.

Do not upload the original high-quality photos.

Show upload progress:

Uploading Photos

342 / 2000

[████████░░░░░░] 17%

Handle large photo collections efficiently.

Do not upload all 2000 photos simultaneously.

Use controlled batch/concurrent uploads.

Handle failed uploads.

Show:

Successfully Uploaded: 1987
Failed: 13

Allow retrying failed uploads.

==================================================
STEP 4: CREATE CLIENT SELECTION URL
==================================================

After upload completion, generate a unique shareable client URL.

Example:

/select/{selectionToken}

The selectionToken must be random and difficult to guess.

Vendor dashboard should show:

Client Selection Link

[ Copy Link ]

The vendor sends this link to the client.

==================================================
STEP 5: CLIENT PHOTO SELECTION PAGE
==================================================

The client does NOT need to log in.

The client opens:

/select/{selectionToken}

Show:

Project Name
Client Name

Example:

Rahul & Priya Wedding

"Select 200 Photos for Your Album"

Display all preview photos in a responsive gallery.

IMPORTANT:

There may be 2000–5000 photos.

Do NOT render every full-resolution image at once.

Use:

- Lazy loading
- Thumbnail-sized Cloudinary images
- Pagination, infinite scroll, or virtualization
- Efficient state management

Each photo should be selectable.

Selected photo UI:

- Show check icon
- Show selected overlay
- Show selection number if possible

Example:

Selected 143 / 200

The client must not be able to select more than the configured selection limit.

When the limit is reached:

"You can select a maximum of 200 photos."

Allow:

- Select photo
- Unselect photo
- Fullscreen photo preview
- Next photo
- Previous photo
- Mobile swipe-friendly experience

==================================================
STEP 6: CLIENT SUBMITS SELECTION
==================================================

Show:

Selected 200 / 200

[ Submit Selection ]

Before submission, show confirmation:

"You selected 200 photos. After submitting, your photographer will receive your selection."

Buttons:

Cancel
Confirm Selection

On confirmation:

Save selected photo IDs in MongoDB.

Store:

projectId
selectedPhotoIds
submittedAt
selectionStatus

Example:

{
  projectId: "...",
  selectedPhotoIds: [
    "ph_001",
    "ph_008",
    "ph_021"
  ],
  submittedAt: Date,
  selectionStatus: "completed"
}

Do NOT store photo binary data for client selection.

Only store photo IDs/references.

==================================================
STEP 7: VENDOR DASHBOARD
==================================================

Vendor dashboard should show project cards.

Example:

Rahul & Priya Wedding

2000 Photos

Selection:
200 / 200

Status:
Selection Completed

Button:

"Create Selected Photos Folder"

Only show or enable this button after the client has submitted the selection.

==================================================
STEP 8: SELECT ORIGINAL LOCAL PHOTO FOLDER
==================================================

When the vendor clicks:

"Create Selected Photos Folder"

Use:

window.showDirectoryPicker()

Ask the vendor to select the ORIGINAL high-quality photo folder.

Example folder:

Rahul-Priya-Original

The folder may contain:

DSC_8491.JPG
DSC_8492.JPG
DSC_8493.JPG
DSC_8494.CR3
DSC_8495.NEF

The browser must receive a FileSystemDirectoryHandle.

Do NOT ask for or depend on the full local file path.

Do NOT use input type="file" for this functionality.

Use the File System Access API.

==================================================
STEP 9: MATCH CLIENT SELECTED PHOTOS WITH ORIGINAL PHOTOS
==================================================

Fetch selected photo records from the backend.

Example:

[
  {
    photoId: "ph_001",
    originalFileName: "DSC_8492.JPG",
    originalBaseName: "DSC_8492"
  },
  {
    photoId: "ph_002",
    originalFileName: "DSC_9121.JPG",
    originalBaseName: "DSC_9121"
  }
]

Read the selected local directory.

Create an efficient map/index of local files.

Example:

Map {
  "DSC_8492" => FileSystemFileHandle,
  "DSC_9121" => FileSystemFileHandle
}

Match using normalized originalBaseName.

Matching should be case-insensitive.

Example:

Cloud preview:

DSC_8492.webp

Database:

originalBaseName = DSC_8492

Original local photo:

DSC_8492.CR3

This should MATCH.

Supported original extensions may include:

.jpg
.jpeg
.png
.cr3
.cr2
.nef
.arw
.dng
.raf

Do not depend only on the file extension.

Normalize filenames carefully.

Detect duplicate base names.

If duplicate matches exist, do NOT silently choose a random file.

Report the duplicate to the vendor.

==================================================
STEP 10: CREATE SELECTED PHOTOS FOLDER
==================================================

Inside the selected original folder, automatically create:

"Selected Album Photos"

Use:

directoryHandle.getDirectoryHandle(
  "Selected Album Photos",
  { create: true }
)

If the folder already exists, handle it safely.

Do not accidentally delete existing files.

==================================================
STEP 11: COPY ORIGINAL PHOTOS
==================================================

For every selected photo:

1. Find the matching original FileSystemFileHandle.

2. Get the original File:

sourceFileHandle.getFile()

3. Create a destination file:

destinationDirectoryHandle.getFileHandle(
  originalFile.name,
  { create: true }
)

4. Create writable stream:

destinationFileHandle.createWritable()

5. Write the original File/Blob.

6. Close the writable stream.

Conceptual flow:

Original File
     ↓
Read File / Blob
     ↓
Create Destination File
     ↓
Write Original Bytes
     ↓
Close Writable
     ↓
Copied Successfully

Do NOT compress the original photo.

Do NOT modify image quality.

Do NOT convert image format.

The copied file must contain the original bytes.

==================================================
STEP 12: COPY PROGRESS UI
==================================================

Show a progress modal.

Example:

Creating Selected Album

Copying Original Photos...

67 / 200

[████████░░░░░░] 34%

Current File:

DSC_8492.CR3

Do not freeze the UI.

Process files carefully.

Handle individual file copy failures.

At completion show:

Selected Album Created Successfully

Successfully Copied: 197

Missing Photos: 2

Failed: 1

Folder:

Selected Album Photos

==================================================
STEP 13: MISSING PHOTO HANDLING
==================================================

If a selected photo cannot be found in the original folder:

Do not stop the complete process.

Continue copying other photos.

Create a missing photos result.

Example:

Missing Photos:

DSC_8492
DSC_9211

Allow vendor to:

- View missing photo names
- Copy missing names
- Download a missing-photo report as TXT or CSV if practical

==================================================
SECURITY AND BROWSER REQUIREMENTS
==================================================

The application must clearly explain:

"Your original photos stay on your device. EnviteYou only accesses the folder you explicitly select."

Use the File System Access API only after a user interaction such as a button click.

Handle:

NotAllowedError
AbortError
Permission denied
Unsupported browser

File System Access API support is not universal.

Detect support using:

"showDirectoryPicker" in window

If unsupported, show a clear message recommending a compatible Chromium-based browser.

Do not fake browser support.

==================================================
ARCHITECTURE REQUIREMENTS
==================================================

Separate the code into reusable modules.

Suggested frontend structure:

app/
  dashboard/
  select/[token]/

components/
  PhotoGallery/
  PhotoCard/
  PhotoViewer/
  SelectionCounter/
  UploadProgress/
  CopyProgressModal/

services/
  api.js
  cloudinary.js

utils/
  fileSystem.js
  fileMatching.js
  filename.js

Backend structure:

controllers/
models/
routes/
services/
middleware/
utils/

Create proper MongoDB models for:

User/Vendor
PhotoSelectionProject
Photo

Create clean REST APIs.

==================================================
IMPORTANT DEVELOPMENT INSTRUCTIONS
==================================================

Do not build everything in one file.

Do not use fake mock functionality for the core File System Access API flow.

Write production-quality, readable code.

Use async/await.

Add proper error handling.

Add comments only where the logic is difficult.

Avoid unnecessary dependencies.

Before writing code:

1. Analyze the complete requirement.
2. Design the database schemas.
3. Design REST API endpoints.
4. Design frontend folder structure.
5. Explain the end-to-end data flow.
6. Identify technical risks.

Then implement the application STEP BY STEP.

Do not skip steps.

After completing each major step, explain:

- What files were created
- What the code does
- How data flows
- How to test the feature

The most important feature is:

CLIENT SELECTS COMPRESSED PREVIEW PHOTOS
        ↓
DATABASE STORES SELECTED PHOTO IDs
        ↓
VENDOR SELECTS ORIGINAL LOCAL FOLDER
        ↓
WEBSITE MATCHES SELECTED PHOTO NAMES
        ↓
WEBSITE CREATES "SELECTED ALBUM PHOTOS"
        ↓
WEBSITE COPIES SELECTED ORIGINAL HIGH-QUALITY PHOTOS INTO THAT FOLDER

Start by analyzing the architecture and existing codebase if one exists.

If an existing codebase is available, inspect it first and integrate the feature into the current architecture instead of rebuilding the entire project unnecessarily.