// Kiswahili texts, keyed by the English wording used in the pages.
// A text with no entry here simply shows in English. Texts in {braces} are filled in by the page.
//
// NEEDS REVIEW by a native Swahili speaker before launch, especially the FAQ answers,
// payment and fee wording, and the farmer-facing text.

export const sw: Record<string, string> = {
  // ---- Navigation and layout
  Home: 'Nyumbani',
  'Work with us': 'Fanya kazi nasi',
  Traceability: 'Ufuatiliaji wa mazao',
  'Farm tracker & market board': 'Ufuatiliaji wa mashamba na bei za sokoni',
  'Stories from the field': 'Hadithi kutoka shambani',
  FAQ: 'Maswali ya mara kwa mara',
  Contact: 'Wasiliana nasi',
  Main: 'Menyu kuu',
  'WhatsApp us': 'Tuandikie WhatsApp',
  'WhatsApp us on {phone}': 'Tuandikie WhatsApp kupitia {phone}',
  '{name} home': 'Ukurasa wa mwanzo wa {name}',
  'Fresh Produce': 'Mazao Mapya',
  Pages: 'Kurasa',
  Visit: 'Tembelea',
  'Marikiti Market, Nairobi': 'Soko la Marikiti, Nairobi',
  'Karatina, Nyeri County': 'Karatina, Kaunti ya Nyeri',
  'Grower, offtaker and market link for Kenyan fresh produce.':
    'Mkulima, mnunuzi wa mazao na kiungo cha soko kwa mazao mapya ya Kenya.',

  // ---- Home
  'Karatina, Nyeri · Marikiti, Nairobi': 'Karatina, Nyeri · Marikiti, Nairobi',
  'We grow, buy and connect Kenyan fresh produce to market.':
    'Tunakuza, tunanunua na kuunganisha mazao mapya ya Kenya na soko.',
  'From our farm in Karatina and a network of contracted growers to Marikiti and beyond. Every crate carries a batch code you can trace back to the field it came from.':
    'Kutoka shamba letu la Karatina na mtandao wa wakulima tunaofanya nao kazi hadi Marikiti na kwingineko. Kila kreti ina msimbo wa kundi unaokuwezesha kufuatilia shamba ambako mazao yalitoka.',
  'Capsicum greenhouse at the Auxesis Karatina farm': 'Greenhouse ya pilipili hoho katika shamba la Auxesis, Karatina',
  'For buyers': 'Kwa wanunuzi',
  'Source produce': 'Pata mazao',
  'Hotels, supermarkets, exporters, processors and Marikiti traders. Steady volumes, graded to spec, with records for every batch.':
    'Hoteli, maduka makubwa, wasafirishaji nje, wasindikaji na wafanyabiashara wa Marikiti. Kiasi cha uhakika, mazao yaliyopangwa kwa madaraja, na kumbukumbu za kila kundi.',
  'Request a supply quote': 'Omba nukuu ya bei ya usambazaji',
  'For farmers': 'Kwa wakulima',
  'Sell your produce': 'Uza mazao yako',
  'We buy what we grow ourselves, and link you to buyers for everything else. Clear grades, clear fees, prompt payment.':
    'Tunanunua mazao tunayokuza sisi wenyewe, na kukuunganisha na wanunuzi kwa mengine yote. Madaraja wazi, ada wazi, malipo ya haraka.',
  'What we do': 'Tunachofanya',
  'We grow': 'Tunakuza',
  'We buy': 'Tunanunua',
  'We connect': 'Tunaunganisha',
  'Cucumbers, red and yellow capsicum, chillies and butternuts from our own farm in Karatina, sold wholesale and retail at Marikiti.':
    'Matango, pilipili hoho nyekundu na za njano, pilipili na boga la butternut kutoka shamba letu la Karatina, tunauza kwa jumla na rejareja Marikiti.',
  'As an offtaker, we buy the same crops from contracted farmers at an agreed grade and price, and collect from the farm.':
    'Kama mnunuzi wa mazao, tunanunua mazao hayo hayo kutoka kwa wakulima tunaofanya nao kazi kwa daraja na bei tuliyokubaliana, na tunayachukua shambani.',
  "For crops we don't grow, we link farmers to buyers in our network for a fee charged only when a sale is completed.":
    'Kwa mazao ambayo hatukuzi, tunaunganisha wakulima na wanunuzi katika mtandao wetu, kwa ada inayotozwa tu mauzo yakikamilika.',
  'Every crate has a record': 'Kila kreti ina kumbukumbu',
  'Each batch is coded at harvest with the farm, block and date. Buyers can look up any code to see where their produce was grown and how it reached market.':
    'Kila kundi hupewa msimbo wakati wa mavuno, ukionyesha shamba, kipande cha shamba na tarehe. Wanunuzi wanaweza kutafuta msimbo wowote kuona mazao yao yalikokuzwa na jinsi yalivyofika sokoni.',
  'Trace a batch': 'Fuatilia kundi',
  'Open the farm tracker': 'Fungua ufuatiliaji wa mashamba',
  'Market board': 'Bei za sokoni',
  'This week at Marikiti': 'Wiki hii Marikiti',
  'Full market board': 'Bei zote za sokoni',
  'Sample figures. Updated every Monday.': 'Takwimu za mfano. Husasishwa kila Jumatatu.',
  Cucumbers: 'Matango',
  'Red capsicum': 'Pilipili hoho nyekundu',
  'Yellow capsicum': 'Pilipili hoho ya njano',
  'KES per kg': 'KES kwa kilo',
  'KES per piece': 'KES kwa kipande',
  'All stories': 'Hadithi zote',
  Stories: 'Hadithi',
  Farmers: 'Wakulima',
  Market: 'Soko',
  'Growing grade-A capsicum in Central Kenya': 'Kukuza pilipili hoho ya daraja A katika Kenya ya Kati',
  'Fresh produce outlook for November': 'Mwelekeo wa mazao mapya mwezi Novemba',
  'Farmer profile: selling beyond the local broker': 'Wasifu wa mkulima: kuuza zaidi ya dalali wa kawaida',
  'Guide · 6 min': 'Mwongozo · dakika 6',
  'Market report · 3 min': 'Ripoti ya soko · dakika 3',
  'Profile · 5 min': 'Wasifu · dakika 5',
  'Grower guides, market reports and farmer profiles from Auxesis Fresh Produce.':
    'Miongozo ya kilimo, ripoti za soko na wasifu wa wakulima kutoka Auxesis Fresh Produce.',
  'We grow, buy and connect Kenyan fresh produce to market. Cucumbers, capsicum, chillies and butternuts from our Karatina farm and contracted farmers, with every batch traceable.':
    'Tunakuza, tunanunua na kuunganisha mazao mapya ya Kenya na soko. Matango, pilipili hoho, pilipili na boga la butternut kutoka shamba letu la Karatina na wakulima tunaofanya nao kazi, kila kundi likiweza kufuatiliwa.',

  // ---- Work with us
  'Buyers and farmers, one market link': 'Wanunuzi na wakulima, kiungo kimoja cha soko',
  'Buyers source graded produce with batch records. Farmers sell with clear grades, clear fees and prompt payment.':
    'Wanunuzi hupata mazao yaliyopangwa kwa madaraja yenye kumbukumbu za makundi. Wakulima huuza kwa madaraja wazi, ada wazi na malipo ya haraka.',
  'We buy what we grow ourselves, and link you to buyers for everything else. Fees are charged only when a sale is completed.':
    'Tunanunua mazao tunayokuza sisi wenyewe, na kukuunganisha na wanunuzi kwa mengine yote. Ada hutozwa tu mauzo yakikamilika.',
  'Register your farm': 'Sajili shamba lako',
  'Business name': 'Jina la biashara',
  'Crops & weekly volume': 'Mazao na kiasi kwa wiki',
  'Phone or WhatsApp': 'Simu au WhatsApp',
  'Your name': 'Jina lako',
  'County & crop': 'Kaunti na zao',
  Send: 'Tuma',
  'Leave this empty': 'Acha hapa patupu',
  "Thanks — we'll be in touch on WhatsApp.": 'Asante — tutawasiliana nawe kupitia WhatsApp.',
  'We could not send that. Please try again, or message us on WhatsApp.':
    'Hatukuweza kutuma hilo. Tafadhali jaribu tena, au tuandikie kupitia WhatsApp.',
  'Please fill in all three fields.': 'Tafadhali jaza sehemu zote tatu.',

  // ---- Tracker, trace, batch cards
  'Farm tracker and market board': 'Ufuatiliaji wa mashamba na bei za sokoni',
  'See what is planted, growing and ready for market, farm by farm, plus this week at Marikiti.':
    'Angalia kinachopandwa, kinachokua na kilicho tayari sokoni, shamba kwa shamba, pamoja na bei za wiki hii Marikiti.',
  'Live listing': 'Orodha ya moja kwa moja',
  'Farm production tracker': 'Ufuatiliaji wa uzalishaji mashambani',
  'Follow every batch from the day it was planted to the day it is ready at Marikiti and City Park, across our Karatina farm and commercial growers countrywide.':
    'Fuatilia kila kundi tangu siku lilipopandwa hadi siku litakapokuwa tayari Marikiti na City Park, katika shamba letu la Karatina na wakulima wa kibiashara nchini kote.',
  'Farms in production': 'Mashamba yanayozalisha',
  'Batches ready for market': 'Makundi tayari sokoni',
  'Tracked volume': 'Kiasi kinachofuatiliwa',
  Crop: 'Zao',
  'All crops': 'Mazao yote',
  Stage: 'Hatua',
  'Pipeline: tap a stage to see only those batches.': 'Hatua: gusa hatua ili kuona makundi ya hatua hiyo pekee.',
  '{stage}, 1 batch': '{stage}, kundi 1',
  '{stage}, {n} batches': '{stage}, makundi {n}',
  'Loading batches…': 'Inapakia makundi…',
  'We could not load the tracker right now.': 'Hatukuweza kupakia ufuatiliaji kwa sasa.',
  'Please refresh the page in a moment. If it keeps happening, call us on the number on the Contact page.':
    'Tafadhali onyesha upya ukurasa baada ya muda mfupi. Tatizo likiendelea, tupigie kwa namba iliyo kwenye ukurasa wa Wasiliana nasi.',
  'No batches have been registered yet.': 'Bado hakuna makundi yaliyosajiliwa.',
  'No batches match those filters.': 'Hakuna makundi yanayolingana na vichujio hivyo.',
  'Clear filters': 'Futa vichujio',
  Planted: 'Imepandwa',
  Growing: 'Inakua',
  Harvesting: 'Inavunwa',
  Harvested: 'Imevunwa',
  'Grading & Packing': 'Kupanga madaraja na kufungasha',
  'Ready for Market': 'Tayari sokoni',
  Dispatched: 'Imesafirishwa',
  'Expected harvest': 'Mavuno yanayotarajiwa',
  'Market ready': 'Tayari sokoni',
  'Our farm': 'Shamba letu',
  'Grade {grade}': 'Daraja {grade}',
  'Stage {n} of {total}: {stage}': 'Hatua ya {n} kati ya {total}: {stage}',
  'Enter the batch code on your crate to see the farm, block and every stage it passed through.':
    'Weka msimbo wa kundi ulio kwenye kreti yako kuona shamba, kipande cha shamba na kila hatua iliyopitiwa.',
  'Each batch is coded at harvest with the farm, block and date. Enter the code printed on your crate to see where it was grown and every stage it passed through.':
    'Kila kundi hupewa msimbo wakati wa mavuno, ukionyesha shamba, kipande cha shamba na tarehe. Weka msimbo ulioandikwa kwenye kreti yako kuona lilikokuzwa na kila hatua iliyopitiwa.',
  'Type the batch code printed on your crate to see the farm it came from and the dates it passed each stage.':
    'Andika msimbo wa kundi ulioandikwa kwenye kreti yako kuona shamba lilikotoka na tarehe lilizopitia kila hatua.',
  'Batch code': 'Msimbo wa kundi',
  'For example AUX-KAR-001': 'Kwa mfano AUX-KAR-001',
  'Trace batch': 'Fuatilia kundi',
  'Try:': 'Jaribu:',
  'Looking up {code}…': 'Inatafuta {code}…',
  'We could not look that up right now. Please try again.': 'Hatukuweza kutafuta hilo kwa sasa. Tafadhali jaribu tena.',
  'We have no batch with the code': 'Hatuna kundi lenye msimbo',
  'Check the code on your crate, or': 'Angalia msimbo ulio kwenye kreti yako, au',
  'contact us': 'wasiliana nasi',
  'Journey of {crop}': 'Safari ya {crop}',
  Now: 'Sasa',

  // ---- Crops and produce page
  'Local Cucumber': 'Tango la Kienyeji',
  'English Cucumber': 'Tango la Kiingereza',
  'Red Capsicum': 'Pilipili hoho nyekundu',
  'Yellow Capsicum': 'Pilipili hoho ya njano',
  Chillies: 'Pilipili',
  Butternuts: 'Boga la butternut',
  Broccoli: 'Broccoli',
  Cauliflower: 'Kolifulawa',
  Zucchini: 'Zucchini (courgette)',
  'Short, crisp and thin-skinned, the everyday favourite moving fastest at Marikiti.':
    'Fupi, gumu kidogo na lenye ngozi nyembamba, pendwa ya kila siku inayouzwa kwa kasi zaidi Marikiti.',
  'Long, seedless greenhouse cucumbers graded and sleeved for hotels and supermarkets.':
    'Matango marefu yasiyo na mbegu yanayokuzwa kwenye greenhouse, yamepangwa kwa madaraja na kufungwa kwa hoteli na maduka makubwa.',
  'Fully ripened sweet peppers, colour-graded and packed in 5kg crates.':
    'Pilipili hoho tamu zilizoiva kikamilifu, zimepangwa kwa rangi na kufungwa kwenye kreti za kilo 5.',
  'Bright, thick-walled yellow peppers grown under net for consistent colour.':
    'Pilipili hoho za njano zenye rangi angavu na nyama nene, zinazokuzwa chini ya neti ili rangi iwe sawa.',
  'Bird eye and cayenne chillies, hand-picked and sorted by heat and length.':
    'Pilipili za bird eye na cayenne, zinazochumwa kwa mkono na kupangwa kulingana na ukali na urefu.',
  'Cured butternut squash with long shelf life, ideal for bulk wholesale runs.':
    'Boga la butternut lililokaushwa kwa muda mrefu wa kukaa, bora kwa mauzo ya jumla ya kiasi kikubwa.',
  'Tight, deep-green heads cut in the cool of the morning and moved the same day.':
    'Vichwa vya kijani kibichi vilivyobana, vinavyokatwa asubuhi penye baridi na kusafirishwa siku hiyo hiyo.',
  'Creamy-white, compact curds grown in the Karatina highlands and trimmed to spec.':
    'Vichwa vyeupe vilivyobana vinavyokuzwa katika nyanda za juu za Karatina na kukatwa kwa vipimo vinavyohitajika.',
  'Young, glossy courgettes picked at uniform length for hotels and grocers.':
    'Zucchini changa zinazong’aa, zinazochumwa kwa urefu unaolingana kwa hoteli na wauzaji wa mboga.',
  'Greenhouse grown': 'Hukuzwa kwenye greenhouse',
  'Open field': 'Shamba la wazi',
  '10kg / 20kg / 50kg crates · loose or bagged · tonnes on order':
    'Kreti za kilo 10 / 20 / 50 · bila kufungwa au kwenye mifuko · tani kwa oda',
  '10kg / 20kg crates · sleeved · 100kg and tonnes on order':
    'Kreti za kilo 10 / 20 · zimefungwa · kilo 100 na tani kwa oda',
  '10kg / 20kg crates · colour graded · tonnes on order': 'Kreti za kilo 10 / 20 · zimepangwa kwa rangi · tani kwa oda',
  '10kg / 20kg crates · sorted by heat · 50kg on order': 'Kreti za kilo 10 / 20 · zimepangwa kwa ukali · kilo 50 kwa oda',
  '20kg / 50kg / 100kg nets · cured · tonnes on order': 'Neti za kilo 20 / 50 / 100 · zimekaushwa · tani kwa oda',
  '10kg / 20kg crates · iced heads · 50kg on order': 'Kreti za kilo 10 / 20 · vichwa vilivyowekwa barafu · kilo 50 kwa oda',
  '10kg / 20kg crates · trimmed & wrapped · 50kg on order':
    'Kreti za kilo 10 / 20 · zimekatwa na kufungwa · kilo 50 kwa oda',
  '10kg / 20kg / 50kg crates · size graded · tonnes on order':
    'Kreti za kilo 10 / 20 / 50 · zimepangwa kwa ukubwa · tani kwa oda',
  'Our produce': 'Mazao yetu',
  'Cucumbers, red and yellow capsicum, chillies, butternuts, broccoli, cauliflower and zucchini in wholesale pack sizes from our Karatina farm and contracted Kenyan growers.':
    'Matango, pilipili hoho nyekundu na za njano, pilipili, boga la butternut, broccoli, kolifulawa na zucchini kwa vifurushi vya jumla kutoka shamba letu la Karatina na wakulima wa Kenya tunaofanya nao kazi.',
  'Wholesale & retail': 'Jumla na rejareja',
  'Nine focused lines, mostly grown in open field and greenhouse, supplied consistently to traders, grocers, hotels and households at Marikiti and City Park, from our Karatina farm and commercial growers across Kenya. Our pack sizes start from 10kg, 20kg, 50kg and 100kg, up to full tonnage on order.':
    'Aina tisa kuu za mazao, mengi yakikuzwa shamba la wazi na kwenye greenhouse, tunayosambaza kwa uhakika kwa wafanyabiashara, wauzaji wa mboga, hoteli na kaya katika Marikiti na City Park, kutoka shamba letu la Karatina na wakulima wa kibiashara kote Kenya. Vifurushi vyetu huanzia kilo 10, 20, 50 na 100, hadi tani kamili kwa oda.',
  'Search produce, e.g. courgette, bell pepper, cucumber': 'Tafuta mazao, k.m. courgette, pilipili hoho, tango',
  'Search produce': 'Tafuta mazao',
  'Clear search': 'Futa utafutaji',
  'Growing method': 'Njia ya kukuza',
  'All growing methods': 'Njia zote za kukuza',
  'Pack size': 'Ukubwa wa kifurushi',
  Any: 'Yoyote',
  tonnes: 'tani',
  '{n} of {total} lines': 'Aina {n} kati ya {total}',
  'No produce matches those filters.': 'Hakuna mazao yanayolingana na vichujio hivyo.',
  'Try a different word or pack size, or ask us. We can often source what is not listed.':
    'Jaribu neno au ukubwa tofauti wa kifurushi, au tuulize. Mara nyingi tunaweza kupata kisichoorodheshwa.',
  'Request a quote': 'Omba nukuu ya bei',
  'Inside our greenhouses': 'Ndani ya greenhouse zetu',
  'Capsicum, from seedling to fruit': 'Pilipili hoho, kutoka mche hadi tunda',
  'Our red and yellow capsicum start as transplanted seedlings on drip lines and are trellised through fruiting. They are picked green for trade or held on the plant until they colour up.':
    'Pilipili hoho zetu nyekundu na za njano huanza kama miche iliyopandikizwa kwenye mifereji ya matone na kuegemezwa kwenye nguzo hadi kuzaa. Huchumwa zikiwa kijani kwa biashara au kuachwa kwenye mmea hadi zipate rangi.',
  'Young capsicum seedlings on drip lines': 'Miche michanga ya pilipili hoho kwenye mifereji ya matone',
  'Greenhouse rows under agronomy monitoring': 'Mistari ya greenhouse chini ya usimamizi wa wataalamu wa kilimo',
  'Fruiting stage, before colour change': 'Hatua ya kuzaa, kabla ya rangi kubadilika',
  'Trellised beds ahead of colour grading': 'Matuta yaliyoegemezwa kabla ya kupanga kwa rangi',
  'Need volume pricing?': 'Unahitaji bei ya kiasi kikubwa?',
  'Tell us your crop, quantity and delivery point and we will quote from the next available batch.':
    'Tuambie zao, kiasi na mahali pa kupeleka, nasi tutakupa bei kutoka kundi lijalo linalopatikana.',

  // ---- About
  'About us': 'Kuhusu sisi',
  'Auxesis grows and trades fresh produce from Karatina, Nyeri County to Marikiti and City Park markets in Nairobi, working directly with Kenyan farmers.':
    'Auxesis hukuza na kuuza mazao mapya kutoka Karatina, Kaunti ya Nyeri hadi masoko ya Marikiti na City Park jijini Nairobi, tukifanya kazi moja kwa moja na wakulima wa Kenya.',
  'Who we are': 'Sisi ni nani',
  'We grow, buy and connect Kenyan fresh produce to market: cucumbers (local and English), red and yellow capsicum, chillies and butternuts, trading wholesale and retail at Marikiti and City Park, Nairobi.':
    'Tunakuza, tunanunua na kuunganisha mazao mapya ya Kenya na soko: matango (ya kienyeji na ya Kiingereza), pilipili hoho nyekundu na za njano, pilipili na boga la butternut, tukiuza kwa jumla na rejareja Marikiti na City Park, Nairobi.',
  'Two sides of the same supply chain': 'Pande mbili za mnyororo mmoja wa usambazaji',
  'We produce on our own farm in Karatina, Nyeri County, and we aggregate from commercial growers and agri investors across Kenya. Growing ourselves keeps us honest about agronomy, timelines and quality; sourcing widely keeps supply steady through the seasons.':
    'Tunazalisha kwenye shamba letu wenyewe la Karatina, Kaunti ya Nyeri, na tunakusanya kutoka kwa wakulima wa kibiashara na wawekezaji wa kilimo kote Kenya. Kukuza sisi wenyewe hutufanya tuwe waaminifu kuhusu kilimo, muda na ubora; kununua kutoka maeneo mengi hudumisha usambazaji katika misimu yote.',
  'Karatina farm': 'Shamba la Karatina',
  'Our own production base in Nyeri County: trial plots, staggered planting and reliable baseline volumes.':
    'Kituo chetu cha uzalishaji katika Kaunti ya Nyeri: mashamba ya majaribio, upandaji wa awamu na kiasi cha msingi cha uhakika.',
  'Farmer partnerships': 'Ushirikiano na wakulima',
  'We buy from contracted farmers at an agreed grade and price, and link farmers to buyers for crops we do not grow, with a fee only when a sale is completed.':
    'Tunanunua kutoka kwa wakulima tunaofanya nao kazi kwa daraja na bei tuliyokubaliana, na kuunganisha wakulima na wanunuzi kwa mazao ambayo hatukuzi, kwa ada tu mauzo yakikamilika.',
  'Marikiti & City Park trading': 'Biashara Marikiti na City Park',
  'Daily wholesale and retail sales from our stalls at Wakulima (Marikiti) Market and City Park, Nairobi.':
    'Mauzo ya jumla na rejareja kila siku kutoka vibanda vyetu katika Soko la Wakulima (Marikiti) na City Park, Nairobi.',
  'Traceability is the product': 'Ufuatiliaji ndio bidhaa yenyewe',
  'Every batch we handle is registered against a farm, a crop and a set of dates: planted, expected harvest, harvested, graded, market-ready and dispatched. Buyers can follow that record publicly on our farm tracker, with no guesswork about where produce came from or how fresh it is.':
    'Kila kundi tunalolishughulikia husajiliwa dhidi ya shamba, zao na tarehe mbalimbali: kupandwa, mavuno yanayotarajiwa, kuvunwa, kupangwa kwa madaraja, tayari sokoni na kusafirishwa. Wanunuzi wanaweza kufuatilia kumbukumbu hiyo hadharani kwenye ufuatiliaji wetu wa mashamba, bila kubahatisha mazao yalikotoka au yalivyo mapya.',
  'See the farm tracker': 'Tazama ufuatiliaji wa mashamba',
  'What we are working towards': 'Tunachokielekea',
  'Consistent quality': 'Ubora usiobadilika',
  'Clear grading standards per crop so buyers get the same product every week.':
    'Viwango wazi vya madaraja kwa kila zao ili wanunuzi wapate bidhaa ile ile kila wiki.',
  'Fair farmer income': 'Kipato cha haki kwa wakulima',
  'Direct buying that removes unnecessary middlemen from the chain.': 'Ununuzi wa moja kwa moja unaondoa madalali wasio wa lazima kwenye mnyororo.',
  'Less post-harvest loss': 'Hasara ndogo baada ya mavuno',
  'Planned harvest windows matched to real market demand.': 'Muda wa mavuno uliopangwa kulingana na mahitaji halisi ya soko.',

  // ---- Contact
  'Call, WhatsApp or visit Auxesis at Wakulima (Marikiti) Market, Nairobi for wholesale orders, retail enquiries and farmer partnerships.':
    'Piga simu, tuandikie WhatsApp au tembelea Auxesis katika Soko la Wakulima (Marikiti), Nairobi kwa oda za jumla, maulizo ya rejareja na ushirikiano na wakulima.',
  'Get in touch': 'Wasiliana nasi',
  'Buy from us, or grow with us': 'Nunua kwetu, au kuza nasi',
  'Wholesale orders, retail enquiries and farmer partnerships. Talk to the {name} team.':
    'Oda za jumla, maulizo ya rejareja na ushirikiano na wakulima. Ongea na timu ya {name}.',
  'Chat on WhatsApp': 'Ongea nasi kwenye WhatsApp',
  'Call {phone}': 'Piga {phone}',
  'Market stall': 'Kibanda sokoni',
  'Wakulima (Marikiti) Market, Haile Selassie Avenue, Nairobi': 'Soko la Wakulima (Marikiti), Barabara ya Haile Selassie, Nairobi',
  'Open in Maps': 'Fungua kwenye Ramani',
  'Karatina, Nyeri County, Kenya': 'Karatina, Kaunti ya Nyeri, Kenya',
  'Call or WhatsApp': 'Piga simu au WhatsApp',
  Email: 'Barua pepe',
  'Trading hours': 'Saa za biashara',
  'Monday to Saturday, 4:00am – 6:00pm at Marikiti and City Park. Farm visits by appointment.':
    'Jumatatu hadi Jumamosi, 4:00 asubuhi – 6:00 jioni Marikiti na City Park. Ziara za shambani kwa miadi.',

  // ---- Quote
  'Request a quote ': 'Omba nukuu ya bei',
  'Tell us the produce, quantity and delivery point you need and Auxesis will send a wholesale quote.':
    'Tuambie mazao, kiasi na mahali pa kupeleka unavyohitaji, na Auxesis itakutumia nukuu ya bei ya jumla.',
  'Wholesale & bulk orders': 'Oda za jumla na za kiasi kikubwa',
  'Tell us what you need and we will come back with price, availability and delivery. Prices move with the market, so we quote each order.':
    'Tuambie unachohitaji nasi tutakujibu kwa bei, upatikanaji na usafirishaji. Bei hubadilika kulingana na soko, kwa hiyo tunatoa nukuu kwa kila oda.',
  'Prefer to talk?': 'Unapendelea kuongea?',
  'We reply fastest on WhatsApp.': 'Tunajibu haraka zaidi kupitia WhatsApp.',
  'Email (optional)': 'Barua pepe (si lazima)',
  Produce: 'Mazao',
  'Choose a crop…': 'Chagua zao…',
  'Several crops / not sure yet': 'Mazao kadhaa / bado sijaamua',
  'Quantity (optional)': 'Kiasi (si lazima)',
  'For example 500kg a week, or 2 tonnes': 'Kwa mfano kilo 500 kwa wiki, au tani 2',
  'Delivery point (optional)': 'Mahali pa kupeleka (si lazima)',
  'Town, market or address': 'Mji, soko au anwani',
  'Message (optional)': 'Ujumbe (si lazima)',
  'Thank you, {name}': 'Asante, {name}',
  'We have your request and will call or message you on {phone}. Our stall is open {hours}.':
    'Tumepokea ombi lako, na tutakupigia simu au kukutumia ujumbe kupitia {phone}. Kibanda chetu kimefunguliwa {hours}.',
  'Also send on WhatsApp': 'Tuma pia kupitia WhatsApp',
  'Send another request': 'Tuma ombi lingine',
  'We could not send your request. Please try again, or message us on':
    'Hatukuweza kutuma ombi lako. Tafadhali jaribu tena, au tuandikie kupitia',
  'Sending…': 'Inatuma…',
  'Enter your name': 'Weka jina lako',
  'Keep this under 120 characters': 'Tumia herufi chini ya 120',
  'Keep this under 200 characters': 'Tumia herufi chini ya 200',
  'Keep this under 80 characters': 'Tumia herufi chini ya 80',
  'Keep your message under 2000 characters': 'Weka ujumbe wenye herufi chini ya 2000',
  'Enter a phone number we can call or WhatsApp': 'Weka namba ya simu tunayoweza kupiga au kuandika WhatsApp',
  'Enter a valid phone number, for example 0712 345 678': 'Weka namba sahihi ya simu, kwa mfano 0712 345 678',
  'Enter a valid email, or leave it blank': 'Weka barua pepe sahihi, au iache patupu',
  'Tell us which produce you need, or write a short message': 'Tuambie mazao unayohitaji, au andika ujumbe mfupi',

  // ---- 404
  'Page not found': 'Ukurasa haujapatikana',
  'The page you are looking for does not exist or has moved.': 'Ukurasa unaoutafuta haupo au umehamishwa.',
  'Back to the home page': 'Rudi ukurasa wa mwanzo',

  // ---- FAQ
  'Frequently asked questions': 'Maswali yanayoulizwa mara kwa mara',
  'Questions & answers': 'Maswali na majibu',
  'Quick answers for buyers and for farmers. If yours is not here, call or message us.':
    'Majibu mafupi kwa wanunuzi na wakulima. Kama swali lako halipo hapa, tupigie simu au tutumie ujumbe.',
  'Answers for buyers and farmers: where our produce comes from, growing method, delivery beyond Nairobi, offtake, and payment terms.':
    'Majibu kwa wanunuzi na wakulima: mazao yetu yanakotoka, njia ya kukuza, usafirishaji nje ya Nairobi, ununuzi wa mazao na masharti ya malipo.',
  'Still have a question?': 'Bado una swali?',
  'Buying from us': 'Kununua kwetu',
  'For traders, grocers, hotels and households.': 'Kwa wafanyabiashara, wauzaji wa mboga, hoteli na kaya.',
  'Growing for us': 'Kukuza kwa ajili yetu',
  'For farmers who want to supply Auxesis.': 'Kwa wakulima wanaotaka kuipatia Auxesis mazao.',
  'Where is the produce from?': 'Mazao yanatoka wapi?',
  'Our own farm is in Karatina, Nyeri County. The rest comes from commercial growers we work with in other parts of Kenya. Every batch on the Farm Tracker shows which farm and county it came from.':
    'Shamba letu wenyewe liko Karatina, Kaunti ya Nyeri. Mengine yanatoka kwa wakulima wa kibiashara tunaofanya nao kazi katika sehemu nyingine za Kenya. Kila kundi kwenye ufuatiliaji wa mashamba linaonyesha shamba na kaunti lilikotoka.',
  'See the Farm Tracker': 'Tazama ufuatiliaji wa mashamba',
  'What variety is it?': 'Ni aina gani?',
  'It depends on the crop and the grower, and the variety is recorded for each batch on the Farm Tracker. Tell us the crop when you ask for a quote and we will confirm the variety available.':
    'Inategemea zao na mkulima, na aina huandikwa kwa kila kundi kwenye ufuatiliaji wa mashamba. Tuambie zao unapoomba nukuu ya bei nasi tutakuthibitishia aina zinazopatikana.',
  'See batches and varieties': 'Tazama makundi na aina',
  'Is it open field or greenhouse?': 'Je, ni shamba la wazi au greenhouse?',
  'The Produce page shows the growing method on each crop.': 'Ukurasa wa Mazao unaonyesha njia ya kukuza kwa kila zao.',
  and: 'na',
  'See our produce': 'Tazama mazao yetu',
  'When was it last sprayed?': 'Ilipuliziwa dawa mara ya mwisho lini?',
  'Our growers follow agreed spray programmes. The site does not show spray dates yet, so ask us about the specific batch you want when you request a quote and we will tell you.':
    'Wakulima wetu hufuata ratiba za kupulizia dawa zilizokubaliwa. Tovuti bado haionyeshi tarehe za kupulizia, kwa hiyo tuulize kuhusu kundi mahususi unalotaka unapoomba nukuu ya bei nasi tutakujulisha.',
  'What is the shelf life of the produce?': 'Mazao hukaa muda gani bila kuharibika?',
  'It depends on the crop, how it is stored and how far it travels. Butternuts are cured for a long shelf life, while broccoli is cut in the cool of the morning, iced and moved the same day. Tell us the crop and where it is going and we will advise.':
    'Inategemea zao, jinsi linavyohifadhiwa na umbali linaosafiri. Boga la butternut hukaushwa ili likae muda mrefu, wakati broccoli hukatwa asubuhi penye baridi, huwekwa barafu na kusafirishwa siku hiyo hiyo. Tuambie zao na mahali linapokwenda nasi tutakushauri.',
  'When is the next harvest?': 'Mavuno yajayo ni lini?',
  'Every batch on the Farm Tracker shows its stage and its expected harvest date, updated by the farmers who grow it. Check there for what is coming, or ask us about a crop you need.':
    'Kila kundi kwenye ufuatiliaji wa mashamba linaonyesha hatua yake na tarehe ya mavuno inayotarajiwa, inayosasishwa na wakulima wanaolikuza. Angalia hapo kuona kinachokuja, au tuulize kuhusu zao unalohitaji.',
  'Check expected harvest dates': 'Angalia tarehe za mavuno zinazotarajiwa',
  'How long will you be harvesting and supplying?': 'Mtavuna na kusambaza kwa muda gani?',
  'We plant in staggered batches so there is normally something coming through. For a regular weekly order, tell us the crop and quantity and we will confirm how long we can supply it.':
    'Tunapanda kwa awamu ili kuwe na kitu kinachopatikana mara nyingi. Kwa oda ya kila wiki, tuambie zao na kiasi nasi tutathibitisha tunaweza kusambaza kwa muda gani.',
  'Can you deliver to places far from Nairobi, like Garissa or Kongowea (Mombasa)?':
    'Je, mnaweza kupeleka sehemu za mbali na Nairobi, kama Garissa au Kongowea (Mombasa)?',
  'We can discuss delivery to markets outside Nairobi. Cost and timing depend on the crop, the quantity and the transport. Give us the destination in the quote form and we will come back with what is possible.':
    'Tunaweza kujadili usafirishaji kwenda masoko nje ya Nairobi. Gharama na muda hutegemea zao, kiasi na usafiri. Tupe mahali unapopeleka kwenye fomu ya nukuu nasi tutakujibu kinachowezekana.',
  'What is your offtake capacity?': 'Uwezo wenu wa kununua mazao ni upi?',
  'It depends on the crop and the season, and it grows as we add buyers. Tell us what you grow, how much you expect per week and when it will be ready, and we will confirm what we can take before you plant.':
    'Unategemea zao na msimu, na hukua tunavyoongeza wanunuzi. Tuambie unachokuza, kiasi unachotarajia kwa wiki na litakapokuwa tayari, nasi tutathibitisha tunachoweza kununua kabla hujapanda.',
  'Tell us what you grow': 'Tuambie unachokuza',
  'If I grow for you, will I be sure of a consistent market?': 'Nikikuza kwa ajili yenu, je, nitakuwa na uhakika wa soko la kudumu?',
  'We work with growers on agreed varieties, planting calendars and farm-gate prices, so you plant knowing what we will buy. The market is assured for what we agree together before planting: the crop, the volume, the timing and the quality. We cannot promise to buy produce that was not agreed.':
    'Tunafanya kazi na wakulima kwa aina, ratiba za kupanda na bei za shambani zilizokubaliwa, ili upande ukijua tutakachonunua. Soko lina uhakika kwa kile tunachokubaliana pamoja kabla ya kupanda: zao, kiasi, wakati na ubora. Hatuwezi kuahidi kununua mazao ambayo hayakukubaliwa.',
  'Partner with us': 'Shirikiana nasi',
  'What are your terms of payment?': 'Masharti yenu ya malipo ni yapi?',
  'Farmers are paid promptly, at the agreed grade and price, once produce is collected and graded. The details are confirmed with you at registration, before you plant.':
    'Wakulima hulipwa haraka, kwa daraja na bei iliyokubaliwa, mara mazao yanapochukuliwa na kupangwa kwa madaraja. Maelezo huthibitishwa nawe wakati wa usajili, kabla hujapanda.',
  'Do you charge farmers a fee?': 'Je, mnawatoza wakulima ada?',
  'There is no fee on crops Auxesis buys directly from you. For crops we do not buy ourselves, we link you to buyers in our network and charge a fee only when a sale is completed.':
    'Hakuna ada kwa mazao ambayo Auxesis inanunua moja kwa moja kutoka kwako. Kwa mazao ambayo hatuyanunui sisi wenyewe, tunakuunganisha na wanunuzi katika mtandao wetu na kutoza ada tu mauzo yakikamilika.',
  'Register your farm ': 'Sajili shamba lako',
}
