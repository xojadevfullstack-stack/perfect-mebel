import { NextResponse } from "next/server";
import {
  handleHealth,
  handleCategoriesGet,
  handleProductsGet,
  handleCollectionsGet,
  handleLeadsPost,
  handleBotPost,
} from "./public";
import {
  handleAdminAuthLogin,
  handleAdminAuthLogout,
  handleAdminAuthMe,
  handleAdminCategoriesGet,
  handleAdminCategoriesPost,
  handleAdminCategoryDetail,
  handleAdminProductsGet,
  handleAdminProductsPost,
  handleAdminProductDetail,
  handleAdminCollectionsGet,
  handleAdminCollectionsPost,
  handleAdminCollectionDetail,
  handleAdminCollectionProducts,
  handleAdminLeadsGet,
  handleAdminStatsGet,
  handleAdminUploadPost,
} from "./admin";

export async function dispatchApiRoute(req: Request, slug: string[]): Promise<NextResponse> {
  const method = req.method;
  const [first, second, third, fourth] = slug;

  // 1. Health: /api/health
  if (first === "health") {
    return handleHealth();
  }

  // 2. Telegram Bot: /api/bot
  if (first === "bot") {
    if (method === "POST") return handleBotPost(req);
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  // 3. Public Categories: /api/categories
  if (first === "categories") {
    if (method === "GET") return handleCategoriesGet();
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  // 4. Public Products: /api/products, /api/products/:idOrSlug
  if (first === "products") {
    if (method === "GET") return handleProductsGet(req, second);
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  // 5. Public Collections: /api/collections, /api/collections/:idOrSlug
  if (first === "collections") {
    if (method === "GET") return handleCollectionsGet(req, second);
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  // 6. Public Leads: /api/leads
  if (first === "leads") {
    if (method === "POST") return handleLeadsPost(req);
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  // 7. Admin routes: /api/admin/...
  if (first === "admin") {
    // Auth: /api/admin/auth/...
    if (second === "auth") {
      if (third === "login" && method === "POST") return handleAdminAuthLogin(req);
      if (third === "logout" && method === "POST") return handleAdminAuthLogout();
      if (third === "me" && method === "GET") return handleAdminAuthMe();
    }

    // Categories: /api/admin/categories, /api/admin/categories/:id
    if (second === "categories") {
      if (!third) {
        if (method === "GET") return handleAdminCategoriesGet(req);
        if (method === "POST") return handleAdminCategoriesPost(req);
      } else {
        return handleAdminCategoryDetail(req, third);
      }
    }

    // Products: /api/admin/products, /api/admin/products/:id
    if (second === "products") {
      if (!third) {
        if (method === "GET") return handleAdminProductsGet(req);
        if (method === "POST") return handleAdminProductsPost(req);
      } else {
        return handleAdminProductDetail(req, third);
      }
    }

    // Collections: /api/admin/collections, /api/admin/collections/:id, /api/admin/collections/:id/products
    if (second === "collections") {
      if (!third) {
        if (method === "GET") return handleAdminCollectionsGet(req);
        if (method === "POST") return handleAdminCollectionsPost(req);
      } else if (fourth === "products") {
        return handleAdminCollectionProducts(req, third);
      } else {
        return handleAdminCollectionDetail(req, third);
      }
    }

    // Leads: /api/admin/leads
    if (second === "leads") {
      if (method === "GET") return handleAdminLeadsGet(req);
    }

    // Stats: /api/admin/stats
    if (second === "stats") {
      if (method === "GET") return handleAdminStatsGet();
    }

    // Upload: /api/admin/upload
    if (second === "upload") {
      if (method === "POST") return handleAdminUploadPost(req);
    }
  }

  return NextResponse.json({ success: false, error: "API yo'li topilmadi" }, { status: 404 });
}
