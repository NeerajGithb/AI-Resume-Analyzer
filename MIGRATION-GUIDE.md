# Feature Migration Guide

## Architecture Overview

```
Page → Hook → Service → API → ProgressHelper → Store → GlobalProgress
```

## Core Pattern (5 Files per Feature)

### 1. **Page Component** (`/app/(dashboard)/[feature]/page.tsx`)
- Upload UI + form inputs
- Call mutation hook
- Navigate to report page with temp ID → replace with real ID

### 2. **Mutation Hook** (`/hooks/use[Feature]Mutation.ts`)
- React Query mutation wrapper
- Handle abort controller
- Update cache on success/error
- Invalidate history

### 3. **Service** (`/services/[feature]Service.ts`)
- ProgressHelper integration
- Define stages + durations
- FormData preparation
- API call wrapper

### 4. **Store** (`/store/[feature]UIStore.ts`)
- Zustand state: `file`, `stage`, `progress`, custom fields
- Actions: `setFile`, `setStageProgress`, `reset`

### 5. **Report Page** (`/app/(dashboard)/[feature]/report/[id]/page.tsx`)
- Fetch result by ID
- Render GlobalProgress while loading
- Show results when complete

---

## Step-by-Step Migration

### **Step 1: Create Store** (`src/store/newFeatureUIStore.ts`)

```typescript
import { create } from 'zustand';

interface NewFeatureUIState {
  file: File | null;
  stage: string | null;
  progress: number;
  // Add custom fields
  customField: string;

  setFile: (file: File | null) => void;
  setStageProgress: (stage: string | null, progress: number) => void;
  setCustomField: (value: string) => void;
  reset: () => void;
}

export const useNewFeatureStore = create<NewFeatureUIState>((set) => ({
  file: null,
  stage: null,
  progress: 0,
  customField: '',

  setFile: (file) => set({ file }),
  setStageProgress: (stage, progress) => set({ stage, progress }),
  setCustomField: (customField) => set({ customField }),
  reset: () => set({ file: null, stage: null, progress: 0, customField: '' }),
}));
```

### **Step 2: Create Service** (`src/services/newFeatureService.ts`)

```typescript
import axiosInstance from '@/lib/api/baseService';
import { ProgressHelper } from '@/lib/api/progressHelper';

const STAGES = ['uploading', 'parsing', 'processing', 'finalizing'];
const DURATIONS = [900, 1400, 1800, 600]; // ms per stage

export async function run(
  file: File,
  signal: AbortSignal,
  onStage: (stage: string, progress: number) => void,
  customParam?: string
) {
  const progress = new ProgressHelper(onStage, signal);

  return await progress.run(
    STAGES,
    async () => {
      const formData = new FormData();
      formData.append('file', file);
      if (customParam) formData.append('customParam', customParam);

      const response = await axiosInstance.post('/api/endpoint', formData, { signal });
      
      if (!response.data?.success) throw new Error('API error');
      return response.data.data;
    },
    DURATIONS
  );
}

export async function getById(id: string) {
  const response = await axiosInstance.get(`/api/endpoint/${id}`);
  if (!response.data?.success) throw new Error('API error');
  return response.data.data;
}
```

### **Step 3: Create Mutation Hook** (`src/hooks/useNewFeatureMutation.ts`)

```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import * as newFeatureService from '@/services/newFeatureService';
import { useNewFeatureStore } from '@/store/newFeatureUIStore';

export function useNewFeatureMutation() {
  const queryClient = useQueryClient();
  const { setStageProgress, setFile } = useNewFeatureStore();
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation({
    mutationFn: async ({ file, customParam }) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setFile(file);
      setStageProgress('uploading', 0);

      try {
        return await newFeatureService.run(
          file,
          signal,
          (stage, progress) => setStageProgress(stage, progress),
          customParam
        );
      } finally {
        abortControllerRef.current = null;
      }
    },
    onSuccess: (data) => {
      setStageProgress(null, 0);
      queryClient.setQueryData(['latest-newfeature'], { result: data, error: null });
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
    onError: (err) => {
      setStageProgress(null, 0);
      queryClient.setQueryData(['latest-newfeature'], { result: null, error: err });
    },
  });

  const abort = (onAbort?: () => void) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setStageProgress(null, 0);
      mutation.reset();
      onAbort?.();
    }
  };

  return { ...mutation, abort };
}

export function useNewFeatureResultQuery(id?: string) {
  return useQuery({
    queryKey: ['newfeature-result', id],
    queryFn: async () => {
      if (!id) throw new Error('ID required');
      return await newFeatureService.getById(id);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 60,
  });
}
```

### **Step 4: Create Page** (`src/app/(dashboard)/newfeature/page.tsx`)

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { DropZone } from '@/components/upload/DropZone';
import { Button } from '@/components/ui/Button';
import { useNewFeatureStore } from '@/store/newFeatureUIStore';
import { useNewFeatureMutation } from '@/hooks/useNewFeatureMutation';
import AppShell from '@/components/layout/AppShell';

export default function NewFeaturePage() {
  const router = useRouter();
  const { file, setFile, customField, setCustomField } = useNewFeatureStore();
  const { mutate, isPending, error } = useNewFeatureMutation();

  const handleSubmit = () => {
    if (!file || isPending) return;

    // Generate temp ID
    const tempId = btoa(`processing:${Date.now()}`).replace(/[+/=]/g, '');
    router.push(`/newfeature/report/${tempId}`);

    mutate(
      { file, customParam: customField },
      {
        onSuccess: (data) => {
          router.replace(`/newfeature/report/${data.id}`);
        },
      }
    );
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">New Feature</h1>
        
        <DropZone file={file} onFile={setFile} disabled={isPending} error={error?.message} />
        
        <input
          type="text"
          value={customField}
          onChange={(e) => setCustomField(e.target.value)}
          placeholder="Custom parameter"
          className="w-full mt-4 p-2 border rounded"
        />
        
        <Button onClick={handleSubmit} disabled={!file || isPending} className="mt-4">
          {isPending ? 'Processing...' : 'Submit'}
        </Button>
      </div>
    </AppShell>
  );
}
```

### **Step 5: Create Report Page** (`src/app/(dashboard)/newfeature/report/[id]/page.tsx`)

```typescript
'use client';

import { useParams } from 'next/navigation';
import { GlobalProgress } from '@/components/common/GlobalProgress';
import { useNewFeatureStore } from '@/store/newFeatureUIStore';
import { useNewFeatureResultQuery } from '@/hooks/useNewFeatureMutation';
import AppShell from '@/components/layout/AppShell';

export default function ReportPage() {
  const params = useParams();
  const id = params.id as string;
  const { stage } = useNewFeatureStore();
  const { data: result, isLoading } = useNewFeatureResultQuery(id?.startsWith('processing') ? undefined : id);

  const showProgress = stage || isLoading;

  return (
    <AppShell>
      {showProgress && <GlobalProgress />}
      
      {result && (
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Results</h1>
          {/* Render your results */}
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </AppShell>
  );
}
```

---

## Key Concepts

### **ProgressHelper Integration**
```typescript
const progress = new ProgressHelper(onStage, signal);
return await progress.run(STAGES, async () => {
  // API call here
}, DURATIONS);
```

### **Temp ID Pattern**
```typescript
const tempId = btoa(`processing:${Date.now()}`).replace(/[+/=]/g, '');
router.push(`/feature/report/${tempId}`);
// After success:
router.replace(`/feature/report/${data.id}`);
```

### **GlobalProgress Integration**
```typescript
const { stage } = useFeatureStore();
const showProgress = stage || isLoading;

{showProgress && (
  <GlobalProgress 
    title="Processing Your File"
    onCancel={() => abort()}
  />
)}
```

### **Stage Durations** (Realistic Timing)
```typescript
const DURATIONS = [
  900,   // uploading (quick)
  1400,  // parsing
  1800,  // processing (longest)
  600,   // finalizing (quick)
];
```

---

## Testing New Features

1. Create `/test-[feature]` page using `useTestProgress` pattern
2. Test progress animations without API calls
3. Verify temp ID → real ID replacement
4. Test abort functionality
5. Check history invalidation

---

## Existing Features

| Feature | Page | Hook | Service | Store | Report |
|---------|------|------|---------|-------|--------|
| Analyze | ✅ | ✅ | ✅ | ✅ | ✅ |
| Builder | ✅ | ✅ | ✅ | ✅ | ✅ |
| Compare | ✅ | ✅ | ✅ | ✅ | ✅ |
| Job Match | ✅ | ✅ | ✅ | ✅ | ✅ |
| Cover Letter | ✅ | ✅ | ✅ | ✅ | ✅ |
| LinkedIn | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Common Pitfalls

❌ **Don't**: Call API directly from page  
✅ **Do**: Use mutation hook

❌ **Don't**: Store progress in component state  
✅ **Do**: Use Zustand store

❌ **Don't**: Hardcode stage names  
✅ **Do**: Define in service with durations

❌ **Don't**: Skip abort controller  
✅ **Do**: Always implement cleanup

❌ **Don't**: Forget to invalidate history  
✅ **Do**: Call `invalidateQueries` on success
