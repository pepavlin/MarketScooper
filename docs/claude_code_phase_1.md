# Fáze 1 — End-to-end vertical slice + admin dashboard

## Cíl fáze
Vytvoř plně funkční první verzi aplikace, která:
- získá data alespoň z 1–2 zdrojů,
- zpracuje je pomocí AI,
- vytěží z nich problémy a obchodní signály,
- uloží výsledky do databáze,
- zobrazí je v uživatelském rozhraní,
- a zároveň bude mít **admin dashboard**, kde je vidět stav celého systému.

Tato fáze nemá být jen technický základ. Má už vracet reálné insighty, které lze procházet a hodnotit.

---

## Výstup této fáze
Po dokončení musí být možné:

1. Spustit aplikaci lokálně.
2. Naimportovat / stáhnout data z minimálně jednoho veřejného zdroje.
3. U každého záznamu spustit AI analýzu.
4. Vidět seznam nalezených příležitostí.
5. Rozkliknout detail konkrétního záznamu.
6. V admin dashboardu vidět přehled nad ingestion, AI zpracováním, chybami a statistikami.

---

## Doporučený stack
Použij moderní, rozšiřitelný stack:

- **Frontend + backend app:** Next.js
- **Databáze:** PostgreSQL
- **ORM:** Prisma nebo Drizzle
- **Background jobs / workers:** Node.js worker nebo Python worker
- **LLM integrace:** OpenAI API přes dobře oddělenou service vrstvu
- **Styling:** Tailwind
- **Admin UI:** součást Next.js aplikace
- **Validace:** Zod
- **Logging:** strukturovaný logging
- **Env konfigurace:** `.env`

Architekturu navrhni modulárně tak, aby šla později rozšířit o clustering, více zdrojů, plánované běhy a pokročilé scoring modely.

---

## Části aplikace, které musí existovat

# 1. Veřejná / hlavní aplikační část
Nemusí být marketingově krásná, ale musí být použitelná.

Musí obsahovat:

## 1.1 Přehled nalezených příležitostí
Stránka se seznamem analyzovaných výsledků, kde bude pro každý záznam:
- krátký název / shrnutí problému,
- zdroj,
- buyer segment,
- celkové score,
- urgency signal,
- payment signal,
- dissatisfaction signal,
- datum zpracování,
- stav záznamu.

Musí jít:
- filtrovat,
- řadit,
- a otevřít detail.

## 1.2 Detail příležitosti
Detail jedné nalezené opportunity musí ukazovat:
- původní text / raw content,
- URL nebo identifikaci zdroje,
- AI-extrahovaný problém,
- AI-extrahovaný buyer segment,
- AI-extrahované signály,
- důvod skóre,
- stručné AI shrnutí, proč by to mohl být produktový směr.

---

# 2. Admin dashboard
Toto je důležitá část. Chci mít nad systémem přehled.

Admin dashboard musí obsahovat minimálně tyto sekce:

## 2.1 Overview
Souhrnná karta / stránka s metrikami:
- počet raw záznamů,
- počet úspěšně analyzovaných záznamů,
- počet chyb,
- počet pending záznamů,
- počet opportunity výsledků,
- průměrné score,
- poslední běh ingestion,
- poslední běh AI analýzy.

## 2.2 Sources
Sekce pro přehled zdrojů:
- seznam aktivních zdrojů,
- stav zdroje,
- kolik záznamů ze zdroje bylo načteno,
- poslední úspěšný fetch,
- poslední chyba.

V této fázi stačí read-only přehled, ale struktura má být připravená na budoucí správu.

## 2.3 Processing jobs
Přehled zpracování:
- seznam posledních jobů,
- typ jobu,
- stav,
- počet položek,
- začátek / konec,
- error message,
- retry count.

## 2.4 Errors / logs
Stránka nebo tabulka s chybami:
- ingestion chyby,
- parsing chyby,
- AI chyby,
- DB chyby.

U každé chyby musí být:
- čas,
- komponenta,
- stručná hláška,
- kontext.

## 2.5 Manual actions
Admin musí mít alespoň základní ruční akce:
- spustit ingestion,
- spustit analýzu pending záznamů,
- reanalyzovat konkrétní záznam,
- označit záznam jako ignored,
- označit záznam jako reviewed.

---

## Datové zdroje pro tuto fázi
Použij 1–2 zdroje, ale architekturu udělej tak, aby šly snadno přidat další.

Preferované zdroje:
- Reddit
- Hacker News
- Product Hunt komentáře
- případně import přes JSON / CSV jako fallback

Minimální požadavek:
- alespoň 1 skutečný online zdroj,
- plus 1 jednoduchý fallback import pro testování.

Každý zdroj musí mít vlastní adaptér / connector vrstvu.

---

## Co se má z každého záznamu vytáhnout pomocí AI
Nad každým raw záznamem proveď AI analýzu a ulož strukturovaný výstup.

Minimálně extrahuj:

- `problem_summary`
- `buyer_segment`
- `pain_level` (0–10)
- `urgency_signal` (0–10)
- `payment_signal` (0–10)
- `dissatisfaction_signal` (0–10)
- `solution_search_signal` (0–10)
- `is_potential_opportunity` (boolean)
- `reasoning_summary`
- `tags`
- `language`
- `confidence`

Výstup musí být validovaný proti schématu a při nevalidním AI výstupu se musí umět bezpečně zachytit chyba.

---

## Scoring
V první fázi udělej **základní opportunity scoring**, ne ještě clustering.

Zaveď jednoduché finální score, například z těchto složek:
- pain level
- urgency
- payment signal
- dissatisfaction
- search intent
- confidence

Implementace může být jednoduchá, ale:
- musí být transparentní,
- musí být uložená,
- a v UI musí být vidět, proč záznam dostal dané score.

---

## Datový model
Navrhni čistý datový model minimálně pro tyto entity:

- `Source`
- `RawDocument`
- `AnalysisResult`
- `ProcessingJob`
- `AppError`
- `ReviewState`

Mysli na budoucí rozšíření o:
- embeddings,
- clustering,
- reports,
- recommendations,
- scheduled scans.

---

## Workflow aplikace
Aplikace musí umět tento tok:

1. Fetch dat ze zdroje
2. Uložení raw dokumentu
3. Zařazení dokumentu do zpracování
4. AI extrakce
5. Validace výstupu
6. Výpočet score
7. Uložení výsledku
8. Zobrazení v dashboardu a adminu

---

## UI požadavky
UI nemusí být designově perfektní, ale musí být:
- čisté,
- rychlé,
- dobře čitelné,
- použitelné pro reálnou práci.

Použij:
- tabulky,
- filtry,
- badge pro stavy,
- score indikátory,
- detailní panely.

Admin dashboard i hlavní přehled musí fungovat dobře na desktopu.

---

## Důležité technické požadavky
- použij TypeScript,
- odděl ingestion, AI orchestration, scoring a UI do samostatných modulů,
- žádná velká chaotická logika v route handlerech,
- připrav projekt na budoucí background job queue,
- dbej na idempotenci fetch a analýzy,
- zamez duplicitnímu ukládání stejných raw dokumentů,
- přidej seed nebo demo dataset pro rychlé otestování.

---

## Co chci po dokončení této fáze vidět
- funkční aplikaci,
- funkční admin dashboard,
- několik reálně analyzovaných záznamů,
- možnost ručně spustit ingestion a analýzu,
- jasnou architekturu připravenou na další fáze.

---

## Důraz na kvalitu implementace
Nechci pouze proof of concept napsaný narychlo. Chci solidní základ:
- dobře oddělené moduly,
- čitelnou strukturu složek,
- základní dokumentaci v README,
- environment proměnné,
- jednoduchý způsob spuštění.

---

## Deliverables
Na konci této fáze vytvoř:
1. zdrojový kód aplikace,
2. README se spuštěním,
3. seed / demo data nebo import,
4. krátký popis architektury,
5. seznam míst, kde je projekt připraven na rozšíření ve fázi 2.
