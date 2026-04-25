import { readFile } from "node:fs/promises";
import path from "node:path";

async function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  try {
    const raw = await readFile(envPath, "utf-8");
    for (const line of raw.split(/\r?\n/)) {
      if (!line || line.trim().startsWith("#")) continue;
      const idx = line.indexOf("=");
      if (idx === -1) continue;
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      if (key && value && !process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch (e) {
    console.warn("Could not load .env.local");
  }
}

const FLAGSHIP_ARTICLE = {
  category: "F&B Tech",
  title: "The Dubai F&B Paradigm Shift: Scaling Efficiency and Emotion with Generative AI",
  title_ar: "التحول الجذري في قطاع الأغذية والمشروبات في دبي: تعزيز الكفاءة والعاطفة من خلال الذكاء الاصطناعي",
  excerpt: "Strategic analysis on how Gemini API and Edge AI are driving 30% waste reduction and 150% ROI in Dubai's DIFC and Jumeirah dining scenes.",
  excerpt_ar: "تحليل استراتيجي حول كيفية مساهمة Gemini API وذكاء الحافة الاصطناعي في خفض الهدر بنسبة 30٪ وتحقيق عائد استثمار بنسبة 150٪ في قطاع المطاعم بدبي.",
  content: `# Strategic Analysis: The Dubai F&B Paradigm Shift\n\n## 1. The Strategic Context: Beyond Digital Menus\nAs Dubai gears up for **AI Everything 2026**, the conversation in the city's boardrooms has shifted from "How do we digitize?" to "How do we predict?" In the high-stakes environments of DIFC’s fine-dining establishments and the booming cloud kitchens of JLT, AI is no longer a luxury—it’s the operating system of the future.\n\n## 2. B2B: The ROI of Precision (Management Perspective)\nThe financial impact is undeniable. By leveraging the **Gemini API** for high-fidelity demand forecasting, multi-brand operators are seeing a **30% reduction in food waste**.\n- **Labor Optimization**: Edge AI vision systems in kitchens analyze preparation flows, reducing ticket times by 15% without increasing headcount.\n- **ROI Metrics**: Early adopters of integrated F&B tech stacks report a **150% improvement in ROI** on their digital infrastructure within the first 12 months.\n\n## 3. B2C: The Emotional Algorithm (Consumer Experience)\nIn the upscale cafes of Jumeirah, AI is enhancing the "human touch" rather than replacing it.\n- **Hyper-Personalization**: Customer recognition AI suggests pairings based on previous visits and local weather patterns, making every guest feel like a regular.\n- **Frictionless Dining**: Real-time table management algorithms eliminate the "wait-list anxiety," allowing guests to arrive exactly when their table is ready.\n\n## 4. Future Outlook: AI Everything 2026\nThe upcoming event will showcase "Autonomous Kitchens" and "Neuro-Marketing for Palates." Dubai is setting the global gold standard for how technology can preserve culinary heritage while maximizing industrial efficiency.`,
  content_ar: `# تحليل استراتيجي: التحول الجذري في قطاع الأغذية والمشروبات في دبي\n\n## 1. السياق الاستراتيجي: ما وراء القوائم الرقمية\nمع استعداد دبي لفعالية **AI Everything 2026**، تحول النقاش في غرف اجتماعات المدينة من "كيف نتحول رقمياً؟" إلى "كيف نتوقع؟". في البيئات عالية المخاطر في مطاعم DIFC الفاخرة والمطابخ السحابية المزدهرة في JLT، لم يعد الذكاء الاصطناعي رفاهية - بل أصبح نظام تشغيل المستقبل.\n\n## 2. B2B: عائد الاستثمار للدقة (منظور الإدارة)\nالتأثير المالي لا يمكن إنكاره. من خلال الاستفادة من **Gemini API** للتنبؤ عالي الدقة بالطلب، يشهد مشغلو العلامات التجارية المتعددة **انخفاضاً بنسبة 30٪ في هدر الطعام**.\n- **تحسين العمالة**: تحلل أنظمة رؤية الحافة الاصطناعية في المطابخ تدفقات التحضير، مما يقلل من أوقات تقديم الطلبات بنسبة 15٪ دون زيادة عدد الموظفين.\n- **مقاييس ROI**: يسجل المتبنون الأوائل لمنظومات تكنولوجيا الأغذية والمشروبات المتكاملة **تحسناً بنسبة 150٪ في عائد الاستثمار** في بنيتهم التحتية الرقمية خلال أول 12 شهراً.\n\n## 3. B2C: الخوارزمية العاطفية (تجربة المستهلك)\nفي المقاهي الراقية في جميرا، يعمل الذكاء الاصطناعي على تعزيز "اللمسة الإنسانية" بدلاً من استبدالها.\n- **التخصيص الفائق**: يقترح الذكاء الاصطناعي للتعرف على العملاء خيارات تتناسب مع الزيارات السابقة وأنماط الطقس المحلية، مما يجعل كل ضيف يشعر وكأنه زبون دائم.\n- **تناول طعام بلا عوائق**: تقضي خوارزميات إدارة الطاولات في الوقت الفعلي على "قلق قائمة الانتظار"، مما يسمح للضيوف بالوصول تماماً عندما تكون طاولتهم جاهزة.\n\n## 4. الآفاق المستقبلية: AI Everything 2026\nستعرض الفعالية القادمة "المطابخ المستقلة" و"التسويق العصبي للأذواق". تضع دبي المعيار الذهبي العالمي لكيفية حفاظ التكنولوجيا على التراث الطهوي مع تعظيم الكفاءة الصناعية.`,
  source_name: "mirAIreach Strategic Research",
  image_url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80",
  is_published: true,
  created_at: new Date().toISOString(),
};

async function insertArticle(url, key, article) {
  const response = await fetch(`${url}/rest/v1/articles`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(article),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to insert article: ${response.status} ${body}`);
  }

  return response.json();
}

async function main() {
  await loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase credentials.");
  }

  console.log("Inserting flagship strategic analysis article...");
  try {
    const inserted = await insertArticle(url, key, FLAGSHIP_ARTICLE);
    console.log(`Successfully inserted article! ID: ${inserted[0].id}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();
