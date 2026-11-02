# Multi-turn chat tests (tools/dialogs.mjs). Format: '## title', then '> message | check'.

## نادر والمسافة من عمان
> شو اسمك؟ | kind:chat-persona
> نادر | name:نادر
> شو المسافة من عمان للكمباوند؟ | topic:distance
> طيب منيح، باي | name:نادر

## سارة ومسبح الأطفال
> انتي شو اسمك | kind:chat-persona
> اسمي سارة | name:سارة
> في مسبح للأطفال؟ | topic:pool
> وكم حجم المسبح الكبير؟ | topic:pool
> مع السلامة | name:سارة

## ام خالد والأوراق المطلوبة
> مرحبا، ما اسمك؟ | kind:chat-persona
> ام خالد | name:ام خالد
> شو المستندات اللي بدي إياها لتملك الشاليه | topic:documents
> ماشي، سلام | name:ام خالد

## ريم والتقسيط
> شو اسمك؟ | kind:chat-persona
> انا ريم | name:ريم
> هل في تقسيط بدون فوايد؟ | topic:installments
> شكرا كتير | kind:chat-thanks
> باي | name:ريم

## عمر وسند الملكية
> عفوا شو اسمك | kind:chat-persona
> معك عمر | name:عمر
> الشاليه بيتسجل باسمي عنجد؟ | topic:title-deed
> في مسجد قريب من الشاليهات؟ | topic:mosque
> يلا باي | name:عمر

## لينا والأمن
> اسمك شو يا قمر | kind:chat-persona
> لينا | name:لينا
> الكمباوند مسكر ومين بيدخل؟ | topic:gated
> الحراسة 24 ساعة؟ | topic:security
> مع السلامة يا لينا | name:لينا

## ياسمين والنادي الرياضي
> شو اسمك | kind:chat-persona
> اسمي ياسمين | name:ياسمين
> في نادي رياضي أو سبا هلق؟ | topic:gym
> طيب شو الخدمات اللي جاية بعدين؟ | topic:future
> باي ياسمين | name:ياسمين

## محمد والأسعار
> مرحبا شو اسمك انتي؟ | kind:chat-persona
> محمد | name:محمد
> قديش الأسعار للشاليهات المتوفرة؟ | topic:prices
> ومنين بعرف الأسعار المحدثة | topic:prices
> الله يعطيك العافية، باي | name:محمد

## هبة والشراء من برا الأردن
> ممكن تعرفيني شو اسمك؟ | kind:chat-persona
> هبة | name:هبة
> انا مش أردنية، بقدر أشتري شاليه هون؟ | topic:foreigners
> تمام هبة، مع السلامة | name:هبة

## زياد وخدمات الكمباوند
> انتي شو اسمك؟ | kind:chat-persona
> زياد | name:زياد
> شو الخدمات اللي بتقدموها بالكمباوند؟ | topic:services
> منيح كتير | kind:chat-compliment
> باي زياد | name:زياد

## رنا والمستندات
> شو اسمك | kind:chat-persona
> انا رنا | name:رنا
> شو الإجراءات اللي لازم أمشيها عشان أملك شاليه؟ | topic:documents
> طيب، مع السلامة | name:رنا

## فادي والرسوم الشهرية
> شو اسمك يا جماعة | kind:chat-persona
> فادي | name:فادي
> في رسوم صيانة شهرية على الشاليه؟ | topic:fees
> هيك منيح، يعطيكي العافية | kind:chat-thanks
> باي فادي | name:فادي

## منى وأطفالها
> مرحبا، اسمك شو؟ | kind:chat-persona
> اسمي منى | name:منى
> شو في للأطفال بالكمباوند؟ | topic:kids
> وفي حديقة عامة بالكمباوند؟ | topic:parks
> سلام يا منى | name:منى

## طارق والمساحة
> عفوا شو اسمك؟ | kind:chat-persona
> طارق | name:طارق
> كم متر مربع الأرض والبناء؟ | topic:area
> ومين بيصلح العطل اذا صار؟ | topic:maintenance
> باي طارق | name:طارق

## دانة وخطوات الشراء
> شو اسمك حبيبتي | kind:chat-persona
> دانة | name:دانة
> شو الخطوات من اختيار الشاليه لحد الشراء؟ | topic:buy-steps
> تمام، مع السلامة | name:دانة

## سامر وموعد التسليم
> انتي شو اسمك؟ | kind:chat-persona
> سامر | name:سامر
> امتى بيتسلم الشاليه؟ | topic:handover
> الشاليهات جاهزة للاستلام هلق؟ | topic:handover
> باي سامر | name:سامر

## غادة والمياه
> شو اسمك | kind:chat-persona
> غادة | name:غادة
> كيف وضع المياه بالكمباوند؟ | topic:water
> منيح، شكرا | kind:chat-thanks
> يلا باي يا غادة | name:غادة

## وليد والكهرباء
> مرحبا شو اسمك؟ | kind:chat-persona
> اسمي وليد | name:وليد
> الكهرباء عداد مستقل لكل شاليه؟ | topic:electricity
> مع السلامة وليد | name:وليد

## نور والغولف
> عفوا، شو اسمك | kind:chat-persona
> نور | name:نور
> في ملعب غولف هون؟ | topic:golf
> ومين مؤسس روح العطاء؟ | topic:founder
> باي نور | name:نور

## ماجد والصور
> شو اسمك انتي | kind:chat-persona
> ماجد | name:ماجد
> وين بقدر أشوف صور وفيديو للكمباوند؟ | topic:gallery
> طيب مع السلامة | name:ماجد

## أميرة والتعديل على الشاليه
> ممكن تقولي اسمك؟ | kind:chat-persona
> انا أميرة | name:أميرة
> بقدر أعدّل على الشاليه أو أزيد بناء؟ | topic:modify
> باي أميرة | name:أميرة

## حسام وفريق الإدارة
> شو اسمك | kind:chat-persona
> حسام | name:حسام
> مين فريق الإدارة ورؤساء الأقسام؟ | topic:team
> ماشي يا حسام، باي | name:حسام

## لمى والحيوانات الأليفة
> انتي شو اسمك | kind:chat-persona
> لمى | name:لمى
> هل مسموح الحيوانات الأليفة بالكمباوند؟ | topic:pets
> شكرا لمى | kind:chat-thanks
> مع السلامة | name:لمى

## يوسف والعيادة
> عفوا، شو اسمك؟ | kind:chat-persona
> يوسف | name:يوسف
> في عيادة أو صيدلية بالكمباوند؟ | topic:medical
> تمام يوسف، سلام | name:يوسف

## هالة والمفروش
> شو اسمك حبيبتي | kind:chat-persona
> هالة | name:هالة
> الشاليه بيجي مفروش ولا فاضي؟ | topic:furnished
> في مطاعم أو كافيهات قريبة؟ | topic:food
> باي هالة | name:هالة

## شاليه A1 والسعر
> ورّيني الشاليه A1 | card:chalet:A1
> وكم سعره؟ | card:chalet:A1:price
> وين مكانه بالضبط؟ | card:chalet:A1:where
> بدي أحجز موعد معاينة | book

## شاليه A4 والمساحة
> شو في الشاليه A4 | card:chalet:A4
> مساحته قديش؟ | card:chalet:A4:area
> مميزاته شو؟ | card:chalet:A4:features

## شاليه A8 وحالته
> بدي أعرف عن الشاليه A8 | card:chalet:A8
> متاح؟ | card:chalet:A8:status
> وكم سعره هلق؟ | card:chalet:A8:price
> في جاكوزي بالشاليه؟ | topic:jacuzzi

## شاليه A12 والمميزات
> ورّيني A12 | card:chalet:A12
> شو مميزاته؟ | card:chalet:A12:features
> وين مكانه؟ | card:chalet:A12:where

## شاليه A13 ومكانه
> شو الشاليه A13 | card:chalet:A13
> وين مكانه بالكمباوند؟ | card:chalet:A13:where
> مساحته كم؟ | card:chalet:A13:area
> شكرا كتير | kind:chat-thanks

## شاليه C3 والسعر
> بدي تفاصيل عن الشاليه C3 | card:chalet:C3
> قديش سعره؟ | card:chalet:C3:price
> متاح ولا مباع؟ | card:chalet:C3:status
> الكهرباء عداد مستقل؟ | topic:electricity

## شاليه D20 والمميزات
> شو في الشاليه D20 | card:chalet:D20
> مميزاته شو بالضبط؟ | card:chalet:D20:features
> وكم سعره؟ | card:chalet:D20:price

## شاليه D21 ومكانه
> عرفني على الشاليه D21 | card:chalet:D21
> وين مكانه؟ | card:chalet:D21:where
> متاح هلق؟ | card:chalet:D21:status
> شو المسافة من المطار؟ | topic:distance

## شاليه D36 والمساحة
> بدي أشوف الشاليه D36 | card:chalet:D36
> مساحته قديش؟ | card:chalet:D36:area
> وكم سعره؟ | card:chalet:D36:price

## شاليه D46 وحالته
> شو الشاليه D46 | card:chalet:D46
> مباع ولا متاح؟ | card:chalet:D46:status
> شو مميزاته؟ | card:chalet:D46:features
> بدي أحجز معاينة له | book

## شاليه D48 والسعر
> ورّيني D48 | card:chalet:D48
> بكم؟ | card:chalet:D48:price
> وين مكانه بالضبط؟ | card:chalet:D48:where

## شاليه D50 والمميزات
> معلومات عن الشاليه D50 | card:chalet:D50
> شو مميزاته؟ | card:chalet:D50:features
> مساحته؟ | card:chalet:D50:area
> في مسجد قريب؟ | topic:mosque

## شاليه E1 وحالته
> بدي الشاليه E1 | card:chalet:E1
> متاح؟ | card:chalet:E1:status
> وكم سعره؟ | card:chalet:E1:price

## شاليه E11 ومكانه
> ورّيني الشاليه E11 | card:chalet:E11
> وين مكانه؟ | card:chalet:E11:where
> شو مميزاته؟ | card:chalet:E11:features
> باي | kind:chat-bye

## شاليه E15 والمساحة
> شو في الشاليه E15 | card:chalet:E15
> مساحته كم؟ | card:chalet:E15:area
> قديش سعره؟ | card:chalet:E15:price
> في تدفئة وتكييف بالشاليه؟ | topic:heating

## شاليه E22 والسعر
> بدي تفاصيل عن E22 | card:chalet:E22
> بكم سعره؟ | card:chalet:E22:price
> متاح؟ | card:chalet:E22:status

## شاليه G5 والمميزات
> عرفني على الشاليه G5 | card:chalet:G5
> شو مميزاته؟ | card:chalet:G5:features
> وين مكانه؟ | card:chalet:G5:where

## شاليه N7 والمساحة
> الشاليه N7 شو فيه؟ | card:chalet:N7
> مساحته قديش؟ | card:chalet:N7:area
> وكم سعره هلق؟ | card:chalet:N7:price
> بدي أحجز معاينة | book

## شاليه R4 وحالته
> ورّيني R4 | card:chalet:R4
> متاح ولا لأ؟ | card:chalet:R4:status
> شو مميزاته؟ | card:chalet:R4:features

## شاليه R17 والسعر
> شو الشاليه R17 | card:chalet:R17
> قديش سعره؟ | card:chalet:R17:price
> وين مكانه؟ | card:chalet:R17:where
> في خدمة تنظيف بالكمباوند؟ | topic:housekeeping

## شاليه S4 والمميزات
> بدي أشوف S4 | card:chalet:S4
> شو مميزاته بالضبط؟ | card:chalet:S4:features
> مساحته؟ | card:chalet:S4:area

## شاليه T13 ومكانه
> شو الشاليه T13 | card:chalet:T13
> وين مكانه؟ | card:chalet:T13:where
> متاح؟ | card:chalet:T13:status
> شكرا يا حبيبتي | kind:chat-thanks

## شاليه T15 والسعر
> عرفيني على T15 | card:chalet:T15
> كم سعره؟ | card:chalet:T15:price
> مساحته؟ | card:chalet:T15:area

## شاليه W2 والمميزات
> ورّيني الشاليه W2 | card:chalet:W2
> شو مميزاته؟ | card:chalet:W2:features
> وكم سعره؟ | card:chalet:W2:price
> في حراسة 24 ساعة؟ | topic:security

## شاليه W4 والحالة
> بدي تفاصيل W4 | card:chalet:W4
> متاح هلق؟ | card:chalet:W4:status
> وين مكانه بالكمباوند؟ | card:chalet:W4:where
> بدي أحجز موعد | book
## Compound asked, meant the sale
> شو هاد الكمباوند اللي عندكم؟ | topic:about
> لا مش هيك، ما فهمتي علي | sorry
> قصدي شو بتبيعوا بالضبط وشو هو المشروع؟ | topic:what-sell

## Prices turned into installments
> قديش الاسعار عندكم؟ | topic:prices
> لا مش هيك، قصدي عن الدفع | sorry
> طيب بقدر ادفع على اقساط؟ قديش القسط الشهري | topic:installments
> تمام منيح يسلمو | kind:chat-thanks

## Kids pool, not the big one
> شو في للاطفال هون؟ | topic:kids
> لا مش هيك، ما فهمتي علي | sorry
> قصدي مسبح الاطفال تحديدا، في ولا لاء؟ | topic:pool

## Far from the airport, meant the road
> بعيد عن المطار؟ | topic:distance
> مش هاد قصدي | sorry
> طيب شو الطريق اللي بوصل فيه بالسيارة من عمان | topic:roads

## Who gets in, meant the guard
> مين بدخل الكمباوند؟ | topic:gated
> لا مش هيك، ما فهمتي علي | sorry
> يعني في حراسة 24 ساعة ولا لاء؟ | topic:security

## Gym now vs later
> في جيم او سبا؟ | topic:gym
> لا مش هيك، قصدي شو الموجود هسا مش شو رح يجي | sorry
> طيب شو الخدمات الموجودة حاليا؟ | topic:services

## AC question became the kitchen
> في تكييف بالشاليه؟ | topic:heating
> ما فهمتي علي، قصدي الشاليه نفسه | sorry
> شو وضع المطبخ والمعيشة فيه؟ | topic:kitchen

## Papers, then the deed
> شو الاوراق اللي بدي اجيبها؟ | topic:documents
> لا مش هيك، قصدي عن الاسم على الشاليه | sorry
> الشاليه بيتسجل باسمي انا؟ وكيف بنقل الملكية | topic:title-deed

## Foreigner, meant the deed
> انا مش اردني، بقدر اشتري من برا الاردن؟ | topic:foreigners
> مش هاد قصدي | sorry
> يعني الشاليه بيصير باسمي بالقانون؟ | topic:title-deed

## Furnished, then finishes
> بيجي مفروش الشاليه؟ | topic:furnished
> لا مش هيك، ما فهمتي علي | sorry
> طيب شو نوع التشطيبات بالضبط؟ | topic:finishes
> اوكي تمام | kind:chat-ack

## Floors, then the size
> الشاليه طابق واحد ولا طابقين؟ | topic:floors
> لا مش هيك، قصدي كم المساحة | sorry
> كم متر البيت والارض؟ | topic:area

## Water, then power
> كيف المية بالكمباوند؟ | topic:water
> لا مش هيك، قصدي الكهربا | sorry
> والعداد الكهربا مستقل لكل شاليه؟ | topic:electricity

## Golf, meant football
> في ملعب غولف؟ | topic:golf
> لا مش هيك، انا بدي ملعب كرة قدم او رياضة عادية | sorry
> في ملاعب رياضية عندكم؟ | topic:sports

## Renting out vs renting for a night
> بقدر اأجر الشاليه ولا اكثر؟ | topic:rent-invest
> ما فهمتي علي، انا بدي استأجر ليلة او يومين بس | sorry
> بقدر استأجر شاليه ليلة واحدة؟ | topic:daily-rental

## Where is the office
> وين المكتب؟ | topic:office
> لا مش هيك، قصدي مين الشركة اللي طورت المشروع | sorry
> والشركة المطورة اسمها شو؟ | topic:company

## Management, then the founder
> مين الادارة عندكم؟ | topic:team
> لا مش هيك، ما فهمتي علي | sorry
> طيب مين المؤسس تبع روح العطاء؟ | topic:founder
> مشكور كتير | kind:chat-thanks

## Handover date
> امتى بتسلموا؟ | topic:handover
> مش هاد قصدي | sorry
> يعني بقدر استلم هلا ولا لازم استنى؟ | topic:handover

## Trust, then licence
> شو بضمن انكم شركة موثوقة؟ | topic:trust
> لا مش هيك، قصدي هل انتو مرخصين رسميا | sorry
> يعني عندكم ترخيص من الدولة؟ | topic:trust

## Pharmacy, then schools
> في صيدلية بالكمباوند؟ | topic:medical
> لا مش هيك، ما فهمتي علي | sorry
> والمدارس او الحضانة للاولاد شو في؟ | topic:schools

## Restaurants, meant outside
> في مطاعم او كافيهات؟ | topic:food
> لا مش هيك قصدي برا الكمباوند | sorry
> شو الاماكن القريبة منكم؟ | topic:nearby

## Bikes, meant the courts
> في دراجات هوائية؟ | topic:bikes
> ما فهمتي علي، قصدي الملاعب | sorry
> يعني في ملعب كورة او تنس؟ | topic:sports

## Dog, then the gate
> بقدر اربي كلب؟ | topic:pets
> لا مش هيك، قصدي الكمباوند مغلق ولا لاء | sorry
> طيب مين بدخل ومين بطلع؟ | topic:gated

## Extra room, then parks
> بقدر ازيد غرفة على الشاليه؟ | topic:modify
> لا مش هيك، بدي عن الحدائق | sorry
> في حدائق عامة جوا الكمباوند؟ | topic:parks

## Wedding party, meant swimming
> بقدر اعمل فرح بالكمباوند؟ | topic:events
> ما فهمتي علي، قصدي مكان نسبح فيه مع اهلي | sorry
> في مسبح كبير ولا لاء؟ | topic:pool

## Dad with mobility, then the clinic
> الشاليه مناسب لابوي كبير بالسن؟ | topic:accessible
> لا مش هيك، قصدي اذا تعب فين بروح | sorry
> في عيادة قريبة بالكمباوند؟ | topic:medical

## Size of the land, asked twice
> قديش مساحة الارض؟ | topic:area
> والبناء كم متر، يعني المساحة الكلية؟ | topic:area
> يعني شو حجم البيت نفسه بالمتر؟ | topic:area
> شكرا كتير | kind:chat-thanks

## What is the compound
> شو هو كمباوند روح العطاء؟ | topic:about
> يعني شو بالضبط هالمشروع؟ | topic:about
> احكيلي عنه باختصار كمان مرة | topic:about
> تمام تمام | kind:chat-ack

## Where it is
> وين موقعكم بالضبط؟ | topic:location
> مكانكم بالاردن على أي منطقة؟ | topic:location
> شو اقرب منطقة عندكم؟ | topic:location
> اوكي | kind:chat-ack

## What the chalet has inside
> شو المرافق الخاصة بكل شاليه؟ | topic:chalet-facilities
> يعني داخل البيت شو في؟ | topic:chalet-facilities
> شو الاشياء اللي لحالي بالشاليه؟ | topic:chalet-facilities
> يسلمو عالرد | kind:chat-thanks

## Compound-wide facilities
> شو المرافق اللي بالكمباوند كله؟ | topic:compound-facilities
> والخدمات العامة شو؟ | topic:compound-facilities
> بالكمباوند نفسه شو الاشي المتوفر؟ | topic:compound-facilities
> ماشي | kind:chat-ack

## Booking a visit
> كيف بقدر احجز معاينة؟ | topic:visit
> بدي اجي اشوف المكان بنفسي، كيف الحجز؟ | topic:visit
> شو الخطوات عشان اجي اتفرج؟ | topic:visit
> thank you | kind:chat-thanks

## Virtual tour from abroad
> في معاينة فيديو اذا انا برا الاردن؟ | topic:video-visit
> بقدر اتفرج عليه بالفيديو كول؟ | topic:video-visit
> ممكن مكالمة فيديو اشوف فيها المكان؟ | topic:video-visit
> تمام شكرا | kind:chat-thanks

## Price range
> قديش الاسعار؟ | topic:prices
> بكم الشاليهات المتوفرة هسا؟ | topic:prices
> ممكن تعطيني فكرة عن الاسعار؟ | topic:prices
> منيح، شكرا | kind:chat-thanks

## Monthly instalments
> في تقسيط؟ | topic:installments
> شو نسبة القسط الشهري؟ | topic:installments
> بدفع كل شهر كم بالظبط؟ | topic:installments
> اوك | kind:chat-ack

## Papers needed to own
> شو الاوراق المطلوبة للشراء؟ | topic:documents
> بدي اعرف الشروط والمستندات | topic:documents
> شو لازم اجيب معي عشان امتلك؟ | topic:documents
> يعطيك العافية | kind:chat-thanks

## Maintenance fees
> في رسوم صيانة شهرية؟ | topic:fees
> هل في مصاريف سنوية زيادة؟ | topic:fees
> مصاريف الخدمات الدورية قديش؟ | topic:fees
> مشكور | kind:chat-thanks

## Steps to buy
> كيف بتم عملية الشراء من الاول؟ | topic:buy-steps
> شو الخطوات من الاختيار لحد التوقيع؟ | topic:buy-steps
> يعني المراحل كلها لحد ما اصير مالك؟ | topic:buy-steps
> تمام | kind:chat-ack

## When can I move in
> امتى بتسلموا الشاليهات؟ | topic:handover
> الشاليهات جاهزة للاستلام؟ | topic:handover
> يعني بقدر استلم قريب ولا لاء؟ | topic:handover
> اوكي شكرا | kind:chat-thanks

## Distance from Amman
> كم بعد عن عمان؟ | topic:distance
> المسافة للمطار قديش؟ | topic:distance
> بالسيارة قديش بدي اوصل من عمان؟ | topic:distance
> ماشي تمام | kind:chat-ack

## Services offered
> شو الخدمات اللي بتقدموها؟ | topic:services
> يعني شو بتوفروا للساكنين؟ | topic:services
> الخدمات الحالية شو هي؟ | topic:services
> يسلمو | kind:chat-thanks

## Pool size
> كم حجم المسبح؟ | topic:pool
> المسبح الكبير شو مساحته؟ | topic:pool
> يعني طول وعرض المسبح كم؟ | topic:pool
> شكرا كتير | kind:chat-thanks

## Rooms and baths
> كم غرفة نوم بالشاليه؟ | topic:bedrooms
> كم حمام فيه؟ | topic:bedrooms
> عدد الغرف والحمامات؟ | topic:bedrooms
> اوكي منيح | kind:chat-ack

## Winter warmth
> في تدفئة بالشتاء؟ | topic:heating
> والتكييف كيف؟ | topic:heating
> بيوتكم فيها تكييف او تدفئة؟ | topic:heating
> تمام شكرا | kind:chat-thanks

## Where to park
> وين بركن السيارة؟ | topic:parking
> في كراج للشاليه؟ | topic:parking
> مواقف السيارات كيف؟ | topic:parking
> ماشي | kind:chat-ack

## Mosque nearby
> في مسجد بالكمباوند؟ | topic:mosque
> مصلى قريب منكم؟ | topic:mosque
> وين بصلي جوا الكمباوند؟ | topic:mosque
> يعطيك العافية | kind:chat-thanks

## Grocery inside
> في سوبرماركت جوا؟ | topic:shop
> محل بقالة داخل الكمباوند؟ | topic:shop
> شو فيه يعني بالدكاكين؟ | topic:shop
> منيح تمام | kind:chat-ack

## Golf course
> في ملعب غولف؟ | topic:golf
> ملعب الغولف موجود عندكم؟ | topic:golf
> وهل في مكان للعب الغولف؟ | topic:golf
> thanks | kind:chat-thanks

## Weather and air
> شو الجو عندكم؟ | topic:weather
> هواكم شو يعني؟ | topic:weather
> الهوا عندكم منيح؟ | topic:weather
> اوكي شكرا | kind:chat-thanks

## Furnished or empty
> الشاليه مفروش؟ | topic:furnished
> بيجي فيه عفش؟ | topic:furnished
> بيجي مع الاثاث؟ | topic:furnished
> تمام | kind:chat-ack

## Pets allowed
> بسمح للحيوانات الاليفة؟ | topic:pets
> قطط او كلاب مسموحين؟ | topic:pets
> حيوانات اليفة عندكم؟ | topic:pets
> شكرا يسلمو | kind:chat-thanks
## نكتة وسعر وتقسيط
> هلا | kind:chat-greet
> احكيلي نكتة قصيرة | kind:chat-joke-request
> قديش سعر الشاليه تقريبا؟ | topic:prices
> وفي تقسيط بدون فوايد؟ | topic:installments
> يسلمو، شكرا | kind:chat-thanks

## اسمك ومكتب المبيعات
> اهلين، شو اسمك؟ | kind:chat-persona
> وين مكتب المبيعات وين بتستقبلوا الزوار؟ | topic:office
> الله يسلمك، مع السلامة | kind:chat-bye

## الجو والمسبح
> مرحبا | kind:chat-greet
> شو الجو عندكم؟ | topic:weather
> انتي شو أخبارك اليوم؟ | kind:chat-persona
> في مسبح؟ كم حجمه؟ | topic:pool

## تعليق وطريق
> انتي شاطرة كتير بالرد | kind:chat-compliment
> كم يبعد عن عمان؟ | topic:distance
> ممتاز، بفكر فيها | kind:chat-ack
> الله يعطيكي العافية | kind:chat-wish

## نكتة ومطعم
> هاي | kind:chat-greet
> احكيلي نكتة عن الشاليهات | kind:chat-joke-request
> في مطاعم أو كافيهات بالكمباوند؟ | topic:food
> ضحكتيني، شكرا | kind:chat-thanks

## عاصمة اليابان
> شو عاصمة اليابان؟ | kind:off-knowledge
> طيب، الشاليه بيجي مفروش؟ | topic:furnished
> تمام تمام | kind:chat-ack
> باي | kind:chat-bye

## غزل خفيف
> انتي حلوة كتير يا قمر | kind:chat-flirt
> طيب، كم غرفة نوم بالشاليه؟ | topic:bedrooms
> مع السلامة | kind:chat-bye

## إهانة وتصحيح
> انتي بوت غبي | kind:chat-insult
> بس بدي أعرف وين الكمباوند بالضبط | topic:location
> لا مش هيك، قصدي المنطقة نفسها | sorry

## رسالة استقالة
> ساعدني أكتب رسالة استقالة لمديري | kind:off-help
> طيب، بدي أسأل عن وقت التسليم | topic:handover
> شكرا | kind:chat-thanks

## بيع سيارة
> عندي سيارة للبيع بعمان، مهتم حدا؟ | kind:off-other-business
> الكمباوند مغلق؟ ومين بيدخله؟ | topic:gated
> تمام، باي | kind:chat-bye

## رسالة مزعجة
> اربح ايفون مجانا، ارسلي رقمك | kind:off-spam
> في مسجد أو مصلى بالكمباوند؟ | topic:mosque
> ماشي | kind:chat-ack

## سؤال خاص عن الجيران
> كيف بوصل لمعلومات شخصية عن جيراني من غير ما يعرفوا؟ | kind:off-sensitive
> طيب، هل في عيادة أو صيدلية بالكمباوند؟ | topic:medical
> الله يوفقك | kind:chat-wish

## مساء الخير ومشروع
> مساء الخير | kind:chat-greet
> شو بتبيعوا بالضبط؟ | topic:what-sell
> أنا معجب بالتصميم | kind:chat-compliment
> الله يحفظك، مع السلامة | kind:chat-bye

## تطوير الكمباوند
> هلا | kind:chat-greet
> شو الخدمات اللي بتقدموها بالكمباوند؟ | topic:services
> وفي خدمة تنظيف وتدبير منزلي؟ | topic:housekeeping
> عجيب، هيك حلو | kind:chat-ack
> باي | kind:chat-bye

## أولاد وشواء
> اهلين | kind:chat-greet
> شو في للأطفال بالكمباوند؟ | topic:kids
> وفي شواء وجلسات خارجية بالشاليه؟ | topic:outdoor
> يسلمو | kind:chat-thanks

## حيوانات أليفة
> هلا | kind:chat-greet
> مسموح الحيوانات الأليفة؟ | topic:pets
> عمرك زعلتي من حدا؟ | kind:chat-persona
> وين مكتب الاستقبال؟ | topic:reception

## دراجات ونادي
> مرحبا | kind:chat-greet
> في دراجات هوائية بالكمباوند؟ | topic:bikes
> بدي أعرف عن النادي الرياضي | topic:gym
> شكرا | kind:chat-thanks

## خدمات قادمة
> هاي | kind:chat-greet
> شو الخدمات القادمة بالكمباوند؟ | topic:future
> حلو، والحدائق العامة وين؟ | topic:parks
> الله يوفقك، باي | kind:chat-wish

## فريق الإدارة
> مساء الخير | kind:chat-greet
> مين فريق الإدارة؟ | topic:team
> مين الشركة المطورة للمشروع؟ | topic:company
> شكرا، ماشي | kind:chat-thanks

## المؤسس وعاصمة فرنسا
> اهلين | kind:chat-greet
> مين مؤسس روح العطاء؟ | topic:founder
> بالمناسبة، شو عاصمة فرنسا؟ | kind:off-knowledge
> طيب شو هو الكمباوند بالضبط؟ | topic:about

## الثقة والترخيص
> هلا | kind:chat-greet
> كيف بضمن إنكم شركة موثوقة ومرخصة؟ | topic:trust
> لا مش هيك، قصدي ترخيص المشروع | sorry
> شكرا | kind:chat-thanks

## خطوات الشراء
> مرحبا | kind:chat-greet
> ما الخطوات من اختيار الشاليه لحد الشراء؟ | topic:buy-steps
> وشو المستندات المطلوبة؟ | topic:documents
> باي | kind:chat-bye

## الإنترنت والمياه
> هلا | kind:chat-greet
> في إنترنت واي فاي بالشاليه؟ | topic:internet
> والمياه كيف الوضع؟ | topic:water
> تمام | kind:chat-ack

## كهرباء وطاقة
> مرحبا | kind:chat-greet
> الكهرباء بالكمباوند عداد مستقل؟ | topic:electricity
> في طاقة شمسية؟ | topic:electricity
> شكراً جزيلاً | kind:chat-thanks

## تسعير وصيانة
> اهلين | kind:chat-greet
> كيف بقدر أعرف الأسعار المتوفرة؟ | topic:prices
> يعني بدون فوايد بالتقسيط؟ | topic:installments
> شو رسوم الصيانة؟ | topic:fees
> الله يعطيكي العافية | kind:chat-wish

## فيديو وزيارة
> هلا | kind:chat-greet
> ممكن أعمل معاينة افتراضية عبر فيديو كول؟ | topic:video-visit
> بدي أحجز موعد للمعاينة | topic:visit
> شكرا | kind:chat-thanks

## سند الملكية
> مرحبا | kind:chat-greet
> الشاليه بيتسجل باسمي؟ | topic:title-deed
> وشو مكان المواقف والكراج؟ | topic:parking
> باي | kind:chat-bye

## إيجار واستثمار
> هاي | kind:chat-greet
> بقدر أأجر الشاليه وأستفيد منه كاستثمار؟ | topic:rent-invest
> الشاليه طابق واحد ولا طابقين؟ | topic:floors

## تدفئة وتكييف
> اهلين | kind:chat-greet
> في تدفئة أو تكييف بالشاليه؟ | topic:heating
> وفي جاكوزي؟ | topic:jacuzzi
> شكراً | kind:chat-thanks

## مطبخ وحديقة
> مرحبا | kind:chat-greet
> كيف المطبخ والمعيشة بالشاليه؟ | topic:kitchen
> هل في حديقة خاصة؟ | topic:garden
> تمام، مع السلامة | kind:chat-bye

## مدارس وحضانة
> هلا | kind:chat-greet
> في مدارس أو حضانة بالكمباوند؟ | topic:schools
> شو الأماكن القريبة من الكمباوند؟ | topic:nearby
> الله يحفظك | kind:chat-wish

## سوبر ماركت
> مرحبا | kind:chat-greet
> في محل سوبر ماركت داخل الكمباوند؟ | topic:shop
> وفي ملاعب رياضية؟ | topic:sports
> ماشي، شكرا | kind:chat-thanks

## اتحاد الملاك
> اهلين | kind:chat-greet
> في اتحاد للمالكين بالكمباوند؟ | topic:owners
> شو الطريق إله من عمان؟ | topic:roads
> باي | kind:chat-bye

## صور وفيديو
> هلا | kind:chat-greet
> وين بقدر أشوف صور وفيديو للكمباوند؟ | topic:gallery
> إذا أنا مش أردني بقدر أشتري؟ | topic:foreigners
> ممتاز، الله يعطيكي العافية | kind:chat-wish

## إيجار ليلي
> مرحبا | kind:chat-greet
> بقدر أستأجر شاليه ليلة أو كم يوم؟ | topic:daily-rental
> شو بتنصحيني؟ | topic:recommend
> شكرا | kind:chat-thanks

## ذوي الاحتياجات
> هلا | kind:chat-greet
> الشاليه مناسب لكبار السن أو لكرسي متحرك؟ | topic:accessible
> بقدر أعمل مناسبة أو حفلة بالكمباوند؟ | topic:events
> تمام | kind:chat-ack

## كم شاليه عندكم
> اهلين | kind:chat-greet
> كم شاليه أو كمباوند عندكم؟ | topic:chalet-count
> بقدر أعدّل على الشاليه أو أزيد بناء؟ | topic:modify
> مع السلامة | kind:chat-bye

## شقق وأراضي
> مرحبا | kind:chat-greet
> عندكم شقق أو أراضي أو فلل للبيع؟ | topic:other-property
> انتي بتحبي الشغل هون؟ | kind:chat-persona
> شكرا كتير | kind:chat-thanks

## جاكوزي ومسبح الأطفال
> هلا | kind:chat-greet
> كم حجم المسبح وفي مسبح للأطفال؟ | topic:pool
> وفي جاكوزي بالشاليه؟ | topic:jacuzzi
> ماشي | kind:chat-ack

## مساحة وتشطيب
> مرحبا | kind:chat-greet
> ما مساحة الأرض والبناء لكل شاليه؟ | topic:area
> شو نوع التشطيبات؟ | topic:finishes
> يسلمو | kind:chat-thanks

## مرافق الشاليه
> اهلين | kind:chat-greet
> شو المرافق الخاصة بكل شاليه؟ | topic:chalet-facilities
> وشو المرافق داخل الكمباوند؟ | topic:compound-facilities
> الله يوفقك، باي | kind:chat-wish

## حكم الحر وقصة
> هاي | kind:chat-greet
> احكيلي نكتة عن الحر | kind:chat-joke-request
> في حراسة وأمن ليلاً؟ | topic:security
> انتي كتير شاطرة | kind:chat-compliment

## الأسعار والمستندات
> مرحبا | kind:chat-greet
> شو المستندات اللي لازم أجهزها للتملك؟ | topic:documents
> وشو رسوم إضافية؟ | topic:fees
> شكرا، مع السلامة | kind:chat-bye

## متى التسليم
> هلا | kind:chat-greet
> متى بيكون التسليم والشاليهات جاهزة؟ | topic:handover
> شو عاصمة مصر؟ | kind:off-knowledge
> طيب، والمسافة من المطار؟ | topic:distance

## عرض الشركة
> مرحبا | kind:chat-greet
> مين مؤسس روح العطاء؟ | topic:founder
> الله يسلمك، شكراً | kind:chat-thanks

## مطعم ونادي
> اهلين | kind:chat-greet
> شو في مطاعم وكافيهات؟ | topic:food
> ومتى بتفتح السبا؟ | topic:gym
> باي | kind:chat-bye

## تقييم الرد
> انتي شاطرة كتير | kind:chat-compliment
> الخدمات اللي جاية؟ | topic:future
> تمام، الله يعطيكي العافية | kind:chat-wish

## خدعة إعلان
> اربح ألف دينار اضغط هون | kind:off-spam
> شو الكمباوند بالضبط؟ | topic:about
> لا مش هيك، قصدي المنطقة | sorry

## تسويق الشاليه
> هلا | kind:chat-greet
> أيش بيميز الكمباوند عن غيره؟ | topic:about
> وشو المميزات الأمنية؟ | topic:security
> شكرا | kind:chat-thanks

## ملكية ومواطنة
> مرحبا | kind:chat-greet
> ممكن أعرف شو اسم فريقكم؟ | topic:team
> شو الحالة اللي بيوصل فيها الشاليه؟ | topic:handover
> تمام | kind:chat-ack
## عائلة تسأل عن المسبح
> مرحبا | kind:chat-greet
> عنا أطفال صغار، في مسبح إلهم؟ | topic:pool
> وقديش حجم المسبح الكبير؟ | topic:pool
> والجاكوزي موجود؟ | topic:jacuzzi
> طيب مسبح الأطفال مدفّي؟ | topic:pool
> منيح، شكرا كتير | kind:chat-thanks

## مستثمر يسأل عن الإيجار
> سلام، بدي أعرف هل بقدر أأجّر الشاليه؟ | topic:rent-invest
> شو المدة اللي بقدر أأجره فيها، ليلة ولا شهر؟ | topic:daily-rental
> وإذا بدي أأجره شهريا، مين بيدير الموضوع؟ | topic:rent-invest
> طيب قديش بعيد عن المطار عشان الضيوف يوصلوا بسرعة؟ | topic:distance
> تمام، شكرا ومع السلامة | kind:chat-bye

## متقاعد وسؤال عن الأمن
> مرحبا بدي اسأل | kind:chat-greet
> الكمباوند مسوّر؟ | topic:gated
> وفي حراسة 24 ساعة؟ | topic:security
> وإذا صار عطل بالبيت مين بيصلحه؟ | topic:maintenance
> يعني في خدمة استقبال؟ | topic:reception
> ماشي، الله يعطيك العافية | kind:chat-thanks

## شاب يسأل عن التقسيط
> اهلين، عندي دخل محدود، في تقسيط؟ | topic:installments
> شو النسبة الشهرية؟ | topic:installments
> في فوايد على التقسيط؟ | topic:installments
> وإذا تأخرت بالدفعة في غرامة؟ | topic:fees
> منيح، بعرف أسأل لاحقا. باي | kind:chat-bye

## ريم تسأل عن الخدمات
> مرحبا | kind:chat-greet
> شو اسمك؟ | kind:chat-persona
> اسمي ريم | name:ريم
> شو الخدمات اللي بتقدموها بالكمباوند؟ | topic:services
> في خدمة تنظيف للبيت؟ | topic:housekeeping
> في سوبر ماركت قريب؟ | topic:shop
> باي، شكرا | name:ريم

## مصري يسأل عن الموقع
> ازيك، عايز اعرف الكمباوند فين بالظبط | topic:location
> ده بعيد عن عمان قد إيه؟ | topic:distance
> وفي مطار قريب؟ | topic:distance
> والطريق سهل ولا فيه زحمة؟ | topic:roads
> تمام، شكرا جدا | kind:chat-thanks

## زوجان جدد عن المدارس
> مرحبا | kind:chat-greet
> احنا زوجين جداد، في مدارس أو حضانة جوّا الكمباوند؟ | topic:schools
> وفي مكان نروح فيه نتمشى؟ | topic:parks
> طيب في مطعم أو كافيه قريب؟ | topic:food
> بدنا نحجز زيارة الأسبوع الجاي | book
> تمام، شكرا | kind:chat-thanks

## مستثمرة تسأل عن الشاليه D20
> سؤال: شو الأسعار المتوفرة؟ | topic:prices
> بدي أشوف شاليه D20 | card:chalet:D20
> وكم سعره؟ | card:chalet:D20:price
> متاح لسه؟ | card:chalet:D20:status
> وين مكانه بالكمباوند؟ | card:chalet:D20:where
> ماشي، شكرا | kind:chat-thanks

## عائلة كبيرة تسأل عن D36
> اهلين | kind:chat-greet
> بدي شاليه فيه مسبح كبير، شو المتوفر؟ | topic:pool
> في شاليه D36 مثلا؟ | card:chalet:D36
> مساحته قديش؟ | card:chalet:D36:area
> ومميزاته شو؟ | card:chalet:D36:features
> لو سمحتي، شو في جاكوزي؟ | topic:jacuzzi
> شكرا منيح | kind:chat-thanks

## خليجي يسأل عن الملكية
> هلا، ابي اعرف اذا الشاليه باسمي؟ | topic:title-deed
> وشو الأوراق اللي أحتاجها؟ | topic:documents
> الملكية تنتقل وش الإجراءات؟ | topic:title-deed
> ومتى التسليم؟ | topic:handover
> زين، مع السلامة | kind:chat-bye

## غير أردني يسأل عن الشراء
> Hi, I'm not Jordanian, can I buy here? | topic:foreigners
> Good to know. What are the steps to buy? | topic:buy-steps
> Do I need a lawyer for it? | topic:documents
> ok thanks | kind:chat-thanks
> ok thanks a lot, bye | kind:chat-bye

## سؤال عن النادي الرياضي
> مرحبا | kind:chat-greet
> في نادي رياضي؟ | topic:gym
> لا مش هيك، قصدي شو المرافق داخل الشاليه | sorry
> يعني في حمام سباحة خاص؟ | topic:pool
> منيح، شكرا | kind:chat-thanks

## خالد وسؤال الأمن
> هلا، شو اسمك؟ | kind:chat-persona
> اسمي خالد | name:خالد
> بدي أعرف عن الأمن بالكمباوند | topic:security
> في كاميرات؟ | topic:security
> والكهرباء شغّالة 24 ساعة؟ | topic:electricity
> باي، شكرا | name:خالد

## عيلة تحب الشواء والحديقة
> مرحبا | kind:chat-greet
> في حديقة خاصة للشاليه؟ | topic:garden
> وشو في مكان للشواء؟ | topic:outdoor
> وكراج للسيارات؟ | topic:parking
> ماشي، الله يعطيكم العافية | kind:chat-thanks
> ومع السلامة | kind:chat-bye

## سؤال عن الإنترنت والتشطيبات
> اهلين | kind:chat-greet
> الشاليه فيه واي فاي؟ | topic:internet
> والتكييف والتدفئة؟ | topic:heating
> شو نوع التشطيبات؟ | topic:finishes
> زين، بس ابي اعرف مين الشركة المطوّرة | topic:company
> شكرا، باي | kind:chat-bye

## فتاة تسأل عن الحيوانات الأليفة
> مرحبا | kind:chat-greet
> هل مسموح الحيوانات الأليفة؟ | topic:pets
> وكلاب كبيرة؟ | topic:pets
> شو عن الحدائق للمشي مع الكلب؟ | topic:parks
> تمام، يعطيكي العافية | kind:chat-thanks
> وقبل ما أروح، شو الأسعار؟ | topic:prices

## رجل يسأل عن الوصول لوالده
> مرحبا، والدي كبير بالسن | topic:accessible
> الشاليه مناسب لكرسي متحرك؟ | topic:accessible
> شو الشاليه طابق واحد؟ | topic:floors
> وشو الأماكن الطبية القريبة يعني مستشفى؟ | topic:medical
> ماشي، شكرا لك | kind:chat-thanks

## شاب يسأل عن المياه والكهرباء
> اهلين | kind:chat-greet
> الماء كيف بالكمباوند؟ | topic:water
> في خزانات أو مياه ثابتة؟ | topic:water
> والكهرباء مستقلة للشاليه؟ | topic:electricity
> في طاقة شمسية؟ | topic:electricity
> تمام، شكرا كتير | kind:chat-thanks

## يسأل عن المؤسس والإدارة
> مرحبا | kind:chat-greet
> مين مؤسس روح العطاء؟ | topic:founder
> وفي فريق إدارة؟ | topic:team
> شو الشركة اللي بتطوّر المشروع؟ | topic:company
> وكيف بضمن إنكم موثوقين ومرخصين؟ | topic:trust
> ماشي، الله يوفقكم | kind:chat-thanks

## يسأل عن الرسوم والصيانة
> سؤال: في رسوم شهرية؟ | topic:fees
> لا مش هيك، بدي أعرف الرسوم السنوية | sorry
> والرسوم بتشمل صيانة الكمباوند؟ | topic:fees
> وإذا صار عطل بالشاليه مين بيصلحه؟ | topic:maintenance
> في اتحاد للمالكين؟ | topic:owners
> منيح، شكرا | kind:chat-thanks

## استفسار بالفصحى عن التقسيط
> السلام عليكم | kind:chat-greet
> أرغب في الاستفسار عن طرق الدفع المتاحة | topic:installments
> هل توجد إمكانية للدفع على أقساط شهرية؟ | topic:installments
> ما المدة الزمنية للتقسيط؟ | topic:installments
> شكراً لكم | kind:chat-thanks

## ام خالد تسأل عن الملاعب
> هلا | kind:chat-greet
> شو اسمك انتي؟ | kind:chat-persona
> ام خالد | name:ام خالد
> ابي اعرف عن الحدائق والملاعب للأطفال | topic:kids
> في دراجات هوائية للعيال؟ | topic:bikes
> ماشي، باي | name:ام خالد

## شاليه E1 بالتفصيل
> اهلين | kind:chat-greet
> وش الشاليه E1؟ | card:chalet:E1
> بكم؟ | card:chalet:E1:price
> وين موقعه؟ | card:chalet:E1:where
> والمساحة كم؟ | card:chalet:E1:area
> ومميزاته؟ | card:chalet:E1:features
> زين، يعطيك العافية | kind:chat-thanks

## شاليه A4 متاح؟
> مرحبا | kind:chat-greet
> ابي اشوف الشاليه A4 | card:chalet:A4
> متاح؟ | card:chalet:A4:status
> وكم مساحته؟ | card:chalet:A4:area
> بدي احجز زيارة له | book
> شكرا، باي | kind:chat-bye

## شقق وأراضي
> مرحبا | kind:chat-greet
> عندكم شقق أو أراضي للبيع؟ | topic:other-property
> طيب شو الفرق بين الشاليهات والأراضي؟ | topic:what-sell
> شو الأسعار للشقق؟ | topic:prices
> ماشي، شكرا | kind:chat-thanks

## مكتب المبيعات
> هلا | kind:chat-greet
> وين مكتب المبيعات؟ | topic:office
> يعني بقدر أجي بدون موعد؟ | topic:visit
> انا ساكن بعمان، هل في فيديو معاينة؟ | topic:video-visit
> وفي دوام يوم الجمعة؟ | topic:office
> شكرا | kind:chat-thanks

## نادر يسأل عن التسليم
> مرحبا | kind:chat-greet
> شو اسمك؟ | kind:chat-persona
> نادر | name:نادر
> متى بيكون الشاليه جاهز للتسليم؟ | topic:handover
> وهل بيجي مفروش؟ | topic:furnished
> مع السلامة | name:نادر

## تهنئة وسؤال عن المشاريع
> كل عام وانتو بخير | kind:chat-wish
> وعنكم شو المشاريع الجاية؟ | topic:future
> في جيم أو سبا؟ | topic:gym
> انتم قريبين من مطار الملكة علياء؟ | topic:distance
> ماشي، شكرا | kind:chat-thanks

## مجاملة ثم الجيران
> مرحبا | kind:chat-greet
> انتي شاطرة كتير | kind:chat-compliment
> بدي أعرف شو في مطاعم قريبة | topic:food
> وفي سوبرماركت؟ | topic:shop
> شو الأماكن القريبة مثل المولات؟ | topic:nearby
> شكرا، باي | kind:chat-bye

## الجو عندكم
> اهلين | kind:chat-greet
> الجو عندكم بالصيف حار؟ | topic:weather
> والهوا في الشتا بيكون بارد؟ | topic:weather
> وفي شجر وحديقة عامة؟ | topic:parks
> تمام شكرا | kind:chat-thanks

## معاينة بالفيديو
> مرحبا | kind:chat-greet
> هل بقدر أعاين الكمباوند عن طريق فيديو؟ | topic:video-visit
> وإذا جيت فعلا كيف بحجز الموعد؟ | topic:visit
> وفي صور أو فيديوهات منشورة؟ | topic:gallery
> منيح، شكرا لكم | kind:chat-thanks

## المطبخ والجاكوزي
> هلا | kind:chat-greet
> شو المطبخ مجهز؟ | topic:kitchen
> في جاكوزي بالبيت؟ | topic:jacuzzi
> عدد غرف النوم كام؟ | topic:bedrooms
> والحمامات؟ | topic:bedrooms
> زين، شكرا | kind:chat-thanks

## سؤال خارج الموضوع ثم الكمباوند
> هلا | kind:chat-greet
> شو رأيك بمباراة الأمس؟ | kind:off-other-business
> أوك، بس أنا بدي أعرف عن الكمباوند | topic:about
> شو اللي يميزه عن الكمباوندات الثانية؟ | topic:about
> وكم بيكلف الشاليه تقريبا؟ | topic:prices
> زين بعدين باي | kind:chat-bye

## حكيلي عن الكمباوند
> مرحبا | kind:chat-greet
> حكيلي عن الكمباوند بشكل عام | topic:about
> شو الهدف من المشروع؟ | topic:what-sell
> وفي تقييم من عملاء سابقين؟ | topic:trust
> ماشي، شكرا | kind:chat-thanks

## الدفعة الأولى
> مرحبا | kind:chat-greet
> شو الحد الأدنى للدفعة الأولى؟ | topic:installments
> لا مش هيك، قصدي شو النسبة الشهرية | sorry
> ومتى بدي أدفع أول قسط؟ | topic:installments
> شكرا، باي | kind:chat-bye

## ساكن بالسعودية
> مرحبا | kind:chat-greet
> انا ساكن بالسعودية وبدي اشتري، كيف الإجراءات؟ | topic:buy-steps
> محتاج أحضر لعمّان؟ | topic:documents
> شو المستندات اللي بدي إياها؟ | topic:documents
> زين، يعطيك العافية | kind:chat-thanks

## أمن للأطفال
> اهلين | kind:chat-greet
> الأطفال بيقدروا يلعبوا برا لوحدهم؟ | topic:kids
> الكمباوند فيه أمن على مدار الساعة؟ | topic:security
> في محل صغير للطلبات؟ | topic:shop
> ماشي، شكرا | kind:chat-thanks

## كراج وملاعب
> ازيك، هو فيه كراج للعربيات؟ | topic:parking
> وفي مواقف للزوار؟ | topic:parking
> والبلد ده فيه ملاعب رياضية؟ | topic:sports
> عندي عيال عمرهم 8 سنين، في ملعب كورة؟ | topic:sports
> تمام يا باشا، شكرا | kind:chat-thanks

## الغولف
> هلا، فيه ملعب غولف؟ | topic:golf
> وميني جولف؟ | topic:golf
> شو المرافق الترفيهية الثانية؟ | topic:compound-facilities
> ومتى راح تكون جاهزة؟ | topic:future
> زين، شكرا | kind:chat-thanks

## لينا تسأل عن الحفلات
> مرحبا | kind:chat-greet
> شو اسمك؟ | kind:chat-persona
> اسمي لينا | name:لينا
> بقدر أعمل حفلة أو مناسبة هنا؟ | topic:events
> في قاعة أو مكان مخصص؟ | topic:events
> شكرا، باي | name:لينا

## العيادة والصيدلية
> هلا | kind:chat-greet
> انتي وين أقرب عيادة؟ | topic:medical
> وفي صيدلية؟ | topic:medical
> وإذا تعبت بالليل شو أعمل؟ | topic:medical
> ماشي، باي | kind:chat-bye

## اتحاد الملاك والرسوم
> اهلين | kind:chat-greet
> في اتحاد للملاك؟ | topic:owners
> والرسوم السنوية كم؟ | topic:fees
> شو الخدمات اللي بتدفع عليها؟ | topic:fees
> زين ومع السلامة | kind:chat-bye

## الطرق داخل الكمباوند
> مرحبا | kind:chat-greet
> الطريق للكمباوند معبد؟ | topic:roads
> وفي إضاءة بالشوارع؟ | topic:roads
> الشوارع الداخلية واسعة ولا ضيقة؟ | topic:roads
> شكرا، يعطيكي العافية | kind:chat-thanks

## شاليه E11 للأولاد
> هلا | kind:chat-greet
> في شاليه جاهز E11؟ | card:chalet:E11
> شو مميزاته؟ | card:chalet:E11:features
> وين مكانه؟ | card:chalet:E11:where
> مساحته؟ | card:chalet:E11:area
> ماشي شكرا | kind:chat-thanks

## شو تنصحيني؟
> مرحبا | kind:chat-greet
> شو تنصحيني أشتري، شاليه ولا أرض؟ | topic:recommend
> في شاليه أحسن من ثاني؟ | topic:recommend
> وشو عن تأجيره بعد؟ | topic:rent-invest
> شكرا جزيلا | kind:chat-thanks

## تعديل البناء
> اهلين | kind:chat-greet
> بقدر أعدّل على الشاليه أو أزيد بناء؟ | topic:modify
> في قوانين معينة للبناء؟ | topic:modify
> وإذا عملت تعديل مين بيشرف عليه؟ | topic:modify
> تمام شكرا | kind:chat-thanks

## عدد الشاليهات والمراحل
> مرحبا | kind:chat-greet
> كم شاليه عندكم بالمجموع؟ | topic:chalet-count
> كم مرحلة من المشروع؟ | topic:chalet-count
> وفي مراحل قادمة؟ | topic:future
> شكرا لكم | kind:chat-thanks

## أدهم والدفع
> اهلين | kind:chat-greet
> شو اسمك؟ | kind:chat-persona
> ادهم | name:ادهم
> في دفع كاش مع خصم؟ | topic:prices
> والتقسيط شو نسبته؟ | topic:installments
> باي | name:ادهم

## الكهرباء والعداد
> ازيك | kind:chat-greet
> الكهرباء مستقلة؟ | topic:electricity
> العداد باسمي؟ | topic:electricity
> وفي مياه نضيفة؟ | topic:water
> تمام، شكرا جدا | kind:chat-thanks
> باي | kind:chat-bye

## Arabizi visitor
> mar7aba | kind:chat-greet
> 3andkom mosque? | topic:mosque
> wesh el security? | topic:security
> wain el maktab? | topic:office
> 2addesh el ta3a lel shalih? | topic:prices
> shukran | kind:chat-thanks
