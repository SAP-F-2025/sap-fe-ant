# SAP Assessment Management System

> **Senior-Level React + Ant Design Application** with production-ready architecture and best practices.

## 🏗️ Architecture Overview

This is a **feature-complete educational assessment management system** built with modern React patterns and Ant Design, following enterprise-grade best practices.

### Tech Stack

- **React 19** + **TypeScript** - Latest React with full type safety
- **Ant Design 5** - Enterprise UI component library
- **React Query (TanStack Query)** - Server state management
- **React Router 7** - Client-side routing
- **Zod** - Runtime validation
- **Vite** - Lightning-fast build tool
- **Vitest** - Unit testing framework

---

## ✨ Key Features

### 🎨 Design System & Theming

✅ **Token-First Design**

- All spacing follows 8px scale
- Design tokens for colors, typography, spacing, borders
- No magic numbers - everything is token-based

✅ **Multi-Theme Support**

- Light mode (default)
- Dark mode
- High contrast mode (accessibility)
- Theme persistence to localStorage
- Smooth theme transitions

✅ **Responsive Design**

- Breakpoint-aware components (xs → xxl)
- Mobile-first approach
- Collapsible sidebar on mobile
- Token-based responsive spacing

### 🧩 Reusable Components

#### DataTable Component

Advanced table with enterprise features:

- ✅ Server-side pagination, sorting, filtering
- ✅ Row selection with bulk actions
- ✅ Column visibility toggle
- ✅ CSV export with proper encoding
- ✅ Responsive layout
- ✅ Empty states with call-to-action
- ✅ Loading skeletons

#### FormDrawer Component

Smart form drawer with:

- ✅ Zod schema validation
- ✅ Dirty state tracking (prevent accidental close)
- ✅ Optimistic updates
- ✅ Loading states
- ✅ Responsive width
- ✅ Confirmation on close if dirty

### 🚀 State Management

#### React Query Integration

- ✅ Query caching with smart invalidation
- ✅ Optimistic updates
- ✅ Global error handling via Ant Design messages
- ✅ DevTools for debugging (dev only)
- ✅ Retry logic for failed requests
- ✅ Stale-while-revalidate pattern

#### Custom Hooks

- `useUsers` - Fetch users with filters, pagination, sorting
- `useCreateUser` - Create with cache invalidation
- `useUpdateUser` - Update with optimistic updates
- `useDeleteUser` - Delete with rollback on error
- `useBulkDeleteUsers` - Batch operations

### 📄 Pages

#### Users Management (Full CRUD Example)

- ✅ Server-side table with all DataTable features
- ✅ Search with 500ms debounce
- ✅ Filter by role and status
- ✅ Sort by any column
- ✅ Bulk delete with confirmation
- ✅ Create/Edit drawer with validation
- ✅ CSV export
- ✅ Mock data for development

#### Assessment Management

- ✅ List, Create, Edit, Detail views
- ✅ Rich form with 20+ settings
- ✅ Status management (Draft → Active → Archived)
- ✅ Statistics dashboard
- ✅ Proctoring settings
- ✅ Accessibility options

#### Question Management

- ✅ Support for 7 question types
- ✅ Dynamic form based on question type
- ✅ Tag system
- ✅ Difficulty levels
- ✅ Usage tracking

#### Question Banks

- ✅ Public/Private visibility
- ✅ Tag-based organization
- ✅ Question count tracking

#### Grading Module

- ✅ List pending submissions
- ✅ Manual grading with feedback
- ✅ Score input
- ✅ Status tracking

### 🛡️ Error Handling

#### ErrorBoundary

- ✅ Catches React errors
- ✅ Shows user-friendly fallback
- ✅ Displays stack trace in dev
- ✅ Reset and home navigation
- ✅ Ready for error tracking integration (Sentry)

#### Global Error Handling

- ✅ React Query error cache
- ✅ Axios interceptors
- ✅ Toast notifications via Ant Design
- ✅ 401 auto-redirect to login

### ♿ Accessibility

- ✅ WCAG AA+ compliant color contrast
- ✅ High contrast theme option
- ✅ Keyboard navigation support
- ✅ ARIA attributes on interactive elements
- ✅ Screen reader support
- ✅ Focus management
- ✅ Skip links ready

### 🧪 Testing

#### Unit Tests

- ✅ Hook testing (`useUsers.test.ts`)
- ✅ Component testing (`DataTable.test.tsx`)
- ✅ Proper test setup with React Query wrapper
- ✅ Mock data utilities

#### Testing Stack

- Vitest - Fast unit test runner
- @testing-library/react - Component testing
- @testing-library/user-event - User interaction simulation
- jsdom - DOM environment

---

## 📂 Project Structure

```
src/
├── components/           # Reusable components
│   ├── DataTable/       # Advanced table component
│   ├── FormDrawer/      # Form drawer component
│   ├── ErrorBoundary/   # Error boundary
│   └── Layout/          # Layout components
├── pages/               # Page components (feature-oriented)
│   ├── Dashboard/
│   ├── Users/           # ✨ Full CRUD example
│   ├── Assessments/
│   ├── Questions/
│   ├── QuestionBanks/
│   └── Grading/
├── hooks/               # Custom React hooks
│   └── useUsers.ts      # React Query hooks with mock data
├── providers/           # Context providers
│   └── QueryProvider.tsx
├── services/            # API services
│   ├── api.ts           # Axios instance
│   ├── mockData.ts      # Mock data for development
│   └── *Service.ts      # Feature services
├── theme/               # Design system
│   ├── tokens.ts        # Design tokens
│   └── ThemeProvider.tsx
├── types/               # TypeScript types
│   └── index.ts         # Shared types
├── test/                # Test utilities
│   └── setup.ts
└── App.tsx              # Root component with providers
```

---

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Server will start at `http://localhost:3000` (or next available port).

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Testing

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

---

## 🎯 Key Decisions & Best Practices

### 1. Token-First Styling

**Why:** Consistent spacing and colors across the app
**How:** All values reference theme tokens

```tsx
style={{ padding: token.paddingLG, margin: token.marginMD }}
```

### 2. Server-Side Table Operations

**Why:** Scalable for large datasets
**How:** Pagination, sorting, filtering happen on server

```tsx
<DataTable
	onPageChange={(page, size) => fetchData(page, size)}
	onSortChange={(field, order) => fetchData(page, size, field, order)}
/>
```

### 3. Optimistic Updates

**Why:** Better UX with instant feedback
**How:** React Query mutation with onMutate

```tsx
const updateMutation = useMutation({
	onMutate: async (input) => {
		// Update cache immediately
		queryClient.setQueryData(key, optimisticData);
	},
	onError: (err, input, context) => {
		// Rollback on error
		queryClient.setQueryData(key, context.previousData);
	},
});
```

### 4. Form Validation with Zod

**Why:** Type-safe validation at runtime
**How:** Single source of truth for validation

```tsx
const userSchema = z.object({
	name: z.string().min(1),
	email: z.string().email(),
});
```

### 5. Error Boundaries

**Why:** Graceful error handling
**How:** Catch errors, show fallback, allow recovery

### 6. Mock Data for Development

**Why:** Frontend development without backend dependency
**How:** Toggle in `.env` file

```env
VITE_USE_MOCK=true
```

---

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8888
VITE_USE_MOCK=true
```

### Theme Customization

Edit `src/theme/tokens.ts`:

```tsx
export const lightTheme: ThemeConfig = {
	token: {
		colorPrimary: '#1890ff', // Change primary color
		borderRadius: 8, // Change border radius
		// ... more tokens
	},
};
```

---

## 📊 Performance Optimizations

- ✅ Code splitting by route
- ✅ React Query caching (5min stale, 10min garbage collection)
- ✅ Debounced search (500ms)
- ✅ Lazy loading for heavy components
- ✅ Memoized expensive computations
- ✅ Tree-shaken icon imports
- ✅ Production build with Rolldown (faster than Rollup)

---

## 🚦 Next Steps

### To Connect Real API:

1. Set `VITE_USE_MOCK=false` in `.env`
2. Update `API_CONFIG.BASE_URL` to your API
3. Implement auth token storage
4. API services will automatically switch

### To Add Storybook:

```bash
npx storybook@latest init
```

Stories structure:

```
src/components/DataTable/DataTable.stories.tsx
```

### To Add E2E Tests:

```bash
npm install -D @playwright/test
```

---

## 📖 Code Examples

### Using DataTable

```tsx
<DataTable<User>
	columns={columns}
	dataSource={users}
	total={total}
	onPageChange={(page, size) => setParams({ page, size })}
	selectedRowKeys={selected}
	onSelectionChange={(keys, rows) => setSelected(keys)}
	bulkActions={[
		{
			key: 'delete',
			label: 'Delete Selected',
			icon: <DeleteOutlined />,
			danger: true,
			onClick: (rows) => handleBulkDelete(rows),
		},
	]}
	enableExport
	onRefresh={() => refetch()}
/>
```

### Using FormDrawer

```tsx
<FormDrawer<UserInput>
	title="Create User"
	open={open}
	onClose={() => setOpen(false)}
	onSubmit={async (values) => {
		await createUser(values);
	}}
	schema={userSchema}
	loading={isCreating}
>
	<Form.Item name="name" label="Name">
		<Input />
	</Form.Item>
</FormDrawer>
```

### Using React Query Hooks

```tsx
const { data, isLoading, refetch } = useUsers({
	page: 1,
	size: 10,
	search: 'john',
	role: 'admin',
});

const createMutation = useCreateUser();
await createMutation.mutateAsync({ name: 'John', email: 'john@example.com' });
```

---

## 🤝 Contributing

This is a production-ready starter. Key principles:

1. **Token-first styling** - No hardcoded values
2. **Type safety** - Leverage TypeScript fully
3. **Accessibility** - WCAG AA+ compliance
4. **Performance** - Optimize for large datasets
5. **Testing** - Test critical paths
6. **Documentation** - Inline comments for decisions

---

## 📝 License

MIT

---

## 🎓 Learning Resources

- [Ant Design Best Practices](https://ant.design/docs/react/recommendation)
- [React Query Docs](https://tanstack.com/query/latest)
- [Zod Documentation](https://zod.dev/)
- [Vitest Guide](https://vitest.dev/guide/)

---

**Built with ❤️ using best practices and modern patterns**
