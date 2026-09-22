# Mebel Salon — Design System

> **Versiya:** 1.0  
> **Sana:** 2026-09-22  
> **Manba:** Loyiha PRD v2.0 + Reference image tahlili  
> **Maqsad:** Barcha UI development uchun single source of truth

---

## Design Philosophy

Mebel Salon — bu **zamonaviy mebel ishlab chiqaruvchi korxona uchun narxlarsiz onlayn vitrina**. Dizayn falsafasi:

1. **Premium Minimalism** — Har bir element o'z joyida, ortiqcha bezak yo'q. Mebel rasmlariga e'tibor qaratiladi.
2. **Warm Organic Aesthetic** — Issiq, tabiiy rang palitrasi — yog'och, qum, tosh ranglari. Sovuq va texnik emas, balki iliq va yashash joyiga mos.
3. **Content-First** — Rasm va mahsulot ma'lumotlari birinchi o'rinda. UI elementlari kontentga xizmat qiladi, kontentni bosib qo'ymaydi.
4. **Effortless Navigation** — Foydalanuvchi kerakli mebelni 2-3 klik bilan topishi kerak. Navigatsiya intuitiv va sodda.
5. **No Price, No Cart** — Bu do'kon emas, vitrina. Narx o'rniga "Ariza qoldirish" va "Mening tanlovlarim" mexanizmi.

---

## Brand / Visual Direction

| Xususiyat | Tavsif |
|-----------|--------|
| **Brend nomi** | Perfect Mebel |
| **Kayfiyat** | Nafis, iliq, me'moriy, ishonchli, premium |
| **Visual tili** | Skandinaviya arxitektura minimalizmi + O'rta Osiyo iliqligi (`reference.jpg` uslubi) |
| **Brend ranglari** | Oq (`#FFFFFF`), krem (`#FDFBF7`) va yorqin iliq sariq / oltin qahrabo (`#F59E0B` / `#D97706`) |
| **Maqsadli auditoriya** | O'zbekistondagi uy jihozlovchi oilalar, dizaynerlar, 25-50 yosh |
| **Rasm uslubi** | Kinfolk / Architectural Digest uslubidagi lifestyle fotosuratlar — mebellar interyerda, iliq tabiiy yorug'lik |
| **Umumiy hissiyot** | Premium mebel galereyasiga kirganday — sokin, tartibli, qulay, narxlarsiz ekskursiya |

---

## Color System

### Light Mode (Asosiy)

Ranglar `reference.jpg`dagi iliq tahririy palitradan ilhomlangan bo'lib, **Perfect Mebel**ning oq va sariq/oltin brend ranglariga asoslangan:

| Token | HSL | Hex (taxminiy) | Ishlatilish |
|-------|-----|-----------------|-------------|
| `--background` | `40 30% 98%` | `#FDFBF7` | Sahifa asosiy fon — iliq unbleached linen / oq-krem |
| `--foreground` | `24 10% 10%` | `#1C1917` | Asosiy matn rangi — chuqur ko'mir toshi |
| `--card` | `0 0% 100%` | `#FFFFFF` | Karta, vitrina surface elementlar foni (toza oq) |
| `--card-foreground` | `24 10% 10%` | `#1C1917` | Karta ichidagi matn |
| `--popover` | `0 0% 100%` | `#FFFFFF` | Dropdown, modal fon |
| `--popover-foreground` | `24 10% 10%` | `#1C1917` | Popover ichidagi matn |
| `--primary` | `38 92% 50%` | `#F59E0B` | Asosiy brend rangi — yorqin iliq sariq / oltin qahrabo |
| `--primary-foreground` | `24 10% 10%` | `#1C1917` | Primary ustidagi matn — to'q rang |
| `--secondary` | `36 25% 94%` | `#FAF2EE` | Ikkilamchi fon — mayin iliq krem |
| `--secondary-foreground` | `24 10% 10%` | `#1C1917` | Secondary ustidagi matn |
| `--muted` | `36 20% 92%` | `#F4ECE8` | Muted elementlar foni |
| `--muted-foreground` | `24 6% 45%` | `#78716C` | Ikkinchi darajali matn, spetsifikatsiyalar |
| `--accent` | `38 90% 90%` | `#FEF3C7` | Accent/hover fon — och sarg'ish |
| `--accent-foreground` | `24 10% 10%` | `#1C1917` | Accent ustidagi matn |
| `--destructive` | `0 72% 51%` | `#D93025` | Xatolik, o'chirish |
| `--destructive-foreground` | `0 0% 100%` | `#FFFFFF` | Destructive ustidagi matn |
| `--success` | `158 64% 42%` | `#10B981` | Muvaffaqiyat, "Omborda mavjud" status pilli |
| `--success-foreground` | `0 0% 100%` | `#FFFFFF` | Success ustidagi matn |
| `--warning` | `38 92% 50%` | `#F59E0B` | Ogohlantirish, "Buyurtma asosida" status pilli |
| `--warning-foreground` | `0 0% 100%` | `#FFFFFF` | Warning ustidagi matn |
| `--border` | `36 14% 88%` | `#E5E0D8` | Chegaralar — nozik me'moriy chiziqlar |
| `--input` | `36 14% 88%` | `#E5E0D8` | Input border |
| `--ring` | `38 92% 50%` | `#F59E0B` | Focus ring — brend sariq/oltin rangi |
| `--radius` | — | `0.375rem (6px)` | Asosiy border-radius |

### Dark Mode

| Token | HSL | Hex (taxminiy) | Izoh |
|-------|-----|-----------------|------|
| `--background` | `25 20% 9%` | `#1A1512` | Issiq to'q jigarrang-qora |
| `--foreground` | `30 15% 90%` | `#E8E2DB` | Sust oq-krem matn |
| `--card` | `25 18% 12%` | `#211C18` | Karta foni — biroz ochiqroq |
| `--card-foreground` | `30 15% 90%` | `#E8E2DB` | Karta matni |
| `--popover` | `25 18% 12%` | `#211C18` | Popover foni |
| `--popover-foreground` | `30 15% 90%` | `#E8E2DB` | Popover matni |
| `--primary` | `30 45% 50%` | `#B88B54` | Primary biroz to'qroq |
| `--primary-foreground` | `30 20% 98%` | `#FDFBF9` | Primary ustidagi matn |
| `--secondary` | `25 15% 16%` | `#2A2420` | Secondary fon |
| `--secondary-foreground` | `30 15% 85%` | `#DDD5CC` | Secondary matn |
| `--muted` | `25 12% 18%` | `#302924` | Muted fon |
| `--muted-foreground` | `25 10% 55%` | `#8F857A` | Muted matn |
| `--accent` | `25 15% 18%` | `#302924` | Accent fon |
| `--accent-foreground` | `30 15% 88%` | `#E2DCD4` | Accent matn |
| `--destructive` | `0 62% 35%` | `#8E2320` | Destructive dark |
| `--destructive-foreground` | `0 0% 95%` | `#F2F2F2` | Destructive matn |
| `--success` | `142 55% 45%` | `#3DAA5B` | Success ochiqroq |
| `--success-foreground` | `144 60% 10%` | `#0D2614` | Success matn |
| `--warning` | `40 80% 50%` | `#E6AD1A` | Warning ochiqroq |
| `--warning-foreground` | `26 50% 12%` | `#2E1F0F` | Warning matn |
| `--border` | `25 12% 20%` | `#352E28` | Border dark |
| `--input` | `25 12% 20%` | `#352E28` | Input border dark |
| `--ring` | `30 45% 50%` | `#B88B54` | Focus ring dark |

---

## Typography

Reference imageda **serif headings + sans-serif body** kombinatsiyasi ishlatilgan. Bu premium mebel vitrinasiga juda mos.

### Font Families

| Rol | Font | Fallback | Izoh |
|-----|------|----------|------|
| **Headings (Display)** | `Playfair Display` | `Georgia, serif` | Elegant, editorial serif — h1, h2, h3 |
| **Body (Sans)** | `Inter` | `system-ui, sans-serif` | Toza, o'qishli sans-serif — p, label, button |

### Font Scale

| Element | Size | Weight | Line Height | Letter Spacing | Font |
|---------|------|--------|-------------|----------------|------|
| `h1` — Hero heading | `48px / 3rem` | `700 Bold` | `1.1` | `-0.02em` | Playfair Display |
| `h2` — Section heading | `32px / 2rem` | `600 SemiBold` | `1.2` | `-0.01em` | Playfair Display |
| `h3` — Card / subsection | `22px / 1.375rem` | `600 SemiBold` | `1.3` | `0` | Playfair Display |
| `h4` — Small heading | `18px / 1.125rem` | `600 SemiBold` | `1.4` | `0` | Inter |
| `body-lg` | `18px / 1.125rem` | `400 Regular` | `1.6` | `0` | Inter |
| `body` | `16px / 1rem` | `400 Regular` | `1.6` | `0` | Inter |
| `body-sm` | `14px / 0.875rem` | `400 Regular` | `1.5` | `0` | Inter |
| `caption` | `12px / 0.75rem` | `500 Medium` | `1.4` | `0.02em` | Inter |
| `label` | `14px / 0.875rem` | `500 Medium` | `1.4` | `0` | Inter |
| `button` | `14px / 0.875rem` | `500 Medium` | `1` | `0.01em` | Inter |
| `overline` | `12px / 0.75rem` | `600 SemiBold` | `1.2` | `0.08em` | Inter |

### Responsive Typography

| Element | Mobile (< 640px) | Tablet (640-1024px) | Desktop (> 1024px) |
|---------|-------------------|---------------------|---------------------|
| `h1` | `32px / 2rem` | `40px / 2.5rem` | `48px / 3rem` |
| `h2` | `24px / 1.5rem` | `28px / 1.75rem` | `32px / 2rem` |
| `h3` | `18px / 1.125rem` | `20px / 1.25rem` | `22px / 1.375rem` |

---

## Spacing

8px asosiy grid tizimi. Barcha spacing qiymatlari 4px yoki 8px ga ko'paytma.

| Token | Qiymat | Ishlatilish |
|-------|--------|-------------|
| `xs` | `4px (0.25rem)` | Icon-text oraliq, juda yaqin elementlar |
| `sm` | `8px (0.5rem)` | Kichik ichki padding, input padding-y |
| `md` | `16px (1rem)` | Standart ichki padding, elementlar oraliq |
| `lg` | `24px (1.5rem)` | Karta ichki padding, section ichidagi gap |
| `xl` | `32px (2rem)` | Section padding-top/bottom small |
| `2xl` | `48px (3rem)` | Section padding-top/bottom medium |
| `3xl` | `64px (4rem)` | Section padding-top/bottom desktop |
| `4xl` | `80px (5rem)` | Hero section padding, major section gaps |
| `page-x` | `16px (mobile) / 32px (desktop)` | Sahifa horizintal padding |

---

## Layout

### Container

| Xususiyat | Qiymat |
|-----------|--------|
| Max width | `1400px` (mavjud config dan) |
| Centering | `mx-auto` |
| Padding | `px-4 sm:px-8` (16px mobile, 32px desktop) |

### Grid System

| Layout turi | Columns | Gap | Ishlatilish |
|-------------|---------|-----|-------------|
| Product grid | `1 col (mobile) → 2 col (sm) → 3 col (md) → 4 col (lg)` | `24px` | Katalog, mahsulotlar |
| Category grid | `2 col (mobile) → 3 col (md)` | `16px` | Toifalar ko'rinishi |
| Collection grid | `1 col (mobile) → 2 col (md) → 3 col (lg)` | `24px` | Komplektlar ro'yxati |
| Feature grid | `1 col (mobile) → 2 col (md)` | `32px` | New arrivals, about |
| Hero | Full-width | — | Bosh sahifa hero |

### Section Structure

Har bir sahifa section bo'limlarga ajratilgan:

```
[Header — sticky, blur backdrop]
[Hero Section — full-width image + overlay text]
[Section Divider — subtle line]
[Content Section — padded, centered]
[Section Divider]
[Content Section]
[Footer]
```

Section oraliq paddinglar: `py-16 sm:py-20 lg:py-24`

---

## Border Radius

Reference image juda minimal radius ishlatadi — faqat biroz yumshatish maqsadida.

| Token | Qiymat | Ishlatilish |
|-------|--------|-------------|
| `--radius` | `0.5rem (8px)` | Asosiy radius (mavjud config) |
| `sm` | `calc(var(--radius) - 4px) = 4px` | Kichik elementlar — badge, tag |
| `md` | `calc(var(--radius) - 2px) = 6px` | Input, select |
| `lg` | `var(--radius) = 8px` | Card, button |
| `xl` | `12px` | Rasm konteynerlari, modal |
| `pill` | `9999px` | Pill shape — lang toggle, badge |
| `full` | `50%` | Avatar, icon button |

---

## Shadows

Reference imageda shadow juda minimal — faqat hover yoki elevated elementlar uchun.

| Token | Qiymat | Ishlatilish |
|-------|--------|-------------|
| `shadow-none` | `none` | Default holat — ko'pchilik elementlar |
| `shadow-xs` | `0 1px 2px rgba(44,36,32,0.04)` | Subtle depth — input focus |
| `shadow-sm` | `0 1px 3px rgba(44,36,32,0.06), 0 1px 2px rgba(44,36,32,0.04)` | Karta default holat |
| `shadow-md` | `0 4px 6px rgba(44,36,32,0.06), 0 2px 4px rgba(44,36,32,0.04)` | Karta hover, dropdown |
| `shadow-lg` | `0 10px 15px rgba(44,36,32,0.06), 0 4px 6px rgba(44,36,32,0.04)` | Modal, elevated card |
| `shadow-xl` | `0 20px 25px rgba(44,36,32,0.08), 0 8px 10px rgba(44,36,32,0.04)` | Floating widget |

> **Muhim:** Soyalar issiq ohangda bo'lsin (sovuq ko'k-kulrang emas). `rgba(44,36,32,...)` — foreground rangdan olingan.

---

## Iconography

| Xususiyat | Qiymat |
|-----------|--------|
| **Kutubxona** | `lucide-react` (mavjud loyihada) |
| **Default size** | `20px (1.25rem)` — body text yonida |
| **Small** | `16px (1rem)` — button, badge ichida |
| **Large** | `24px (1.5rem)` — feature icon, navigatsiya |
| **XL** | `32px-40px` — hero feature, category icon |
| **Stroke width** | `1.5px` — nozik, elegant ko'rinish |
| **Rang** | `text-muted-foreground` default, `text-primary` accent holat |

---

## Imagery

### Product Photography Style

| Xususiyat | Qiymat |
|-----------|--------|
| **Fon** | Neytral iliq fon (krem, sust beige) yoki real interyerda |
| **Yorug'lik** | Tabiiy, iliq, yumshoq soyalar |
| **Ratio** | `4:5` (portrait) — mahsulot kartalari uchun |
| **Hero ratio** | `16:9` yoki `21:9` — bosh sahifa hero uchun |
| **Collection cover** | `3:2` (landscape) — komplekt muqovasi |
| **Format** | WebP (asosiy), JPEG (fallback) |
| **Max size** | `5MB` |
| **Object fit** | `object-cover` — rasm konteynerga mos kelsin |
| **Placeholder** | Sust krem fon + muted icon (rasm yo'q bo'lganda) |

### Image Treatment

- Rasm burchaklari: `rounded-lg` (8px) yoki `rounded-xl` (12px)
- Hover effekt: `scale(1.03)` + `transition-transform duration-500`
- Rasm ustida gradient overlay (hero uchun): `bg-gradient-to-t from-background/60 to-transparent`

---

## Components

### Header

```
┌─────────────────────────────────────────────────────────────┐
│  Logo (serif)    [Home] [Katalog] [Komplektlar] [Aloqa]     │
│                                    [UZ|RU|EN] [🌙] [📋 N]  │
└─────────────────────────────────────────────────────────────┘
```

| Xususiyat | Qiymat |
|-----------|--------|
| Height | `64px (h-16)` |
| Position | `sticky top-0 z-40` |
| Background | `bg-background/95 backdrop-blur` |
| Border | `border-b border-border` |
| Logo | Brend nomi serif fontda (`Playfair Display, 20px, bold`) |
| Nav links | `Inter, 14px, medium`, `text-muted-foreground`, hover: `text-foreground` |
| Active link | `text-foreground font-semibold` |
| Language switcher | Pill-shaped grouped buttons, active: `bg-primary text-primary-foreground` |
| Theme toggle | Icon button — `Sun` / `Moon` |
| Selections badge | Floating counter badge `bg-primary text-primary-foreground rounded-full` |
| Mobile | Hamburger menu → slide-in drawer |

### Button

| Variant | Background | Text | Border | Hover |
|---------|-----------|------|--------|-------|
| **Primary** | `bg-primary` | `text-primary-foreground` | none | `bg-primary/90` |
| **Secondary** | `bg-secondary` | `text-secondary-foreground` | none | `bg-secondary/80` |
| **Outline** | `transparent` | `text-foreground` | `border-border` | `bg-accent` |
| **Ghost** | `transparent` | `text-foreground` | none | `bg-accent` |
| **Destructive** | `bg-destructive` | `text-destructive-foreground` | none | `bg-destructive/90` |

| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| **sm** | `32px` | `px-3` | `12px` |
| **default** | `40px` | `px-5` | `14px` |
| **lg** | `48px` | `px-8` | `16px` |

Radius: `rounded-lg (8px)`. Transition: `transition-colors duration-200`.

### Product Card

Reference asosida — toza, minimal mahsulot karta.

```
┌────────────────────────┐
│                        │
│     [Product Image]    │  ← 4:5 ratio, rounded-lg
│      hover: scale      │
│                        │
├────────────────────────┤
│  Product Title         │  ← Inter, 14px, semibold
│  Material / Category   │  ← 12px, muted-foreground
│                        │
│  [🟢 Omborda] | [⏳ Buyurtma] │  ← Badge
│                        │
│  [Batafsil →]  [➕]   │  ← Link + select button
└────────────────────────┘
```

| Xususiyat | Qiymat |
|-----------|--------|
| Background | `bg-card` |
| Border | `border border-border` |
| Radius | `rounded-xl (12px)` |
| Shadow | `shadow-none` default, `shadow-md` hover |
| Image container | `aspect-[4/5] overflow-hidden rounded-t-xl` |
| Image hover | `group-hover:scale-[1.03] transition-transform duration-500` |
| Content padding | `p-4` |
| Title | `text-sm font-semibold text-card-foreground line-clamp-2` |
| Subtitle | `text-xs text-muted-foreground mt-1` |
| Hover | `hover:border-primary/30 hover:shadow-md transition-all duration-300` |

> **NARX YO'Q** — Narx o'rniga `stockStatus` badge va "Batafsil" link ko'rsatiladi.

### Category Card / Tab

Toifalar uchun ikkita variant:

**Tabs (Katalog sahifasida):**

| Xususiyat | Qiymat |
|-----------|--------|
| Layout | Horizontal scrollable row |
| Style | Pill-shaped buttons |
| Active | `bg-primary text-primary-foreground` |
| Inactive | `bg-secondary text-secondary-foreground` |
| Font | `Inter, 13px, medium` |
| Padding | `px-4 py-2` |
| Gap | `8px` |

**Cards (Bosh sahifada):**

| Xususiyat | Qiymat |
|-----------|--------|
| Layout | Rounded image + label below |
| Image | `aspect-square rounded-xl` |
| Label | `text-sm font-medium text-center mt-3` |
| Hover | Image `scale(1.05)`, text `text-primary` |

### Badge

| Variant | Background | Text |
|---------|-----------|------|
| **In Stock** | `bg-success/10` | `text-success` |
| **Made to Order** | `bg-warning/10` | `text-warning` |
| **Default** | `bg-secondary` | `text-secondary-foreground` |

Font: `Inter, 11px, semibold`, padding: `px-2.5 py-0.5`, radius: `rounded-full`.

### Input / Search

| Xususiyat | Qiymat |
|-----------|--------|
| Height | `40px` |
| Background | `bg-background` |
| Border | `border border-input` |
| Radius | `rounded-lg (8px)` |
| Font | `Inter, 14px` |
| Placeholder | `text-muted-foreground` |
| Focus | `ring-2 ring-ring ring-offset-2` |
| Padding | `px-3 py-2` |

Search: input + search icon (left) + clear button (right).

### Modal (Ariza formasi)

| Xususiyat | Qiymat |
|-----------|--------|
| Width | `max-w-lg (512px)` |
| Background | `bg-card` |
| Radius | `rounded-xl (12px)` |
| Shadow | `shadow-xl` |
| Overlay | `bg-foreground/40 backdrop-blur-sm` |
| Header | Serif heading, `h3`, `border-b` |
| Content padding | `p-6` |
| Footer | `flex justify-end gap-3 pt-4 border-t` |

### Toast / Notification

Loyihada `sonner` ishlatiladi.

| Xususiyat | Qiymat |
|-----------|--------|
| Position | `bottom-right` |
| Background | `bg-card border border-border` |
| Radius | `rounded-lg` |
| Shadow | `shadow-lg` |
| Success icon | `text-success` |
| Error icon | `text-destructive` |

### Footer

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]                                                      │
│                                                              │
│  [Bosh sahifa] [Katalog] [Komplektlar] [Aloqa]              │
│                                                              │
│  📞 +998 XX XXX XX XX  |  📍 Toshkent, ...  |  ✈️ @bot     │
│                                                              │
│  © 2026 Mebel Salon. Barcha huquqlar himoyalangan.          │
└─────────────────────────────────────────────────────────────┘
```

| Xususiyat | Qiymat |
|-----------|--------|
| Background | `bg-card` (light), `bg-card` (dark) |
| Border | `border-t border-border` |
| Padding | `py-12 sm:py-16` |
| Layout | Logo top, nav links middle, contacts, copyright bottom |
| Font | Body `text-sm text-muted-foreground` |
| Links hover | `text-foreground` |

---

## Product Cards — Batafsil Spetsifikatsiya

Bu vitrina sayti uchun eng muhim komponent.

### Karta Variantlari

| Variant | Ishlatilish | O'lcham |
|---------|-------------|---------|
| **Standard** | Katalog grid | Responsive grid column |
| **Featured** | Bosh sahifa "Yangi mebellar" | Kattaroq, horizontal layout |
| **Compact** | "Mening tanlovlarim" ro'yxati | Small horizontal card |
| **Collection Item** | Komplekt ichidagi mebel | Checkbox bilan |

### Standard Card — Batafsil

```
Image Area:
  - aspect-ratio: 4/5
  - object-fit: cover
  - overflow: hidden
  - border-radius: top-left, top-right = 12px
  - hover: scale(1.03), duration 500ms

Content Area:
  - padding: 16px
  - gap: 8px

Title:
  - font: Inter 14px semibold
  - color: card-foreground
  - max lines: 2 (line-clamp-2)

Metadata Row:
  - font: Inter 12px regular
  - color: muted-foreground
  - content: material yoki category nomi

Status Badge:
  - margin-top: 8px
  - font: 11px semibold
  - rounded-full, padding: 2px 10px

Actions Row:
  - margin-top: 12px
  - flex, justify-between, items-center
  - "Batafsil →" link (text-primary, 13px medium)
  - "➕ Tanlash" icon button (rounded-full, bg-primary/10)
```

---

## Ecommerce Patterns

### "Mening Tanlovlarim" (Selections Basket)

Bu an'anaviy savat emas — lead yig'ish mexanizmi.

**Floating Widget:**
| Xususiyat | Qiymat |
|-----------|--------|
| Position | `fixed bottom-6 right-6 z-50` |
| Shape | `rounded-full` (collapsed), `rounded-xl` (expanded) |
| Background | `bg-primary text-primary-foreground` |
| Shadow | `shadow-xl` |
| Badge | Tanlangan mahsulotlar soni, `bg-card text-foreground` |
| Click | Expands to show selected items list |

**Expanded Panel:**
| Xususiyat | Qiymat |
|-----------|--------|
| Width | `max-w-sm (384px)` |
| Position | `fixed bottom-6 right-6` yoki `slide-in from right` |
| Layout | Title + items list + CTA button |
| Item | Compact card (rasm + nom + remove button) |
| CTA | "Ariza qoldirish" primary button → opens modal |

### Ariza (Lead) Modal

| Maydon | Turi | Majburiy |
|--------|------|----------|
| Ism | `text input` | ✅ |
| Telefon | `tel input` | ✅ |
| Manzil | `text input` | ❌ |
| Izoh | `textarea` | ❌ |
| Tanlangan mebellar | `read-only list` | Avtomatik |

Modal tagida: "Telegram orqali buyurtma" secondary button → deep link to bot.

### Stock Status Indicators

| Holat | Visual |
|-------|--------|
| `IN_STOCK` | 🟢 Yashil badge: "Omborda mavjud" |
| `MADE_TO_ORDER` | ⏳ Sariq badge: "Buyurtma asosida" |

---

## Responsive Behavior

### Breakpoints

Tailwind CSS default breakpointlari:

| Breakpoint | Min Width | Ishlatilish |
|------------|-----------|-------------|
| `sm` | `640px` | Kichik tablet |
| `md` | `768px` | Tablet |
| `lg` | `1024px` | Desktop |
| `xl` | `1280px` | Katta desktop |
| `2xl` | `1400px` | Container max-width |

### Mobile-First Responsive Rules

| Element | Mobile | Tablet (md) | Desktop (lg) |
|---------|--------|-------------|--------------|
| **Header nav** | Hamburger drawer | Full horizontal nav | Full horizontal nav |
| **Hero** | Stack, smaller text | Wider, bigger text | Full-width, large |
| **Product grid** | 1 column | 2 columns | 3-4 columns |
| **Category tabs** | Horizontal scroll | Wrap | Inline |
| **Footer** | Stack vertical | 2 columns | 3-4 columns |
| **Selections widget** | Bottom sheet | Fixed bottom-right | Fixed bottom-right |
| **Container padding** | `px-4` | `px-6` | `px-8` |

---

## Accessibility

| Xususiyat | Talab |
|-----------|-------|
| **Color contrast** | Minimum 4.5:1 (WCAG AA) text, 3:1 large text |
| **Focus visible** | `ring-2 ring-ring ring-offset-2 ring-offset-background` |
| **Touch targets** | Minimum `44px × 44px` |
| **Alt text** | Barcha rasmlarda alt text (`titleUz` yoki `titleRu`/`titleEn`) |
| **Keyboard navigation** | Barcha interactive elementlar tab orqali yetib boriladi |
| **Screen reader** | `aria-label` tugmalar va iconlar uchun |
| **Reduced motion** | `prefers-reduced-motion: reduce` — animatsiyalarni o'chirish |
| **Font scaling** | `rem` unit — browser font size o'zgarishiga mos |

---

## Do / Don't

### ✅ Do

- Mahsulot rasmlariga ustunlik ber — ular saytning asosiy kontenti.
- Issiq, tabiiy ranglarni qo'lla — sovuq ko'k/kulrangdan qoching.
- Keng whitespace qo'y — elementlar "nafas olsin".
- Serif headings + sans-serif body kombinatsiyasini saqla.
- Hover animatsiyalarni subtle qil (300-500ms, ease-out).
- Responsive bo'lsin — avval mobile, keyin desktop.
- Har bir matnni `next-intl` orqali tarjima faylidan ol.
- Dark modeda ranglar iliq qolaversin (sovuq ko'k-qora emas).

### ❌ Don't

- Narx, to'lov, valyuta ko'rsatma — bu vitrina, do'kon emas.
- Generic e-commerce template ishlatma — bu maxsus mebel vitrinasi.
- Ortiqcha gradient, glassmorphism, neon rang qo'shma.
- Juda katta border-radius (> 16px) ishlatma — reference minimal.
- Har joyga shadow qo'yma — faqat hover va elevated elementlar.
- Rasm ustiga ko'p text overlay qo'yma — rasm toza ko'rinsin.
- Comic Sans, Impact kabi fontlar ishlatma.
- Inline style yozma — faqat Tailwind classlari.
- Console.log production kodda qoldirma.
- `any` type ishlatma.

---

## Reference Analysis

### Manba

Reference image: `havena` brend nomli home decor / mebel vitrina sayti dizayni.

### Aniqlangan Asosiy Prinsiplar

| Prinsip | Reference'dan olingan tahlil |
|---------|------------------------------|
| **Color philosophy** | Butunlay issiq, earthy palitra — krem, tan, jigarrang. Sovuq rang umuman yo'q |
| **Typography** | Serif headings (editorial premium hissiyot) + clean sans-serif body |
| **Whitespace** | Juda generous — sectionlar orasida katta bo'sh joy, elementlar siqilmagan |
| **Image treatment** | Lifestyle photography — mebellar real interyerda, iliq yorug'lik |
| **Card style** | Ultra-minimal — rasm + nom + narx. Bizda narx o'rniga status badge |
| **CTA buttons** | Warm tan/camel rangli, pill yoki slightly rounded shape |
| **Section dividers** | Nozik gorizontal chiziq yoki faqat whitespace |
| **Header** | Clean, minimal — logo chap, nav center, actions o'ng |
| **Footer** | Our Story + Newsletter. Bizda aloqa ma'lumotlari + Telegram link |
| **Overall feel** | Premium mebel showroom — toza, tartibli, professional |

### Reference → Project Moslashtirish

| Reference elementi | Project adaptatsiya |
|---------------------|---------------------|
| Narx ko'rsatish (\$4.95) | ❌ O'chirildi — o'rniga stockStatus badge |
| "Shop Now" CTA | → "Katalogni ko'rish" primary button |
| "Add to Cart" | → "Tanlash ➕" (Mening tanlovlarim ga qo'shish) |
| Cart icon | → "📋 Tanlovlarim (N)" floating widget |
| Search + Cart header | → Search + Language + Theme + Selections |
| "Best Sellers" section | → "Ommabop mebellar" / "Yangi qo'shilganlar" |
| "New Arrivals" banner | → "Yangi kolleksiyalar" banner |
| "Timeless & Elegant" categories | → Toifalar bo'yicha ko'rish (Divanlar, Krovatlar, Shkaflar) |
| Newsletter | → Telegram botga ulanish CTA + Aloqa form |
| "Our Story" | → Kompaniya haqida qisqa bo'lim |

---

> **Bu DESIGN.md barcha frontend sahifalar va komponentlarni yaratishda asosiy manbaa sifatida ishlatiladi. Har qanday yangi UI elementi shu tizimga mos bo'lishi SHART.**
