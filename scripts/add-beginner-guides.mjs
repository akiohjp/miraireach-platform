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
    console.warn("No .env.local found");
  }
}

const BEGINNER_GUIDES = [
  {
    category: "AI Starter Guide",
    title: "Gemini 101: Creating Polite Rejection Emails in 60 Seconds",
    excerpt: "Learn how to use Gemini to handle awkward professional situations with grace and speed.",
    content: `## The Art of the Polite "No" with AI\n\nWe've all been there: an old colleague asks for a favor you can't fulfill, or a salesperson sends a follow-up that you're just not interested in. Instead of letting these emails sit in your inbox and cause stress, use Google Gemini to craft a polite, professional rejection in seconds.\n\n### The "1-Minute Prompt"\nCopy and paste this into Gemini: *"I need to politely decline an invitation to speak at a local business event because I have a scheduling conflict. Make the tone warm but firm, and wish them success. Keep it under 3 sentences."*\n\n### Why it Works\nGemini understands the social nuances of professional communication in the UAE. It ensures that while you're saying "no," you're not burning any bridges. This simple tactic can save you hours of "reply-guilt" and keep your inbox moving efficiently. It's the perfect starter skill for any busy business owner.`
  },
  {
    category: "AI Starter Guide",
    title: "Claude for Beginners: How to Summarize 50-Page PDFs Instantly",
    excerpt: "Stop drowning in documents. Use Claude to turn long contracts and manuals into simple bullet points.",
    content: `## Turning Information Overload into Actionable Insight\n\nWhether it's a new government regulation or a long lease agreement, the sheer volume of text we have to read can be overwhelming. Claude (by Anthropic) is the world's best tool for "Long Context" reading. It can read an entire book in seconds and tell you exactly what you need to know.\n\n### Step-by-Step Guide\n1. Download your PDF document.\n2. Upload it to Claude.ai.\n3. Type this prompt: *"Summarize the top 5 most important points from this document that I need to be aware of as a business owner. Use simple language and list them as bullet points."*\n\n### The Tactic\nBy using Claude to "pre-read" your documents, you can identify red flags or key opportunities before you even open the file. This is particularly useful for busy managers in Dubai who need to stay on top of rapid market shifts without spending all day reading. It's like having a dedicated research assistant available 24/7.`
  },
  {
    category: "AI Starter Guide",
    title: "ChatGPT Secrets: Generating 30 Days of SNS Content in One Go",
    excerpt: "Master the 'Batch Brainstorming' prompt to keep your Instagram and LinkedIn feeds fresh.",
    content: `## Never Run Out of Ideas Again\n\nConsistency is the secret to social media success, but thinking of new things to post every day is exhausting. ChatGPT is the ultimate brainstorming partner for your SNS strategy, allowing you to generate a month's worth of content ideas in a single afternoon.\n\n### The "Batch" Prompt\nTry this: *"I run a boutique coffee shop in Dubai Marina. Generate 30 creative ideas for Instagram posts that highlight our local community, our unique coffee blends, and our sustainability efforts. For each idea, include a suggested caption and 3 relevant hashtags."*\n\n### Pro-Tip\nDon't just take the first output. Ask ChatGPT to "make 5 of these more humorous" or "add a focus on our new vegan pastries." By iterating with the AI, you can build a diverse and engaging content calendar that keeps your audience coming back for more. This is the fastest way to scale your digital presence with zero extra cost.`
  },
  {
    category: "AI Starter Guide",
    title: "The 'Excel Rescue' Prompt: How to Ask AI for the Right Formulas",
    excerpt: "Stop searching YouTube for Excel tutorials. Use AI to write your complex formulas for you.",
    content: `## Excel Doesn't Have to be Hard\n\nWe've all struggled with VLOOKUPs and nested IF statements. Instead of getting frustrated, use AI to write the formula for you based on a simple description of what you want to achieve. This works in ChatGPT, Gemini, and Claude.\n\n### The "Translator" Prompt\nInstead of searching for a function, describe the goal: *"I have a column A with sales figures and column B with categories. Write me an Excel formula that calculates the total sales only for the category 'Real Estate'."*\n\n### Why This is a Game-Changer\nThe AI will not only give you the formula but will also explain *how* it works. This means you're learning while you're working. It's the perfect way to upskill your administrative team and ensure your business data is always accurate and well-organized.`
  },
  {
    category: "AI Starter Guide",
    title: "Global News in Local Language: Using AI to Translate Complex Reports",
    excerpt: "How to stay ahead of international tech trends by translating foreign news into natural Japanese or Arabic.",
    content: `## Information has no Borders\n\nThe most important AI and tech news often breaks in English or Chinese. To stay ahead of the competition in the UAE, you need to be able to digest this information quickly. Copilot and Gemini are excellent at translating technical jargon into natural, easy-to-read language.\n\n### The Tactic\nCopy the URL of an international news article and paste it into Gemini with this prompt: *"Summarize this article in natural, professional Japanese (or Arabic). Focus on the parts that are most relevant to the Dubai tech sector and explain any technical terms in simple language."*\n\n### The Result\nYou get a high-level briefing that is tailored to your specific needs. This allows you to identify global trends and apply them to your local business strategy months before your competitors even see the news. In the AI era, speed of information is your greatest competitive advantage.`
  },
  {
    category: "AI Starter Guide",
    title: "The 'Devil's Advocate' Prompt: Preparing for Tough Meetings with AI",
    excerpt: "Use AI to simulate difficult questions from clients or investors before they happen.",
    content: `## Walk into Every Meeting with Confidence\n\nPreparation is 90% of success. One of the most powerful (and underused) ways to use ChatGPT or Claude is to have it "act" as your toughest critic. This allows you to refine your pitch and prepare answers for difficult questions in a low-stakes environment.\n\n### The "Roleplay" Prompt\n*"I am pitching a new AI-driven logistics solution to a major port operator in Dubai. You are the skeptical Chief Operations Officer. Ask me 5 difficult questions about the ROI, security risks, and implementation timeline of my proposal."*\n\n### The Tactic\nOnce the AI asks the questions, try answering them! Then ask the AI to "critique my answers and suggest how to make them more persuasive." This feedback loop will sharpen your communication skills and ensure you're never caught off guard in a high-stakes boardroom.`
  },
  {
    category: "AI Starter Guide",
    title: "AI as a Private Tutor: Learning New Skills Faster than Ever",
    excerpt: "How to use AI to break down complex topics (like blockchain or SEO) into simple lessons.",
    content: `## Knowledge is just a Prompt Away\n\nWant to understand how Bitcoin works? Or how to optimize your website for AI search? You don't need an expensive course. AI is the world's most patient and knowledgeable private tutor, available to you 24/7.\n\n### The "5-Year-Old" Tactic\nIf you're struggling with a complex concept, use this prompt: *"Explain the concept of 'Tokenization in Real Estate' to me as if I am a 5-year-old. Use a simple analogy involving toys or candy."*\n\n### Deep-Diving\nOnce you have the basics, you can ask the AI to "provide a more advanced explanation with a real-world example from the Dubai market." This step-by-step approach ensures you actually understand the material rather than just memorizing definitions. It's the ultimate tool for the lifelong learner and the ambitious entrepreneur.`
  },
  {
    category: "AI Starter Guide",
    title: "Streamlining Daily Tasks: The 'Zero-Waste' To-Do List with Gemini",
    excerpt: "How to use AI to prioritize your tasks and find 'hidden hours' in your busy schedule.",
    content: `## Take Back Control of Your Time\n\nMost business owners have a "to-do list" that is too long to ever complete. This leads to burnout and missed opportunities. Gemini can help you audit your tasks and focus on the 20% of work that produces 80% of your results.\n\n### The "Prioritization" Prompt\nPaste your messy list of tasks into Gemini and say: *"I am a restaurant owner in Dubai. Here is my to-do list for today. Based on my goal of 'increasing evening footfall,' prioritize these tasks from most to least important. For the low-priority tasks, suggest how I can automate or delegate them."*\n\n### The Tactic\nBy letting an "objective observer" (the AI) look at your schedule, you can see where you are wasting time on low-value activities. It helps you stay focused on the "big picture" strategy while the AI handles the logistical brainstorming. It's about working smarter, not harder.`
  },
  {
    category: "AI Starter Guide",
    title: "Writing Better Job Descriptions: Attracting Top Talent with AI",
    excerpt: "How to turn a boring list of requirements into an inspiring job ad that wins over the best candidates.",
    content: `## Your Job Ad is Your First Pitch\n\nIn the competitive Dubai talent market, a boring job description won't cut it. To attract the best people, your ad needs to speak to their ambitions and the unique culture of your company. AI is the perfect tool for injecting "personality" and "vision" into your HR documents.\n\n### The "Visionary" Prompt\n*"I am hiring a Lead Developer for my Fintech startup in the DIFC. Here are the technical requirements. Rewrite this into an inspiring, high-energy job ad that emphasizes our mission to 'democratize finance in the Middle East.' Make it sound like a once-in-a-lifetime opportunity."*\n\n### The Result\nThe AI will produce a much more compelling narrative that resonates with high-performers. It ensures that your company stands out in a crowded market and attracts the people who are not just looking for a paycheck, but for a mission. It's a simple change that can fundamentally alter the trajectory of your team's growth.`
  },
  {
    category: "AI Starter Guide",
    title: "Gift Ideas and Personal Touches: Using AI for Client Relationship Management",
    excerpt: "How to use AI to find the perfect gift or write a thoughtful thank-you note that stands out.",
    content: `## Relationships are the Foundation of Business\n\nIn the UAE, business is built on personal relationships and mutual respect. A thoughtful gift or a well-written thank-you note after a big deal can make all the difference. Claude is particularly good at "Empathetic Writing" and creative gift brainstorming.\n\n### The "Relationship" Prompt\n*"I just closed a partnership with a major logistics firm. I want to send a thoughtful thank-you gift to the CEO. He loves sailing and high-end watches. Suggest 3 unique, culturally appropriate gift ideas in the $500 range that are available in Dubai. Also, write a 2-sentence thank-you note to accompany the gift."*\n\n### The Tactic\nBy providing specific details about the person, you get suggestions that are truly thoughtful rather than generic. This "Extra 1%" of effort, enabled by AI, is what builds long-term loyalty and trust in the business world. It's a digital way to maintain the traditional values of hospitality and respect.`
  }
];

async function main() {
  await loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) throw new Error("Missing config");

  // 1. Duplicate Check
  const checkRes = await fetch(`${url}/rest/v1/articles?select=title`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` }
  });
  const existingData = await checkRes.json();
  const existingTitles = new Set(existingData.map(a => a.title));

  console.log(`🚀  ADDING ${BEGINNER_GUIDES.length} BEGINNER GUIDES...`);

  let totalAdded = 0;

  for (let i = 0; i < BEGINNER_GUIDES.length; i++) {
    const art = BEGINNER_GUIDES[i];
    
    if (existingTitles.has(art.title)) {
      console.log(`⏩ Skipping duplicate: "${art.title}"`);
      continue;
    }

    const payload = {
      category: art.category,
      title: art.title,
      excerpt: art.excerpt,
      content: art.content,
      content_ar: `[Beginner Guide (Arabic): ${art.title}]`,
      source_name: "mirAIreach Academy",
      image_url: `https://picsum.photos/seed/miraibeginner-${Date.now()}-${i}/800/600`,
      is_published: true,
      created_at: new Date().toISOString()
    };

    const insertRes = await fetch(`${url}/rest/v1/articles`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "apikey": key, 
        "Authorization": `Bearer ${key}` 
      },
      body: JSON.stringify(payload)
    });

    if (insertRes.ok) {
      process.stdout.write(".");
      totalAdded++;
    } else {
      console.error(`\n❌ Failed to insert: ${art.title}`);
    }
  }

  console.log(`\n\n✅ SUCCESS: Added ${totalAdded} beginner-friendly articles. Total unique articles in DB: ${existingTitles.size + totalAdded}`);
}

main();
