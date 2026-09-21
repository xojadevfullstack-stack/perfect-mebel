# Coding Standards

Ushbu hujjat Mebel Salon loyihasi uchun yozish qoidalari va standartlarini belgilaydi. Jamoaning barcha a'zolari kod yozishda ushbu standartlarga rioya qilishlari shart.

## TypeScript Guidelines

- **Strict Mode Enabled**: TypeScript'ning `tsconfig.json` faylida `strict` rejimi yoqilgan. Bunga qat'iy amal qilinishi kerak.
- **No `any` Type**: `any` turidan foydalanish taqiqlanadi. O'rniga `unknown` ishlating va turlarni aniqlashtiring, yoki to'g'ri interfeys/type ishlating.
- **Interface vs Type**: 
  - Obyektlar va klasslar uchun `interface` foydalaning.
  - Birlashma (Union), kesishish (Intersection) va oddiy qiymatlar uchun `type` foydalaning.
- **Enum Conventions**: Enum nomlari va ularning elementlari `PascalCase` formatida bo'lishi kerak.
  ```typescript
  enum StockStatus {
    InStock = 'IN_STOCK',
    MadeToOrder = 'MADE_TO_ORDER'
  }
  ```

### ESLint Enforcement
Quyidagi qoidalar `.eslintrc` da `error` darajasida o'rnatilishi SHART:
```json
{
  "@typescript-eslint/no-explicit-any": "error",
  "no-console": "warn",
  "no-var": "error",
  "prefer-const": "error"
}
```

## React / Next.js Conventions

- **Server vs Client Components**: Next.js App Router'da komponentlar odatda Server Components hisoblanadi. Faqatgina holat (state), effektlar (useEffect) yoki event listener'lar kerak bo'lganda faylning eng yuqorisida `'use client'` direktivasini qo'shing.
- **File Naming**: 
  - Fayllar (ayniqsa sahifalar va route'lar) `kebab-case` bo'lishi kerak (masalan, `product-card.tsx`).
  - Export qilingan React komponentlari `PascalCase` formatida nomlanishi kerak.
- **Component Structure**: Komponent fayllari quyidagi tuzilishga ega bo'lishi kerak:
  1. Imports (React/Next, uchinchi tomon paketlari, ichki modullar)
  2. Types / Interfaces (ushbu komponent uchun xos)
  3. Component (asosiy funksiya)
  4. Exports
- **Custom Hooks Naming**: Custom hook'lar har doim `use` so'zi bilan boshlanishi kerak (masalan, `useCart`, `useDebounce`).

## Tailwind CSS Conventions

- **Class Ordering**: Tailwind klasslari o'ziga xos mantiqiy ketma-ketlikda yozilishi tavsiya etiladi (masalan, Layout → Spacing → Typography → Visual). Prettier-plugin-tailwindcss ushbu jarayonni avtomatlashtiradi.
- **Using `cn()` utility**: Shartli klasslarni yoki klasslarni birlashtirishda har doim `cn()` yordamchi funksiyasidan foydalaning (clsx + tailwind-merge asosida).
  ```tsx
  import { cn } from "@/lib/utils";
  
  <div className={cn("base-class", isActive && "active-class")}>
  ```
- **Responsive Design**: Loyiha mobile-first yondashuvida yozilishi kerak. Avval mobil moslashuv yoziladi, so'ng `sm:`, `md:`, `lg:` prefixlari ishlatiladi.
- **Dark Mode**: Iloji boricha dark mode klasslari (`dark:bg-slate-900`) e'tiborga olinishi kerak.
- **Accessibility (WCAG 2.1 AA)**: Matn va fon o'rtasida kontrast nisbati kamida 4.5:1 bo'lishi kerak. Dark mode da ham bu qoida saqlanishi shart.

## Prisma Conventions

- **Model Naming**: Ma'lumotlar bazasi modellari Birlik sonida va `PascalCase` yozilishi kerak (`Model Product`, `Model Category`).
- **Field Naming**: Model maydonlari `camelCase` shaklida bo'lishi kerak (`titleUz`, `createdAt`).
- **Transactions**: O'zaro bog'liq ma'lumotlarni o'zgartirish yoki yaratishda har doim Prisma tranzaksiyalaridan (`$transaction`) foydalaning, shunda xatolik yuz bersa ma'lumotlar butunligi saqlanadi.

## API Conventions

- **Response Format**: Barcha API yo'llari (Route Handlers) yoki Server Actions bir xil strukturada javob qaytarishi kerak:
  ```typescript
  // Muvaffaqiyatli
  { success: true, data: T }
  
  // Xatolik
  { success: false, error: string }
  
  // Ro'yxat (pagination bilan)
  { success: true, data: T[], meta: { total: number, page: number, limit: number } }
  ```
- **Error Handling**: Xatoliklar to'g'ri tutilishi va tegishli HTTP status kodlari bilan qaytarilishi kerak.
- **Zod Validation**: Barcha kiruvchi ma'lumotlar (API so'rovlar, Server Actions parametrlari) Zod sxemalari orqali tekshirilishi (validate) shart.

### Shared Zod Schemas
Zod schema'lar `packages/shared/schemas/` papkasida markazlashtiriladi va client-side (react-hook-form resolver) hamda server-side (API route handler) da **bir xil schema** ishlatiladi. Bu client va server validatsiya qoidalari orasidagi nomuvofiqlikni bartaraf etadi.

## Environment Variables Validation
Barcha muhit o'zgaruvchilari ilova ishga tushganda `zod` orqali validatsiya qilinishi shart. `lib/env.ts` faylida:
```typescript
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  TELEGRAM_BOT_TOKEN: z.string().min(1),
  TELEGRAM_FACTORY_CHANNEL_ID: z.string().min(1),
  TELEGRAM_SUPPORT_GROUP_ID: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```
Noto'g'ri yoki yo'q env bilan ilova ishga tushmasligi kerak.

## Security Conventions

### Password Hashing
Barcha parol hash operatsiyalari `lib/auth.ts` dagi markazlashtirilgan funksiya orqali amalga oshiriladi:
```typescript
import bcryptjs from 'bcryptjs';

const BCRYPT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcryptjs.hash(plain, BCRYPT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(plain, hash);
}
```
Bu BCRYPT_ROUNDS konstantasi orqali minimum round soni enforce qilinadi.

## Git Conventions

- **Commit Messages**: Conventional Commits formatidan foydalaning:
  - `feat: yangi xususiyat qo'shildi`
  - `fix: xatolik to'g'irlandi`
  - `docs: hujjatlarga o'zgartirish kiritildi`
  - `refactor: kod yaxshilandi`
- **Branch Naming**: 
  - Yangi imkoniyatlar uchun: `feature/nomi` yoki `feat/nomi`
  - Xatolarni to'g'irlash uchun: `bugfix/nomi` yoki `fix/nomi`

## Testing Conventions

*(Kelajakda qo'shiladi)*
Hozircha loyihada unit yoki e2e testlar yo'q, lekin qo'shilganda Jest/Vitest va Playwright ishlash prinsiplari ushbu bo'limda yoziladi.
