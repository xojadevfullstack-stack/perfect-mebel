# Hissa qo'shish qoidalari (Contributing Guidelines)

Mebel Salon loyihasiga qiziqishingiz uchun tashakkur! Ushbu hujjatda loyihaga hissa qo'shish (contribute qilish) jarayoni va qoidalari yoritilgan.

## 🔄 Qanday qilib hissa qo'shish mumkin? (Workflow)

Biz standart **Fork & Pull Request** uslubidan foydalanamiz:

1. Repozitoriyni o'zingizning akkauntingizga **Fork** qiling.
2. O'z kompyuteringizga klonlang: `git clone https://github.com/USERNAME/online-mebel-magazin.git`
3. Asosiy repozitoriyni upstream sifatida qo'shing: `git remote add upstream https://github.com/org/online-mebel-magazin.git`
4. Yangi branch yarating (qoidalarga muvofiq).
5. O'zgarishlarni amalga oshiring va commit qiling.
6. O'zingizning forkingizga push qiling.
7. Asosiy repozitoriyga **Pull Request (PR)** oching.

## 🌿 Branch nomlash qoidalari (Branch Naming)

Branch nomlari tushunarli va ma'lum bir tuzilmaga ega bo'lishi kerak:

- Yangi funksionallik (feature) uchun: `feature/short-description` (masalan, `feature/add-checklist`)
- Xatoliklarni to'g'rilash (bug) uchun: `bugfix/short-description` (masalan, `bugfix/fix-lead-submission`)
- Shoshilinch xatolar uchun: `hotfix/short-description`
- Hujjatlar uchun: `docs/update-readme`

*Eslatma: Branch nomlarida faqat kichik harflar va chiziqcha (-) dan foydalaning.*

## 💬 Commit xabari formati (Conventional Commits)

Biz [Conventional Commits](https://www.conventionalcommits.org/) qoidalariga amal qilamiz. Format quyidagicha:
`<type>[optional scope]: <description>`

Asosiy turlar (Types):
- `feat:` Yangi funksionallik qo'shilganda
- `fix:` Xatolik (bug) to'g'rilanganda
- `docs:` Hujjatlarga o'zgartirish kiritilganda (README, CONTRIBUTING, va hokazo)
- `style:` Kod formatlash, probellar, vergullar kabi mantiqqa ta'sir qilmaydigan o'zgarishlar
- `refactor:` Yangi funksiya qo'shmaydigan va xatoni to'g'rilamaydigan kod o'zgarishi
- `test:` Testlar qo'shish yoki mavjudlarini o'zgartirish
- `chore:` Build jarayoni yoki yordamchi vositalar va kutubxonalardagi o'zgarishlar

*Misol:* `feat(bot): add interactive checklist for collections`

## 🎨 Kod yozish uslubi (Code Style Rules)

Loyiha sifatini saqlab qolish uchun quyidagi qoidalarga amal qiling:

### TypeScript
- Har doim aniq tiplardan (types/interfaces) foydalaning. `any` tipidan foydalanish taqiqlanadi.
- Interface nomlari katta harf bilan boshlanishi kerak (PascalCase).
- Fayl va papka nomlari `kebab-case` usulida yozilishi kerak (masalan, `user-profile.tsx`).

### Tailwind CSS & shadcn/ui
- Klasslarni tartibli yozish uchun `tailwind-merge` va `clsx` utilitalaridan (loyihada mavjud `cn` funksiyasidan) foydalaning.
- UI komponentlarini o'zgartirishdan oldin `shadcn/ui` hujjatlarini ko'rib chiqing va standart dizayn tizimini buzmang.

### Komponentlarni nomlash
- React komponentlari nomlari katta harf bilan (PascalCase) bo'lishi kerak: `ProductCard.tsx`.
- Komponentlar iloji boricha kichik va faqat bitta vazifani bajarishiga e'tibor bering (Single Responsibility Principle).

## ✅ Pull Request (PR) Checklist

PR ochishdan oldin quyidagilarni tekshiring:
- [ ] Kod standartlarga javob beradimi (`npm run lint` orqali tekshirilganmi)?
- [ ] O'zgartirishlar muhim fayllarni (masalan, `.env.example`) yangilashni talab qilmaydimi?
- [ ] Ma'lumotlar bazasi sxemasiga (Prisma) o'zgarish kiritilgan bo'lsa, migratsiyalar to'g'ri yaratilganmi?
- [ ] Yangi funksionallik uchun kerakli hujjatlar yozilganmi?
- [ ] Barcha console.log va test xabarlari tozalanganmi?

## 🐛 Xatolik haqida xabar berish (Issue Reporting)

Yangi xatolik haqida xabar berish (Issue ochish) da quyidagi ma'lumotlarni keltiring:
1. **Muammo tavsifi:** Qisqa va lo'nda tushuntirish.
2. **Qadamlar:** Xatolikni qanday qilib qayta yuzaga chiqarish mumkin.
3. **Kutilgan natija:** Aslida nima bo'lishi kerak edi.
4. **Haqiqiy natija:** Amalda nima ro'y berdi.
5. **Muhit ma'lumotlari:** OS, Brauzer versiyasi, Node.js versiyasi.

## 🧑‍💻 Kodni ko'rib chiqish (Code Review Process)

1. Siz ochgan PR kamida bitta asosiy dasturchi (maintainer) tomonidan ko'rib chiqilishi kerak.
2. Agar sharhlar qoldirilsa, ularni muhokama qiling va kerakli o'zgarishlarni commit qilib, o'sha branchga push qiling (yangi PR ochmang).
3. Barcha tasdiqlardan so'ng, PR asosiy (main) branchga merge qilinadi.

Loyihani rivojlantirishdagi yordamingiz uchun rahmat! 🎉
