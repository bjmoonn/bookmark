## Criteria

Client-side routing with React Router
* [x] At least 4 routes: / (home), /folders, /tags, /settings
* [x] 2 routes with URL parameters: /folders/[id], /tags/[id]
* [x] Nested routes: Using Next.js app router with (routes) directory
* [x] Active links with unique styling: Navigation component shows active state

AJAX requests for each type
* [x] GET: Fetching linkPreview, bookmarks, tags, folders
* [x] POST: Creating new bookmarks, tags, folders
* [x] PATCH: Updating bookmarks, tags, folders
* [x] DELETE: Deleting bookmarks, tags, folders

API Resources and Relationships
* [x] 5+ API Resources
* [x] 3+ Relationships

Form Elements
* [x] Input: Link/Tag/Folder creation field
* [x] Textarea: Summary field in LinkItem component
* [x] Select menu: Folder selection in BookmarkForm
* [x] Radio buttons: Settings page for wiping data
* [x] Checkbox: Tag selection in BookmarkForm

Custom Form Validation
* [x] Component state validation: LinkField component
* [x] Error messages: Shown below invalid fields
* [x] Form submission prevention: Invalid forms can't be submitted
* [x] Unique error messages: Different messages for different validation failures

Reusable Component
* [x] ListItem component used in multiple places: (Tags list, Folders list)
* [x] LinkItem component used in multiple places: (Bookmark list, tags/[id], folders/[id])
* [x] Configurable props: icon, color, title, subtitle, etc.

Document Title
* [x] Unique titles for different pages

Display Notifications
* [x] Display notifications using Sonner (similar to React Toastify, just prettier and easier to implement)