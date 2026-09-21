# Mebel Salon — Loyiha Qoidalari

> Bu fayl loyiha bo'ylab barcha kataloglarga tarqaluvchi umumiy qoidalarni belgilaydi.

## Asosiy Qoidalar

1. **Til:** Butun loyiha TypeScript (strict mode) da yoziladi.
2. **Narx yo'q:** Saytda va botda hech qanday narx, to'lov, valyuta mexanizmi bo'lmaydi.
3. **3 til:** UZ (default), RU, EN — barcha UI matnlari `next-intl` orqali.
4. **Dark/Light:** Barcha sahifalar ikkala rejimda to'g'ri ishlashi shart.
5. **Mobile-first:** Tailwind CSS bilan responsive dizayn — mobil birinchi.

## Fayl O'zgartirishda

- Mavjud kommentlarni o'chirmang (agar o'zgarishga tegishli bo'lmasa).
- `zod` bilan input validatsiya — barcha API va forma larda.
- Import tartibini saqlang: React → Next.js → 3rd party → lokal.

## Commit Qilishda

- Conventional Commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`
- O'zbek yoki ingliz tilida commit xabari.

## Deploy Oldidan

- `npx tsc --noEmit` — TypeScript xatolik yo'qligini tekshirish.
- `npm run build` — Build muvaffaqiyatli o'tishi shart.
- `.env` fayllar git ga qo'shilmasin.
