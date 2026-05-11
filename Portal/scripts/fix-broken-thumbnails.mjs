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

// Fisher-Yates Shuffle
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

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

const CATEGORY_MAP = {
  "Marketing Tech": "Business & Technology",
  "Smart City & GovTech": "Real Estate & PropTech",
  "Energy & Sustainability": "Lifestyle & Travel"
};

async function main() {
  await loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) throw new Error("Missing config");

  console.log("🛠️  UPDATING THUMBNAILS WITH SHUFFLE & SEQUENTIAL LOGIC...");
  
  // 1. Fetch all articles
  const res = await fetch(`${url}/rest/v1/articles?select=id,category`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` }
  });
  
  if (!res.ok) throw new Error(`Fetch failed: ${await res.text()}`);
  const allArticles = await res.json();
  console.log(`Found ${allArticles.length} articles to update.`);

  // 2. Group articles by category
  const grouped = {};
  for (const art of allArticles) {
    if (!grouped[art.category]) grouped[art.category] = [];
    grouped[art.category].push(art);
  }

  let totalUpdated = 0;

  // 3. Process each category
  for (const category of Object.keys(grouped)) {
    const articles = grouped[category];
    const poolKey = CATEGORY_MAP[category] || category;
    let pool = STATIC_IMAGE_POOLS[poolKey] || STATIC_IMAGE_POOLS["Business & Technology"];
    
    // Shuffle the pool for this category run
    let currentPool = shuffle([...pool]);
    let poolIndex = 0;

    console.log(`\nProcessing ${category} (${articles.length} articles)...`);

    for (const article of articles) {
      // If we exhausted the pool, re-shuffle and restart
      if (poolIndex >= currentPool.length) {
        currentPool = shuffle([...pool]);
        poolIndex = 0;
      }

      const baseImage = currentPool[poolIndex];
      const newImageUrl = `${baseImage}?auto=format&fit=crop&w=1600&q=80&sig=seq_${article.id}_${Math.random().toString(36).substring(7)}`;

      const patchRes = await fetch(`${url}/rest/v1/articles?id=eq.${article.id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json", 
          "apikey": key, 
          "Authorization": `Bearer ${key}` 
        },
        body: JSON.stringify({ image_url: newImageUrl })
      });

      if (patchRes.ok) {
        totalUpdated++;
        poolIndex++;
        process.stdout.write(".");
      } else {
        console.error(`\nFailed to update ID ${article.id}: ${await patchRes.text()}`);
      }
    }
  }

  console.log(`\n\n✅ SUCCESS: Updated ${totalUpdated} articles with unique shuffled thumbnails.`);
}

main();
