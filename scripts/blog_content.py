"""Blog articles for GoMadar.sa.

Each article has an Arabic and an English version. Body text is plain HTML
(h2, p, ul, ol, and the helper blocks below). Copy rules (see
landing/README.md) apply: no figures other than MADAR's own terms, no
guarantees or superlatives, formal Arabic, «مدار» masculine singular.
"""

PUBLISHED = "2026-09-27"
PUBLISHED_LABEL = {"ar": "سبتمبر 2026", "en": "September 2026"}


def callout(title, items):
    lis = "".join(f"<li>{i}</li>" for i in items)
    return f'<aside class="callout"><h3>{title}</h3><ul class="ticks">{lis}</ul></aside>'


def formula(text):
    return f'<p class="formula">{text}</p>'


ARTICLES = [
    {
        "slug": "choosing-a-food-supplier",
        "pattern": 0,
        "ar": {
            "tag": "الموردون",
            "title": "كيف تختار مورد مواد غذائية موثوقاً لمنشأتك",
            "description": "قائمة تحقق عملية لاختيار مورد مواد غذائية في السعودية: السجل التجاري، وشهادات هيئة الغذاء والدواء، وسلسلة التبريد، والتسعير، وشروط الدفع.",
            "lead": "المورد الذي تختاره يحدد جودة ما تقدّمه لعملائك، واستقرار تكاليفك، وانتظام عملك اليومي. هذه قائمة تحقق عملية تساعدك على تقييم أي مورد قبل أن تبدأ التعامل معه.",
            "body": """
<h2>تحقّق من الوضع النظامي أولاً</h2>
<p>قبل الحديث عن الأسعار، اطلب من المورد ما يثبت أنه منشأة نظامية تعمل في نشاط الأغذية:</p>
<ul>
<li>سجل تجاري ساري المفعول، ونشاط مسجّل يطابق ما يورّده.</li>
<li>تسجيل المنشأة أو المنتجات لدى الهيئة العامة للغذاء والدواء بحسب طبيعة المنتج.</li>
<li>التسجيل في ضريبة القيمة المضافة، والقدرة على إصدار فواتير إلكترونية متوافقة مع متطلبات هيئة الزكاة والضريبة والجمارك.</li>
</ul>
<p>هذه المستندات لا تثبت جودة المنتج وحدها، لكنها الحد الأدنى الذي لا ينبغي التنازل عنه.</p>

<h2>اسأل عن الجودة والسلامة الغذائية</h2>
<p>الجودة تُقاس بالأنظمة المتّبعة لا بالوعود. اسأل المورد عن:</p>
<ul>
<li>شهادات أنظمة سلامة الغذاء لديه، مثل HACCP أو ISO 22000.</li>
<li>طريقة التخزين في المستودع، والفصل بين المنتجات الجافة والمبرّدة والمجمّدة.</li>
<li>سلسلة التبريد أثناء النقل، وكيف تُراقَب درجات الحرارة.</li>
<li>سياسته في تواريخ الصلاحية: ما أقصر مدة صلاحية متبقية يقبل توريدها؟</li>
</ul>

<h2>قيّم انتظام التوريد</h2>
<p>السعر المنخفض يفقد قيمته إذا تأخرت الشحنة في يوم ذروة. تحقّق من:</p>
<ul>
<li>مواعيد التوصيل المتاحة، ومدى الالتزام بها.</li>
<li>الحد الأدنى للطلب، ومدى ملاءمته لحجم منشأتك.</li>
<li>آلية التعامل مع النواقص والمرتجعات والمنتجات التالفة.</li>
<li>وجود مسؤول تواصل واضح تعود إليه عند أي ملاحظة.</li>
</ul>

<h2>افهم التسعير وشروط الدفع</h2>
<ul>
<li>هل الأسعار شاملة ضريبة القيمة المضافة والتوصيل؟</li>
<li>كيف ومتى تُبلَّغ بتغيّر الأسعار؟</li>
<li>هل يتاح الدفع الآجل؟ وما مدته وشروطه؟</li>
<li>هل تحصل على فاتورة واضحة لكل طلب؟</li>
</ul>
<p>قارن التكلفة الإجمالية لا سعر الوحدة فقط: التوصيل، والحد الأدنى للطلب، والهدر الناتج عن قِصر الصلاحية، كلها جزء من السعر الحقيقي.</p>

<h2>ابدأ بطلب تجريبي</h2>
<p>قبل الالتزام بكميات كبيرة، اطلب كمية محدودة وراقب دقة الطلب، وحالة المنتجات عند الاستلام، والالتزام بالموعد، وسرعة التجاوب عند وجود ملاحظة. تجربة واقعية واحدة تكشف أكثر مما يكشفه أي عرض تقديمي.</p>

<h2>لا تعتمد على مورد واحد</h2>
<p>وجود مورد بديل لكل صنف أساسي يحميك من انقطاع مفاجئ، ويمنحك مرجعاً واقعياً عند مقارنة الأسعار والشروط.</p>
""" + callout("قائمة التحقق المختصرة", [
                "سجل تجاري ساري ونشاط مطابق",
                "تسجيل لدى الهيئة العامة للغذاء والدواء",
                "فواتير إلكترونية متوافقة وشاملة الضريبة",
                "شهادات سلامة غذائية وطريقة تخزين واضحة",
                "سلسلة تبريد مراقَبة أثناء النقل",
                "مواعيد توصيل وحد أدنى مناسبان",
                "تسعير واضح وشروط دفع مكتوبة",
                "طلب تجريبي ناجح قبل الالتزام",
            ]) + """
<h2>كيف يساعدك مدار</h2>
<p>في مدار، لا يدخل المنصة مورد قبل التحقق من سجله التجاري وشهادات الغذاء والدواء وشهادات الجودة. وتُعرض لك أسعار الموردين المعتمدين جنباً إلى جنب، مع خيار الدفع الآجل حتى 45 يوماً عبر شراكة مع جهة تمويل مرخصة.</p>
""",
        },
        "en": {
            "tag": "Suppliers",
            "title": "How to choose a reliable food supplier for your business",
            "description": "A practical checklist for choosing a food supplier in Saudi Arabia: commercial registration, SFDA certificates, cold chain, pricing and payment terms.",
            "lead": "The supplier you choose shapes the quality you serve, the stability of your costs and the rhythm of your daily operations. This practical checklist helps you assess any supplier before you start working with them.",
            "body": """
<h2>Check the legal basics first</h2>
<p>Before discussing prices, ask the supplier for proof that they are a properly registered food business:</p>
<ul>
<li>A valid commercial registration, with a registered activity that matches what they supply.</li>
<li>Registration of the facility or products with the Saudi Food and Drug Authority, as the product requires.</li>
<li>VAT registration, and the ability to issue e-invoices that meet ZATCA requirements.</li>
</ul>
<p>These documents do not prove product quality on their own, but they are the minimum you should not compromise on.</p>

<h2>Ask about quality and food safety</h2>
<p>Quality is measured by systems, not promises. Ask the supplier about:</p>
<ul>
<li>Food safety certifications, such as HACCP or ISO 22000.</li>
<li>How the warehouse stores goods, and how dry, chilled and frozen products are kept apart.</li>
<li>The cold chain in transit, and how temperatures are monitored.</li>
<li>Their shelf-life policy: what is the shortest remaining shelf life they will deliver?</li>
</ul>

<h2>Assess delivery reliability</h2>
<p>A low price loses its value if a delivery is late on a peak day. Check:</p>
<ul>
<li>Available delivery windows, and how consistently they are met.</li>
<li>The minimum order, and whether it suits the size of your business.</li>
<li>How shortages, returns and damaged goods are handled.</li>
<li>Whether there is a clear point of contact for any issue.</li>
</ul>

<h2>Understand pricing and payment terms</h2>
<ul>
<li>Do prices include VAT and delivery?</li>
<li>How and when are you told about price changes?</li>
<li>Is deferred payment available? For how long, and on what terms?</li>
<li>Do you receive a clear invoice for every order?</li>
</ul>
<p>Compare the total cost, not just the unit price: delivery, minimum order and waste from short shelf life are all part of the real price.</p>

<h2>Start with a trial order</h2>
<p>Before committing to large volumes, place a limited order and watch for order accuracy, product condition on arrival, punctuality and responsiveness when something needs fixing. One real trial reveals more than any presentation.</p>

<h2>Do not rely on a single supplier</h2>
<p>Having an alternative supplier for each essential item protects you from sudden disruption and gives you a realistic reference when comparing prices and terms.</p>
""" + callout("Quick checklist", [
                "Valid commercial registration and matching activity",
                "Registration with the Saudi Food and Drug Authority",
                "Compliant, VAT-inclusive e-invoices",
                "Food safety certification and clear storage practices",
                "A monitored cold chain in transit",
                "Suitable delivery windows and minimum order",
                "Clear pricing and written payment terms",
                "A successful trial order before committing",
            ]) + """
<h2>How MADAR helps</h2>
<p>On MADAR, no supplier is admitted before their commercial registration, food and drug certificates and quality certificates are verified. Prices from certified suppliers are shown side by side, with the option of deferred payment for up to 45 days through a partnership with a licensed financing institution.</p>
""",
        },
    },
    {
        "slug": "deferred-payment-for-restaurants-and-grocers",
        "pattern": 1,
        "ar": {
            "tag": "التمويل",
            "title": "الدفع الآجل للمطاعم والبقالات: كيف تستفيد منه دون أن يُثقل تدفقك النقدي",
            "description": "ما الدفع الآجل للمنشآت؟ الفرق بين آجل المورد وتمويل الفواتير، ومتى يفيدك، والأسئلة التي تطرحها قبل استخدامه.",
            "lead": "تدفع المطاعم والبقالات ثمن البضاعة اليوم، وتستعيده من مبيعاتها على مدى الأيام التالية. هذه الفجوة بين الشراء والتحصيل هي ما يجعل إدارة التدفق النقدي تحدياً يومياً، وهي ما صُمّم الدفع الآجل لمعالجته.",
            "body": """
<h2>ما الدفع الآجل للمنشآت؟</h2>
<p>هو ترتيب تستلم فيه البضاعة الآن، وتسدد قيمتها لاحقاً خلال مدة متفق عليها. ويأتي عادة بإحدى صورتين:</p>
<ul>
<li><strong>آجل المورد:</strong> يمنحك المورد نفسه مهلة للسداد، ويتحمّل هو انتظار التحصيل.</li>
<li><strong>تمويل الفواتير:</strong> تسدد جهة تمويل قيمة الفاتورة للمورد، ثم تسددها أنت لجهة التمويل لاحقاً. وفي المملكة، تخضع جهات التمويل لترخيص البنك المركزي السعودي.</li>
</ul>

<h2>متى يفيدك؟</h2>
<ul>
<li>عندما تسبق دورة الشراء دورة البيع، كما في المواسم والمناسبات.</li>
<li>عند التوسع أو افتتاح فرع جديد يحتاج مخزوناً أولياً.</li>
<li>لتفادي تجميد السيولة في مخزون لم يُبع بعد.</li>
<li>للشراء بكميات أنسب دون استنزاف الحساب الجاري.</li>
</ul>

<h2>متى يصبح عبئاً؟</h2>
<p>الدفع الآجل أداة، وسوء استخدامها مكلف. انتبه إلى:</p>
<ul>
<li>الشراء بأكثر من حاجتك لأن السداد مؤجل.</li>
<li>تراكم الاستحقاقات في فترة واحدة.</li>
<li>إغفال الرسوم أو شروط التأخر في السداد.</li>
<li>الاعتماد عليه لتغطية خسائر تشغيلية بدل معالجة أسبابها.</li>
</ul>

<h2>أسئلة تطرحها قبل الاستخدام</h2>
<ol>
<li>ما مدة السداد، ومن أي تاريخ تُحتسب؟</li>
<li>هل توجد رسوم أو تكلفة تمويل، وكيف تُحتسب؟</li>
<li>ما الذي يترتب على التأخر في السداد؟</li>
<li>ما الحد الائتماني المتاح لمنشأتك، وكيف يُراجَع؟</li>
<li>من الجهة المموّلة، وهل هي مرخصة؟</li>
<li>هل يؤثر الاستخدام على سجلك الائتماني؟</li>
</ol>

<h2>كيف تديره بانضباط</h2>
<ul>
<li>اربط مواعيد السداد بدورة مبيعاتك الفعلية.</li>
<li>ابدأ بالأصناف سريعة الدوران.</li>
<li>احتفظ بجدول بسيط لكل الاستحقاقات القادمة.</li>
<li>راجع الاستخدام دورياً وقارنه بالمبيعات.</li>
</ul>

<h2>ضامن: الدفع الآجل في مدار</h2>
<p>ضامن خيار دفع مدمج في مدار: عند تأكيد الطلب يُدفع للمورد فوراً، وتُسدّد أنت خلال 45 يوماً، عبر شراكة مع جهة تمويل مرخصة. ويخضع الاستخدام لشروط جهة التمويل ولتقييم الأهلية.</p>
""",
        },
        "en": {
            "tag": "Financing",
            "title": "Deferred payment for restaurants and grocers: using it without straining your cash flow",
            "description": "What is B2B deferred payment? The difference between supplier credit and invoice financing, when it helps, and the questions to ask before using it.",
            "lead": "Restaurants and grocers pay for stock today and recover the cost from sales over the following days. That gap between buying and collecting is what makes cash flow a daily challenge, and it is what deferred payment is designed to address.",
            "body": """
<h2>What is B2B deferred payment?</h2>
<p>It is an arrangement in which you receive goods now and pay for them later, within an agreed period. It usually takes one of two forms:</p>
<ul>
<li><strong>Supplier credit:</strong> the supplier gives you time to pay and carries the wait for collection.</li>
<li><strong>Invoice financing:</strong> a financing institution pays the supplier's invoice, and you repay the institution later. In the Kingdom, financing institutions are licensed by the Saudi Central Bank.</li>
</ul>

<h2>When does it help?</h2>
<ul>
<li>When your buying cycle runs ahead of your sales cycle, as in seasons and occasions.</li>
<li>When expanding or opening a new branch that needs opening stock.</li>
<li>To avoid tying up cash in stock that has not sold yet.</li>
<li>To buy in more suitable quantities without draining your current account.</li>
</ul>

<h2>When does it become a burden?</h2>
<p>Deferred payment is a tool, and misusing it is costly. Watch for:</p>
<ul>
<li>Buying more than you need because payment is deferred.</li>
<li>Repayments piling up in a single period.</li>
<li>Overlooking fees or late-payment terms.</li>
<li>Relying on it to cover operating losses instead of fixing their causes.</li>
</ul>

<h2>Questions to ask before using it</h2>
<ol>
<li>What is the repayment period, and from which date is it counted?</li>
<li>Are there fees or financing costs, and how are they calculated?</li>
<li>What happens if a payment is late?</li>
<li>What credit limit is available to your business, and how is it reviewed?</li>
<li>Who is the financing institution, and is it licensed?</li>
<li>Does using it affect your credit record?</li>
</ol>

<h2>How to manage it with discipline</h2>
<ul>
<li>Align repayment dates with your actual sales cycle.</li>
<li>Start with fast-moving items.</li>
<li>Keep a simple schedule of all upcoming repayments.</li>
<li>Review usage regularly against your sales.</li>
</ul>

<h2>Dhamen: deferred payment on MADAR</h2>
<p>Dhamen is a payment option built into MADAR: when you confirm an order, the supplier is paid upfront, and you settle within 45 days through a partnership with a licensed financing institution. Use is subject to the financing institution's terms and an eligibility assessment.</p>
""",
        },
    },
    {
        "slug": "preventing-stock-outs",
        "pattern": 2,
        "ar": {
            "tag": "المخزون",
            "title": "كيف تتجنب نفاد المخزون في المطعم أو البقالة",
            "description": "خطوات عملية لتقليل نفاد المخزون: نقطة إعادة الطلب، والمخزون الاحتياطي، وتصنيف الأصناف، وصرف المخزون حسب الصلاحية.",
            "lead": "نفاد صنف أساسي في منتصف يوم العمل يعني طلبات لا تُلبّى، وعملاء يتجهون إلى غيرك. والحل ليس تكديس المخزون، بل معرفة متى تطلب وكم تطلب.",
            "body": """
<h2>ابدأ بمعرفة استهلاكك</h2>
<p>سجّل ما تستهلكه من كل صنف أساسي يومياً أو أسبوعياً. من دون هذا السجل، تبقى قرارات الطلب تخميناً مهما كانت الخبرة.</p>

<h2>حدّد نقطة إعادة الطلب</h2>
<p>نقطة إعادة الطلب هي المستوى الذي إذا بلغه المخزون وجب إصدار طلب جديد. وتُحسب تقريبياً على النحو الآتي:</p>
""" + formula("نقطة إعادة الطلب = متوسط الاستهلاك اليومي × مدة التوريد بالأيام + المخزون الاحتياطي") + """
<p>ومدة التوريد هي الوقت بين إصدار الطلب ووصول البضاعة إلى منشأتك، لا وقت الشحن وحده.</p>

<h2>احتفظ بمخزون احتياطي مدروس</h2>
<p>المخزون الاحتياطي يحميك من تأخر التوريد أو ارتفاع الطلب المفاجئ. اجعله أكبر للأصناف الحرجة وسريعة الدوران، وأصغر للأصناف قصيرة الصلاحية حتى لا يتحول إلى هدر.</p>

<h2>صنّف أصنافك حسب أهميتها</h2>
<p>لا يستحق كل صنف الدرجة نفسها من المتابعة. يساعدك تصنيف ABC على توزيع جهدك:</p>
<ul>
<li><strong>الفئة (أ):</strong> أصناف قليلة تمثل الجزء الأكبر من قيمة مشترياتك، وتستحق مراقبة لصيقة.</li>
<li><strong>الفئة (ب):</strong> أصناف متوسطة الأهمية، تكفيها متابعة منتظمة.</li>
<li><strong>الفئة (ج):</strong> أصناف كثيرة منخفضة القيمة، تكفيها مراجعة دورية.</li>
</ul>

<h2>اصرف المخزون حسب الصلاحية</h2>
<p>طبّق مبدأ «ما تنتهي صلاحيته أولاً يُصرف أولاً» (FEFO)، ورتّب التخزين بحيث يكون الأقرب انتهاءً في المقدمة. هذا يقلل الهدر ويحافظ على جودة ما تقدّمه.</p>

<h2>اجعل المراجعة عادة</h2>
<ul>
<li>جرد دوري قصير للأصناف الحرجة.</li>
<li>مقارنة الاستهلاك الفعلي بما خططت له.</li>
<li>تحديث نقاط إعادة الطلب قبل المواسم والمناسبات.</li>
<li>التواصل مع الموردين مبكراً عند توقع ارتفاع الطلب.</li>
</ul>

<h2>مستشعر المخزون الذكي في مدار</h2>
<p>يقرأ مستشعر المخزون الذكي أنماط استهلاكك، ويتنبأ بالنفاد، ويقترح إعادة الطلب من موردين معتمدين — لتشتري بذكاء، لا بالتخمين.</p>
""",
        },
        "en": {
            "tag": "Inventory",
            "title": "How to avoid stock-outs in your restaurant or grocery store",
            "description": "Practical steps to reduce stock-outs: reorder points, safety stock, item classification and expiry-based stock rotation.",
            "lead": "Running out of an essential item mid-shift means orders you cannot fill and customers who go elsewhere. The answer is not to overstock, but to know when to order and how much.",
            "body": """
<h2>Start by knowing your consumption</h2>
<p>Record how much of each essential item you use, daily or weekly. Without that record, ordering decisions remain guesswork, however experienced you are.</p>

<h2>Set a reorder point</h2>
<p>The reorder point is the stock level at which a new order must be placed. It can be estimated as follows:</p>
""" + formula("Reorder point = average daily usage × lead time in days + safety stock") + """
<p>Lead time is the time between placing an order and the goods arriving at your business, not the shipping time alone.</p>

<h2>Keep a considered safety stock</h2>
<p>Safety stock protects you from late deliveries or sudden spikes in demand. Keep more of it for critical, fast-moving items, and less for short-shelf-life items so it does not turn into waste.</p>

<h2>Classify your items by importance</h2>
<p>Not every item deserves the same level of attention. ABC classification helps you focus your effort:</p>
<ul>
<li><strong>Category A:</strong> a few items that make up most of your purchasing value, and deserve close monitoring.</li>
<li><strong>Category B:</strong> moderately important items that need regular follow-up.</li>
<li><strong>Category C:</strong> many low-value items that need only periodic review.</li>
</ul>

<h2>Rotate stock by expiry</h2>
<p>Apply “first expired, first out” (FEFO), and arrange storage so the items closest to expiry are at the front. This reduces waste and protects the quality of what you serve.</p>

<h2>Make review a habit</h2>
<ul>
<li>A short periodic count of critical items.</li>
<li>Comparing actual usage with what you planned.</li>
<li>Updating reorder points before seasons and occasions.</li>
<li>Talking to suppliers early when you expect demand to rise.</li>
</ul>

<h2>The smart inventory sensor on MADAR</h2>
<p>MADAR's smart inventory sensor reads your consumption patterns, predicts stock-outs and suggests reorders from certified suppliers — so you buy on insight, not on guesswork.</p>
""",
        },
    },
]

BLOG_INDEX = {
    "ar": {
        "title": "مدونة مدار",
        "heading": "مدونة مدار",
        "description": "مقالات عملية لأصحاب المطاعم والبقالات والمنشآت الغذائية في السعودية: اختيار الموردين، والدفع الآجل، وإدارة المخزون.",
        "lead": "مقالات عملية لأصحاب المطاعم والبقالات والمنشآت الغذائية: اختيار الموردين، والدفع الآجل، وإدارة المخزون.",
    },
    "en": {
        "title": "The MADAR blog",
        "heading": "The MADAR blog",
        "description": "Practical articles for restaurant, grocery and food business owners in Saudi Arabia: choosing suppliers, deferred payment and inventory management.",
        "lead": "Practical articles for restaurant, grocery and food business owners: choosing suppliers, deferred payment and inventory management.",
    },
}
