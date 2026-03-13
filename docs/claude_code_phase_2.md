# Fáze 2 — Zlepšení kvality insightů a analytické vrstvy

## Cíl fáze
Navázat na funkční aplikaci z fáze 1 a výrazně zlepšit **kvalitu výstupů**. Tato fáze není primárně o přidávání dalších stránek, ale o tom, aby systém lépe rozuměl problémům, buyerům a signálům ochoty platit.

Výstupem má být výrazně chytřejší systém, který dává méně šumu a více skutečně zajímavých nálezů.

---

## Hlavní cíl
Z fáze 1 už existuje end-to-end pipeline. Ve fázi 2 ji rozšiř a zpřesni tak, aby analýza nebyla jen základní extrakce, ale kvalitní strukturované vyhodnocení.

---

## Co má být v této fázi přidáno

# 1. Lepší extrakce signálů
Rozšiř AI analýzu tak, aby vytahovala další dimenze.

Nové nebo vylepšené výstupy:
- přesnější buyer segment,
- velikost buyeru / typ zákazníka,
- mention konkurence,
- zmínka o existujícím workaroundu,
- explicitní willingness-to-pay evidence,
- cost-of-problem signal,
- severity summary,
- “why now” hint,
- type of problem (workflow, automation, integration, compliance, search, collaboration, etc.).

---

# 2. Strukturované evidence
Nestačí jen finální čísla. U každého výsledku chci mít i evidence layer.

Pro každý signál ukládej:
- stručné vysvětlení,
- případné úryvky nebo paraphrased evidence,
- confidence,
- zda byl signál explicitní nebo odvozený.

Příklad:
- payment signal: 8
- evidence type: explicit
- evidence summary: autor přímo říká, že by za řešení zaplatil / firma už platí za workaround

Pozor na copyright: neukládej zbytečně dlouhé citace, stačí krátké bezpečné shrnutí nebo velmi krátký úryvek.

---

# 3. Deduplikace a normalizace
Ve fázi 1 budou výsledky často roztříštěné. Teď přidej:
- deduplikaci raw dokumentů,
- deduplikaci téměř stejných insightů,
- normalizaci buyer segmentů,
- normalizaci kategorií problémů,
- normalizaci názvů konkurentů.

Cílem je snížit chaos v datech.

---

# 4. Review workflow
Přidej lepší ruční review flow v admin dashboardu.

Pro každý výsledek musí být možné:
- označit jako validní příležitost,
- označit jako noise,
- označit jako duplicate,
- přidat interní poznámku,
- ručně upravit tags nebo category,
- změnit review status.

Review status návrh:
- new
- reviewed
- accepted
- rejected
- duplicate
- ignored

---

# 5. Lepší filtrace a pohledy v admin dashboardu
Rozšiř admin dashboard tak, aby bylo možné:
- filtrovat podle zdroje,
- filtrovat podle buyer segmentu,
- filtrovat podle category,
- filtrovat podle score range,
- filtrovat podle review status,
- filtrovat podle explicit payment signal,
- zobrazit jen noise / errors / pending review.

Přidej i agregované pohledy:
- top buyer segments,
- top categories,
- zdroje s největším množstvím kvalitních nálezů,
- review conversion: kolik new výsledků skončí jako accepted.

---

# 6. Prompting a AI orchestration
Přepracuj AI vrstvu tak, aby byla robustnější.

Chci:
- jasně oddělené prompt šablony,
- verzi promptů,
- možnost prompt snadno upravit,
- retry při nevalidním JSON výstupu,
- fallback handling,
- audit trail, jakou prompt verzí byl výsledek vytvořen.

Přidej možnost porovnávat novou prompt verzi na části dat.

---

# 7. Lepší scoring model
Nahraď jednoduchý scoring z fáze 1 promyšlenější verzí.

Scoring má zohledňovat:
- pain,
- urgency,
- explicit solution search,
- dissatisfaction,
- payment signal,
- buyer quality,
- confidence,
- penalty za šum nebo neurčitost.

Musí existovat:
- jasná formule nebo transparentní scoring logika,
- breakdown v UI,
- možnost budoucího ladění vah.

---

## Úpravy datového modelu
Rozšiř datový model o entity nebo pole pro:
- evidence,
- competitor mentions,
- review notes,
- normalized categories,
- normalized buyer segments,
- prompt versioning,
- dedupe groups.

Návrh udělej tak, aby později šel napojit clustering bez bolestivých změn.

---

## Admin dashboard — nové sekce / rozšíření
Ve fázi 2 rozšiř admin minimálně o:

## 1. Review Queue
Speciální pohled pro ruční třídění nových insightů.

Musí obsahovat:
- rychlé akce accept / reject / duplicate,
- klávesové zkratky, pokud je to jednoduché,
- přehled evidence,
- možnost interní poznámky.

## 2. Analytics
Přehled analytik:
- top kategorie,
- top buyer segmenty,
- distribution score,
- explicit payment signal count,
- accepted vs rejected.

## 3. Prompt / processing metadata
U výsledků zobraz:
- prompt version,
- model name,
- processing timestamp,
- retries,
- validation status.

---

## Technické požadavky
- zachovej čistou architekturu,
- žádná prompt logika natvrdo rozházená po appce,
- scoring musí být testovatelný,
- normalizace musí být oddělená vrstva,
- review workflow musí být konzistentní v DB i UI.

---

## Co chci po dokončení této fáze vidět
- lepší kvalitu insightů než ve fázi 1,
- méně duplicit a méně šumu,
- review flow v adminu,
- evidence pro jednotlivé signály,
- analytické pohledy nad výsledky,
- připravenost na clustering ve fázi 3.

---

## Deliverables
Na konci této fáze vytvoř:
1. rozšířenou AI analytickou vrstvu,
2. review workflow v admin dashboardu,
3. deduplikaci a normalizaci,
4. rozšířený scoring,
5. dokumentaci změn oproti fázi 1,
6. stručný návrh, jak na to naváže fáze 3.
