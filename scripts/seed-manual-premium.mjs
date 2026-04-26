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
    
    const CATEGORY_KEYWORDS = {
      "Gourmet & Dining": "fine-dining,restaurant,food",
      "AI & Deep Tech": "artificial-intelligence,technology,robot",
      "Lifestyle & Travel": "luxury-travel,hotel,lifestyle",
      "Business & Technology": "business,corporate,technology",
      "FinTech & Crypto": "finance,cryptocurrency,bitcoin",
      "Real Estate & PropTech": "architecture,skyscraper,real-estate",
      "Logistics & Supply Chain": "logistics,shipping,cargo",
      "Food & Culture": "emirati-food,heritage,culture"
    };
    const keyword = CATEGORY_KEYWORDS[article.category] || "dubai,luxury";

    const payload = {
      ...article,
      image_url: `https://images.unsplash.com/featured/?${encodeURIComponent(keyword)}&sig=${Date.now()}_${Math.random().toString(36).substring(7)}`,
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
