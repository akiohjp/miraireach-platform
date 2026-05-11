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
  } catch (err) {
    console.warn("No .env.local found, using process.env");
  }
}

const PREMIUM_ARTICLES = [
  {
    category: "Gourmet & Dining",
    source_name: "Michelin Guide",
    title: "The 2026 Stars: How Dubai Secured its Place as a Global Gastronomy Capital",
    title_ar: "نجوم 2026: كيف حجزت دبي مكانتها كعاصمة عالمية لفنون الطهي",
    excerpt: "A strategic look at the evolution of Dubai's culinary landscape and the impact of the latest Michelin selections.",
    excerpt_ar: "نظرة استراتيجية على تطور المشهد الطهي في دبي وتأثير أحدث اختيارات ميشلان.",
    content: `## The Culinary Renaissance of the Middle East\n\nDubai's journey to becoming a Michelin-starred destination was not an overnight success, but a decade of strategic investment and visionary talent acquisition. In 2026, the city has reached a tipping point, boasting more stars per capita than many established European capitals.\n\n### Strategic Pillars of Success\n- **Diverse Talent Acquisition**: Chefs from Tokyo, Paris, and Lima have set up flagship concepts in DIFC and Jumeirah.\n- **Supply Chain Innovation**: The rise of vertical farming in the UAE has provided chefs with fresh, local ingredients previously unavailable.\n- **Cultural Fusion**: The unique blend of traditional Emirati flavors with modern techniques has created a new 'Dubai Style' of dining.\n\n### AI Market Insight\nAI-driven inventory management is now the standard in Michelin-starred kitchens, reducing waste by 30% and allowing chefs to focus on creative execution.`,
    content_ar: `## النهضة الطهوية في الشرق الأوسط\n\nلم تكن رحلة دبي لتصبح وجهة حاصلة على نجمة ميشلان نجاحاً بين عشية وضحاها، بل كانت عقداً من الاستثمار الاستراتيجي واكتساب المواهب ذات الرؤية. في عام 2026، وصلت المدينة إلى نقطة تحول، حيث تفتخر بنجوم للفرد الواحد أكثر من العديد من العواصم الأوروبية العريقة.\n\n### الركائز الاستراتيجية للنجاح\n- **اكتساب مواهب متنوعة**: أنشأ طهاة من طوكيو وباريس وليما مفاهيم رائدة في مركز دبي المالي العالمي وجميرا.\n- **الابتكار في سلسلة التوريد**: وفر صعود الزراعة العمودية في الإمارات للطهاة مكونات محلية طازجة لم تكن متوفرة سابقاً.\n- **الاندماج الثقافي**: خلق المزيج الفريد من النكهات الإماراتية التقليدية مع التقنيات الحديثة "أسلوب دبي" جديداً في تناول الطعام.\n\n### رؤية سوق الذكاء الاصطناعي\nأصبحت إدارة المخزون المدعومة بالذكاء الاصطناعي الآن هي المعيار في المطابخ الحاصلة على نجمة ميشلان، مما يقلل النفايات بنسبة 30% ويسمح للطهاة بالتركيز على التنفيذ الإبداعي.`,
    image_url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1600&q=80&sig=michelin_2026"
  },
  {
    category: "Gourmet & Dining",
    source_name: "Gault&Millau UAE",
    title: "The Ethics of Caviar: A Strategic Look at Sustainable Luxury in Dubai",
    title_ar: "أخلاقيات الكافيار: نظرة استراتيجية على الفخامة المستدامة في دبي",
    excerpt: "Exploring the rise of ethically sourced caviar and the new standards of luxury dining in the Emirates.",
    excerpt_ar: "استكشاف صعود الكافيار المستخرج بمسؤولية والمعايير الجديدة لتناول الطعام الفاخر في الإمارات.",
    content: `## Sustainability in the High-End Sector\n\nLuxury is no longer just about excess; it is about responsibility. Gault&Millau UAE analyzes how Dubai's top restaurants are pivoting to ethical luxury. Caviar, once a symbol of opulence at any cost, is now scrutinized for its environmental footprint.\n\n### The Shift to Ethical Sourcing\nTop chefs in Dubai are now prioritizing suppliers who use sustainable sturgeon farming practices. This shift is driven by a more conscious generation of diners who demand transparency in their food's origin.\n\n### AI Market Insight\nBlockchain technology is being utilized to track the provenance of premium ingredients like caviar, ensuring that what arrives at the table is authentic and ethically sourced.`,
    content_ar: `## الاستدامة في القطاع الفاخر\n\nلم تعد الفخامة تتعلق فقط بالإفراط، بل بالمسؤولية. تحلل "غو إيه ميو" الإمارات كيف تتحول أفضل المطاعم في دبي إلى الفخامة الأخلاقية. الكافيار، الذي كان يوماً رمزاً للبذخ بأي ثمن، يخضع الآن للتدقيق بسبب بصمته البيئية.\n\n### التحول إلى المصادر الأخلاقية\nيعطي كبار الطهاة في دبي الآن الأولوية للموردين الذين يستخدمون ممارسات مستدامة في تربية سمك الحفش. هذا التحول مدفوع بجيل أكثر وعياً من رواد المطاعم الذين يطالبون بالشفافية في أصل طعامهم.\n\n### رؤية سوق الذكاء الاصطناعي\nيتم استخدام تقنية البلوكشين لتتبع منشأ المكونات المتميزة مثل الكافيار، مما يضمن أن ما يصل إلى المائدة أصلي ومستخرج بطريقة أخلاقية.`,
    image_url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80&sig=caviar_ethics"
  },
  {
    category: "AI & Deep Tech",
    source_name: "TechCrunch ME",
    title: "LLMs in Arabic: The Race for the Most Accurate Middle Eastern AI",
    title_ar: "نماذج اللغات الكبيرة باللغة العربية: السباق نحو أدق ذكاء اصطناعي في الشرق الأوسط",
    excerpt: "Technical analysis of the competition between global giants and local startups to master Arabic dialect processing.",
    excerpt_ar: "تحليل تقني للمنافسة بين العمالقة العالميين والشركات الناشئة المحلية لإتقان معالجة اللهجات العربية.",
    content: `## The Nuance of Language in the AI Era\n\nArabic is one of the most complex languages for Natural Language Processing (NLP) due to its numerous dialects and intricate grammar. TechCrunch ME explores the latest breakthroughs in Jais and other regional LLMs.\n\n### Breaking the Language Barrier\n- **Tokenization Innovation**: New methods for representing Arabic characters in neural networks.\n- **Dialect Adaptation**: Moving beyond Modern Standard Arabic (MSA) to understand Egyptian, Levantine, and Gulf dialects.\n- **Enterprise Adoption**: How UAE government entities are using local AI to automate public services.\n\n### AI Market Insight\nLocalized LLMs are expected to capture 60% of the Middle Eastern enterprise market by 2027, as data sovereignty becomes a non-negotiable requirement.`,
    content_ar: `## الفروق اللغوية في عصر الذكاء الاصطناعي\n\nتعد اللغة العربية واحدة من أكثر اللغات تعقيداً لمعالجة اللغات الطبيعية (NLP) نظراً لعدة لهجاتها وقواعدها المعقدة. تستكشف "تيك كرنش" الشرق الأوسط أحدث الاختراقات في "جيس" وغيرها من نماذج اللغات الكبيرة الإقليمية.\n\n### كسر حاجز اللغة\n- **الابتكار في التجزئة**: طرق جديدة لتمثيل الحروف العربية في الشبكات العصبية.\n- **التكيف مع اللهجات**: الانتقال إلى ما هو أبعد من اللغة العربية الفصحى الحديثة لفهم اللهجات المصرية والشامية والخليجية.\n- **تبني المؤسسات**: كيف تستخدم الجهات الحكومية في الإمارات الذكاء الاصطناعي المحلي لأتمتة الخدمات العامة.\n\n### رؤية سوق الذكاء الاصطناعي\nمن المتوقع أن تستحوذ نماذج اللغات الكبيرة المحلية على 60٪ من سوق المؤسسات في الشرق الأوسط بحلول عام 2027، حيث تصبح سيادة البيانات مطلباً غير قابل للتفاوض.`,
    image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=80&sig=arabic_llm"
  },
  {
    category: "Lifestyle & Travel",
    source_name: "Condé Nast Traveller ME",
    title: "The Desert Reimagined: Luxury Eco-Resorts Redefining Isolation",
    title_ar: "إعادة تصور الصحراء: منتجعات بيئية فاخرة تعيد تعريف العزلة",
    excerpt: "A curated guide to the most exclusive sustainable retreats in the UAE's vast desert landscape.",
    excerpt_ar: "دليل منسق لأكثر المنتجعات المستدامة حصرياً في المناظر الطبيعية الصحراوية الواسعة في الإمارات.",
    content: `## The Shift Toward Regenerative Travel\n\nLuxury travel in the Middle East is undergoing a paradigm shift. Travelers are no longer just looking for golden faucets; they are seeking connection with nature and cultural heritage. Condé Nast Traveller ME examines the rise of high-end eco-resorts.\n\n### Sustainability Meets Opulence\n- **Solar Powered Luxury**: Resorts in Hatta and Al Ain operating entirely on renewable energy.\n- **Minimal Footprint**: Low-impact construction techniques that preserve the fragile desert ecosystem.\n- **Holistic Wellness**: Integration of ancient Bedouin wellness practices with modern biohacking.\n\n### AI Market Insight\nPersonalized travel AI is now curating bespoke 'Isolation Itineraries' for UHNWIs, focusing on digital detox and environmental contribution.`,
    content_ar: `## التحول نحو السفر التجديدي\n\nيشهد السفر الفاخر في الشرق الأوسط تحولاً في النموذج. لم يعد المسافرون يبحثون فقط عن الصنابير الذهبية؛ بل يبحثون عن التواصل مع الطبيعة والتراث الثقافي. تستعرض "كوندي ناست ترافيلر" الشرق الأوسط صعود المنتجعات البيئية الراقية.\n\n### الاستدامة تلتقي بالبذخ\n- **فخامة تعمل بالطاقة الشمسية**: منتجعات في حتا والعين تعمل بالكامل بالطاقة المتجددة.\n- **بصمة منخفضة**: تقنيات بناء منخفضة التأثير تحافظ على النظام البيئي الصحراوي الهش.\n- **العافية الشمولية**: دمج ممارسات العافية البدوية القديمة مع الاختراق الحيوي الحديث.\n\n### رؤية سوق الذكاء الاصطناعي\nيقوم الذكاء الاصطناعي المخصص للسفر الآن بتنسيق "مسارات عزلة" مفصلة للأثراء، مع التركيز على التخلص من السموم الرقمية والمساهمة البيئية.`,
    image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80&sig=eco_desert"
  },
  {
    category: "Business & Technology",
    source_name: "Forbes Middle East",
    title: "The Family Office Shift: Why Gen Z Heirs are Investing in Venture Capital",
    title_ar: "تحول المكاتب العائلية: لماذا يستثمر ورثة الجيل Z في رأس المال الاستثماري",
    excerpt: "Strategic analysis of the changing investment patterns among the region's wealthiest families.",
    excerpt_ar: "تحليل استراتيجي لأنماط الاستثمار المتغيرة بين أغنى العائلات في المنطقة.",
    content: `## A New Era of Wealth Management\n\nThe great wealth transfer in the Middle East is not just about moving money; it's about changing priorities. Forbes Middle East looks at how the next generation is pivoting family offices toward tech and impact.\n\n### Strategic Investment Shifts\n- **Tech-First Approach**: Moving from real estate into high-growth AI and Fintech startups.\n- **Global Diversification**: Using Dubai as a base for cross-border venture capital investments.\n- **Sustainability Mandate**: ESG compliance as a core requirement for all new portfolio additions.\n\n### AI Market Insight\nPredictive wealth management platforms are being integrated into family offices to monitor global geopolitical risks and automate asset reallocation in real-time.`,
    content_ar: `## عصر جديد لإدارة الثروات\n\nلا يتعلق انتقال الثروة الكبير في الشرق الأوسط بمجرد نقل الأموال؛ بل يتعلق بتغيير الأولويات. تستعرض "فوربس الشرق الأوسط" كيف يوجه الجيل القادم المكاتب العائلية نحو التكنولوجيا والتأثير.\n\n### تحولات الاستثمار الاستراتيجية\n- **نهج التكنولوجيا أولاً**: الانتقال من العقارات إلى الشركات الناشئة في مجال الذكاء الاصطناعي والتكنولوجيا المالية عالية النمو.\n- **التنويع العالمي**: استخدام دبي كقاعدة لاستثمارات رأس المال الاستثماري عبر الحدود.\n- **تفويض الاستدامة**: الامتثال للمعايير البيئية والاجتماعية والحوكمة (ESG) كمتطلب أساسي لجميع الإضافات الجديدة للمحفظة.\n\n### رؤية سوق الذكاء الاصطناعي\nيتم دمج منصات إدارة الثروات التنبؤية في المكاتب العائلية لمراقبة المخاطر الجيوسياسية العالمية وأتمتة إعادة تخصيص الأصول في الوقت الفعلي.`,
    image_url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80&sig=family_office"
  },
  {
    category: "FinTech & Crypto",
    source_name: "Arabian Business",
    title: "Dubai's Crypto Oasis: Why VARA is Influencing Global Policy in 2026",
    title_ar: "واحة دبي للعملات الرقمية: لماذا تؤثر سلطة تنظيم الأصول الافتراضية (VARA) على السياسة العالمية في 2026",
    excerpt: "Exploring the regulatory leadership of Dubai and its impact on the global digital asset ecosystem.",
    excerpt_ar: "استكشاف القيادة التنظيمية لدبي وتأثيرها على منظومة الأصول الرقمية العالمية.",
    content: `## The Regulatory Gold Standard\n\nIn 2026, Dubai has solidified its position as the world's crypto capital. The Virtual Assets Regulatory Authority (VARA) has moved from a regional experiment to a global trendsetter. Arabian Business analyzes this unprecedented shift.\n\n### Key Regulatory Pillars\n- **Transparency First**: Real-time audit requirements for licensed exchanges.\n- **Innovation Sandbox**: Allowing startups to test DeFi protocols under government supervision.\n- **Global Interoperability**: Establishing common standards with London, Singapore, and New York.\n\n### AI Market Insight\nAI-powered compliance tools are now mandatory for crypto startups in Dubai, allowing for instantaneous KYC and AML checks that exceed international standards.`,
    content_ar: `## المعيار الذهبي للتنظيم\n\nفي عام 2026، رسخت دبي مكانتها كعاصمة للعملات الرقمية في العالم. انتقلت سلطة تنظيم الأصول الافتراضية (VARA) من تجربة إقليمية إلى رائدة للتوجهات العالمية. تحلل "أريبيان بزنس" هذا التحول غير المسبوق.\n\n### الركائز التنظيمية الرئيسية\n- **الشفافية أولاً**: متطلبات التدقيق في الوقت الفعلي للبورصات المرخصة.\n- **صندوق رمال الابتكار**: السماح للشركات الناشئة باختبار بروتوكولات التمويل اللامركزي (DeFi) تحت إشراف حكومي.\n- **التوافق العالمي**: وضع معايير مشتركة مع لندن وسنغافورة ونيويورك.\n\n### رؤية سوق الذكاء الاصطناعي\nأصبحت أدوات الامتثال المدعومة بالذكاء الاصطناعي الآن إلزامية للشركات الناشئة في مجال التشفير في دبي، مما يسمح بإجراء فحوصات فورية لعرف عميلك (KYC) ومكافحة غسيل الأموال (AML) تتجاوز المعايير الدولية.`,
    image_url: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=1600&q=80&sig=dubai_crypto"
  },
  {
    category: "Logistics & Supply Chain",
    source_name: "Gulf Business",
    title: "Logistics 4.0: How DP World is Using AI to Predict Global Port Delays",
    title_ar: "لوجستيات 4.0: كيف تستخدم دي بي ورلد الذكاء الاصطناعي للتنبؤ بتأخيرات الموانئ العالمية",
    excerpt: "Technical report on the digital transformation of Jebel Ali Port and its role in global trade resilience.",
    excerpt_ar: "تقرير تقني حول التحول الرقمي لميناء جبل علي ودوره في مرونة التجارة العالمية.",
    content: `## The Digital Backbone of Global Trade\n\nJebel Ali Port remains the crown jewel of Middle Eastern logistics. In 2026, the integration of 'Logistics 4.0' has moved from a concept to a operational reality. Gulf Business explores the AI infrastructure behind DP World's global success.\n\n### Strategic Digital Pillars\n- **Predictive Berth Allocation**: Using machine learning to optimize vessel docking times.\n- **Autonomous Terminals**: AI-driven cranes and transport vehicles operating 24/7 with zero human intervention.\n- **Real-Time Visibility**: Blockchain-backed tracking for every container moving through the GCC.\n\n### AI Market Insight\nAI-optimized port operations have increased throughput by 22% in Dubai, setting a new global benchmark for maritime efficiency.`,
    content_ar: `## العمود الفقري الرقمي للتجارة العالمية\n\nلا يزال ميناء جبل علي جوهرة التاج في اللوجستيات الشرق أوسطية. في عام 2026، انتقل دمج "لوجستيات 4.0" من مجرد مفهوم إلى واقع تشغيلي. تستعرض "جلف بزنس" البنية التحتية للذكاء الاصطناعي وراء النجاح العالمي لشركة دي بي ورلد.\n\n### الركائز الرقمية الاستراتيجية\n- **تخصيص الرصيف التنبؤي**: استخدام التعلم الآلي لتحسين أوقات رسو السفن.\n- **المحطات الذاتية**: رافعات ومركبات نقل مدفوعة بالذكاء الاصطناعي تعمل على مدار الساعة طوال أيام الأسبوع دون تدخل بشري.\n- **الرؤية في الوقت الفعلي**: تتبع مدعوم بالبلوكشين لكل حاوية تتحرك عبر دول مجلس التعاون الخليجي.\n\n### رؤية سوق الذكاء الاصطناعي\nأدت عمليات الموانئ المحسنة بالذكاء الاصطناعي إلى زيادة الإنتاجية بنسبة 22٪ في دبي، مما وضع معياراً عالمياً جديداً للكفاءة البحرية.`,
    image_url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80&sig=logistics_ai"
  },
  {
    category: "Real Estate & PropTech",
    source_name: "Arabian Business",
    title: "Predictive Property: How AI is Stabilizing the Dubai Real Estate Market",
    title_ar: "العقارات التنبؤية: كيف يعمل الذكاء الاصطناعي على استقرار سوق العقارات في دبي",
    excerpt: "Strategic analysis of the PropTech revolution and its impact on investor confidence in the UAE.",
    excerpt_ar: "تحليل استراتيجي لثورة التكنولوجيا العقارية وتأثيرها على ثقة المستثمرين في الإمارات.",
    content: `## Beyond the Boom and Bust Cycle\n\nDubai's real estate market has long been associated with volatility. However, in 2026, data science is providing a new level of stability. Arabian Business examines the tools allowing developers and investors to see around corners.\n\n### PropTech Innovation Pillars\n- **Valuation AI**: Real-time property valuation based on thousands of data points, from school ratings to proximity to future metro lines.\n- **Smart Contracts**: Eliminating legal friction in property transfers via DLD-approved blockchain protocols.\n- **Tenant Sentiment Analysis**: Using social listening to predict shifting demand in residential neighborhoods.\n\n### AI Market Insight\nAI-driven market forecasting has reduced speculative bubbles in Dubai's premium sector by providing transparent, data-backed entry and exit points for global institutional investors.`,
    content_ar: `## ما وراء دورة الازدهار والكساد\n\nلطالما ارتبط سوق العقارات في دبي بالتقلبات. ومع ذلك، في عام 2026، يوفر علم البيانات مستوى جديداً من الاستقرار. تستعرض "أريبيان بزنس" الأدوات التي تسمح للمطورين والمستثمرين برؤية ما وراء الأفق.\n\n### ركائز ابتكار التكنولوجيا العقارية\n- **الذكاء الاصطناعي للتقييم**: تقييم العقارات في الوقت الفعلي بناءً على آلاف نقاط البيانات، من تصنيفات المدارس إلى القرب من خطوط المترو المستقبلية.\n- **العقود الذكية**: القضاء على الاحتكاك القانوني في عمليات نقل الملكية عبر بروتوكولات البلوكشين المعتمدة من دائرة الأراضي والأملاك في دبي.\n- **تحليل مشاعر المستأجرين**: استخدام الاستماع الاجتماعي للتنبؤ بالطلب المتغير في الأحياء السكنية.\n\n### رؤية سوق الذكاء الاصطناعي\nأدت تنبؤات السوق المدعومة بالذكاء الاصطناعي إلى تقليل الفقاعات المضاربة في القطاع المتميز بدبي من خلال توفير نقاط دخول وخروج شفافة ومدعومة بالبيانات للمستثمرين المؤسسيين العالميين.`,
    image_url: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1600&q=80&sig=proptech_ai"
  },
  {
    category: "Food & Culture",
    source_name: "What's On Dubai",
    title: "The Heritage Kitchen: Preserving Emirati Gastronomy in a Modern City",
    title_ar: "مطبخ التراث: الحفاظ على فنون الطهي الإماراتية في مدينة حديثة",
    excerpt: "A cultural exploration of the movement to document and revitalize traditional recipes for the next generation.",
    excerpt_ar: "استكشاف ثقافي لحركة توثيق وإحياء الوصفات التقليدية للجيل القادم.",
    content: `## A Journey Back to the Roots\n\nAmidst the skyscrapers and Michelin stars, a quiet revolution is happening in the kitchens of Old Dubai. What's On Dubai explores how local families and young chefs are ensuring that the flavors of the past are not lost to time.\n\n### The Pillars of Culinary Heritage\n- **Recipe Digitization**: Using AI to archive oral histories and cooking techniques from the elders.\n- **Local Ingredient Sourcing**: The comeback of seasonal desert plants and sustainable fish varieties in high-end dining.\n- **Educational Hubs**: New cooking schools dedicated entirely to traditional Gulf techniques.\n\n### AI Market Insight\nCultural preservation AI is being used to analyze thousands of hours of oral history to identify lost spice blends and cooking methods, bridging the gap between generations.`,
    content_ar: `## رحلة العودة إلى الجذور\n\nوسط ناطحات السحاب ونجوم ميشلان، تحدث ثورة هادئة في مطابخ دبي القديمة. تستعرض "واتس أون دبي" كيف تضمن العائلات المحلية والطهاة الشباب عدم ضياع نكهات الماضي مع مرور الوقت.\n\n### ركائز التراث الطهوي\n- **رقمنة الوصفات**: استخدام الذكاء الاصطناعي لأرشفة التواريخ الشفوية وتقنيات الطبخ من كبار السن.\n- **توفير المكونات المحلية**: عودة النباتات الصحراوية الموسمية وأنواع الأسماك المستدامة في المطاعم الراقية.\n- **المراكز التعليمية**: مدارس طبخ جديدة مخصصة بالكامل لتقنيات الخليج التقليدية.\n\n### رؤية سوق الذكاء الاصطناعي\nيتم استخدام الذكاء الاصطناعي للحفاظ على الثقافة لتحليل آلاف الساعات من التاريخ الشفوي لتحديد خلطات التوابل وطرق الطبخ المفقودة، مما يسد الفجوة بين الأجيال.`,
    image_url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80&sig=heritage_kitchen"
  }
];

const STATIC_IMAGE_POOLS = {
  "Gourmet & Dining": [
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9",
    "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601",
    "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327",
    "https://images.unsplash.com/photo-1493770348161-369560ae357d",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
    "https://images.unsplash.com/photo-1551024506-0bccd828d307",
    "https://images.unsplash.com/photo-1499028344343-cd173ffc68a9",
    "https://images.unsplash.com/photo-1482049016688-2d3e1b311543",
    "https://images.unsplash.com/photo-1484723088339-fe28233e561e",
    "https://images.unsplash.com/photo-1490645935967-10de6ba17051",
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288",
    "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38"
  ],
  "AI & Deep Tech": [
    "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    "https://images.unsplash.com/photo-1518770660439-4636190af475",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
    "https://images.unsplash.com/photo-1525338078858-8ed653b17675",
    "https://images.unsplash.com/photo-1504384308090-c89e12075d19",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    "https://images.unsplash.com/photo-1516116216624-53e697fedbea",
    "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb",
    "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
    "https://images.unsplash.com/photo-1558494949-ef0109123b06",
    "https://images.unsplash.com/photo-1504164996022-09080787b6b3",
    "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0",
    "https://images.unsplash.com/photo-1507146426996-ef05306b995a",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    "https://images.unsplash.com/photo-1518433278981-67dfef56079b",
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837"
  ],
  "Real Estate & PropTech": [
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
    "https://images.unsplash.com/photo-1582407947304-fd86f028f716",
    "https://images.unsplash.com/photo-1503387762-592dee58c460",
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
    "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
    "https://images.unsplash.com/photo-1460317442991-0ec209397118",
    "https://images.unsplash.com/photo-1513584684374-8bdb7483ef8f",
    "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff",
    "https://images.unsplash.com/photo-1493397212122-2b85dda8106b",
    "https://images.unsplash.com/photo-1501183007986-d0d080b147f9",
    "https://images.unsplash.com/photo-1515263487990-61b07816b324",
    "https://images.unsplash.com/photo-1475855581690-80af145cd335",
    "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6",
    "https://images.unsplash.com/photo-1523217582562-09d0def993a6",
    "https://images.unsplash.com/photo-1512915922686-57c11ff9b6b0",
    "https://images.unsplash.com/photo-1505691938895-1758d7eaa511",
    "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8"
  ],
  "Business & Technology": [
    "https://images.unsplash.com/photo-1497366216548-37526070297c",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72",
    "https://images.unsplash.com/photo-1557804506-669a67965ba0",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    "https://images.unsplash.com/photo-1454165833267-033f235ff27d",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0",
    "https://images.unsplash.com/photo-1542744094-3a31f08e78ec",
    "https://images.unsplash.com/photo-1551434678-e076c223a692",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    "https://images.unsplash.com/photo-1504384308090-c89e12075d19",
    "https://images.unsplash.com/photo-1491975474562-1f4e30bc9468",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    "https://images.unsplash.com/photo-1553877522-43269d4ea984",
    "https://images.unsplash.com/photo-1552664730-d307ca884978",
    "https://images.unsplash.com/photo-1434626881859-194d67b2b86f",
    "https://images.unsplash.com/photo-1552581234-26160f608093",
    "https://images.unsplash.com/photo-1521791136064-7986c2920216"
  ],
  "Lifestyle & Travel": [
    "https://images.unsplash.com/photo-1518186239751-2477cf41d49e",
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c",
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecee",
    "https://images.unsplash.com/photo-1519046904884-53103b34b206",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    "https://images.unsplash.com/photo-1502784444187-359ac186c5bb",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1",
    "https://images.unsplash.com/photo-1530789253508-20299e9000a6",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800",
    "https://images.unsplash.com/photo-1473625247510-8ceb1760943f",
    "https://images.unsplash.com/photo-1533105079780-92b9be482077",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    "https://images.unsplash.com/photo-1493246507139-91e8bef99c02",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
    "https://images.unsplash.com/photo-1433086966358-54859d0ed716",
    "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6",
    "https://images.unsplash.com/photo-1502120924758-c02da0471947",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e"
  ],
  "Logistics & Supply Chain": [
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d",
    "https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b",
    "https://images.unsplash.com/photo-1521331015254-184518349272",
    "https://images.unsplash.com/photo-1578575437130-527eed3abbec",
    "https://images.unsplash.com/photo-1519003722824-194d4455a60c",
    "https://images.unsplash.com/photo-1524514587686-8200f623b90f",
    "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3",
    "https://images.unsplash.com/photo-1506784923340-39401777264a",
    "https://images.unsplash.com/photo-1513151239018-d457d5724a12",
    "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a",
    "https://images.unsplash.com/photo-1515516089376-88db1e26e9c0",
    "https://images.unsplash.com/photo-1522071823991-b99c223a656e",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
    "https://images.unsplash.com/photo-1518135746617-646069796e6a",
    "https://images.unsplash.com/photo-148336675901f-15775a109721",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0",
    "https://images.unsplash.com/photo-1553028826-f4804a6dba3b",
    "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122",
    "https://images.unsplash.com/photo-1516321497487-e288fb19713f",
    "https://images.unsplash.com/photo-1497366216548-37526070297c"
  ],
  "FinTech & Crypto": [
    "https://images.unsplash.com/photo-1621761191319-c6fb62004040",
    "https://images.unsplash.com/photo-1518186239751-2477cf41d49e",
    "https://images.unsplash.com/photo-1605792657660-596af903962a",
    "https://images.unsplash.com/photo-1624555130581-1d9cca783bc0",
    "https://images.unsplash.com/photo-1639762681485-074b7f938ba0",
    "https://images.unsplash.com/photo-1633156191779-2a43217d848e",
    "https://images.unsplash.com/photo-1621416848446-9fba84a0f44d",
    "https://images.unsplash.com/photo-1638913660106-73b4bac0da09",
    "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d",
    "https://images.unsplash.com/photo-1642104704074-907c0698cbd9",
    "https://images.unsplash.com/photo-1622633054716-6811ba2847c1",
    "https://images.unsplash.com/photo-1634704784915-aacf363b021f",
    "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d",
    "https://images.unsplash.com/photo-1639151240321-0a6e3c0d4538",
    "https://images.unsplash.com/photo-1631603090989-93f9ef6f9d80",
    "https://images.unsplash.com/photo-1644335492336-d4e5f039433a",
    "https://images.unsplash.com/photo-1639322537228-f710d846310a",
    "https://images.unsplash.com/photo-1622790698141-94e30457ef12",
    "https://images.unsplash.com/photo-1633156191779-2a43217d848e",
    "https://images.unsplash.com/photo-1625806319395-96081223df05"
  ],
  "Food & Culture": [
    "https://images.unsplash.com/photo-1559339352-11d035aa65de",
    "https://images.unsplash.com/photo-1590089052664-8fbf74677a3b",
    "https://images.unsplash.com/photo-1589113331629-113b1d58d973",
    "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91",
    "https://images.unsplash.com/photo-1599481238505-b8b0537a3f77",
    "https://images.unsplash.com/photo-1567160563686-24024bc652c4",
    "https://images.unsplash.com/photo-1541544741938-0af808871cc0",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    "https://images.unsplash.com/photo-1498654077810-12c21d4d6dc3",
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601",
    "https://images.unsplash.com/photo-1525755662778-989d0524087e",
    "https://images.unsplash.com/photo-1490818387583-1baba5e638af",
    "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94",
    "https://images.unsplash.com/photo-149485981460c-38af4c370741",
    "https://images.unsplash.com/photo-1481931098730-1181134857b7",
    "https://images.unsplash.com/photo-1504387854560-3f77bb9c5126",
    "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2",
    "https://images.unsplash.com/photo-1506354666786-959d6d497f1a",
    "https://images.unsplash.com/photo-1512101177083-c7d79427071e",
    "https://images.unsplash.com/photo-1464306311795-997483974834"
  ]
};

async function main() {
  await loadEnv();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase configuration");
  }

  console.log(`🚀 IMPORTING ${PREMIUM_ARTICLES.length} PREMIUM ARTICLES (Append-only)...`);

  for (const article of PREMIUM_ARTICLES) {
    process.stdout.write(`- Adding: "${article.title}"... `);
    const poolKey = article.category;
    const pool = STATIC_IMAGE_POOLS[poolKey] || STATIC_IMAGE_POOLS["Business & Technology"];
    
    // Shuffling and Sequential Logic for images
    if (!global.poolIndices) global.poolIndices = {};
    if (!global.shuffledPools) global.shuffledPools = {};

    if (!global.shuffledPools[poolKey] || global.poolIndices[poolKey] >= global.shuffledPools[poolKey].length) {
      function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      }
      global.shuffledPools[poolKey] = shuffle([...pool]);
      global.poolIndices[poolKey] = 0;
    }

    const baseImage = global.shuffledPools[poolKey][global.poolIndices[poolKey]];
    global.poolIndices[poolKey]++;

    const payload = {
      ...article,
      image_url: `${baseImage}?auto=format&fit=crop&w=1600&q=80&sig=${Date.now()}_${Math.random().toString(36).substring(7)}`,
      is_published: true,
      is_curated: true,
      created_at: new Date().toISOString()
    };

    const res = await fetch(`${supabaseUrl}/rest/v1/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      console.log("DONE.");
    } else {
      console.error(`FAILED: ${await res.text()}`);
    }
  }

  console.log("\n✨ IMPORT COMPLETE.");
}

main();
