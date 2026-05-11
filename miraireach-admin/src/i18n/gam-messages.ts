export type GamLocale = "en" | "ja" | "ar";

export const gamLocales: GamLocale[] = ["en", "ja", "ar"];

export function isRtlLocale(locale: GamLocale): boolean {
  return locale === "ar";
}

export type GamMessages = {
  wordmarkSubtitle: string;
  opsBadge: string;
  navLabel: string;
  nav: {
    overview: string;
    projects: string;
    clients: string;
    costs: string;
    billing: string;
    quickExpense: string;
    /** Drop / camera capture (replaces form-first labeling in nav). */
    quickCapture: string;
    settings: string;
    sectionExecutive: string;
    sectionOperations: string;
  };
  userRole: string;
  headerTitle: string;
  kpiLive: string;
  notificationsAria: string;
  intro: { before: string; brand: string; after: string };
  kpi: {
    gross: string;
    grossSub: string;
    pnl: string;
    pnlSub: string;
    collections: string;
    collectionsSub: string;
    costBurn: string;
    costBurnSub: string;
  };
  pl: {
    title: string;
    subtitle: string;
    period: string;
    scope: string;
    legendRevenue: string;
    legendCost: string;
    legendNet: string;
    netIndex: string;
    chartAria: string;
    tooltipCost: string;
    tooltipRevenue: string;
  };
  cost: {
    title: string;
    subtitle: string;
    budgetNote: string;
    alertTitle: string;
    alertBody: string;
    lines: { infra: string; api: string; labor: string; bizdev: string; ads: string; outsource: string };
  };
  cash: {
    title: string;
    subtitle: string;
    low: string;
    mid: string;
    high: string;
  };
  activity: { title: string; items: { time: string; body: string }[] };
  chartDays: [string, string, string, string, string, string, string];
  language: { label: string; en: string; ja: string; ar: string };
  /** Shown near currency control: FX is illustrative */
  currencyHint: string;
  currencyLabel: string;
  executive: {
    kicker: string;
    mtdProfit: string;
    mtdProfitSub: string;
    forecast: string;
    forecastSub: string;
    activeProjects: string;
    activeProjectsSub: string;
  };
  executiveSummary: {
    empty: string;
    /** Placeholders: {net} {revenue} {cost} {margin} {vsPrior} {projects} {risk} */
    line: string;
    vsPriorUp: string;
    vsPriorDown: string;
    vsPriorFlat: string;
    /** {label} {pct} */
    riskSuffix: string;
    /** {ratio} revenue÷marketing spend (illustrative) */
    marketingSuffix: string;
  };
  chartPure: {
    pnlTitle: string;
    pnlSub: string;
    kpiTitle: string;
    kpiSub: string;
    mktTitle: string;
    mktSub: string;
    mtdRevenue: string;
    mtdCost: string;
    mtdNet: string;
    mktSpendMtd: string;
    mktEfficiency: string;
    mktMoM: string;
    legendNet: string;
    legendMarketing: string;
  };
  operationsHub: {
    title: string;
    sub: string;
    cardClients: string;
    cardCosts: string;
    cardBilling: string;
    cardCapture: string;
    cardOrg: string;
  };
  insights: {
    title: string;
    kicker: string;
    marginUp: string;
    marginDown: string;
    marginFlat: string;
    budgetRisk: string;
    fxDiversity: string;
  };
  taxPreview: {
    label: string;
    hint: string;
    approx: string;
  };
  pl6m: {
    title: string;
    subtitle: string;
  };
  dashboard: {
    loading: string;
    loadError: string;
    retry: string;
    noOrganization: string;
    noOrganizationHint: string;
    emptySection: string;
    emptyLedgerHint: string;
    emptyCostHint: string;
    emptyProjectsHint: string;
    emptyActivityHint: string;
    collectionsNoData: string;
    collectionsNoDataSub: string;
    costBurnNoData: string;
    costBurnNoDataSub: string;
    costNearCap: string;
    costOverBudget: string;
    cashSubtitleDynamic: string;
    activityFromLedger: string;
    projectsSidebar: string;
    grossSubNoCompare: string;
    signInRequired: string;
    signInHint: string;
    userFallback: string;
    pnlSubPositive: string;
    pnlSubNegative: string;
    pnlSubFlat: string;
    costBurnSubOver: string;
    projectsEmpty: string;
    envOrgMismatchTitle: string;
    envOrgMismatchBody: string;
    emptyLedgerSeedHint: string;
    weakAccessTitle: string;
    weakAccessBody: string;
    /** Executive pulse strip — short labels for KPI tiles */
    pulseKicker: string;
    pulseNet: string;
    pulseMargin: string;
    pulseForecast: string;
    pulseActive: string;
    /** Minimal executive mock — numbers only */
    execForecastTitle: string;
    execForecastSub: string;
    execRevenueTitle: string;
    execRevenueSub: string;
    execMarketingRoiTitle: string;
    execMarketingRoiSub: string;
    execMarginTitle: string;
    execMarginSub: string;
    execFooterOps: string;
  };
  dataEntry: {
    clientsProjectsTitle: string;
    plEntryTitle: string;
    backDashboard: string;
    save: string;
    saving: string;
    saved: string;
    saveError: string;
    required: string;
    clientSection: string;
    clientSectionSub: string;
    projectSection: string;
    projectSectionSub: string;
    displayName: string;
    legalName: string;
    countryCode: string;
    countryPlaceholder: string;
    defaultCurrency: string;
    createClient: string;
    clientCreated: string;
    selectClient: string;
    noClientsYet: string;
    projectCode: string;
    projectName: string;
    billingCurrency: string;
    status: string;
    statusDraft: string;
    statusActive: string;
    statusOnHold: string;
    statusClosed: string;
    createProject: string;
    projectCreated: string;
    plSection: string;
    plSectionSub: string;
    entryKind: string;
    kindRevenue: string;
    kindExpense: string;
    transactionDate: string;
    amount: string;
    amountHintFunctional: string;
    linkProject: string;
    noProject: string;
    costCategory: string;
    costCategoryExpenseOnly: string;
    memo: string;
    memoPlaceholder: string;
    postEntry: string;
    entryPosted: string;
    entryHint: string;
  };
  costsBudgets: {
    pageTitle: string;
    pageSub: string;
    categoriesTitle: string;
    categoriesSub: string;
    slug: string;
    label: string;
    sortOrder: string;
    addCategory: string;
    categoryAdded: string;
    budgetsTitle: string;
    budgetsSub: string;
    monthNote: string;
    budgetAmount: string;
    saveBudgets: string;
    budgetsSaved: string;
    noCategories: string;
    linkPlHint: string;
  };
  orgSettings: {
    pageTitle: string;
    pageSub: string;
    orgName: string;
    orgSlug: string;
    functionalCurrency: string;
    orgId: string;
    copyId: string;
    copied: string;
    yourRole: string;
  };
  mobileQuick: {
    title: string;
    subtitle: string;
    /** Short prefix for ledger memo, e.g. "Quick · Payroll" */
    ledgerMemoPrefix: string;
    selectCategory: string;
    amountLabel: string;
    currencyHint: string;
    submit: string;
    saving: string;
    saved: string;
    error: string;
    needLogin: string;
    noOrg: string;
    catFood: string;
    catLabor: string;
    catSupplies: string;
    catMisc: string;
    clear: string;
    backspace: string;
    home: string;
    openFullPl: string;
  };
  /** Receipt capture: drop / camera first (no keypad). */
  quickCapture: {
    title: string;
    subtitle: string;
    dropHint: string;
    dropActive: string;
  };
  presentationQuick: {
    title: string;
    subtitle: string;
    weakBanner: string;
    revenue: string;
    expense: string;
    revenueCategoryNote: string;
    amount: string;
    category: string;
    catConsult: string;
    catTools: string;
    catOther: string;
    currency: string;
    submit: string;
    saving: string;
    saved: string;
    error: string;
    overlayHint: string;
    memoPrefix: string;
    uploadTitle: string;
    uploadHint: string;
    uploadButton: string;
    uploadSuccess: string;
    needLogin: string;
  };
  receiptOcr: {
    sectionTitle: string;
    sectionSub: string;
    camera: string;
    gallery: string;
    uploading: string;
    analyzing: string;
    parseError: string;
    serverNotConfigured: string;
    previewTitle: string;
    needCategory: string;
    fieldDate: string;
    fieldVendor: string;
    fieldTotal: string;
    fieldCurrency: string;
    fieldTax: string;
    taxHint: string;
    confirmSave: string;
    discard: string;
    saving: string;
    saved: string;
    copyToKeypad: string;
    stepsTitle: string;
    stepReceive: string;
    stepAi: string;
    stepReview: string;
    stepPost: string;
    stepDone: string;
    liveLogTitle: string;
    logUploaded: string;
    logParsed: string;
    logAwaitingConfirm: string;
    logPosted: string;
  demoModeBadge: string;
  /** Shown above demo controls when presentation UI is on */
  presentationCallout: string;
  loadDemoSample: string;
    demoSampleHint: string;
    successTitle: string;
    successDismiss: string;
    successLedgerId: string;
    successStoragePath: string;
    successNoStorage: string;
    successAmount: string;
    successRefreshing: string;
  };
  /** Supabase Auth login */
  auth: {
    signInCta: string;
    signOut: string;
    pageTitle: string;
    pageSubtitle: string;
    email: string;
    password: string;
    submit: string;
    submitting: string;
    errorGeneric: string;
    backHome: string;
  };
};

export const gamMessages: Record<GamLocale, GamMessages> = {
  en: {
    wordmarkSubtitle: "Management HQ",
    opsBadge: "Internal",
    navLabel: "Main navigation",
    nav: {
      overview: "Executive overview",
      projects: "Engagements & projects",
      clients: "Client delivery status",
      costs: "Cost categories & budgets",
      billing: "Billing & revenue",
      quickExpense: "Quick expense",
      quickCapture: "Receipts · scan",
      settings: "Operations & settings",
      sectionExecutive: "Executive",
      sectionOperations: "Operations",
    },
    userRole: "Managing partner (sample)",
    headerTitle: "Executive overview",
    kpiLive: "Executive KPIs: live",
    notificationsAria: "Notifications",
    intro: {
      before:
        "GAM HQ is your firm’s internal command center for management and consulting operations. Keep it clearly separate from ",
      brand: "mirAIreach",
      after: ", the client-facing GEO/AIO acquisition platform.",
    },
    kpi: {
      gross: "Today’s gross (invoiced / recognized)",
      grossSub: "DoD +6.2%",
      pnl: "Forecast monthly net profit (P&L)",
      pnlSub: "Fee mix skewing favorable vs. plan (sample)",
      collections: "Collection rate (rolling 30d)",
      collectionsSub: "Three accounts past terms; no escalation (sample)",
      costBurn: "Operating cost utilization (MTD)",
      costBurnSub: "External APIs running +9% vs. budget—review",
    },
    pl: {
      title: "Real-time P&L outlook",
      subtitle:
        "Surface net-profit trajectory early from daily fee revenue, billing, and operating cost actuals (sample).",
      period: "Window: last 7 days",
      scope: "Pre-tax · firm view",
      legendRevenue: "Revenue",
      legendCost: "Cost",
      legendNet: "Forecast net index",
      netIndex: "Forecast net (index)",
      chartAria: "Seven-day bar chart of revenue versus cost",
      tooltipCost: "Cost",
      tooltipRevenue: "Revenue",
    },
    cost: {
      title: "Cost control",
      subtitle: "Budget vs. actual (MTD · sample)",
      budgetNote: "vs. 100% budget",
      alertTitle: "Executive alert",
      alertBody:
        "External APIs / tooling nearing 90% of the monthly cap. Reallocate by engagement and confirm renewal timing (sample).",
      lines: {
        infra: "Infrastructure & platform",
        api: "Third-party APIs & tooling",
        labor: "Professional staff (fixed)",
        bizdev: "Business development & proposals",
        ads: "Paid media & performance",
        outsource: "Outsourced delivery & vendors",
      },
    },
    cash: {
      title: "Liquidity & cash (projected)",
      subtitle:
        "Fourteen-day band incorporating billing timing and prepaid spend—decision-grade summary (sample).",
      low: "P25",
      mid: "Median",
      high: "P75",
    },
    activity: {
      title: "Consulting & firm activity",
      items: [
        { time: "12:04", body: "Monthly review deck drafted — 12 active matters (sample)" },
        { time: "09:41", body: "Billing cycle closed — accounting / Stripe sync OK" },
        { time: "Yesterday", body: "Cost allocation rules updated by project" },
      ],
    },
    chartDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    language: { label: "Language", en: "English", ja: "日本語", ar: "العربية" },
    currencyHint:
      "Reporting currency and symbols follow your selection. FX conversion uses illustrative demo rates—not live treasury data.",
    currencyLabel: "Reporting currency",
    executive: {
      kicker: "Executive pulse",
      mtdProfit: "Operating surplus (MTD)",
      mtdProfitSub: "Consolidated in functional currency from multi-currency ledger lines.",
      forecast: "Run-rate month-end net",
      forecastSub: "Linear projection from month-to-date net.",
      activeProjects: "Live engagements",
      activeProjectsSub: "Projects in active delivery status.",
    },
    executiveSummary: {
      empty: "Sign in to view your executive summary.",
      line: "Consolidated operating picture: net {net} MTD on {revenue} fee revenue and {cost} operating costs (~{margin}% margin). Versus the same days last month, {vsPrior}. You have {projects} active engagements.{risk}",
      vsPriorUp: "profitability is running ahead",
      vsPriorDown: "profitability is behind",
      vsPriorFlat: "profitability is roughly even",
      riskSuffix: " Budget alert: {label} near {pct}% utilization.",
      marketingSuffix: "Marketing & BD yield (revenue ÷ spend): ~{ratio}×.",
    },
    chartPure: {
      pnlTitle: "P&L summary",
      pnlSub: "Month-to-date totals and the last seven business days.",
      kpiTitle: "Key metric trajectory",
      kpiSub: "Six-month revenue, cost, and net (functional currency).",
      mktTitle: "Marketing program performance",
      mktSub: "BizDev + paid media spend vs. revenue (ledger categories; illustrative).",
      mtdRevenue: "MTD revenue",
      mtdCost: "MTD operating cost",
      mtdNet: "MTD net",
      mktSpendMtd: "MTD marketing & BD spend",
      mktEfficiency: "Revenue / spend",
      mktMoM: "Spend vs. same period last month",
      legendNet: "Net",
      legendMarketing: "Marketing spend",
    },
    operationsHub: {
      title: "Operations & settings",
      sub: "Data entry and configuration live here — the overview stays read-only for decision-makers.",
      cardClients: "Clients & projects",
      cardCosts: "Costs & budgets",
      cardBilling: "Billing & P&L entry",
      cardCapture: "Receipt capture",
      cardOrg: "Organization profile",
    },
    insights: {
      title: "AI-style insights",
      kicker: "Synthesized from your ledger — illustrative narrative for demos.",
      marginUp: "Operating margin is about {delta} pts ahead of last full month — fee mix is helping.",
      marginDown: "Operating margin trails last month by about {delta} pts — review media and vendor spikes.",
      marginFlat: "Operating margin is broadly in line with last full month.",
      budgetRisk: "{label} is at {pct}% of plan; reforecast or trim scope to stay inside guardrails.",
      fxDiversity: "AED, USD, JPY, SAR, and GBP activity is normalizing into the functional view for reporting.",
    },
    taxPreview: {
      label: "UAE CT preview (9%)",
      hint: "Applies a simple 9% notional charge on MTD/forecast surplus for deck storytelling — not tax advice.",
      approx: "Post-tax preview",
    },
    pl6m: {
      title: "Six-month revenue vs. cost",
      subtitle: "Monthly functional rollup — useful for partner walkthroughs.",
    },
    dashboard: {
      loading: "Loading executive data…",
      loadError: "Could not load dashboard data.",
      retry: "Retry",
      noOrganization: "No organization linked to this account.",
      noOrganizationHint:
        "Create an organization, add yourself in organization_members, or set NEXT_PUBLIC_GAM_ORGANIZATION_ID for the signed-in member.",
      emptySection: "No data",
      emptyLedgerHint: "Post revenue and expense lines in the ledger to populate P&L and KPIs.",
      emptyCostHint: "Define cost categories and budget periods, or record expenses with categories.",
      emptyProjectsHint: "Create projects to see engagement codes here.",
      emptyActivityHint: "Ledger entries with timestamps appear here.",
      collectionsNoData: "—",
      collectionsNoDataSub: "Collection rate needs AR / payment splits not present in the ledger yet.",
      costBurnNoData: "—",
      costBurnNoDataSub: "Set MTD category budgets to compute operating cost utilization.",
      costNearCap: "A cost category is nearing its monthly budget cap — review spend.",
      costOverBudget: "A cost category is over budget — reallocate or update the plan.",
      cashSubtitleDynamic: "14-day band from realized daily net in the functional ledger (P25 / median / P75).",
      activityFromLedger: "Recent ledger activity",
      projectsSidebar: "Projects",
      grossSubNoCompare: "No prior-day revenue to compare",
      signInRequired: "Sign in to load your firm dashboard.",
      signInHint: "Use the same account that belongs to organization_members for your tenant.",
      userFallback: "Team member",
      pnlSubPositive: "MTD net is ahead of the same period last month.",
      pnlSubNegative: "MTD net trails the same period last month.",
      pnlSubFlat: "MTD net is in line with the same period last month.",
      costBurnSubOver: "Operating spend exceeds aggregate MTD budgets — review.",
      projectsEmpty: "No projects yet.",
      envOrgMismatchTitle: "Organization ID in .env does not match your membership",
      envOrgMismatchBody:
        "NEXT_PUBLIC_GAM_ORGANIZATION_ID points to a tenant you are not a member of, so the app fell back to your first membership (sorted by org id). Data may look empty. Fix: add yourself to that org in organization_members, run bootstrap with that org’s slug, or remove / update NEXT_PUBLIC_GAM_ORGANIZATION_ID to the org you actually belong to.",
      emptyLedgerSeedHint:
        "If this is a new tenant: from miraireach-admin run npm run seed:env -- <auth_user_uuid> (uses NEXT_PUBLIC_GAM_ORGANIZATION_ID), or npm run seed:gam -- <uuid> (demo-gam-firm), or npm run seed:data -- <uuid> (partner demo). Restart dev after changing .env.",
      weakAccessTitle: "Using the pinned organization from .env (no membership row yet)",
      weakAccessBody:
        "Charts may show zeros until ledger rows exist, and saving needs an organization_members link. Run npm run link:org-member -- your@email.com with SUPABASE_SERVICE_ROLE_KEY set to attach your auth user to NEXT_PUBLIC_GAM_ORGANIZATION_ID.",
      pulseKicker: "Executive pulse",
      pulseNet: "MTD net profit",
      pulseMargin: "Operating margin",
      pulseForecast: "Month-end pace",
      pulseActive: "Active engagements",
      execForecastTitle: "Forecast month-end profit",
      execForecastSub: "Run-rate from MTD net (reference — not audited).",
      execRevenueTitle: "Revenue progress",
      execRevenueSub: "Month-to-date revenue, functional currency.",
      execMarketingRoiTitle: "Marketing ROI (GEO / direct)",
      execMarketingRoiSub: "Revenue ÷ ads + BizDev in ledger — proxy for owned demand.",
      execMarginTitle: "Operating margin (MTD)",
      execMarginSub: "(Revenue − cost) ÷ revenue, same month window.",
      execFooterOps: "Operations & data",
    },
    dataEntry: {
      clientsProjectsTitle: "Clients & projects",
      plEntryTitle: "Revenue & cost (P&L)",
      backDashboard: "Back to overview",
      save: "Save",
      saving: "Saving…",
      saved: "Saved successfully.",
      saveError: "Could not save. Check permissions and inputs.",
      required: "Required",
      clientSection: "New client",
      clientSectionSub: "Creates a billable account shell for engagements.",
      projectSection: "New project",
      projectSectionSub: "Links an engagement to a client and billing currency.",
      displayName: "Display name",
      legalName: "Legal name (optional)",
      countryCode: "Country (ISO, optional)",
      countryPlaceholder: "US",
      defaultCurrency: "Default currency",
      createClient: "Add client",
      clientCreated: "Client added.",
      selectClient: "Client",
      noClientsYet: "No clients yet — add one above.",
      projectCode: "Project code",
      projectName: "Project name",
      billingCurrency: "Billing currency",
      status: "Status",
      statusDraft: "Draft",
      statusActive: "Active",
      statusOnHold: "On hold",
      statusClosed: "Closed",
      createProject: "Add project",
      projectCreated: "Project added.",
      plSection: "Ledger line",
      plSectionSub: "Posts to the firm ledger in your organization’s functional currency.",
      entryKind: "Line type",
      kindRevenue: "Revenue",
      kindExpense: "Expense",
      transactionDate: "Transaction date",
      amount: "Amount",
      amountHintFunctional: "Major units in the org functional currency (e.g. yen or dollars).",
      linkProject: "Project (optional)",
      noProject: "— None —",
      costCategory: "Cost category",
      costCategoryExpenseOnly: "Categories apply to expense lines.",
      memo: "Memo",
      memoPlaceholder: "Invoice #, vendor, retainer month…",
      postEntry: "Post to ledger",
      entryPosted: "Posted to ledger.",
      entryHint: "Revenue is stored as positive; expenses as negative. Dashboard updates immediately.",
    },
    costsBudgets: {
      pageTitle: "Cost categories & budgets",
      pageSub: "Define buckets for expense lines and org-wide monthly caps (functional currency).",
      categoriesTitle: "Categories",
      categoriesSub: "Slug is a stable key (e.g. infra, api). Used when posting expenses.",
      slug: "Slug",
      label: "Label",
      sortOrder: "Sort order",
      addCategory: "Add category",
      categoryAdded: "Category added.",
      budgetsTitle: "Monthly budgets",
      budgetsSub: "Amounts in major units for the current calendar month (firm-wide, not per project).",
      monthNote: "Current month",
      budgetAmount: "Budget cap",
      saveBudgets: "Save budgets",
      budgetsSaved: "Budgets saved.",
      noCategories: "Add at least one category before setting budgets or posting categorized expenses.",
      linkPlHint: "Post revenue & expenses (P&L)",
    },
    orgSettings: {
      pageTitle: "Organization",
      pageSub: "Read-only snapshot from Supabase. Use env NEXT_PUBLIC_GAM_ORGANIZATION_ID to pin this tenant in dev.",
      orgName: "Name",
      orgSlug: "Slug",
      functionalCurrency: "Functional currency",
      orgId: "Organization ID",
      copyId: "Copy ID",
      copied: "Copied.",
      yourRole: "Your role",
    },
    mobileQuick: {
      title: "Quick expense",
      subtitle: "Pick category, amount, post—same flow on phone and desktop.",
      ledgerMemoPrefix: "Quick",
      selectCategory: "Category",
      amountLabel: "Amount",
      currencyHint: "Firm functional currency. Today’s date is used.",
      submit: "Post expense",
      saving: "Posting…",
      saved: "Saved to ledger.",
      error: "Could not save. Check connection and permissions.",
      needLogin: "Sign in to record expenses.",
      noOrg: "No organization is linked to this account.",
      catFood: "Food & ingredients",
      catLabor: "Payroll & labor",
      catSupplies: "Consumables",
      catMisc: "Miscellaneous",
      clear: "Clear",
      backspace: "Del",
      home: "Dashboard",
      openFullPl: "Full ledger form",
    },
    quickCapture: {
      title: "Capture expense",
      subtitle: "Drop a receipt photo or use the camera—no form until we read the slip.",
      dropHint: "Drop receipt image here, or tap Camera / Library below.",
      dropActive: "Release to scan",
    },
    presentationQuick: {
      title: "Quick revenue / expense (presentation)",
      subtitle: "Post a line in transaction currency. The P&L chart updates on this device (also persists when database access is granted).",
      weakBanner:
        "Organization is loaded from NEXT_PUBLIC_GAM_ORGANIZATION_ID without a membership row. Demo lines still update the chart locally; run link:org-member to save to Supabase.",
      revenue: "Revenue",
      expense: "Expense",
      revenueCategoryNote: "Revenue lines omit cost category per ledger rules.",
      amount: "Amount",
      category: "Category",
      catConsult: "Consulting fees",
      catTools: "Tools / SaaS",
      catOther: "Other",
      currency: "Currency",
      submit: "Post entry",
      saving: "Posting…",
      saved: "Applied.",
      error: "Could not load categories.",
      overlayHint:
        "Chart updated in presentation mode (local preview). Link your user to this org to persist in the database.",
      memoPrefix: "Prez",
      uploadTitle: "Document upload (demo)",
      uploadHint: "Invoices and receipts — mock only; no file is stored.",
      uploadButton: "Upload invoice / receipt (demo)",
      uploadSuccess: "Received. (Demo: no file stored.)",
      needLogin: "Sign in to use quick entry.",
    },
    receiptOcr: {
      sectionTitle: "AI receipt scan",
      sectionSub: "Photo or file — English / Arabic mixed Dubai receipts. Review, then post.",
      camera: "Take photo",
      gallery: "Choose file",
      uploading: "Uploading…",
      analyzing: "Reading receipt…",
      parseError: "Could not read this receipt. Try a clearer photo.",
      serverNotConfigured: "OCR is not configured (GEMINI_API_KEY).",
      previewTitle: "Check before posting",
      needCategory: "Choose a category above first.",
      fieldDate: "Date",
      fieldVendor: "Vendor",
      fieldTotal: "Total",
      fieldCurrency: "Currency",
      fieldTax: "Tax / VAT",
      taxHint: "Optional; informational in memo",
      confirmSave: "OK — post to ledger",
      discard: "Discard",
      saving: "Posting…",
      saved: "Posted with receipt link.",
      copyToKeypad: "Copy amount to keypad",
      stepsTitle: "Progress",
      stepReceive: "Receive",
      stepAi: "AI read",
      stepReview: "Review",
      stepPost: "Post",
      stepDone: "Done",
      liveLogTitle: "Activity log",
      logUploaded: "Image stored in Supabase bucket «receipts»",
      logParsed: "AI extracted date, vendor, total, currency, tax",
      logAwaitingConfirm: "Waiting for your OK — edit fields if needed",
      logPosted: "Ledger entry created — dashboard refresh signaled",
      demoModeBadge: "Presentation demo (no API key required in dev)",
      presentationCallout:
        "Demo mode: tap the dashed button below to load a Dubai-style sample receipt, then OK to post. Works without Gemini while NODE_ENV=development.",
      loadDemoSample: "Load sample receipt (demo)",
      demoSampleHint: "One tap for slides: mixed EN/AR Dubai-style totals, then pick a category and post.",
      successTitle: "Posted successfully",
      successDismiss: "Dismiss",
      successLedgerId: "Ledger line ID",
      successStoragePath: "Receipt file in Storage",
      successNoStorage: "No file (demo or local preview only)",
      successAmount: "Booked amount",
      successRefreshing: "Broadcasting refresh to KPI widgets…",
    },
    auth: {
      signInCta: "Sign in",
      signOut: "Sign out",
      pageTitle: "Sign in to GAM HQ",
      pageSubtitle: "Use the Supabase Auth account that is listed in organization_members for your firm.",
      email: "Email",
      password: "Password",
      submit: "Continue",
      submitting: "Signing in…",
      errorGeneric: "Sign-in failed. Check email, password, and Supabase Auth settings.",
      backHome: "Back to overview",
    },
  },
  ja: {
    wordmarkSubtitle: "マネジメント本部",
    opsBadge: "運営",
    navLabel: "メインメニュー",
    nav: {
      overview: "経営オーバービュー",
      projects: "コンサル案件・プロジェクト",
      clients: "クライアント支援状況",
      costs: "コストカテゴリ・予算",
      billing: "請求・収益管理",
      quickExpense: "かんたん経費",
      quickCapture: "資料・経費（撮影・ドロップ）",
      settings: "運用・設定",
      sectionExecutive: "経営",
      sectionOperations: "運用",
    },
    userRole: "マネジングパートナー（モック）",
    headerTitle: "経営オーバービュー",
    kpiLive: "経営 KPI：ライブ同期",
    notificationsAria: "通知",
    intro: {
      before: "GAM HQ は、自社の経営・コンサルティング業務の司令塔です。クライアント向けの ",
      brand: "mirAIreach",
      after: "（表側の GEO/AIO プラットフォーム）とは役割を分離して運用してください。",
    },
    kpi: {
      gross: "本日グロス（請求・実績）",
      grossSub: "前日比 +6.2%",
      pnl: "予測 月次純利益（P&L）",
      pnlSub: "案件・フィー構成が計画比で上振れ傾向（モック）",
      collections: "債権回収率（Rolling 30d）",
      collectionsSub: "与信遅延 3 件・回収エスカレーションなし",
      costBurn: "事業コスト消化（MTD）",
      costBurnSub: "外部API が運用予算比 +9% — 要レビュー",
    },
    pl: {
      title: "リアルタイム P&L 予測",
      subtitle:
        "日次の案件売上・請求実績と事業コストから、純益トレンドを早期に可視化（モック）",
      period: "期間：直近7日",
      scope: "税引前・事業単位",
      legendRevenue: "売上",
      legendCost: "コスト",
      legendNet: "予測純益インデックス",
      netIndex: "予測純益（指数）",
      chartAria: "過去7日分の売上とコストの棒グラフ",
      tooltipCost: "コスト",
      tooltipRevenue: "売上",
    },
    cost: {
      title: "コストコントロール",
      subtitle: "予算対実行（MTD・モック）",
      budgetNote: "予算 100% を基準",
      alertTitle: "経営アラート",
      alertBody:
        "外部API／運用ツールが月次上限の 90% に接近。案件別の配分と契約更新時期を確認してください（モック）",
      lines: {
        infra: "インフラ・基盤費",
        api: "外部API・ツール",
        labor: "コンサル人件（固定）",
        bizdev: "BizDev・提案活動",
        ads: "有料マーケ・パフォーマンス",
        outsource: "外注・ベンダー",
      },
    },
    cash: {
      title: "運転資金・キャッシュ（予測）",
      subtitle:
        "請求タイミングと前払コストを織り込んだ 14 日先レンジ（経営判断用・モック）",
      low: "低位",
      mid: "中央",
      high: "高位",
    },
    activity: {
      title: "コンサル・経営アクティビティ",
      items: [
        { time: "12:04", body: "月次レビュー資料ドラフト — アクティブ案件 12（モック）" },
        { time: "09:41", body: "請求クローズ — 会計・Stripe 同期 OK" },
        { time: "昨日", body: "原価配賦ルール更新（プロジェクト別）" },
      ],
    },
    chartDays: ["月", "火", "水", "木", "金", "土", "日"],
    language: { label: "言語", en: "English", ja: "日本語", ar: "العربية" },
    currencyHint:
      "表示通貨と記号はここで切り替えできます。換算はデモ用の参考レートであり、実際の為替・会計レートではありません。",
    currencyLabel: "表示通貨",
    executive: {
      kicker: "エグゼクティブ・パルス",
      mtdProfit: "営業黒字（MTD）",
      mtdProfitSub: "多通貨台帳を機能通貨に集計した粗利ベースです。",
      forecast: "月次ペースの着地見込み",
      forecastSub: "MTDの純増から暦日で線形外挿した参考値です。",
      activeProjects: "稼働中の案件",
      activeProjectsSub: "ステータスがアクティブなプロジェクト数。",
    },
    executiveSummary: {
      empty: "サインイン後に経営サマリーが表示されます。",
      line: "全案件を束ねた経営スナップショット：MTD 純利益ペースは{net}、売上{revenue}・コスト{cost}・営業利益率おおよそ{margin}%。前年同月同日比では{vsPrior}。アクティブ案件は{projects}件。{risk}",
      vsPriorUp: "利益ペースが前月同区間を上回っています",
      vsPriorDown: "利益ペースが前月同区間を下回っています",
      vsPriorFlat: "利益ペースは前月同区間とおおむね横ばいです",
      riskSuffix: " 予算注意：{label}が約{pct}%まで消化済み。",
      marketingSuffix: "マーケ・BizDevの粗い効率（売上÷該当費用）は約{ratio}倍。",
    },
    chartPure: {
      pnlTitle: "P&L サマリー",
      pnlSub: "月累計と直近7営業日相当のトレンド。",
      kpiTitle: "主要KPIの推移",
      kpiSub: "直近6ヶ月の売上・コスト・純益（機能通貨）。",
      mktTitle: "マーケティング施策の成果状況",
      mktSub: "BizDev＋広告カテゴリの支出と売上の関係（台帳ベース・参考）。",
      mtdRevenue: "MTD 売上",
      mtdCost: "MTD コスト",
      mtdNet: "MTD 純利益",
      mktSpendMtd: "MTD マーケ・BizDev費用",
      mktEfficiency: "売上 ÷ 支出",
      mktMoM: "前月同区間比（支出）",
      legendNet: "純益",
      legendMarketing: "マーケ支出",
    },
    operationsHub: {
      title: "運用・設定",
      sub: "日々の入力とマスタ変更はこちら。オーバービューは意思決定用にノイズを減らしています。",
      cardClients: "クライアント・案件",
      cardCosts: "コスト・予算",
      cardBilling: "請求・P&L入力",
      cardCapture: "領収書の取り込み",
      cardOrg: "組織プロフィール",
    },
    insights: {
      title: "インサイト（デモ）",
      kicker: "台帳から要約したナラティブです（AI助言ではありません）。",
      marginUp: "営業利益率は前月フル月より約 {delta} pt 改善しています。",
      marginDown: "営業利益率は前月フル月より約 {delta} pt 低下しています。広告・外注を確認してください。",
      marginFlat: "営業利益率は前月フル月とおおむね同水準です。",
      budgetRisk: "{label} の消化が {pct}% です。先の超過リスクがあります。",
      fxDiversity: "AED・USD・JPY・SAR・GBPの取引が機能通貨ビューに集約されています。",
    },
    taxPreview: {
      label: "UAE法人税プレビュー（9%）",
      hint: "MTD・着地見込みに単純な9%負担を仮置きします（税務アドバイスではありません）。",
      approx: "税引後プレビュー",
    },
    pl6m: {
      title: "6ヶ月の売上とコスト",
      subtitle: "月次の機能通貨集計（パートナーデモ向け）。",
    },
    dashboard: {
      loading: "経営データを読み込み中…",
      loadError: "ダッシュボードのデータを読み込めませんでした。",
      retry: "再試行",
      noOrganization: "このアカウントに紐づく組織がありません。",
      noOrganizationHint:
        "organizations を作成し organization_members に自分を追加するか、サインイン済みメンバー向けに NEXT_PUBLIC_GAM_ORGANIZATION_ID を設定してください。",
      emptySection: "データなし",
      emptyLedgerHint: "台帳に売上・費用を計上するとP&LとKPIが表示されます。",
      emptyCostHint: "コストカテゴリと予算期間を定義するか、カテゴリ付きの費用を記録してください。",
      emptyProjectsHint: "プロジェクトを作成するとここに案件コードが表示されます。",
      emptyActivityHint: "台帳エントリの履歴がここに表示されます。",
      collectionsNoData: "—",
      collectionsNoDataSub: "債権回収率は台帳だけでは算出できません（入金・未収の分解が必要です）。",
      costBurnNoData: "—",
      costBurnNoDataSub: "カテゴリ別のMTD予算を設定するとコスト消化率が表示されます。",
      costNearCap: "あるコストカテゴリが月次予算上限に近づいています。支出を確認してください。",
      costOverBudget: "あるコストカテゴリが予算超過です。配分や計画の見直しが必要です。",
      cashSubtitleDynamic: "機能通貨ベースの日次実績ネットから14日分の分布（低位・中央・高位）を表示しています。",
      activityFromLedger: "最近の台帳アクティビティ",
      projectsSidebar: "プロジェクト",
      grossSubNoCompare: "前日比較できる売上がありません",
      signInRequired: "サインインすると組織のダッシュボードを読み込めます。",
      signInHint: "organization メンバーである同じアカウントでログインしてください。",
      userFallback: "メンバー",
      pnlSubPositive: "MTDの純利益は前年同月同日比で上振れ傾向です。",
      pnlSubNegative: "MTDの純利益は前年同月同日比で下振れ傾向です。",
      pnlSubFlat: "MTDの純利益は前年同月同日比でおおむね横ばいです。",
      costBurnSubOver: "運用コストがMTD予算合計を上回っています。要レビュー。",
      projectsEmpty: "プロジェクトはまだありません。",
      envOrgMismatchTitle: ".env の組織IDと、あなたの所属が一致していません",
      envOrgMismatchBody:
        "NEXT_PUBLIC_GAM_ORGANIZATION_ID が指すテナントに organization_members として入っていないため、別の組織（IDの辞書順で最初の所属）を表示しています。台帳が空に見えます。対処: その組織にメンバー追加、または bootstrap で同じスラッグの組織に紐づける、または .env の ID を実際に所属している organization の UUID に合わせる。",
      emptyLedgerSeedHint:
        "新規テナントなら miraireach-admin で npm run seed:env -- <authのユーザーUUID>（.env の NEXT_PUBLIC_GAM_ORGANIZATION_ID の組織に入る）、または seed:gam / seed:data。.env 変更後は dev 再起動。",
      weakAccessTitle: ".env で固定した組織を使用中（メンバー行は未リンクの可能性）",
      weakAccessBody:
        "グラフはゼロ表示のままの場合があります。保存するには organization_members が必要です。SUPABASE_SERVICE_ROLE_KEY を設定して npm run link:org-member -- メールアドレス で紐づけできます。",
      pulseKicker: "エグゼクティブ・パルス",
      pulseNet: "MTD 純利益",
      pulseMargin: "営業利益率",
      pulseForecast: "月次着地ペース",
      pulseActive: "稼働案件",
      execForecastTitle: "今月の着地予測利益",
      execForecastSub: "MTD 純益からの線形ペース（参考 · 監査対象外）。",
      execRevenueTitle: "売上進捗",
      execRevenueSub: "月初からの売上高（機能通貨）。",
      execMarketingRoiTitle: "マーケティングROI（GEO・直接予約）",
      execMarketingRoiSub: "売上 ÷ 広告＋BizDev（台帳上の代理指標）。",
      execMarginTitle: "営業利益率（MTD）",
      execMarginSub: "（売上 − コスト）÷ 売上・同月窓。",
      execFooterOps: "オペレーション・データ",
    },
    dataEntry: {
      clientsProjectsTitle: "クライアント・プロジェクト追加",
      plEntryTitle: "売上・コスト（P&L）入力",
      backDashboard: "オーバービューへ戻る",
      save: "保存",
      saving: "保存中…",
      saved: "保存しました。",
      saveError: "保存できませんでした。権限と入力内容を確認してください。",
      required: "必須",
      clientSection: "新規クライアント",
      clientSectionSub: "案件の請求先となるクライアントを登録します。",
      projectSection: "新規プロジェクト",
      projectSectionSub: "クライアントと請求通貨に紐づく案件を作成します。",
      displayName: "表示名",
      legalName: "正式名称（任意）",
      countryCode: "国コード（任意・ISO 2文字）",
      countryPlaceholder: "JP",
      defaultCurrency: "既定通貨",
      createClient: "クライアントを追加",
      clientCreated: "クライアントを追加しました。",
      selectClient: "クライアント",
      noClientsYet: "クライアントがまだありません。上で追加してください。",
      projectCode: "案件コード",
      projectName: "案件名",
      billingCurrency: "請求通貨",
      status: "ステータス",
      statusDraft: "ドラフト",
      statusActive: "アクティブ",
      statusOnHold: "保留",
      statusClosed: "クローズ",
      createProject: "プロジェクトを追加",
      projectCreated: "プロジェクトを追加しました。",
      plSection: "台帳行",
      plSectionSub: "組織の機能通貨で台帳に計上されます。",
      entryKind: "行の種類",
      kindRevenue: "売上",
      kindExpense: "費用",
      transactionDate: "取引日",
      amount: "金額",
      amountHintFunctional: "組織の機能通貨のメジャー単位（円やドルなど）。",
      linkProject: "プロジェクト（任意）",
      noProject: "— なし —",
      costCategory: "コストカテゴリ",
      costCategoryExpenseOnly: "カテゴリは費用行に使用します。",
      memo: "メモ",
      memoPlaceholder: "請求番号、ベンダー、月次レティナー…",
      postEntry: "台帳に計上",
      entryPosted: "台帳に計上しました。",
      entryHint: "売上は正の値、費用は負の値として保存されます。ダッシュボードにすぐ反映されます。",
    },
    costsBudgets: {
      pageTitle: "コストカテゴリ・予算",
      pageSub: "費用計上用の区分と、組織全体の当月予算上限（機能通貨）を設定します。",
      categoriesTitle: "カテゴリ",
      categoriesSub: "スラッグは固定キー（例: infra, api）。費用入力時に使います。",
      slug: "スラッグ",
      label: "表示ラベル",
      sortOrder: "並び順",
      addCategory: "カテゴリを追加",
      categoryAdded: "カテゴリを追加しました。",
      budgetsTitle: "月次予算",
      budgetsSub: "当月（暦月）の上限を、メジャー単位で入力します（全社・案件紐づけなし）。",
      monthNote: "対象月",
      budgetAmount: "予算上限",
      saveBudgets: "予算を保存",
      budgetsSaved: "予算を保存しました。",
      noCategories: "カテゴリを追加してから、予算設定やカテゴリ付き費用を計上できます。",
      linkPlHint: "売上・費用（P&L）の入力",
    },
    orgSettings: {
      pageTitle: "組織",
      pageSub: "Supabase の情報を表示しています。開発時は NEXT_PUBLIC_GAM_ORGANIZATION_ID でテナントを固定できます。",
      orgName: "名前",
      orgSlug: "スラッグ",
      functionalCurrency: "機能通貨",
      orgId: "組織 ID",
      copyId: "ID をコピー",
      copied: "コピーしました。",
      yourRole: "あなたのロール",
    },
    mobileQuick: {
      title: "かんたん経費",
      subtitle: "カテゴリ・金額・計上。スマホでも PC でも同じ手順です。",
      ledgerMemoPrefix: "かんたん",
      selectCategory: "カテゴリ",
      amountLabel: "金額",
      currencyHint: "組織の機能通貨・今日の日付で計上します。",
      submit: "台帳に計上",
      saving: "計上中…",
      saved: "計上しました。",
      error: "保存できませんでした。通信と権限を確認してください。",
      needLogin: "経費を記録するにはサインインしてください。",
      noOrg: "このアカウントに紐づく組織がありません。",
      catFood: "食材仕入",
      catLabor: "人件費",
      catSupplies: "消耗品",
      catMisc: "雑費",
      clear: "クリア",
      backspace: "戻る",
      home: "オーバービュー",
      openFullPl: "詳細（P&L）入力へ",
    },
    quickCapture: {
      title: "資料・経費の取り込み",
      subtitle: "領収書の写真をドロップするか、カメラで撮るだけ。読み取り後に確認します。",
      dropHint: "ここに画像をドロップするか、下のカメラ／フォルダから選んでください。",
      dropActive: "離すとスキャンします",
    },
    presentationQuick: {
      title: "クイック売上・経費（プレゼン用）",
      subtitle: "取引通貨で1行計上。P&Lはこの画面にすぐ反映（DB権限があれば本番台帳にも保存）。",
      weakBanner:
        "organization_members がまだない状態で .env の組織を表示しています。チャートは端末内のデモ加算で動きます。永続化するには link:org-member を実行してください。",
      revenue: "売上",
      expense: "経費",
      revenueCategoryNote: "売上行は台帳ルールによりコストカテゴリは付けません。",
      amount: "金額",
      category: "カテゴリ",
      catConsult: "コンサル費用",
      catTools: "ツール代・SaaS",
      catOther: "その他",
      currency: "通貨",
      submit: "登録",
      saving: "計上中…",
      saved: "反映しました。",
      error: "カテゴリを読み込めませんでした。",
      overlayHint: "プレゼン用にチャートのみ更新（ローカル）。DBに保存するには組織にユーザーを紐づけてください。",
      memoPrefix: "プレゼン",
      uploadTitle: "資料アップロード（デモ）",
      uploadHint: "請求書・領収書などの見せ方のみ。ファイルは保存されません。",
      uploadButton: "請求書・領収書をアップロード（デモ）",
      uploadSuccess: "受け付けました。（デモ：ファイルは保存していません）",
      needLogin: "クイック入力にはサインインが必要です。",
    },
    receiptOcr: {
      sectionTitle: "レシート AI 読み取り",
      sectionSub: "撮影またはファイル選択。英語・アラビア混在のドバイ向けレシートに対応。確認してから計上。",
      camera: "カメラで撮影",
      gallery: "ファイルを選ぶ",
      uploading: "アップロード中…",
      analyzing: "レシートを解析中…",
      parseError: "読み取れませんでした。より鮮明な画像を試してください。",
      serverNotConfigured: "OCR が未設定です（GEMINI_API_KEY）。",
      previewTitle: "内容を確認",
      needCategory: "先に上でカテゴリを選んでください。",
      fieldDate: "日付",
      fieldVendor: "業者名",
      fieldTotal: "合計",
      fieldCurrency: "通貨",
      fieldTax: "税額 / VAT",
      taxHint: "任意。メモに含めます",
      confirmSave: "OK — 台帳に計上",
      discard: "破棄",
      saving: "計上中…",
      saved: "レシート付きで計上しました。",
      copyToKeypad: "金額をテンキーに反映",
      stepsTitle: "進捗",
      stepReceive: "受領",
      stepAi: "AI 読取",
      stepReview: "確認",
      stepPost: "計上",
      stepDone: "完了",
      liveLogTitle: "処理ログ",
      logUploaded: "画像を Supabase Storage「receipts」に保存しました",
      logParsed: "AI が日付・業者・合計・通貨・税額を抽出しました",
      logAwaitingConfirm: "OK 待ち — 必要ならフィールドを編集できます",
      logPosted: "台帳行を作成 — ダッシュボード更新を通知しました",
      demoModeBadge: "プレゼン用デモ（開発中は API キー不要）",
      presentationCallout:
        "デモ表示中: 下の破線ボタンでサンプルレシートを読み込み、OK で台帳に計上できます（開発サーバー時は Gemini なしで動作）。",
      loadDemoSample: "サンプルレシートを表示（デモ）",
      demoSampleHint: "スライド用ワンタップ。英アラ混在のドバイ風サンプル → カテゴリ選択 → 計上。",
      successTitle: "計上が完了しました",
      successDismiss: "閉じる",
      successLedgerId: "台帳行 ID",
      successStoragePath: "Storage 上のレシート",
      successNoStorage: "画像なし（デモまたはローカルプレビューのみ）",
      successAmount: "計上した金額",
      successRefreshing: "KPI ウィジェットへ更新を送信中…",
    },
    auth: {
      signInCta: "サインイン",
      signOut: "サインアウト",
      pageTitle: "GAM HQ にサインイン",
      pageSubtitle: "Supabase Auth のアカウントでログインしてください（organization_members に登録済みのユーザー）。",
      email: "メールアドレス",
      password: "パスワード",
      submit: "続ける",
      submitting: "サインイン中…",
      errorGeneric: "サインインに失敗しました。メール・パスワードと Supabase の認証設定を確認してください。",
      backHome: "オーバービューへ戻る",
    },
  },
  ar: {
    wordmarkSubtitle: "مقر الإدارة والاستشارات",
    opsBadge: "تشغيل داخلي",
    navLabel: "التنقل الرئيسي",
    nav: {
      overview: "نظرة تنفيذية",
      projects: "المشاريع وعقود الاستشارات",
      clients: "حالة تقديم الخدمة للعملاء",
      costs: "فئات التكلفة والميزانيات",
      billing: "الفوترة والإيرادات",
      quickExpense: "مصروف سريع",
      quickCapture: "مستندات ومصروفات (التقاط / إفلات)",
      settings: "التشغيل والإعدادات",
      sectionExecutive: "التنفيذ",
      sectionOperations: "التشغيل",
    },
    userRole: "الشريك الإداري (عيّنة)",
    headerTitle: "نظرة تنفيذية",
    kpiLive: "مؤشرات الأداء التنفيذي: مباشر",
    notificationsAria: "التنبيهات",
    intro: {
      before:
        "GAM HQ هي منصّة التشغيل الداخلية لمؤسستك في مجال الإدارة والاستشارات. احرص على الفصل الواضح بينها وبين ",
      brand: "mirAIreach",
      after: "، أي منصة جذب العملاء المواجهة لـ GEO/AIO.",
    },
    kpi: {
      gross: "إجمالي اليوم (مزمّن / محقّق)",
      grossSub: "مقارنة باليوم السابق ‎+٦٫٢٪",
      pnl: "صافي الربح الشهري المتوقع (قائمة الدخل)",
      pnlSub: "مزيج العوائد مائل للصالح مقارنة بالخطة (عيّنة)",
      collections: "معدل التحصيل (آخر ٣٠ يومًا)",
      collectionsSub: "ثلاثة حسابات متأخرة دون تصعيد تحصيل",
      costBurn: "استهلاك تكاليف التشغيل (منذ بداية الشهر)",
      costBurnSub: "واجهات برمجية خارجية ‎+٩٪ مقارنة بالميزانية — يستلزم المراجعة",
    },
    pl: {
      title: "مؤشر الأداء المالي الفوري (الأرباح والخسائر)",
      subtitle:
        "رصد مسار صافي الربح مبكرًا اعتمادًا على إيرادات الأتعاب اليومية والفوترة والتكاليف الفعلية (عيّنة).",
      period: "النافذة: آخر ٧ أيام",
      scope: "قبل الضريبة · مستوى المؤسسة",
      legendRevenue: "الإيرادات",
      legendCost: "التكلفة",
      legendNet: "مؤشر صافي الربح المتوقع",
      netIndex: "صافي الربح المتوقع (مؤشر)",
      chartAria: "رسم بياني أعمدة لسبعة أيام للإيرادات مقابل التكلفة",
      tooltipCost: "التكلفة",
      tooltipRevenue: "الإيرادات",
    },
    cost: {
      title: "مراقبة التكاليف",
      subtitle: "الميزانية مقابل التنفيذ (منذ بداية الشهر · عيّنة)",
      budgetNote: "مقابل نسبة ١٠٠٪ من الميزانية",
      alertTitle: "تنبيه تنفيذي",
      alertBody:
        "تقترب الأنظمة الخارجية وواجهات البرمجة من ٩٠٪ من السقف الشهري. أعد التوزيع حسب الالتزام وثبّت مواعيد التجديد (عيّنة).",
      lines: {
        infra: "البنية التحتية والمنصات",
        api: "واجهات برمجية وأدوات خارجية",
        labor: "الكوادر المهنية (ثابت)",
        bizdev: "تطوير الأعمال والعروض",
        ads: "الإعلانات والأداء",
        outsource: "الأعمال المُلحَقة والمورّدون",
      },
    },
    cash: {
      title: "السيولة والنقد (متوقع)",
      subtitle:
        "نطاق أربعة عشر يومًا يعتمد مواعيد الفوترة والمصروفات المدفوعة مقدمًا — ملخّص داعم لاتخاذ القرار (عيّنة).",
      low: "الحد الأدنى",
      mid: "الوسيط",
      high: "الحد الأعلى",
    },
    activity: {
      title: "نشاط الاستشارات والمؤسسة",
      items: [
        { time: "12:04", body: "مسودة مواد المراجعة الشهرية — ١٢ التزامًا نشطًا (عيّنة)" },
        { time: "09:41", body: "إغلاق دورة الفوترة — مزامنة المحاسبة / ستريب ناجحة" },
        { time: "أمس", body: "تحديث قواعد توزيع التكلفة حسب المشروع" },
      ],
    },
    chartDays: ["الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"],
    language: { label: "اللغة", en: "English", ja: "日本語", ar: "العربية" },
    currencyHint:
      "تتبع الأرقام العملة المختارة ورمزها. التحويل يستخدم أسعارًا توضيحية للعرض وليس أسعار خزينة فعلية.",
    currencyLabel: "عملة العرض",
    executive: {
      kicker: "نبض تنفيذي",
      mtdProfit: "فائض تشغيلي (منذ بداية الشهر)",
      mtdProfitSub: "مجمّع بالعملة الوظيفية من قيود متعددة العملات.",
      forecast: "توقّع صافي نهاية الشهر",
      forecastSub: "استقراء خطّي من صافي الفترة حتى اليوم.",
      activeProjects: "التزامات نشطة",
      activeProjectsSub: "مشاريع بحالة التنفيذ النشطة.",
    },
    executiveSummary: {
      empty: "سجّل الدخول لعرض الملخص التنفيذي.",
      line: "لمحة موحّدة لجميع الالتزامات: وتيرة صافي الأرباح حتى اليوم {net}، الإيرادات {revenue} والتكاليف {cost} وهامش تشغيل تقريبي{margin}%. مقارنة بالفترة نفسها من الشهر السابق: {vsPrior}. التزامات نشطة: {projects} مشروعًا.{risk}",
      vsPriorUp: "وتيرة الأرباح أعلى من الفترة المقابلة في الشهر السابق",
      vsPriorDown: "وتيرة الأرباح دون الفترة المقابلة في الشهر السابق",
      vsPriorFlat: "وتيرة الأرباح مستقرة تقريبًا مقابل الفترة المقابلة في الشهر السابق",
      riskSuffix: " تنبيه ميزانية: {label} مستهلك بنحو {pct}%.",
      marketingSuffix: " كفاءة تقريبية للتسويق وتطوير الأعمال (إيرادات ÷ المصروفات ذات الصلة): نحو ×{ratio}.",
    },
    chartPure: {
      pnlTitle: "ملخص الأرباح والخسائر",
      pnlSub: "الإجمالي منذ بداية الشهر واتجاه سبعة أيام عمل.",
      kpiTitle: "مسار المؤشرات الرئيسية",
      kpiSub: "آخر ستة أشهر للإيرادات والتكاليف والصافي بالعملة الوظيفية.",
      mktTitle: "أثر أنشطة التسويق",
      mktSub: "الإنفاق على تطوير الأعمال والإعلانات مقابل الإيرادات (من الدفتر - مرجعي).",
      mtdRevenue: "إيرادات منذ بداية الشهر",
      mtdCost: "تكاليف منذ بداية الشهر",
      mtdNet: "صافي منذ بداية الشهر",
      mktSpendMtd: "إنفاق تسويق وتطوير أعمال (منذ بداية الشهر)",
      mktEfficiency: "إيرادات ÷ إنفاق",
      mktMoM: "مقابل الفترة نفسها من الشهر السابق (الإنفاق)",
      legendNet: "صافي",
      legendMarketing: "إنفاق تسويقي",
    },
    operationsHub: {
      title: "التشغيل والإعدادات",
      sub: "سجّل المدخلات وغيّر البيانات المرجعية هنا. تبسّط نظرة التنفيذ للقرار فقط.",
      cardClients: "العملاء والمشاريع",
      cardCosts: "التكاليف والميزانيات",
      cardBilling: "الفوترة وإدخال P&L",
      cardCapture: "استيراد الإيصالات",
      cardOrg: "ملف المؤسسة",
    },
    insights: {
      title: "رؤى بأسلوب ذكاء اصطناعي",
      kicker: "مُلخّص من الدفتر لأغراض العرض.",
      marginUp: "هامش التشغيل أعلى بحوالي {delta} نقطة مقارنة بالشهر الكامل السابق.",
      marginDown: "هامش التشغيل أدنى بحوالي {delta} نقطة — راجع الإعلانات والمورّدين.",
      marginFlat: "هامش التشغيل على مستوى مشابه للشهر الكامل السابق.",
      budgetRisk: "{label} عند {pct}% من الخطة — قد تحتاج إعادة توقّع.",
      fxDiversity: "تتجمّع حركات الدرهم الإماراتي والدولار والين والريال والجنيه في العرض الوظيفي.",
    },
    taxPreview: {
      label: "معاينة ضريبة الشركات الإماراتية (٩٪)",
      hint: "تطبيق افتراضي ٩٪ على الفائض للعروض — ليست استشارة ضريبية.",
      approx: "معاينة بعد الضريبة",
    },
    pl6m: {
      title: "ستة أشهر: إيرادات مقابل تكلفة",
      subtitle: "تجميع شهري بالعملة الوظيفية لجلسات الشركاء.",
    },
    dashboard: {
      loading: "جاري تحميل بيانات التنفيذ…",
      loadError: "تعذّر تحميل بيانات لوحة التحكم.",
      retry: "إعادة المحاولة",
      noOrganization: "لا مؤسسة مرتبطة بهذا الحساب.",
      noOrganizationHint:
        "أنشئ مؤسسة وأضف نفسك في organization_members، أو عيّن NEXT_PUBLIC_GAM_ORGANIZATION_ID للعضو المسجّل.",
      emptySection: "لا توجد بيانات",
      emptyLedgerHint: "سجّل إيرادات ومصروفات في دفتر الأستاذ لملء مؤشرات الأداء والقوائم.",
      emptyCostHint: "عرّف فئات التكلفة وفترات الميزانية، أو سجّل مصروفات بفئات.",
      emptyProjectsHint: "أنشئ مشاريع لعرض رموز الالتزامات هنا.",
      emptyActivityHint: "يظهر هنا سجلّ قيود الدفتر مع الطوابع الزمنية.",
      collectionsNoData: "—",
      collectionsNoDataSub: "معدل التحصيل يحتاج فواتير/مدفوعات غير مُمثَّلة في الدفتر الحالي.",
      costBurnNoData: "—",
      costBurnNoDataSub: "حدد ميزة شهرية لفئات التكلفة لحساب نسبة استهلاك النفقات التشغيلية.",
      costNearCap: "فئة تكلفة تقترب من سقف الميزانية الشهرية — راجع الإنفاق.",
      costOverBudget: "فئة تكلفة تتجاوز الميزانية — أعد التوزيع أو حدّث الخطة.",
      cashSubtitleDynamic: "نطاق ١٤ يومًا مستمد من الصافي اليومي بالعملة الوظيفية (الحد الأدنى / الوسيط / الأعلى).",
      activityFromLedger: "نشاط حديث في الدفتر",
      projectsSidebar: "المشاريع",
      grossSubNoCompare: "لا إيرادات لليوم السابق للمقارنة",
      signInRequired: "سجّل الدخول لتحميل لوحة المؤسسة.",
      signInHint: "استخدم الحساب المضاف في organization_members لهذا المستأجر.",
      userFallback: "عضو فريق",
      pnlSubPositive: "صافي الربح منذ بداية الشهر أعلى مقارنة بنفس الفترة من الشهر الماضي.",
      pnlSubNegative: "صافي الربح منذ بداية الشهر أقل مقارنة بنفس الفترة من الشهر الماضي.",
      pnlSubFlat: "صافي الربح منذ بداية الشهر في حدود نفس الفترة من الشهر الماضي.",
      costBurnSubOver: "الإنفاق التشغيلي يتجاوز إجمالي ميزانية الشهر — يتطلب مراجعة.",
      projectsEmpty: "لا مشاريع بعد.",
      envOrgMismatchTitle: "معرّف المؤسسة في ملف البيئة لا يطابق عضويتك",
      envOrgMismatchBody:
        "يشير NEXT_PUBLIC_GAM_ORGANIZATION_ID إلى مستأجر لست عضوًا فيه، لذا عُرضت أول عضوية لديك. قد يبدو الدفتر فارغًا. أضف نفسك في organization_members، أو شغّل bootstrap بنفس السلَق، أو حدّث المعرّف.",
      emptyLedgerSeedHint:
        "لمؤسسة جديدة: npm run seed:env -- <uuid> (يستخدم NEXT_PUBLIC_GAM_ORGANIZATION_ID) أو seed:gam أو seed:data. أعد تشغيل التطوير بعد تعديل .env.",
      weakAccessTitle: "استخدام المؤسسة المثبتة من ملف البيئة (ربما بلا صف عضوية بعد)",
      weakAccessBody:
        "قد تظهر الرسوم البيانية صفرًا حتى توجد قيود. للحفظ يلزم organization_members. نفّذ npm run link:org-member مع SUPABASE_SERVICE_ROLE_KEY.",
      pulseKicker: "نبض تنفيذي",
      pulseNet: "صافي الشهر حتى اليوم",
      pulseMargin: "هامش التشغيل",
      pulseForecast: "وتيرة نهاية الشهر",
      pulseActive: "التزامات نشطة",
      execForecastTitle: "توقّع صافي ربح نهاية الشهر",
      execForecastSub: "مسار تقديري من صافي الشهر حتى اليوم (مرجعي، غير مُدقّق).",
      execRevenueTitle: "تقدّم الإيرادات",
      execRevenueSub: "إيرادات منذ بداية الشهر بالعملة الوظيفية.",
      execMarketingRoiTitle: "عائد التسويق (GEO / الحجز المباشر)",
      execMarketingRoiSub: "إيرادات ÷ إعلانات وتطوير أعمال — مؤشر طلب مُملَك.",
      execMarginTitle: "هامش التشغيل (منذ بداية الشهر)",
      execMarginSub: "(إيراد − تكلفة) ÷ إيراد، نافذة الشهر نفسها.",
      execFooterOps: "العمليات والبيانات",
    },
    dataEntry: {
      clientsProjectsTitle: "العملاء والمشاريع",
      plEntryTitle: "الإيرادات والتكلفة (قائمة الدخل)",
      backDashboard: "العودة إلى النظرة التنفيذية",
      save: "حفظ",
      saving: "جاري الحفظ…",
      saved: "تم الحفظ بنجاح.",
      saveError: "تعذّر الحفظ. تحقّق من الصلاحيات والمدخلات.",
      required: "مطلوب",
      clientSection: "عميل جديد",
      clientSectionSub: "إنشاء سجل عميل قابل للفوترة للالتزامات.",
      projectSection: "مشروع جديد",
      projectSectionSub: "ربط الالتزام بعميل وعملة الفوترة.",
      displayName: "الاسم المعروض",
      legalName: "الاسم القانوني (اختياري)",
      countryCode: "البلد (ISO، اختياري)",
      countryPlaceholder: "AE",
      defaultCurrency: "العملة الافتراضية",
      createClient: "إضافة عميل",
      clientCreated: "تمت إضافة العميل.",
      selectClient: "العميل",
      noClientsYet: "لا عملاء بعد — أضف عميلًا أعلاه.",
      projectCode: "رمز المشروع",
      projectName: "اسم المشروع",
      billingCurrency: "عملة الفوترة",
      status: "الحالة",
      statusDraft: "مسودة",
      statusActive: "نشط",
      statusOnHold: "معلّق",
      statusClosed: "مغلق",
      createProject: "إضافة مشروع",
      projectCreated: "تمت إضافة المشروع.",
      plSection: "سطر دفتر الأستاذ",
      plSectionSub: "يُرحَّل بالعملة الوظيفية للمؤسسة.",
      entryKind: "نوع السطر",
      kindRevenue: "إيراد",
      kindExpense: "مصروف",
      transactionDate: "تاريخ المعاملة",
      amount: "المبلغ",
      amountHintFunctional: "الوحدات الكبرى بالعملة الوظيفية للمؤسسة.",
      linkProject: "المشروع (اختياري)",
      noProject: "— بلا —",
      costCategory: "فئة التكلفة",
      costCategoryExpenseOnly: "تُستخدم الفئات لسطور المصروف.",
      memo: "مذكرة",
      memoPlaceholder: "رقم الفاتورة، المورّد، شهر الاستحقاق…",
      postEntry: "ترحيل إلى الدفتر",
      entryPosted: "تم الترحيل إلى الدفتر.",
      entryHint: "يُخزَّن الإيراد كقيمة موجبة والمصروف كسالب. تُحدَّث اللوحة فورًا.",
    },
    costsBudgets: {
      pageTitle: "فئات التكلفة والميزانيات",
      pageSub: "عرّف حاويات المصروفات والحدود الشهرية لمستوى المؤسسة (بالعملة الوظيفية).",
      categoriesTitle: "الفئات",
      categoriesSub: "المعرّف المختصر ثابت (مثل infra أو api) ويُستخدم عند تسجيل المصروفات.",
      slug: "المعرّف",
      label: "الوصف",
      sortOrder: "ترتيب الفرز",
      addCategory: "إضافة فئة",
      categoryAdded: "تمت إضافة الفئة.",
      budgetsTitle: "ميزانيات شهرية",
      budgetsSub: "مبالغ بالوحدات الكبرى لشهر التقويم الحالي (على مستوى المؤسسة دون ربط بمشروع).",
      monthNote: "الشهر الحالي",
      budgetAmount: "سقف الميزانية",
      saveBudgets: "حفظ الميزانيات",
      budgetsSaved: "تم حفظ الميزانيات.",
      noCategories: "أضف فئة واحدة على الأقل قبل ضبط الميزانية أو تسجيل مصروفات مصنّفة.",
      linkPlHint: "إدخال الإيرادات والمصروفات (قائمة الدخل)",
    },
    orgSettings: {
      pageTitle: "المؤسسة",
      pageSub: "لقطة للقراءة من Supabase. يمكن تثبيت المستأجر عبر NEXT_PUBLIC_GAM_ORGANIZATION_ID أثناء التطوير.",
      orgName: "الاسم",
      orgSlug: "المعرّف المختصر",
      functionalCurrency: "العملة الوظيفية",
      orgId: "معرّف المؤسسة",
      copyId: "نسخ المعرف",
      copied: "تم النسخ.",
      yourRole: "دورك",
    },
    mobileQuick: {
      title: "مصروف سريع",
      subtitle: "فئة، مبلغ، ترحيل — على الهاتف أو الحاسوب.",
      ledgerMemoPrefix: "سريع",
      selectCategory: "الفئة",
      amountLabel: "المبلغ",
      currencyHint: "بالعملة الوظيفية. يُستخدم تاريخ اليوم.",
      submit: "ترحيل المصروف",
      saving: "جاري الترحيل…",
      saved: "تم الحفظ في الدفتر.",
      error: "تعذّر الحفظ. تحقّق من الاتصال والصلاحيات.",
      needLogin: "سجّل الدخول لتسجيل المصروفات.",
      noOrg: "لا مؤسسة مرتبطة بهذا الحساب.",
      catFood: "مواد غذائية ومشتريات",
      catLabor: "أجور وعمالة",
      catSupplies: "مستلزمات",
      catMisc: "مصروفات متنوعة",
      clear: "مسح",
      backspace: "حذف",
      home: "لوحة التحكم",
      openFullPl: "نموذج الدفتر الكامل",
    },
    quickCapture: {
      title: "التقاط مصروف",
      subtitle: "أسقِط صورة الإيصال أو استخدم الكاميرا — بدون نموذج حتى نقرأ الصورة.",
      dropHint: "أسقِط صورة الإيصال هنا أو استخدم الالتقاط / المعرض أدناه.",
      dropActive: "اترك للمسح",
    },
    presentationQuick: {
      title: "إيراد / مصروف سريع (عرض)",
      subtitle: "سطر واحد بعملة المعاملة. تتحدّث قائمة الدخل فورًا (ويُحفَظ في القاعدة عند توفر الصلاحيات).",
      weakBanner:
        "يُحمَّل NEXT_PUBLIC_GAM_ORGANIZATION_ID دون صف في organization_members. التحديث المحلي للعرض لا يزال يعمل؛ نفّذ link:org-member للحفظ الدائم.",
      revenue: "إيراد",
      expense: "مصروف",
      revenueCategoryNote: "سطور الإيراد لا تتطلب فئة تكلفة وفق قواعد الدفتر.",
      amount: "المبلغ",
      category: "الفئة",
      catConsult: "أتعاب استشارات",
      catTools: "أدوات / SaaS",
      catOther: "أخرى",
      currency: "العملة",
      submit: "تسجيل",
      saving: "جاري الترحيل…",
      saved: "تم التطبيق.",
      error: "تعذّر تحميل الفئات.",
      overlayHint: "تُحدَّث الرسوم في وضع العرض محليًا. اربط المستخدم بالمؤسسة للحفظ في Supabase.",
      memoPrefix: "عرض",
      uploadTitle: "رفع مستندات (عرض وهمي)",
      uploadHint: "فواتير وإيصالات — للعرض فقط؛ لا يُخزَّن ملف.",
      uploadButton: "رفع فاتورة / إيصال (عرض)",
      uploadSuccess: "تم الاستلام. (عرض: لا تخزين فعلي.)",
      needLogin: "سجّل الدخول للإدخال السريع.",
    },
    receiptOcr: {
      sectionTitle: "مسح إيصال بالذكاء الاصطناعي",
      sectionSub: "التقط صورة أو اختر ملفًا. يدعم إيصالات دبي بالإنجليزية والعربية المختلطة. راجع ثم رحّل.",
      camera: "التقط صورة",
      gallery: "اختر ملفًا",
      uploading: "جاري الرفع…",
      analyzing: "جاري قراءة الإيصال…",
      parseError: "تعذّر قراءة الإيصال. جرّب صورة أوضح.",
      serverNotConfigured: "لم يُضبط OCR‎ (GEMINI_API_KEY).",
      previewTitle: "تحقق قبل الترحيل",
      needCategory: "اختر الفئة أعلاه أولًا.",
      fieldDate: "التاريخ",
      fieldVendor: "المورّد",
      fieldTotal: "الإجمالي",
      fieldCurrency: "العملة",
      fieldTax: "الضريبة / القيمة المضافة",
      taxHint: "اختياري؛ يُذكر في الملاحظة",
      confirmSave: "موافق — ترحيل إلى الدفتر",
      discard: "تجاهل",
      saving: "جاري الترحيل…",
      saved: "تم الترحيل مع رابط الإيصال.",
      copyToKeypad: "نسخ المبلغ إلى لوحة الأرقام",
      stepsTitle: "التقدّم",
      stepReceive: "استلام",
      stepAi: "قراءة AI",
      stepReview: "مراجعة",
      stepPost: "ترحيل",
      stepDone: "تم",
      liveLogTitle: "سجل النشاط",
      logUploaded: "تُخزّن الصورة في حاوية Supabase «receipts»",
      logParsed: "استخرجت AI التاريخ والمورّد والإجمالي والعملة والضريبة",
      logAwaitingConfirm: "بانتظار موافقتك — يمكنك تعديل الحقول",
      logPosted: "أُنشئ سطر الدفتر — إشعار لتحديث لوحة المؤشرات",
      demoModeBadge: "عرض توضيحي (لا حاجة لمفتاح API في وضع التطوير)",
      presentationCallout:
        "وضع العرض: اضغط الزر المتقطع أدناه لتحميل إيصال نموذجي ثم موافق للترحيل. يعمل بدون Gemini عند NODE_ENV=development.",
      loadDemoSample: "تحميل إيصال نموذجي (عرض)",
      demoSampleHint: "للشرائح بنقرة واحدة: نموذج دبي إنجليزي/عربي — اختر الفئة ثم رحّل.",
      successTitle: "تم الترحيل بنجاح",
      successDismiss: "إغلاق",
      successLedgerId: "معرّف سطر الدفتر",
      successStoragePath: "ملف الإيصال في التخزين",
      successNoStorage: "لا ملف (عرض فقط أو معاينة محلية)",
      successAmount: "المبلغ المُرحَّل",
      successRefreshing: "جاري بث التحديث إلى عناصر KPI…",
    },
    auth: {
      signInCta: "تسجيل الدخول",
      signOut: "تسجيل الخروج",
      pageTitle: "تسجيل الدخول إلى GAM HQ",
      pageSubtitle: "استخدم حساب Supabase Auth المضاف في organization_members لمؤسستك.",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      submit: "متابعة",
      submitting: "جاري تسجيل الدخول…",
      errorGeneric: "فشل تسجيل الدخول. تحقق من البريد وكلمة المرور وإعدادات المصادقة في Supabase.",
      backHome: "العودة إلى النظرة التنفيذية",
    },
  },
};
