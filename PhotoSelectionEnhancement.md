# Enhance Existing Photo Selection System (Do NOT Rewrite Existing Functionality)

I already have a fully working Photographer Client Photo Selection System. Do NOT rebuild or rewrite the existing project. First analyze the current codebase and integrate this feature into the existing architecture while preserving all current functionality.

## Current Working Flow

Currently the application works like this:

- Vendor creates a Photo Selection Project.
- A unique project folder is automatically created.
- Vendor uploads compressed/preview photos.
- Client receives a unique selection link.
- Client selects photos.
- Vendor receives the selected photos.
- Vendor clicks "Create Selected Photos Folder".
- Browser opens showDirectoryPicker().
- Vendor selects the original local folder.
- The application matches preview photos with original photos using original filenames.
- A new folder is created inside the selected directory.
- Selected original photos are copied into that folder.

Everything above is already working perfectly. Do NOT change this behavior.

---

# New Feature: Event-wise Folder Management

Currently every project contains one flat collection of photos.

I want every project to support multiple event folders.

Example:

Rahul & Priya Wedding
│
├── Mehndi
├── Haldi
├── Wedding
├── Reception
└── + New Folder

When a vendor creates a new project, these folders should be created automatically:

- Mehndi
- Haldi
- Wedding
- Reception

Also provide a "+ New Folder" button so vendors can create unlimited custom folders.

Examples:

- Engagement
- Cocktail
- Sangeet
- Pre Wedding
- Reception Night
- Birthday
- Baby Shower
- Ring Ceremony

There should NOT be any hardcoded logic limiting folder names. The default folders are only created initially.

Each folder should have:

folderId
projectId
folderName
displayOrder
createdAt
updatedAt

---

# Vendor Dashboard Changes

Inside every project, instead of showing one upload section, show folder cards.

Example:

Rahul & Priya Wedding

+ New Folder

--------------------------------
📁 Mehndi

320 Photos

Upload Photos
--------------------------------

📁 Haldi

280 Photos

Upload Photos
--------------------------------

📁 Wedding

1450 Photos

Upload Photos
--------------------------------

📁 Reception

410 Photos

Upload Photos

Vendor can upload photos only inside the selected folder.

---

# Upload Flow

Do NOT change my current upload logic.

The only enhancement is:

Vendor first selects a folder.

Then uploads photos into that folder.

Each uploaded photo must now store:

photoId
projectId
folderId
originalFileName
originalBaseName
previewUrl
cloudinaryPublicId
isSelected

Everything else remains exactly the same.

The original filename must still be preserved because it is required for matching with original photos later.

---

# Cloudinary Structure

Currently a unique project folder is already created.

Keep that behavior.

Inside the project, create event folders.

Example:

Project_3ad829/

    Mehndi/
        img1.webp
        img2.webp

    Haldi/
        img3.webp

    Wedding/
        img4.webp

    Reception/
        img5.webp

Do not flatten all uploads into one folder.

---

# Client Side Changes

Currently client opens the link and immediately sees all photos.

Replace that with an Event Selection screen.

Example:

Choose Event

📁 Mehndi (320 Photos)

📁 Haldi (280 Photos)

📁 Wedding (1450 Photos)

📁 Reception (410 Photos)

When client clicks an event folder,

open the existing gallery.

Do NOT redesign my gallery.

Do NOT change gallery UI.

Simply display photos belonging to that folder.

---

# Global Selection Logic

Selection must remain GLOBAL across every folder.

Example:

Maximum Selection = 200

Client selects:

Mehndi = 25

Haldi = 30

Wedding = 110

Reception = 35

Total Selected:

200 / 200

The selection counter should remain global.

If the client reaches the maximum limit, no further selections should be allowed regardless of the current folder.

---

# Vendor Selection Summary

After client submits,

show grouped statistics.

Example:

Selection Completed

Mehndi
25 Selected

Haldi
30 Selected

Wedding
110 Selected

Reception
35 Selected

Total Selected
200

---

# Local Folder Creation Enhancement

Currently my application creates one destination folder and copies every selected original photo there.

Instead I want this behavior.

Suppose vendor selects:

Rahul-Priya Originals/

The application should automatically create:

Rahul-Priya Originals/

└── Rahul_Priya_Selected_Album/

        ├── Mehndi/

        ├── Haldi/

        ├── Wedding/

        ├── Reception/

        └── Any Custom Folder/

Instead of copying every selected photo into one folder,

copy every original photo into its corresponding event folder.

Example:

Wedding/

DSC_0001.CR3

DSC_0002.CR3

DSC_0003.CR3

Haldi/

DSC_1001.CR3

DSC_1002.CR3

Mehndi/

DSC_2200.CR3

Reception/

DSC_4300.CR3

Do NOT modify the existing filename matching logic.

Do NOT modify the existing File System Access API flow.

Only change the destination folder.

---

# Custom Folder Support

If vendor creates

Pre Wedding

then automatically create

Rahul_Priya_Selected_Album/

Pre Wedding/

and copy selected photos there.

Folder creation must be dynamic.

---

# Database Changes

Create a new collection/model:

ProjectFolder

Fields:

folderId

projectId

folderName

displayOrder

createdAt

updatedAt

Photos should reference:

folderId

Selections should continue referencing only photoIds.

Folder information can be derived through photo relationships.

---

# REST APIs

Add APIs for:

Create Folder

Rename Folder

Delete Empty Folder

Get Project Folders

Upload Photos To Folder

Get Folder Photos

Get Folder-wise Selection Summary

Reuse existing APIs wherever possible.

Avoid duplicate logic.

---

# UI Requirements

Vendor Dashboard

Project Name

+ New Folder

📁 Mehndi

Upload Photos

320 Photos

📁 Haldi

Upload Photos

280 Photos

📁 Wedding

Upload Photos

1450 Photos

📁 Reception

Upload Photos

410 Photos

Client Side

Choose Event

📁 Mehndi

📁 Haldi

📁 Wedding

📁 Reception

Clicking a folder should open the existing gallery page.

---

# Important Technical Constraints

- Do NOT rewrite the existing application.
- Analyze the current architecture before making changes.
- Extend the current implementation.
- Preserve all existing functionality.
- Keep current upload batching.
- Keep Cloudinary upload logic.
- Keep MongoDB structure wherever possible.
- Keep File System Access API implementation.
- Keep filename matching logic.
- Keep gallery UI.
- Keep selection UI.
- Keep selection submission flow.
- Keep project creation flow.
- Only extend the system with event folders.

---

# Development Approach

Before writing any code:

1. Analyze the current codebase.
2. Identify existing models that require modification.
3. Identify existing APIs that require updates.
4. Explain the new database relationships.
5. Explain the new frontend flow.
6. Explain the new backend flow.
7. Explain how folder creation integrates with the existing upload system.
8. Explain how the final local folder copying process will work.

Then implement the feature step-by-step.

For every step explain:

- Which files are modified.
- Which new files are created.
- Why the changes are required.
- How the data flows.
- How to test the feature.

Generate production-quality code following the existing project architecture and coding style instead of creating a new implementation.