# Project Specification (Directory Structure & Responsibilities)

This document defines the directory structure and responsibilities based on Next.js (App Router) with a feature-based modular architecture.  
The goal is to **clarify responsibilities and maintain a scalable, easy-to-navigate structure**.

---

## Root Structure

```
├── app          ... Components related to routing
├── features     ... Feature-specific logic and components
│   ├── common   ... Shared features used across multiple pages
│   └── routes   ... Features tied to specific routes/pages
├── components   ... Common UI-only components (no logic)
├── hooks        ... Shared logic that relies on React Hooks
├── utils        ... Shared logic without React Hooks
├── constants    ... Centralized constant definitions
└── types        ... Shared TypeScript type definitions (optional)
```

---

## Directory Details

### `app/`

- Dedicated to Next.js App Router for routing.
- Should not contain business logic.

---

### `features/`

- Groups logic and components by **feature/domain**.
- `common/` → Shared functionality (forms, editors, tags, etc.)
- `routes/` → Route-specific functionality (login, post list/detail, profile, etc.)

#### Standard `features` Structure

```
features/
  xxx/
    components/  ... UI components for the feature
    endpoint.ts  ... API calls (fetch/axios implementations)
    hooks.ts     ... React Hooks for state and side effects
    stores.ts    ... Shared state across multiple components
```

##### File Responsibilities

- **components/**: Pure UI. Receives data/events via props.
- **endpoint.ts**: Defines API calls only (fetch/axios).
- **hooks.ts**: React logic (state, effects). Can call `endpoint.ts`.
- **stores.ts**: State shared across multiple components (Zustand/Jotai/Redux).  
  Local state should remain inside components using `useState`.

---

### `components/`

- Contains **shared UI components** with no business logic.
- Highly reusable across any page or feature.
- Example:
  ```
  components/
    Alert.tsx
    Button.tsx
    Label.tsx
    Logo.tsx
    Menu.tsx
    Modal.tsx
  ```

---

### `hooks/`

- Contains **shared React Hooks** that are not feature-specific.
- Feature-dependent hooks should go under `features/`.
- Example:
  ```
  hooks/
    useRedirect.ts
    useSave.ts
    useSearch.ts
    useToast.ts
    useWidthSize.ts
  ```

---

### `utils/`

- Contains **pure utility functions** without React dependencies.
- Examples: formatting, parsing, validation.
- Example:
  ```
  utils/
    dates.ts
    formats.ts
    validation.ts
  ```

---

### `constants/`

- Stores **centralized constant definitions**.
- Examples: colors, paths, options for dropdowns.
- Example:
  ```
  constants/
    options.ts
    paths.ts
    styles.ts
  ```

---

### `types/` (optional)

- Stores **shared TypeScript types**.
- Examples: API response types, domain models, utility types.
- Example:
  ```
  types/
    auth.ts
    post.ts
    user.ts
  ```

---

## Design Principles

1. **Separation of concerns**
   - Separate UI from logic
   - Separate API calls from state management
2. **Consistent dependency direction**
   - `components → hooks → endpoint/stores`
   - Avoid circular dependencies
3. **Distinguish shared vs. route-specific logic**
   - Shared logic goes in `common/`, `hooks/`, `utils/`
   - Route-specific logic stays in `routes/`

---

📌 Following this specification ensures you always know **where to put your files** and maintain a clean, scalable structure.
