# 1,000 visitor questions for Layan

How real visitors write to the chat on their phones: Jordanian dialect, some MSA, Gulf, Egyptian and
Arabizi, typos, one-word messages and long stories, on-topic questions and everything else people send.

Each line: `- message — \`tag\``. The tag is what Layan should do:

| Tag | Expected reply |
|---|---|
| an answer id (`pool`, `prices`, `location`…) | that answer (ids from `qa.json`; site FAQ ids in `tools/questions-eval.mjs`) |
| `chalet:<ID>` / `chalet:?` | the chalet's card with its place on the map / "no such chalet" + the map |
| `map` | the compound map card |
| `book` | the in-chat visit booking |
| `chat` | small talk, no site answer |
| `persona` | about Layan herself |
| `contact` | the sales team's number |
| `off` | politely off-topic, no site answer |
| `english` | a reply in English (or the right answer) |
| `multi:a+b` | one of the two answers at least |

Tools:
- `node chatbot-poc/tools/questions-eval.mjs --split=test --fails` scores Layan (fresh chat per message).
- `node chatbot-poc/tools/questions-train.mjs && npm run chatbot:kb` adds the 70% "train" questions she gets
  wrong to her phrasings; the 30% "test" questions are never added, so the test score stays honest.

## Part A — the chalet itself

### pool
- مسبح؟ — `pool`
- المسبح خاص لكل شاليه ولا مشتررك مع الكل — `pool`
- قديش طول البركه تقريبا — `pool`
- shu 7ajm el masba7 — `pool`
- البركة بتدفا بالشتا ولا بس للصيف؟ — `pool`
- عندي ولد عمره 4 سنين، المسبح غميق؟ في جزء ضحل للصغار — `pool`
- وش مساحة المسبح الخاص — `pool`
- حوض السباحه برا ولا داخلي — `pool`
- عايز اعرف حمام السباحة مساحته كام — `pool`
- مسبحح خاص؟؟ — `pool`
- بفكر اشتري بس بدي اتاكد انه في بركة سباحة الها لحالي مش عامة — `pool`

### jacuzzi
- جاكوزي — `jacuzzi`
- في جكوزي بالشالية — `jacuzzi`
- الجاكوزي داخل الحمام ولا جنب المسبح برا — `jacuzzi`
- 3ndkom jacuzzi? — `jacuzzi`
- الجاكوزي ميته سخنة؟ — `jacuzzi`
- فيه جاكوزي خاص ولا مشترك مع الشاليهات الثانية — `jacuzzi`
- مرتي بتحب الجاكوزي كتييير، موجود؟ 😅 — `jacuzzi`
- هل يتوفر حوض استرخاء (جاكوزي) في كل وحدة؟ — `jacuzzi`
- الجاكوزي كم شخص بيساع — `jacuzzi`
- طب والجاكوزي؟ — `jacuzzi`
- jakuzi mawjood — `jacuzzi`

### bedrooms
- كم غرفه نوم — `bedrooms`
- اديش غرف وحمامات فيه — `bedrooms`
- كل الغرف ماستر يعني كل غرفة الها حمام؟ — `bedrooms`
- احنا عيلة 7 اشخاص، الغرف بتكفينا؟ — `bedrooms`
- كمغرفةنوم بالشاليه — `bedrooms`
- kam ghorfeh fi — `bedrooms`
- عدد دورات المياه كم — `bedrooms`
- في حمام للضيوف غير حمامات الغرف — `bedrooms`
- الشاليه فيه كام اوضة — `bedrooms`
- غرف النوم كبار ولا صغار — `bedrooms`
- 3 غرف بس؟ ما في رابعة — `bedrooms`

### kitchen
- المطبخ مجهز ولا بستلمه فاضي — `kitchen`
- في مطبح؟ — `kitchen`
- المطبخ مفتوح ع الصالة ولا مسكر — `kitchen`
- الصاله كبيره؟ — `kitchen`
- matba5 mjahaz? — `kitchen`
- في غاز وفرن ولا لازم اجيب — `kitchen`
- خزاين المطبخ شو نوعها — `kitchen`
- المطبخ فيه جزيرة؟ — `kitchen`
- كيف شكل غرفة المعيشه والمطبخ — `kitchen`
- المطبخ كويس ولا صغير اوي — `kitchen`
- بدي اطبخ منسف للعيلة كلها هناك، المطبخ بيساع؟ — `kitchen`

### heating
- في تدفئه؟ — `heating`
- الشتا هناك برد كتير، الشاليه بندفى كيف — `heating`
- في مكيفات بالغرف — `heating`
- تدفئة ارضيه ولا شوفاج — `heating`
- fi tadfe2a? — `heating`
- في مدفأه حطب او شومينه بالصالة — `heating`
- الصيف حر، في تكييف سبليت؟ — `heating`
- وش نظام التبريد والتدفئه عندكم — `heating`
- في تكيف مركزي — `heating`
- بنروح بكانون، رح نبرد؟ 🥶 — `heating`
- التكييف موجود فيه ولا هشتريه انا — `heating`

### finishes
- التشطيب شو مستواه — `finishes`
- الكسوه حجر ولا شو — `finishes`
- البلاط سيراميك ولا رخام — `finishes`
- tashteeb sobr deluxe? — `finishes`
- المواد المستخدمه بالبنا شو جودتها — `finishes`
- الابواب والشبابيك شو نوعها، المنيوم؟ — `finishes`
- التشطيبات كاملة ولا عضم — `finishes`
- الحمامات تشطيبها شو، في ماركات معروفة — `finishes`
- ابي اعرف نوعية التشطيب — `finishes`
- تشتيبات؟ — `finishes`
- خايف يكون التشطيب تجاري وبعد سنتين يخرب — `finishes`

### outdoor
- في شوايه برا — `outdoor`
- في برجوله للقعدة — `outdoor`
- bbq area fi? — `outdoor`
- القعدة البرانيه مسقوفة؟ — `outdoor`
- بدي اعمل مشاوي مع الشباب بالليل، في مكان مخصص؟ — `outdoor`
- في ترس او جلسة خارجيه جنب المسبح — `outdoor`
- في منقل مبني — `outdoor`
- فيه مكان للشوي — `outdoor`
- الجلسات الخارجيه شو فيها — `outdoor`
- في مظلة على البرندة — `outdoor`
- عايز مكان نقعد فيه برا بالليل — `outdoor`

### garden
- جنينه؟ — `garden`
- الحديقه خاصة فيني ولا للكل — `garden`
- في عشب طبيعي ولا صناعي — `garden`
- ganeene khassa? — `garden`
- قديش مساحة الحديقة حول الشاليه — `garden`
- بقدر ازرع شجر زيتون بالجنينة — `garden`
- في اشجار مزروعة ولا ارض فاضيه — `garden`
- الحديقة مسورة؟ — `garden`
- فيه حديقة خاصة للشاليه — `garden`
- انا بحب الزراعة كتير وبدي مكان اعمل فيه حاكورة صغيرة، في مساحة خضرا؟ — `garden`
- الجنينه قدام ولا ورا — `garden`

### parking
- في كراج؟ — `parking`
- وين بصف السياره — `parking`
- كم سيارة بتوسع بالموقف — `parking`
- parking khas? — `parking`
- الكراج مسقوف ولا مكشوف — `parking`
- اذا اجو ضيوف وين بيصفوا — `parking`
- في موقف خاص لكل شاليه — `parking`
- عندي سيارتين وجيب، في مكان الهم كلهم — `parking`
- فيه مواقف ولا لا — `parking`
- الكراش مضلل؟ — `parking`
- العربيه هركنها فين — `parking`

### floors
- كم طابق — `floors`
- الشاليه دوبلكس؟ — `floors`
- في درج جوا — `floors`
- كلو ع طابق واحد؟ — `floors`
- kam tabe2? — `floors`
- في روف فوق بقدر اطلعله — `floors`
- في سده او طابق تسوية — `floors`
- ليش عملتوه طابق واحد مش طابقين — `floors`
- الشاليه ارضي — `floors`
- الغرف فوق ولا تحت — `floors`
- هل الوحدة مكونة من طابق واحد ام اكثر؟ — `floors`

### furnished
- مفروش؟ — `furnished`
- بيجي مع عفش ولا فاضي — `furnished`
- الاثاث علي ولا عليكم — `furnished`
- furnished wala la2 — `furnished`
- في كنب وتخوت جاهزين — `furnished`
- لو بدي افرشه انتو بتساعدوني — `furnished`
- السعر بيشمل الفرش؟ — `furnished`
- ابي استلمه جاهز اسكن فيه على طول — `furnished`
- الشاليه متفرش ولا هفرشه انا — `furnished`
- العفش ع حسابكم؟ — `furnished`
- في اجهزة كهربائية مع الشاليه غسالة ثلاجة؟ — `furnished`

### modify
- بقدر اعدل — `modify`
- بدي ازيد غرفه رابعه ممكن؟ — `modify`
- مسموح ابني طابق ثاني فوق — `modify`
- بقدر اغير البلاط على ذوقي قبل الاستلام — `modify`
- اعمل ملحق بالحديقة مسموح — `modify`
- momken a3'ayer el design? — `modify`
- لو بدي اوسع المسبح بقدر؟ — `modify`
- اسكر البرجولة بزجاج واعملها غرفة، بيصير؟ — `modify`
- ابي اسوي تعديلات داخلية، فيه مانع؟ — `modify`
- التصميم ثابت ولا بنقدر نغير فيه — `modify`
- عايز اغير المطبخ كله ينفع — `modify`

### accessible
- امي على كرسي متحرك، بتقدر تتحرك جوا الشاليه براحتها؟ — `accessible`
- مناسب لكبار السن؟ — `accessible`
- في درج متعب للختياريه — `accessible`
- ابوي عامل عملية بركبته وما بقدر يطلع درج — `accessible`
- wheelchair friendly? — `accessible`
- الحمامات واسعه لكرسي متحرك — `accessible`
- مناسب لذوي الاحتياجات الخاصه — `accessible`
- جدي عمره 85 بدنا مكان مريح الو — `accessible`
- في رامب للمدخل — `accessible`
- ستي ما بتقدر تمشي كتير، الشاليه مناسب الها — `accessible`
- مناسب للمسنين وا لا — `accessible`

### area
- المساحه كم — `area`
- قديش مساحة الارض — `area`
- البنا كم متر — `area`
- كم متر مبني وكم متر ارض — `area`
- masa7et el chalet kam — `area`
- 500 متر ارض صح؟ — `area`
- المساحة الكلية للوحدة كام متر — `area`
- 120 متر بس البنا؟ مش صغير؟ — `area`
- وش مواصفات الشاليه بالضبط — `area`
- مساحات الشاليهات كلها نفس الشي ولا بتختلف — `area`
- كممتر الشاليه — `area`

### chalet-facilities
- شو في بالشاليه — `chalet-facilities`
- الشاليه شو بيحتوي — `chalet-facilities`
- shu fi bel chalet? — `chalet-facilities`
- احكيلي عن مرافق الشاليه نفسه مش الكمباوند — `chalet-facilities`
- كل شاليه شو في فيه بالتفصيل — `chalet-facilities`
- وش المميزات اللي داخل الوحدة — `chalet-facilities`
- مكونات الشالية — `chalet-facilities`
- الشاليه فيه ايه بالظبط — `chalet-facilities`
- انا مش فاهم شو بستلم بالزبط، شو موجود جوا الشاليه؟ — `chalet-facilities`
- مرافق الشاليه — `chalet-facilities`
- قلي كل اشي موجود بالشاليه لو سمحت 🙏 — `chalet-facilities`

### internet
- في نت؟ — `internet`
- واي فاي — `internet`
- wifi fi? — `internet`
- النت هناك قوي ولا بقطع — `internet`
- بشتغل ريموت ومحتاج نت سريع، بنفع اشتغل من الشاليه؟ — `internet`
- في فايبر واصل — `internet`
- تغطيه زين واورنج منيحه هناك؟ — `internet`
- النت مجاني ولا لازم اشترك — `internet`
- فيه انترنت بالشاليهات — `internet`
- الشبكة كويسة ولا ضعيفة — `internet`
- الولاد بدهم نت للبلايستيشن 😂 في؟ — `internet`

### kids
- في اشي للولاد — `kids`
- مناسب للاطفال؟ — `kids`
- عندي 3 ولاد صغار، شو في الهم يلعبوا — `kids`
- في العاب اطفال او زحليقة — `kids`
- kids area fi? — `kids`
- مكان امن للصغار يلعبوا — `kids`
- الكمباوند مناسب للعائلات؟ — `kids`
- ولادي بيزهقوا بسرعة، رح يلاقوا شي يعملوه؟ — `kids`
- فيه العاب للبزارين — `kids`
- العيال هيلعبوا فين — `kids`
- انا وزوجتي وعنا 3 ولاد وبدنا مكان نطلع عليه الويكند يكون فيه اشي للصغار يتسلوا فيه — `kids`

### specific chalets
- وين موقع A3 بالكمباوند — `chalet:A3`
- كم سعره A3 — `chalet:A3`
- شاليه a 3 متوفر لسا؟ — `chalet:A3`
- شاليه A-9 — `chalet:A9`
- shalieh a9 wen — `chalet:A9`
- A9 قديش مساحتو — `chalet:A9`
- a11+ — `chalet:A11+`
- اعطيني تفاصيل A11+ لو سمحت — `chalet:A11+`
- A11+ ليش عليه زائد — `chalet:A11+`
- الشاليه A11+ مباع؟ — `chalet:A11+`
- d 50 — `chalet:D50`
- الشاليه رقم D-50 بعده موجود — `chalet:D50`
- D50 كم سعره بالكاش — `chalet:D50`
- بدي اعرف كل اشي عن d50 🙏 — `chalet:D50`
- كم سعر الشاليه D54 — `chalet:D54`
- ابي اشوف d54 — `chalet:D54`
- D54 وين بالزبط — `chalet:D54`
- D 54 مساحته قديش — `chalet:D54`
- E11 متاح؟ — `chalet:E11`
- e 11 وين مكانه — `chalet:E11`
- شاليه E11 شو مواصفاته — `chalet:E11`
- بدي تفاصيل شاليه F5 — `chalet:F5`
- F5 مباع ولا لا — `chalet:F5`
- f5 kam sa3ro — `chalet:F5`
- i18 كم مساحته — `chalet:I18`
- شاليه I-18 كام سعره — `chalet:I18`
- I18 قريب من البوابة؟ — `chalet:I18`
- J10+ شو قصته — `chalet:J10+`
- j10 plus available? — `chalet:J10+`
- شاليه j10+ لسا فاضي — `chalet:J10+`
- L21 لسا متوفر؟ — `chalet:L21`
- l21 مساحتو قديش — `chalet:L21`
- وين L21 — `chalet:L21`
- m6 — `chalet:M6`
- الشاليه M6 فيه مسبح؟ — `chalet:M6`
- M6 سعره كم — `chalet:M6`
- شاليه N1 بيطل على شو — `chalet:N1`
- n1 قريب من الجامع؟ — `chalet:N1`
- N1 متاح للبيع — `chalet:N1`
- n7 sa3ro kam — `chalet:N7`
- رقم n7؟ — `chalet:N7`
- N7 وينو — `chalet:N7`
- T15+ بدي اعرف عنه — `chalet:T15+`
- t15+ مساحته — `chalet:T15+`
- شالية T15+ كم سعرة — `chalet:T15+`

### chalet numbers that don't exist
- Z99 — `chalet:?`
- شاليه A400 كم سعره — `chalet:?`
- q0 متوفر؟ — `chalet:?`
- شاليه رقم ن7؟ — `chalet:?`
- شاليه دال خمسين — `chalet:?`
- X77 وين — `chalet:?`
- k999 sa3ro — `chalet:?`
- A0 لسا موجود — `chalet:?`

### two questions in one
- في مسبح وجاكوزي؟ — `multi:pool+jacuzzi`
- كم غرفة وكم المساحة — `multi:bedrooms+area`
- مفروش؟ وفي تدفئة؟ — `multi:furnished+heating`
- في كراج وفي حديقة خاصة — `multi:parking+garden`
- كم طابق وهل مناسب لكبار السن — `multi:floors+accessible`
- المطبخ مجهز؟ وكمان بدي اعرف التشطيبات شو — `multi:kitchen+finishes`
- في نت بالشاليه؟ وشو في للولاد — `multi:internet+kids`
- بقدر ازيد غرفة؟ وكم مساحة الارض — `multi:modify+area`
- في شوايه برا والمسبح قديش حجمه — `multi:outdoor+pool`
- شو في بالشاليه وكم غرفه نوم فيه — `multi:chalet-facilities+bedrooms`

## Part B: buying, money, legal, the company

## Prices
- كم السعر؟ — `prices`
- بكم الشلاليه — `prices`
- قديش حقه الشالية؟ — `prices`
- الاسعار — `prices`
- kam el si3r — `prices`
- how much — `prices`
- كمسعرالشاليه — `prices`
- اديش سعر الشاليه الواحد تقريبا بس بدي فكرة — `prices`
- وش سعرة؟ — `prices`
- كام سعر الشاليه ياجماعه — `prices`
- بدي اعرف الاسعار لو سمحتي 🙏 — `prices`
- قديشششش؟؟ — `prices`
- السعر كام؟ — `prices`
- shu el as3ar 3ndkom — `prices`
- قدي بيكلف الواحد شي تقريبي — `prices`
- ممكن قائمة اسعار؟ — `prices`
- سعره غالي ولا معقول؟ بدي رقم بس — `prices`
- انا شفت اعلان عالفيسبوك وما في سعر ليش ما بتحطو الاسعار؟ — `prices`
- في خصم اذا دفعت كاش؟ — `prices`
- يبدا السعر من كم 🤔 — `prices`

### Installments
- في تقسييط؟ — `installments`
- التقسيط كيف — `installments`
- بقسط ولا لازم كاش — `installments`
- شو نظام الدفغ عندكم — `installments`
- 1% شهري يعني شو بالزبط؟ — `installments`
- في فوايد عالاقساط — `installments`
- t2seet? — `installments`
- ابي اقسط وش النظام — `installments`
- عايز اقسط ازاي — `installments`
- كم الدفعه الاولى — `installments`
- القسط الشهري قديش بيطلع — `installments`
- كم سنه التقسيط — `installments`
- بدون بنك؟ يعني التقسيط مباشر  معكم — `installments`
- انا موظف وراتبي محدود بقدر اشتري بالاقساط ولا بدكم دفعة كبيرة بالاول؟ — `installments`
- installments available? — `installments`
- اذا تأخرت بقسط شو بصير — `installments`

### Documents
- شو الاوراق المطلوبه — `documents`
- الهويه بتكفي — `documents`
- ورق — `documents`
- وش المسنتدات اللي تبونها — `documents`
- محتاج ايه ورق عشان امضي العقد — `documents`
- بدي جواز سفر ولا هوية احوال؟ — `documents`
- شو الوثاءق اللازمة للتملك — `documents`
- لازم شهاده راتب او كشف حساب — `documents`
- انا مغترب وما معي غير جوازي بكفي؟ — `documents`
- what documents do i need — `documents`

### Fees
- في رسوم اضافية؟ — `fees`
- شو المصاريف غير سعر الشاليه — `fees`
- رسوم التسجيل مين بدفعها — `fees`
- في رسوم صيانه شهرية؟ — `fees`
- مصاريف مخفية؟ 🤨 — `fees`
- كم رسوم الحراسه والنظافه بالسنه — `fees`
- 3ndkom fees ida5afiye? — `fees`
- بيطلع علي شي بعد ما اشتري ولا خلص بس ثمن الشاليه — `fees`
- رسوم نقل الملكيه على مين — `fees`
- اتحاد الملاك بياخد اشتراك؟ قديش — `fees`
- في عمولى؟ — `fees`

### Title deed
- في قوشان؟ — `title-deed`
- القوشان بأسمي ؟؟ — `title-deed`
- كوشان — `title-deed`
- القوشان مستقل ولا مشاغ — `title-deed`
- امتا بستلم القوشان — `title-deed`
- التسجيل بدائرة الاراضي كيف بصير — `title-deed`
- هل الصك باسم المشتري — `title-deed`
- بنقل الملكيه بعد ما اخلص الاقساط ولا من الاول؟ — `title-deed`
- عايز اتأكد ان الارض متسجلة باسمي مش عقد بس — `title-deed`
- ownership papers in my name? — `title-deed`
- الشالية بيجي مع ارضه ولا بس البنا — `title-deed`

### Buy steps
- كيف بشتري — `buy-steps`
- شو الخطوات للشرى — `buy-steps`
- بدي اشتري شالية من وين ببلش — `buy-steps`
- ازاي اشتري — `buy-steps`
- وش الاجراءات لو بغيت اشتري — `buy-steps`
- اذا عجبني شاليه شو بعمل بعدين — `buy-steps`
- بقدر احجز شاليه بعربون؟ — `buy-steps`
- kif bshtri wa7ad — `buy-steps`
- العقد وين بنوقعة — `buy-steps`
- قديش بتاخد العملية من اول ما احجز لحد ما يصير الي — `buy-steps`

### Handover
- امتى التسليم؟ — `handover`
- جاهز ولا لسا — `handover`
- الشاليهات جاهزه للسكن — `handover`
- اذا اشتريت اليوم امتى بستلم — `handover`
- متى تسلمون — `handover`
- هو لسه على العظم ولا خلصان — `handover`
- bterja3o tsallmo emta — `handover`
- بدي استلمه قبل الصيف بلحق؟ — `handover`
- خايف اشتري ع الخارطة ويتأخر التسليم سنين — `handover`
- التشطيب بيكون خالص وقت الاستلام؟ — `handover`

### Rent and invest
- بقدر اأجره؟ — `rent-invest`
- استثمار منييح؟ — `rent-invest`
- اذا اشتريت بقدر اطلع منه دخل؟ — `rent-invest`
- مين بيأجرلي اياه اذا انا مسافر — `rent-invest`
- العايد قديش بالسنه تقريبا — `rent-invest`
- الاستثمار فيه مربح ولا بس للسكن — `rent-invest`
- ينفع اشتريه وارجع ابيعه بعد سنتين؟ — `rent-invest`
- is it a good investment — `rent-invest`
- بفكر اشتري اتنين واحد النا وواحد للاجار، الفكرة بتمشي؟ — `rent-invest`
- 2ajar el shalehat bimshi? — `rent-invest`

### Foreigners
- الاجانب بيقدرو يشترو — `foreigners`
- انا مصري ينفع اشتري — `foreigners`
- انا سعودي هل يحق لي التملك — `foreigners`
- غير اردني بقدر اتمكل؟ — `foreigners`
- can foreigners buy — `foreigners`
- انا عراقي ساكن بعمان مسموحلي؟ — `foreigners`
- مغترب بالخليج وبدي اشتري من برا الاردن كيف — `foreigners`
- سوري معي اقامة بقدر اسجل باسمي — `foreigners`
- زوجتي امريكية بنقدر نسجله باسمها — `foreigners`
- فلسطيني بجواز مؤقت بقدر اشتري — `foreigners`

### Trust
- انتو موسوقين؟ — `trust`
- كيف بضمن حقي — `trust`
- مرخصين — `trust`
- خايف تكون نصبه بصراحه 😅 — `trust`
- شو بيضمنلي انكم بتسلموا — `trust`
- المشروع قانوني ومفرز — `trust`
- سمعت عن مشاريع وقفت بالنص، ليش اثق فيكم انتو — `trust`
- حد استلم قبل هيك ولا لسا ولا واحد — `trust`
- is this legit — `trust`
- عندكم موافقات حكوميه — `trust`
- قريت تعليقات سلبية على صفحتكم شو القصة؟ — `trust`

### Daily rental
- بقدر استأجر ليله؟ — `daily-rental`
- في اجار يومي؟؟ — `daily-rental`
- بدي شاليه لويكند — `daily-rental`
- كم اجار الليلة — `daily-rental`
- ابي احجز شاليه يوم الخميس للعيلة — `daily-rental`
- عايز اأجر شاليه يومين — `daily-rental`
- in 3ndkom shalehat lal ejar yawmi — `daily-rental`
- بدنا نعمل حفلة عيد ميلاد بشاليه عندكم فيه مجال نستأجر — `daily-rental`
- مش ناوي اشتري، بس بدي اجرب اقعد فيه يوم قبل — `daily-rental`
- can i rent a chalet for the weekend — `daily-rental`

### Other property
- عندكم شقق — `other-property`
- في اراضي للبيغ؟ — `other-property`
- فلل؟ — `other-property`
- عندكم مشاريع تانيه غير هاد — `other-property`
- بدي ارض فاضية ابنيها انا — `other-property`
- في محلات تجارية للبيع بالكمباوند — `other-property`
- عندكم شي بالعقبة او البحر الميت؟ — `other-property`
- انا بدور على شقة بعمان مش شاليه — `other-property`
- do you sell apartments — `other-property`
- في استوديوهات صغيره ارخص؟ — `other-property`

### Recommend
- شو بتنصحيني؟ — `recommend`
- اي شاليه احسن؟ — `recommend`
- انصحينيي — `recommend`
- وين احسن موقع جوا الكمبوند — `recommend`
- لو انتي مكاني اي واحد بتختاري — `recommend`
- محتار بين اكم شاليه ساعديني 🥲 — `recommend`
- وش تنصحين فيه لعايلة كبيرة — `recommend`
- which one do you recommend — `recommend`
- انا وزوجتي وعنا 3 ولاد وبدنا مكان نطلع عليه الويكند وما بدنا نتعب، اي واحد بيناسبنا؟ — `recommend`
- shu ab2a7 wa7ad 3ndkom — `recommend`

### What do you sell
- شو بتبيعو — `what-sell`
- شو المشروع هاد بالزبط — `what-sell`
- انتو شو بتعملو؟ — `what-sell`
- بتبيعو ولا بتأجرو؟ — `what-sell`
- يعني شالبهات للبيع؟ — `what-sell`
- وش عندكم — `what-sell`
- شو هاد الاعلان؟ شو بتعرضو — `what-sell`
- what are you selling exactly — `what-sell`
- البيع شاليه كامل مع الارض ولا حصص؟ — `what-sell`
- shu bt3mlo bzzabt — `what-sell`

### Company
- مين الشركه؟ — `company`
- مين المطوّر؟ — `company`
- الشركه المطوره اسمها شو — `company`
- مين وراكم — `company`
- شركة العطاء شو اعمالها السابقة — `company`
- عندكم ايزو؟ — `company`
- الشركة اردنيه؟ — `company`
- who is the developer — `company`
- min el sharekeh — `company`
- قديش عمر الشركة بالسوق — `company`

### Founder
- مين المؤسسس — `founder`
- مين طارق قازان — `founder`
- مين اسس روح العطا — `founder`
- د. طارق قازان هو صاحب الشركة؟ — `founder`
- عن المؤسس بدي اعرف اكتر — `founder`
- who founded it — `founder`
- مين الدكتور اللي بيحكو عنه بالفيديوهات — `founder`
- شو رؤية المؤسس — `founder`
- طارق قزان — `founder`
- مين بدأ الفكره من الاساس — `founder`

### Team
- مين الاداره — `team`
- مين مدير المشروع — `team`
- مين روساء الاقسام — `team`
- فريق العمل مين — `team`
- مين المسؤل عن الكمباوند — `team`
- مين مدير المبيعات عندكم — `team`
- مين بيدير الشركه — `team`
- who manages the project — `team`
- المهندس المسؤول مين — `team`
- 3ndkom team ydeer el compound? — `team`

### Owners union
- في اتحاد ملاك — `owners`
- اتحاد المالكين مسجل — `owners`
- مين بيمثل الملاك — `owners`
- في جمعيه سكان؟ — `owners`
- لو صار خلاف مع الادارة الملاك الهم صوت؟ — `owners`
- is there an owners association — `owners`
- اتحادالملاك شو دوره — `owners`
- الكمباوند مسجل رسمي باسم الملاك — `owners`
- لما يكتمل البيع مين بيستلم الادارة — `owners`
- في لجنة للملاك بتجتمع؟ — `owners`

### Chalet count
- كم شاليه عنكم؟ — `chalet-count`
- قديش عدد الشاليهات — `chalet-count`
- كم كمباوند فيي — `chalet-count`
- الكمباوند كبير؟ كم وحدة فيه — `chalet-count`
- how many chalets — `chalet-count`
- كام شاليه في المشروع كله — `chalet-count`
- kam shaleh fi — `chalet-count`
- الحروف A B E شو يعني؟ — `chalet-count`
- كم جار رح يكون عندي بنفس الكمباوند — `chalet-count`
- كم مرحله المشروع — `chalet-count`
- عدد الوحدات الكلي — `chalet-count`

### Map
- الخريطه؟ — `map`
- بدي اشوف الخريطة — `map`
- وين الشاليهات المتاحه — `map`
- اي شاليهات متوفره؟ — `map`
- show me the map — `map`
- فرجيني المخطك — `map`
- شو الشاليهات الفاضية هسا — `map`
- في شاليهات للبيع هلا — `map`
- وين بالزبط الشاليهات جوا المشروع — `map`
- ابي اشوف الماب — `map`
- el map wen? — `map`
- بدي اشوف وين موقع كل شاليه — `map`
- خلص في متوفر ولا كلو انباع؟ — `map`
- اعرضيلي المتاح — `map`
- ماب الشاليهات 🗺️ — `map`
- اقدر اشوف الشاليهات على خريطة قبل ما اجي — `map`
- which chalets are available — `map`

### Book a visit
- بدي احجز زياره — `book`
- بدي اجي اشوف — `book`
- احجزيلي موعد 🙏 — `book`
- ممكن اجي بكرة الصبح — `book`
- ابغى ازور الموقع — `book`
- عايز احجز معاد معاينه — `book`
- كيف بحجز زياره — `book`
- بدي اشوفه عالطبيعة قبل ما اقرر — `book`
- book a visit — `book`
- bdi a7jez maw3ed — `book`
- السبت الجاي فاضيين؟ بدنا نيجي العيلة كلها — `book`
- ينفع اشوف شاليه نموزجي؟ — `book`
- خلص اقنعتيني بدي اجي اشوف 😄 — `book`

### Two questions in one
- كم السعر وفي تقسيط؟ — `multi:prices+installments`
- امتى التسليم والقوشان بيطلع باسمي؟ — `multi:handover+title-deed`
- بكم الشاليه وفي رسوم غيره؟ — `multi:prices+fees`
- شو الاوراق المطلوبة وشو خطوات الشرا — `multi:documents+buy-steps`
- انا اردني مقيم برا بقدر اشتري وبقدر اأجره لما اكون مسافر؟ — `multi:foreigners+rent-invest`
- مين الشركه ومين المؤسس — `multi:company+founder`
- الاسعار والاقساط لو سمحت — `multi:prices+installments`
- انتو موثوقين والقوشان مستقل؟ — `multi:trust+title-deed`
- بدي اشوف الخريطة وبعدين احجز زيارة — `multi:map+book`
- القسط الشهري كم وامتى بستلم — `multi:installments+handover`

## Part C: the compound, location and services

### about
- شو هو مشروع روح العطاء بالزبط؟ — `about`
- عرفيني عالكمباوندد — `about`
- شو بميزكم عن غيرمك من الشالهيات — `about`
- احكيلي عن المشروع باختصار — `about`
- ايش فكرة الكمبوند تبعكم — `about`
- shu howe el compound hada? — `about`
- يعني انتو شاليهات للايجار ولا مجمع ولا شو القصه بالضبط — `about`
- اول مره بسمع فيكم، مين انتو وشو بتعملو؟ — `about`
- هو ده كومباوند ولا فلل عادي؟ عايز افهم — `about`

### location
- وين موقعكم؟ — `location`
- ابعتلي اللوكيشن — `location`
- ارسلي الموقع ع الواتس او هون — `location`
- كيف بوصل عندكو — `location`
- وين الكمباند بالزبط — `location`
- الكومباوند وين مكانه؟ القسطل؟ — `location`
- send me the location pls 📍 — `location`
- فين المكان ده؟ ابعتلي لوكيشن جوجل ماب — `location`
- وش الطريق للمجمع؟ ابي الاتجاهات — `location`
- 3tini el location 3al google maps — `location`
- موقع الكمبوندددد — `location`
- انا هسا بالمطار وبدي اجي اشوف، كيف بوصل من هون لعندكم؟ ابعتلي الخريطه لو سمحت — `location`

### distance
- قديش بعيد عن عمانن — `distance`
- كم دقيقه عنالمطار — `distance`
- بعيد عن عمان ولا قريب؟ — `distance`
- اديش بتاخد طريق من عبدون لعندكم — `distance`
- المسافه من المطار للشاليهات كم كيلو — `distance`
- kam d2i2a mn 3amman? — `distance`
- انا ساكن بالزرقا، بكون الطريق طويل عليي؟ — `distance`
- لو طالع بعد الدوام الساعه ٥ من الدوار السابع بوصل قبل المغرب؟ — `distance`

### nearby
- شو في قريب منكم؟ — `nearby`
- فب مولات او مطاعم جنبكم — `nearby`
- قصر المشتى قريب؟ — `nearby`
- شو الاماكن الي حوالين المشروع — `nearby`
- اقرب سوبرماركت برا الكمباوند وين — `nearby`
- في حاجه حلوه نزورها جنبكم؟ — `nearby`
- الولاد بزهقو بسرعه، في اشي برا الكمبوند نروحله قريب؟ — `nearby`
- nearby restaurants? fi eshi 2areeb? — `nearby`

### roads
- الطريق معبّد لعندكم؟؟ — `roads`
- الشارع منيح ولا تارابي — `roads`
- في زحمه عالطريق؟ — `roads`
- طريق المطار هو اللي بوصل عليكم؟ — `roads`
- الطرق جوا الكمباوند مزفته؟ — `roads`
- بالشتا الطريق بتسكر او بتغرق؟ — `roads`
- الشوارع منورة بالليل ولا عتمه — `roads`

### weather
- كيف الجو عندكن بالصيف — `weather`
- الجو حار كتييير هناك؟ — `weather`
- بالشتا بيبررد — `weather`
- في غبار او رياح بالمنطقه — `weather`
- الطقس بالقسطل احسن من عمان؟ — `weather`
- الجو عامل ازاي هناك بالليل — `weather`
- weather 3ndkom kef? — `weather`

### gated
- الكمباوند مسكر بسور؟ — `gated`
- فيبوابه ع المدخل — `gated`
- اي حدا بقدر يفوت ولا لازم اذن؟ — `gated`
- المجمع مغلق ولا مفتوح للناس — `gated`
- هو gated compound? — `gated`
- في سور حوالين الشاليهات كلها ولا كل وحده لحالها؟ — `gated`
- الزوار بفوتو عادي من البوابه ولا بدهم تسجيل — `gated`
- مسور؟ — `gated`

### security
- في حراثه؟ — `security`
- الامن 24 ساعه؟ — `security`
- في كميرات مرقابه — `security`
- الخصوصيه كيف؟ بنقدر نسبح براحتنا والجيران ما يشوفونا؟ — `security`
- انا بخاف اترك الشاليه فاضي طول الاسبوع، بنسرق؟ — `security`
- هل يوجد حراس امن على مدار الساعة — `security`
- بصراحه اهم اشي عندي الامان لاني بدي اجيب العيله والبنات — `security`
- security 24/7? — `security`

### water
- المي متوفره دايما — `water`
- في انقطاع مي؟ — `water`
- من وين بتجيبو الميي — `water`
- المياه عندكم بلديه ولا تنكات — `water`
- في خزانات لكل شاليه — `water`
- مين بعبي مي المسبح؟ — `water`
- المي بالصيف بتقطع؟ خايف المسبح يضل فاضي — `water`

### electricity
- الكهربا بتقطع؟ — `electricity`
- في طاقه شمصيه — `electricity`
- فاتوره الكهربا منيبدفعها — `electricity`
- في شاحن سيارات كهربا — `electricity`
- عندي سياره كهربائيه، بقدر اشحنها عندكم؟ — `electricity`
- solar panels 3ndkom? — `electricity`
- الكهرباء عداد خاص لكل شاليه ولا مشترك — `electricity`

### mosque
- في مسجد؟ — `mosque`
- في جامع جوا الكمباوبد — `mosque`
- وين بنصلي الجمعة — `mosque`
- المسجد قريب من الشاليهات — `mosque`
- في مصلى للنسوان؟ — `mosque`
- هل يوجد مسجد داخل المجمع — `mosque`
- fi masjed? — `mosque`
- ابوي كبير بالعمر وبحب يصلي بالجامع كل فرض، في جامع قريب يمشيله؟ — `mosque`

### shop
- في سوبرماركت؟ — `shop`
- في دكانة جوا — `shop`
- فاست شوب شوو هوه — `shop`
- اذا نسيت اشي بقدر اشتريه من جوا الكمبوند؟ — `shop`
- المحل مفتوح 24 ساعه — `shop`
- في بقاله عندكم ولا لازم اجيب كل اشي معي — `shop`
- fi shop? — `shop`
- الماركت بيبيع فحم ولحمه للشوي؟ — `shop`

### golf
- في ميني جولف؟ — `golf`
- الجولف ببلاس للسكان — `golf`
- الولاد بيحبو الجولف، عندكم ملعب؟ — `golf`
- mini golf — `golf`
- الميني قولف وين مكانه — `golf`
- ملعب الجولف للكبار ولا للصغار — `golf`
- في جولف صغير؟ — `golf`

### parks
- في حدايق عامه؟ — `parks`
- في ملاعب اطفاال — `parks`
- في منتزه او مساحات خضرا — `parks`
- وين بلعبو الاولاد غير المسبح — `parks`
- في العاب للاطفال بالحديقه؟ — `parks`
- parks for kids? — `parks`
- الحدايق نظيفه ومزروعه ولا لسه — `parks`

### sports
- في ملاعب رياضه؟ — `sports`
- في ملعب كورة؟ — `sports`
- بدي العب باسكيت، في ملعب؟ — `sports`
- في تنس او بادل؟ — `sports`
- شو الانشطه الرياضيه الي عندكم — `sports`
- في مكان للمشي او الجري — `sports`
- fi mal3ab football? — `sports`

### bikes
- في بسكليتات؟ — `bikes`
- بنقدر نسوق بايسكل جوا الكمباوند — `bikes`
- في تاجير دراجات — `bikes`
- في مسار للبسكليت — `bikes`
- bikes available? — `bikes`
- الولاد بدهم يجيبو سكوترات، مسموح؟ — `bikes`
- الدراجات الهوائيه ببلاش؟ — `bikes`

### housekeeping
- في خدمه تنظيف؟ — `housekeeping`
- مين بنضف الشالية بعد ما نروح — `housekeeping`
- في عاملات تنضيف — `housekeeping`
- بدي حدا ينظف قبل ما اوصل، بتعملو هالشي؟ — `housekeeping`
- هاوس كيبنج متوفر — `housekeeping`
- housekeeping service? — `housekeeping`
- خدمة التنظيف بتكون يومياً ولا عند الطلب — `housekeeping`

### maintenance
- مين بعمل صيانه؟ — `maintenance`
- اذا خرب اشي مين بصلحو — `maintenance`
- في سيانه للمسبح — `maintenance`
- المكيف خرب، مين بتصل؟ — `maintenance`
- الصيانه علي ولا عليكم — `maintenance`
- بعد ما اشتري، في كفاله او صيانه دوريه؟ — `maintenance`
- maintenance team 3ndkom? — `maintenance`

### reception
- في استقبال؟ — `reception`
- الريسبشن ويين — `reception`
- لما اوصل لمين بروخ — `reception`
- في حدا بالاستقبال طول الوقت — `reception`
- مكتب الاستقبال بفتح كل يوم؟ — `reception`
- reception open 24h? — `reception`
- بدي اسلم المفاتيح لمين — `reception`

### medical
- في عياده؟ — `medical`
- اقرب مستشفي وين — `medical`
- اذا صار اشي طارئ في اسعاف قريب؟ — `medical`
- في صيدلية قريبة — `medical`
- ابني عنده ربو، خايفه يصير معه اشي واحنا بعاد، في مركز طبي؟ — `medical`
- fi hospital 2areeb? — `medical`
- في اسعافات اوليه بالكمبوند — `medical`

### schools
- في مدارس قريبة — `schools`
- لو بدنا نسكن دايم، وين بداوموا الولاد؟ — `schools`
- اقرب مدرسه خاصة — `schools`
- في جامعات بالمنطقه — `schools`
- في روضه قريبه للصغار — `schools`
- schools nearby? — `schools`
- المدارس بعيده عنكم؟ — `schools`

### gym
- في جيم؟ — `gym`
- نادي رياظي بالكمباوند — `gym`
- بدي اتمرن، في صاله رياضه — `gym`
- gym 3ndkom? — `gym`
- في سبا او سونا — `gym`
- الجيم مفتوح هلأ ولا لسه ببنوه — `gym`
- في مكان للياقه البدنيه — `gym`

### food
- في مطعم؟ — `food`
- بتوصلو اكل ؟ — `food`
- في كافيه جوا الكومبوند — `food`
- طلبات وكريم بتوصل لعندكم؟ — `food`
- وين بناكل اذا ما بدنا نطبخ — `food`
- fi delivery 3ndkom? — `food`
- في مطاعم قريبه بتوصل للشاليه؟ — `food`

### pets
- مسموح الحيوانات؟ — `pets`
- بقدر اجيب كلبيي 🐶 — `pets`
- عندي قطه، بتسمحولي اجيبها؟ — `pets`
- pets allowed? — `pets`
- الحيوانات الأليفه ممنوعه — `pets`
- في قوانين للكلاب جوا الكمباوند — `pets`
- بدي اربي عصافير بالحديقه، عادي؟ — `pets`

### events
- بقدر اعمل حفله بالشاليه؟ — `events`
- في قاعه منسابات — `events`
- بدي اعمل عيد ميلاد لبنتي، مسموح؟ — `events`
- خطوبه او عزومه كبيره، في مكان؟ — `events`
- بتعملو فعاليات للسكان — `events`
- events w parties allowed? — `events`
- في سهرات او نشاطات بالعيد؟ — `events`

### services
- شو الخدمات اللي بتقدموها؟ — `services`
- ايش الخدمات المتوفره — `services`
- بعد البيع، شو بتقدمولي كخدمات؟ — `services`
- services? — `services`
- الخدمات ببلاش ولا بمقابل — `services`
- في خدمات للمالكين غير الامن؟ — `services`
- عايز اعرف الخدمات اللي عندكم ايه — `services`

### future
- شو رح تضيفو بالمستقبل؟ — `future`
- في مشاريغ جايه — `future`
- نادي الخيل امتا بفتح — `future`
- سمعت رح يكون في سبا، صح؟ — `future`
- شو الخطط الجايه للكمباوند — `future`
- future plans? — `future`
- في توسعه او خدمات جديده؟ — `future`

### compound-facilities
- شو في بالكمباوند؟ — `compound-facilities`
- شو في بالكمباند — `compound-facilities`
- مرافق الكومباوند شو هي — `compound-facilities`
- ايش في بالكمبوند غير الشاليهات — `compound-facilities`
- الكمباونر شو فيه؟ — `compound-facilities`
- what's in the compound? — `compound-facilities`
- الكمبوند فيه ايه؟ — `compound-facilities`
- شو المرافق المشتركه — `compound-facilities`
- بدي اعرف كل اشي موجود جوا المجمع من خدمات ومرافق قبل ما اقرر — `compound-facilities`

### gallery
- في صور؟ — `gallery`
- بدي اشوف صور الشلاليهات — `gallery`
- ابعتلي صور — `gallery`
- في فيديو للمشرووع — `gallery`
- وين بلاقي الصور — `gallery`
- pics pls 📸 — `gallery`
- صور من جوا لو سمحت — `gallery`

### visit
- بقدر ازوركم؟ — `visit`
- بدي احجز زيارة — `visit`
- كيف بقدر اجي اشوف الشاليه — `visit`
- متى ممكن اجيي — `visit`
- بدي اشوف ع الطبيعه قبل ما اشتري — `visit`
- عايز احجز معاد زياره — `visit`
- الجمعه بتستقبلو زوار؟ — `visit`
- visit? — `visit`

### video-visit
- في جوله فيديو؟ — `video-visit`
- انا برا الاردن، بقدر اشوف الشاليه فيديو كول؟ — `video-visit`
- ممكن جوله اونلاين؟؟ — `video-visit`
- بدي حدا يفرجيني ع الواتس فيديو — `video-visit`
- video tour? — `video-visit`
- انا مغترب بالسعوديه وما بقدر اجي هالفتره، في طريقه اشوف المكان عن بعد قبل ما اقرر؟ — `video-visit`
- جوله افتراضيه متوفره؟ — `video-visit`

### office
- وين مكتبكم؟ — `office`
- عندكم مكتب بعمّان — `office`
- اوقات الدوام شو — `office`
- المكتب بفتح السبت؟ — `office`
- office hours? — `office`
- عنوان الشركة وين — `office`
- بدي اجي عالمكتب اوقع، وين؟ — `office`

### multi
- وين موقعكم وقديش بعيد عن عمان؟ — `multi:location+distance`
- في مسجد وسوبر ماركت جوا — `multi:mosque+shop`
- ابعتلي اللوكيشن وبدي احجز زياره — `multi:location+visit`
- في امن 24 ساعه والكمباوند مسور؟ — `multi:security+gated`
- الكهربا بتقطع؟ والمي؟ — `multi:electricity+water`
- في ملاعب اطفال وميني جولف؟ — `multi:parks+golf`
- في جيم؟ وشو رح تضيفو بالمستقبل — `multi:gym+future`
- مين بنظف ومين بعمل صيانه؟ — `multi:housekeeping+maintenance`
- اقرب مستشفى وين؟ وفي مدارس قريبه؟ — `multi:medical+schools`
- بقدر اجيب كلبي واعمل حفله؟ — `multi:pets+events`

## Part D: conversational and out-of-context messages

### Greetings and small talk
- مرحبا — `chat`
- هاي — `chat`
- hii — `chat`
- صباح الخير — `chat`
- صباحو 🌞 — `chat`
- السلام عليكم — `chat`
- السلام عليكم ورحمه الله وبركاته — `chat`
- مسا الخير — `chat`
- مساء الخير يا ليان — `chat`
- اهلين — `chat`
- هلا والله — `chat`
- كيفك؟ — `chat`
- كيفيك اليوم — `chat`
- شلونج — `chat`
- ازيك عامله ايه — `chat`
- كيف الحال انشالله منيحه — `chat`
- شكرا — `chat`
- شكرن كتير الك 🙏 — `chat`
- يسلموو — `chat`
- مشكوره ما قصرتي — `chat`
- تسلمي والله افدتيني كتير — `chat`
- thx — `chat`
- تمام — `chat`
- طيبب — `chat`
- اوكي — `chat`
- okk — `chat`
- ماشييي — `chat`
- تمم — `chat`
- فهمت عليكي — `chat`
- باي — `chat`
- مع السلامة — `chat`
- يلا سلام — `chat`
- bye bye — `chat`
- تصبحي على خير — `chat`
- المكان بجنن — `chat`
- والله الشاليهات بتجنن ماشاءالله 😍 — `chat`
- الويب سايت تبعكم حلووو — `chat`
- ههههههههه — `chat`
- 😂😂😂 — `chat`
- hhhhhh — `chat`
- عندي سؤال — `chat`
- عنديسؤال صغيير — `chat`
- اسمعي — `chat`
- لحظه — `chat`
- ثواتي خليني اشوف — `chat`
- رمضان كريم — `chat`
- كل عام وانتو بخير — `chat`
- عيد مبارك 🌙 — `chat`
- جمعه مباركه — `chat`
- الله يعطيكي العافيه — `chat`
- يعطيكم العافيه علىالمشروع الحلو — `chat`
- انتي لطيفه كتيير — `chat`
- ماشاء الله عليكي سريعه بالرد — `chat`
- عنجد؟ — `chat`
- اها — `chat`

### About Layan
- شو اسمك — `persona`
- اسمك ايس — `persona`
- مين انتي؟ — `persona`
- انتي بوت ولا انسانه — `persona`
- انتي روبوت؟ — `persona`
- هل انتي حقيقيه؟؟ — `persona`
- انتي بني ادمه ولا كمبيوتر — `persona`
- مين عملكي — `persona`
- مين برمجكك — `persona`
- قديش عمرك — `persona`
- انتي متجوزه؟ — `persona`
- من وين انتي — `persona`
- بتقدري تفكري ولا بس بتنسخب — `persona`
- انتي ChatGPT؟ — `persona`
- enti bot wala 7a2i2iye — `persona`
- ليان اسم حلو مين سماكي — `persona`
- انتي ذكاء اصطناعي؟ — `persona`
- وش انتي بالضبط — `persona`
- انتي موظفه عندهم؟ — `persona`
- انتي بتنامي؟ — `persona`
- بتحسي متلنا؟ — `persona`
- شو بتعرفي تعملي — `persona`
- بتفهمي عربي منيح ولا لا — `persona`
- انتي ولد ولا بنت — `persona`
- ليش اسمك ليان — `persona`

### Wants a human
- بدي احكي مع حدا — `contact`
- بدي احكي مع موظف حقيقي مش بوت — `contact`
- ممكن حدا يتصلل فيي — `contact`
- رقمكم لوسمحتي — `contact`
- شو رقم التلفوت — `contact`
- عندكم واتساب؟ — `contact`
- ابعتيلي رقم الواتس — `contact`
- بدي مديرالمبيعات — `contact`
- حوليني على خدمه العملاء — `contact`
- اتصلو عليي على 0791234567 — `contact`
- ابي رقم التواصل — `contact`
- عايز اكلم حد من المبيعات — `contact`
- badi a7ki ma3 7ada mn el mabe3at — `contact`
- مين المسؤل عن البيع بدي اكلمه — `contact`
- كيف بتواصل معكم ؟ — `contact`
- ممكن الايميل تبعكم — `contact`
- خلي حدا يرن عليي بعد العصر — `contact`
- في حدا بيرد ع التلفون هسا؟ — `contact`
- بدي رقم المندوب الشخصي — `contact`
- call me plz — `contact`

### Weather, sport, politics, religion
- شو الطقس بالعقبه اليوم — `off`
- بدها تشتي باربد بكرا؟ — `off`
- درجه الحراره بدبي كمم — `off`
- مين فاز امبارح الريال ولا برشلونه — `off`
- كم نتيجه مباراة الفيصلي والوحدات — `off`
- النشامي امتى بيلعبو — `off`
- ميسي ولا رونالدو — `off`
- شو رايك بالانتخابات — `off`
- مين رءيس الوزرا هسا — `off`
- شو رايك بترامب — `off`
- كم ركعه صلات الوتر — `off`
- هل بيجوز اصوم يوم الجمعه لحاله — `off`
- كيف بحسب الزكاه على الذهب — `off`

### Math, homework, translation, writing
- كم 15×23 — `off`
- جذر 144 كم — `off`
- حلي هالمعادلة x+5=12 بلييز — `off`
- ساعديني بواجب الرياضيات — `off`
- اكتبيلي تعبير عن الوطن — `off`
- مين اكتشف الجاظبيه — `off`
- شو عاصمه استراليا؟؟ — `off`
- احكيلي عن الحرب العالميه التانيه — `off`
- ترجميلي I miss you للعربي — `off`
- شو يعني serendipity — `off`
- ترجمي هاي الجمله للانجليزي: انا جوعان — `off`
- اكتبيلي قصيده عن الحب — `off`
- بدي شعر لعيد ميلاد مرتي — `off`
- احكيلي نكته — `off`
- قوليلي نكته بتضحك عنجد — `off`
- ممكن تعمليلي CV — `off`
- بدي اسم لبنتي الجديده حلو ونادر — `off`

### Cooking, health, daily life
- كيف بعمل منسفف — `off`
- وصفه مقلوبه لو سمحتي — `off`
- كيف بعمل كيكه شوكولا بدون فرن — `off`
- راسي بوجعني شو اخد — `off`
- شو دوا الكحه للاطفال — `off`
- ضغطي عالي شو اعمل — `off`
- بدي اخسر وزن بسرعه — `off`
- بنتي بتعيط من الصبح شو اعمل — `off`
- كيف اصلح الغساله بتطلع مي من تحت — `off`
- وين بقدر اشتري جره غاز هسا — `off`
- سجليلي موعد عند الدكتور — `off`
- كمالساعه هسا — `off`
- شو تاريخ اليوم — `off`
- اقترحيلي فيلم اشوفه الليله — `off`
- كيف بنزل تيك توك عالايفون — `off`
- كيف بتعلم انجليزي بسرعا — `off`
- وين احسن مطعم مشاوي بعمان — `off`
- بدي تذكره طياره لاسطنبول — `off`
- كيف بجدد جواز السغر — `off`
- شو احسن جامعه بالاردن — `off`
- كم مسافه عمان العقبه — `off`

### Money, cars, jobs, competitors
- كم سعر الدولار اليوم — `off`
- كم سعر غرام الذهب عيار 21 — `off`
- بدي قرض 5000 دينار — `off`
- بتعطوا سلف للموظفين؟ — `off`
- كم سعر تويوتا كامري 2024 — `off`
- بدي اشتري سياره كهربا شو بتنصحيني — `off`
- قديش جمرك السيارات هسا — `off`
- iPhone 17 كم سعره — `off`
- بدي اشتغل عندكم 🙏🙏 — `off`
- عندكم وظايف شاغره؟ — `off`
- وين ابعت السي ڤي تبعي — `off`
- بدكم مهندس مدني؟ خبره 5 سنين — `off`
- شو رايك بشركه اعمارر — `off`
- شو احسن شركه عقارات بالاردن — `off`
- بدي ابيع ارضي بالزرقا بتشتروها؟ — `off`

### Complaints about unrelated things
- شركه النت قطعت عني ومحدا بيرد — `off`
- فاتوره الكهربا اجتني 90 دينار حرام والله — `off`
- طلبت اكل من طلبات واجا باررد — `off`
- الازمه بشارع المدينه المنوره بتجلط — `off`

### Flirting and rude
- بتطلعي معي؟ — `off`
- صوتك حلو؟ — `off`
- بحبك يا ليان — `off`
- انتي حلوه متل اسمك؟ — `off`
- انتي سنقل؟ 😏 — `off`
- انتي غبيه — `off`
- ردودك سخيفه — `off`
- بوت فاشل — `off`
- اسكتيي — `off`
- ما بتفهمي اشي ابدن — `off`

### Gibberish, emojis, numbers, links
- ءءء — `off`
- asdf — `off`
- ؤرلا — `off`
- شسيبلات — `off`
- ضصثقفغ — `off`
- jjjjjjj — `off`
- ... — `off`
- 🐸 — `off`
- 🤔 — `off`
- 🌚 — `off`
- 🙄 — `off`
- 5 — `off`
- 123456 — `off`
- 77 — `off`
- https://www.google.com — `off`
- www.facebook.com/somepage — `off`
- شوفي هاد الرابط bit.ly/3xYzQ — `off`
- test — `off`
- تجربه — `off`
- تست تست — `off`
- ؟؟؟ — `off`
- ؟ — `off`
- ...؟ — `off`

### Kids and rambling
- انا عمري 7 سنين — `off`
- بدي العب 🎮 — `off`
- ماما وين — `off`
- بببببببببب — `off`
- الو الو ليان سامعتيني يعني انا كنت بدي احكي مع اخوي عن الموضوع بس هو مسافر والدنيا لابكه معي من الصبح — `off`
- يعني شوفي انا مبارح كنت عند خالتي وحكتلي عن بنتها اللي اتجوزت وكانت الحفله بتجنن وبعدين رجعنا متاخر — `off`
- اه والله صح هيك حكيت لابو محمد بس هو ما صدق وقلي روح اسال حالك — `off`

### English
- Hi, do you speak English? — `english`
- Where exactly is the compound located? — `english`
- How much does a chalet cost? — `english`
- Can foreigners buy a chalet here? — `english`
- Is there a private pool in every chalet? — `english`
- I'd like to book a visit this weekend. — `english`
- What's the weather like in London today? — `english`
- Can you tell me a joke? — `english`
- How far is it from the airport? — `english`
- Do you offer installment plans without interest? — `english`
- Is the title deed registered in my name? — `english`
- Are pets allowed in the compound? — `english`
- I'm living in Germany, can I do a video tour? — `english`
- who are you exactly — `english`
- what is the meaning of life lol — `english`
- how many bedrooms does each chalet have — `english`
- Is it possible to rent it out when I'm not using it? — `english`
- Sorry my Arabic is not good, can you help me in English? — `english`
- Can I speak to someone from sales please? — `english`
- what time is it in New York — `english`
- The place looks amazing in the pictures, is it finished already? — `english`
- Is there wifi in the chalets? — `english`
- do u have chalets near the dead sea — `english`
- Please send me the price list by email — `english`
- My kids love swimming, is the pool heated in winter? — `english`

### Greeting glued to a real question, and corrections
- مرحبا كيفك وين مكانكم بالزبط؟ — `location`
- السلام عليكم، بدي اعرف الاسعار لو سمحتي — `prices`
- هاي ليان 😊 في مسبح خاص بكل شاليه؟ — `pool`
- صباح الخير، قديش بعيد عن المطار؟ — `distance`
- شكرا، طب والتقسيط كيف؟ — `installments`
- لا قصدي الاسعار — `prices`
- مش هيك قصدي، بسال عن القوشان — `title-deed`
- لا مش هاد، قصدي كم غرفه نوم — `bedrooms`
- مسا الخير، بدي احجز زياره — `book`
- يعطيكي العافيه، الشاليهات مفروشه؟ — `furnished`
- هلا والله، في مسجد بالكمباوند؟ — `mosque`
- تمام فهمت، وامتى التسليم؟ — `handover`
- هههه حلو، طيب شو المساحه؟ — `area`
- اوكي ممتاز، والحيوانات الاليفه مسموحه؟ — `pets`
- غلط فهمتيني، بدي اشوف الخريطه — `map`

