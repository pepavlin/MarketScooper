# Fáze 3 — Clustering, opportunity intelligence a vyšší vrstva doporučení

## Cíl fáze
Proměnit systém z analyzátoru jednotlivých záznamů na skutečný **market-gap engine**, který umí spojovat opakující se signály do společných opportunity clusterů a nad nimi generovat produktové závěry.

Tady už nejde jen o to, co řekl jeden člověk. Cílem je zjistit:
- jaké problémy se opakují,
- v jakých segmentech,
- s jakou silou,
- a co by z toho stálo za postavení.

---

## Hlavní výstup této fáze
Po dokončení musí systém umět:
1. vytvořit embeddingy relevantních insightů,
2. seskupovat podobné problémy do clusterů,
3. zobrazovat clustery v UI,
4. ohodnotit cluster jako celek,
5. navrhnout produktovou příležitost,
6. v admin dashboardu ukázat kvalitu a stav clusteringu.

---

## Co se má implementovat

# 1. Embeddings pipeline
Přidej vrstvu pro generování embeddings nad vhodnými daty.

Použij promyšlený vstup pro embedding, ne jen raw text.
Zvaž kombinaci:
- normalized problem summary,
- buyer segment,
- category,
- dissatisfaction summary,
- search intent summary.

Musí být jasně určeno:
- která data se embeddují,
- kdy se embedding vytváří,
- jak se re-generuje při změně dat,
- jak se verzují embedding modely.

---

# 2. Clustering
Implementuj clustering podobných insightů.

Požadavky:
- clusterovat na základě embeddingů,
- umožnit re-run clusteringu,
- ukládat cluster assignment,
- mít možnost insight ponechat bez clusteru,
- detekovat malé, slabé nebo podezřelé clustery,
- připravit systém na budoucí iteraci parametrů.

Nechci black-box bez kontroly. Ulož i metadata clusteringu:
- model,
- parametry,
- datum běhu,
- velikost clusteru,
- confidence / cohesion odhad, pokud jde spočítat.

---

# 3. Cluster entity a UI
Zaveď novou hlavní entitu: `OpportunityCluster`.

Každý cluster by měl mít:
- název,
- shrnutí problému,
- dominant buyer segment,
- dominant category,
- počet insightů,
- počet zdrojů,
- aggregate opportunity score,
- cluster confidence,
- created/updated timestamps,
- review status,
- AI-generated opportunity summary.

---

# 4. Cluster detail page
V aplikaci i adminu musí existovat detail clusteru.

Musí ukazovat:
- shrnutí clusteru,
- proč byl vytvořen,
- které insighty do něj patří,
- jaké zdroje ho potvrzují,
- jaké evidence se v něm opakují,
- buyer segmenty uvnitř clusteru,
- konkurenty, kteří se opakují,
- nejčastější stížnosti,
- score breakdown.

Tato stránka je velmi důležitá. Má být použitelná jako podklad pro produktové rozhodnutí.

---

# 5. Cluster-level scoring
Vedle scoringu jednotlivých insightů přidej i scoring clusteru.

Cluster score má zohledňovat:
- počet insightů,
- počet různých zdrojů,
- průměrný a medián insight score,
- explicitní payment evidence,
- konzistenci buyer segmentu,
- konzistenci problému,
- strength of dissatisfaction,
- competition weakness pattern.

Musí být zřejmé, proč je cluster silný nebo slabý.

---

# 6. Opportunity intelligence
Nad každým clusterem spusť vyšší AI vrstvu, která vygeneruje produktově užitečné výstupy.

Minimálně generuj:
- `opportunity_summary`
- `who_should_buy_this`
- `why_this_problem_matters`
- `existing_alternatives`
- `weakness_of_current_solutions`
- `suggested_mvp`
- `pricing_hypothesis`
- `go_to_market_hypothesis`
- `why_now`
- `risks_and_unknowns`

Tohle je velmi důležité. Právě tady se z výsledku stává něco, co je opravdu akční.

---

# 7. Admin dashboard — cluster management
Rozšiř admin dashboard o novou část pro clustery.

Musí obsahovat:

## 7.1 Clusters list
Seznam clusterů s:
- názvem,
- velikostí,
- score,
- dominantním buyerem,
- review statusem,
- počtem zdrojů,
- updated at.

## 7.2 Cluster review
Možnost:
- potvrdit cluster,
- označit cluster jako noise,
- sloučit clustery,
- rozdělit cluster ručně nebo označit ke kontrole,
- přidat interní poznámku.

## 7.3 Clustering runs
Přehled běhů clusteringu:
- datum,
- parametry,
- počet clusterů,
- počet orphan insightů,
- chyby,
- použitý embedding model.

---

# 8. Opportunity reports
Přidej přehledovou stránku nebo export, kde budou top clustery.

U každého clusteru chci vidět:
- co je to za opportunity,
- jak silná je,
- koho se týká,
- proč by za to někdo mohl zaplatit,
- co by mohl být MVP,
- jaká je konkurence.

Tohle má být hlavní business output systému.

---

## Technické požadavky
- embeddings a clustering musí být oddělené moduly,
- cluster assignment musí být re-buildable,
- žádné nevratné mutace bez historie,
- zachovej auditovatelnost,
- promysli migrace dat ze starších insightů,
- chraň výkon DB a připrav rozumné indexy,
- mysli na budoucí vícezdrojový růst.

---

## Co nechci
- jen jednoduché seskupení podle string similarity,
- jen kosmetický cluster list bez skutečné inteligence,
- cluster summaries bez vazby na evidence,
- scoring, který nejde vysvětlit.

---

## Co chci po dokončení této fáze vidět
- fungující embeddings pipeline,
- fungující clustering,
- přehled clusterů,
- detail clusteru s evidence layer,
- opportunity intelligence nad clustery,
- admin rozhraní pro kontrolu clusterů,
- top actionable opportunities.

---

## Deliverables
Na konci této fáze vytvoř:
1. embeddings pipeline,
2. clustering pipeline,
3. datový model pro clustery,
4. cluster UI + admin cluster management,
5. AI-generated opportunity intelligence,
6. report nebo export top opportunity clusterů,
7. dokumentaci k tomu, jak ladit clustering a jak interpretovat cluster score.
