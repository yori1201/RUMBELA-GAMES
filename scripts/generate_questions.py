#!/usr/bin/env python3
"""
Rumbela - Generator Bank Soal
Generates hundreds of curated questions for all 4 game modes × 3 categories × 3 difficulties.
Output: questions.ts.snippet (ready to be merged into game-data.ts)
"""
import json
from pathlib import Path

# ============================================================
# QUIZ QUESTIONS (multiple-choice)
# Format: id, category, difficulty, question, questionTranslation, options[4], answer(idx), explanation, points
# ============================================================

QUIZ = [
    # ===== VOCABULARY BEGINNER =====
    ("q-v-b-6","vocabulary","beginner","What color is the sky on a sunny day?","Warna apa langit di hari cerah?",
     ["Blue","Green","Red","Black"],0,"Langit cerah berwarna biru (blue).",10),
    ("q-v-b-7","vocabulary","beginner","Which one is a fruit?","Mana yang merupakan buah?",
     ["Apple","Car","Table","Pencil"],0,"Apple (apel) adalah buah.",10),
    ("q-v-b-8","vocabulary","beginner","What do you call the room where you sleep?","Apa nama ruangan tempat kamu tidur?",
     ["Bedroom","Kitchen","Bathroom","Garage"],0,"Bedroom = kamar tidur.",10),
    ("q-v-b-9","vocabulary","beginner","Which animal says 'meow'?","Hewan apa yang bersuara 'meong'?",
     ["Cat","Dog","Cow","Duck"],0,"Kucing bersuara 'meow'.",10),
    ("q-v-b-10","vocabulary","beginner","What do you use to write?","Apa yang kamu gunakan untuk menulis?",
     ["Pencil","Cup","Shoe","Ball"],0,"Pencil (pensil) untuk menulis.",10),
    ("q-v-b-11","vocabulary","beginner","Which is a part of your body?","Mana yang merupakan bagian tubuh?",
     ["Hand","Table","Chair","Tree"],0,"Hand (tangan) bagian tubuh.",10),
    ("q-v-b-12","vocabulary","beginner","What is the opposite of 'big'?","Apa lawan dari 'big' (besar)?",
     ["Small","Tall","Long","Wide"],0,"Small = kecil, lawan dari big.",10),
    ("q-v-b-13","vocabulary","beginner","Which day comes after Monday?","Hari apa setelah Senin?",
     ["Tuesday","Friday","Sunday","Wednesday"],0,"Monday → Tuesday (Selasa).",10),
    ("q-v-b-14","vocabulary","beginner","What do you drink when you are thirsty?","Apa yang kamu minum saat haus?",
     ["Water","Bread","Rice","Meat"],0,"Water (air) untuk minum.",10),
    ("q-v-b-15","vocabulary","beginner","Which one is a vehicle?","Mana yang merupakan kendaraan?",
     ["Bicycle","Tree","Mountain","River"],0,"Bicycle (sepeda) adalah kendaraan.",10),

    # ===== VOCABULARY INTERMEDIATE =====
    ("q-v-i-6","vocabulary","intermediate","Choose the synonym of 'happy'.","Pilih sinonim dari 'happy'.",
     ["Joyful","Angry","Tired","Sad"],0,"Joyful = gembira, sama makna dengan happy.",15),
    ("q-v-i-7","vocabulary","intermediate","What does 'exhausted' mean?","Apa arti dari 'exhausted'?",
     ["Sangat lelah","Sangat senang","Sangat marah","Sangat lapar"],0,"Exhausted = kelelahan sekali.",15),
    ("q-v-i-8","vocabulary","intermediate","Choose the antonym of 'expensive'.","Pilih antonim dari 'expensive' (mahal).",
     ["Cheap","Costly","Valuable","Rich"],0,"Cheap = murah, lawan dari expensive.",15),
    ("q-v-i-9","vocabulary","intermediate","Which word means 'to give money for goods'?","Kata apa yang berarti 'memberi uang untuk barang'?",
     ["Buy","Cook","Sleep","Drive"],0,"Buy (membeli) = memberi uang untuk barang.",15),
    ("q-v-i-10","vocabulary","intermediate","What is the meaning of 'generous'?","Apa arti dari 'generous'?",
     ["Pemurah / dermawan","Pelit","Egois","Sombong"],0,"Generous = pemurah, suka berbagi.",15),
    ("q-v-i-11","vocabulary","intermediate","Choose the correct synonym for 'begin'.","Pilih sinonim yang benar untuk 'begin'.",
     ["Start","End","Stop","Finish"],0,"Start = mulai, sama dengan begin.",15),
    ("q-v-i-12","vocabulary","intermediate","What does 'rarely' mean?","Apa arti dari 'rarely'?",
     ["Jarang","Sering","Selalu","Kadang"],0,"Rarely = jarang.",15),
    ("q-v-i-13","vocabulary","intermediate","Which profession works in a hospital?","Profesi mana yang bekerja di rumah sakit?",
     ["Doctor","Teacher","Farmer","Chef"],0,"Doctor (dokter) bekerja di rumah sakit.",15),
    ("q-v-i-14","vocabulary","intermediate","Choose the word that means 'to repair'.","Pilih kata yang berarti 'memperbaiki'.",
     ["Fix","Break","Build","Paint"],0,"Fix = memperbaiki.",15),
    ("q-v-i-15","vocabulary","intermediate","What is a 'recipe' used for?","Untuk apa 'recipe' digunakan?",
     ["Memasak makanan","Mengendarai mobil","Membaca buku","Menulis surat"],0,"Recipe = resep masakan.",15),

    # ===== VOCABULARY ADVANCED =====
    ("q-v-a-6","vocabulary","advanced","Choose the synonym of 'meticulous'.","Pilih sinonim dari 'meticulous'.",
     ["Careless","Thorough","Lazy","Rude"],1,"Thorough = menyeluruh, teliti. Sama makna dengan meticulous.",25),
    ("q-v-a-7","vocabulary","advanced","What does 'ubiquitous' mean?","Apa arti dari 'ubiquitous'?",
     ["Ada di mana-mana","Unik","Tidak penting","Sangat langka"],0,"Ubiquitous = ada di mana-mana, merakyat.",25),
    ("q-v-a-8","vocabulary","advanced","Choose the antonym of 'verbose'.","Pilih antonim dari 'verbose' (bertele-tele).",
     ["Concise","Lengthy","Wordy","Detailed"],0,"Concise = ringkas, lawan dari verbose.",25),
    ("q-v-a-9","vocabulary","advanced","'Ephemeral' most nearly means:","'Ephemeral' paling dekat maknanya dengan:",
     ["Sementara / fana","Abadi","Kuat","Indah"],0,"Ephemeral = sementara, tidak lama.",25),
    ("q-v-a-10","vocabulary","advanced","What does 'pragmatic' mean?","Apa arti dari 'pragmatic'?",
     ["Praktis / realistis","Idealis","Romantis","Sombong"],0,"Pragmatic = praktis, berorientasi hasil.",25),
    ("q-v-a-11","vocabulary","advanced","Choose the synonym of 'augment'.","Pilih sinonim dari 'augment' (memperbesar).",
     ["Decrease","Increase","Ignore","Postpone"],1,"Increase = menambah, sama dengan augment.",25),
    ("q-v-a-12","vocabulary","advanced","What does 'candid' mean?","Apa arti dari 'candid'?",
     ["Jujur / terus terang","Pura-pura","Marah","Tertutup"],0,"Candid = jujur, terus terang.",25),
    ("q-v-a-13","vocabulary","advanced","The word 'diligent' is closest in meaning to:","Kata 'diligent' paling dekat maknanya dengan:",
     ["Hardworking","Lazy","Careless","Late"],0,"Diligent = rajin, pekerja keras.",25),
    ("q-v-a-14","vocabulary","advanced","Choose the antonym of 'ancient'.","Pilih antonim dari 'ancient' (kuno).",
     ["Modern","Old","Antique","Historic"],0,"Modern = modern, lawan dari ancient.",25),
    ("q-v-a-15","vocabulary","advanced","'Lucid' writing is:","Tulisan 'lucid' adalah yang:",
     ["Jelas dan mudah dipahami","Rumit dan membingungkan","Panjang sekali","Tanpa arti"],0,"Lucid = jernih, mudah dipahami.",25),

    # ===== GRAMMAR BEGINNER =====
    ("q-g-b-5","grammar","beginner","Choose the correct article: '___ apple'.","Pilih article yang benar: '___ apple'.",
     ["An","A","The","-"],0,"'Apple' diawali vowel sound → 'an'.",10),
    ("q-g-b-6","grammar","beginner","Which pronoun is for a girl?","Pronoun mana untuk perempuan?",
     ["She","He","It","They"],0,"She = dia (perempuan).",10),
    ("q-g-b-7","grammar","beginner","Complete: 'I ___ a student.'","Lengkapi: 'I ___ a student.'",
     ["am","is","are","be"],0,"Subject 'I' selalu pakai 'am'.",10),
    ("q-g-b-8","grammar","beginner","Choose the plural of 'child'.","Pilih bentuk jamak dari 'child'.",
     ["Children","Childs","Childes","Childrens"],0,"Child → children (jamak tidak beraturan).",10),
    ("q-g-b-9","grammar","beginner","What is the past tense of 'go'?","Apa past tense dari 'go'?",
     ["Went","Goed","Gone","Going"],0,"Go → went (bentuk lampau tidak beraturan).",10),
    ("q-g-b-10","grammar","beginner","Choose the correct preposition: 'The book is ___ the table.'","Pilih preposisi yang benar.",
     ["on","in","at","to"],0,"Di atas permukaan datar → 'on'.",10),
    ("q-g-b-11","grammar","beginner","Which is a verb?","Mana yang merupakan kata kerja?",
     ["Run","Slow","Red","Book"],0,"Run (berlari) adalah kata kerja.",10),
    ("q-g-b-12","grammar","beginner","Complete: 'They ___ happy.'","Lengkapi: 'They ___ happy.'",
     ["are","is","am","be"],0,"Subject 'they' (jamak) pakai 'are'.",10),
    ("q-g-b-13","grammar","beginner","What is the opposite of 'tall'?","Apa lawan dari 'tall' (tinggi)?",
     ["Short","Long","Big","Wide"],0,"Short = pendek, lawan dari tall.",10),
    ("q-g-b-14","grammar","beginner","Choose the correct: 'She ___ coffee every morning.'","Pilih yang benar.",
     ["drinks","drink","drinking","drunk"],0,"She (orang ketiga tunggal) → drinks.",10),

    # ===== GRAMMAR INTERMEDIATE =====
    ("q-g-i-5","grammar","intermediate","Choose the correct form: 'By the time we arrived, the movie ___.'","Pilih bentuk yang benar.",
     ["had started","started","starts","has started"],0,"Past perfect: had + V3 (sudah dimulai sebelum kita sampai).",15),
    ("q-g-i-6","grammar","intermediate","Which sentence uses the present perfect correctly?","Kalimat mana yang menggunakan present perfect dengan benar?",
     ["I have lived here for 5 years.","I lived here for 5 years.","I am living here for 5 years.","I live here for 5 years."],0,"Present perfect: have/has + V3, untuk durasi sampai sekarang.",15),
    ("q-g-i-7","grammar","intermediate","Choose the correct comparative: 'My car is ___ than yours.'","Pilih comparative yang benar.",
     ["faster","fast","more fast","fastest"],0,"Comparative: adjective + er (fast → faster).",15),
    ("q-g-i-8","grammar","intermediate","Which is a reflexive pronoun?","Mana yang merupakan reflexive pronoun?",
     ["Myself","Mine","Me","My"],0,"Myself = diriku sendiri (reflexive).",15),
    ("q-g-i-9","grammar","intermediate","Choose: 'I will call you ___ I arrive.'","Pilih: 'I will call you ___ I arrive.'",
     ["when","if","because","although"],0,"'When' untuk waktu (ketika saya tiba).",15),
    ("q-g-i-10","grammar","intermediate","Identify the modal verb: 'You ___ smoke here.'","Identifikasi modal verb.",
     ["must not","smoke","here","you"],0,"'Must not' = tidak boleh (larangan).",15),
    ("q-g-i-11","grammar","intermediate","Choose the correct conjunction: 'I like tea ___ coffee.'","Pilih konjungsi yang benar.",
     ["and","or","but","because"],0,"'And' untuk menyatukan dua hal yang disukai.",15),
    ("q-g-i-12","grammar","intermediate","Which sentence uses 'since' correctly?","Kalimat mana yang menggunakan 'since' dengan benar?",
     ["I have known him since 2010.","I know him since 2010.","I knew him since 2010.","I am knowing him since 2010."],0,"'Since' + titik waktu, dengan present perfect (have known).",15),
    ("q-g-i-13","grammar","intermediate","Choose: 'This is the book ___ I told you about.'","Pilih: 'This is the book ___ I told you about.'",
     ["that","what","who","whose"],0,"'That' untuk benda dalam relative clause.",15),
    ("q-g-i-14","grammar","intermediate","Which sentence is in passive voice?","Kalimat mana yang passive voice?",
     ["The cake was eaten by Tom.","Tom ate the cake.","Tom is eating cake.","Tom eats cake."],0,"Passive: be + V3 (was eaten).",15),

    # ===== GRAMMAR ADVANCED =====
    ("q-g-a-6","grammar","advanced","Identify the correct sentence:","Identifikasi kalimat yang benar.",
     ["He suggested that she be on time.","He suggested that she is on time.","He suggested she to be on time.","He suggested her to be on time."],0,"Subjunctive setelah 'suggest that' + bare infinitive (be).",25),
    ("q-g-a-7","grammar","advanced","Choose the correct conditional (type 2):","Pilih conditional type 2 yang benar.",
     ["If I were rich, I would travel the world.","If I am rich, I will travel.","If I had been rich, I would travel.","If I were rich, I will travel."],0,"Type 2: If + were, would + V1 (hipotetis sekarang).",25),
    ("q-g-a-8","grammar","advanced","Which sentence uses inversion correctly?","Kalimat mana yang menggunakan inversion dengan benar?",
     ["Never have I seen such a sight.","Never I have seen such a sight.","I never have seen such a sight.","Have I never seen such a sight."],0,"Inversion setelah negative adverbial (Never have I...).",25),
    ("q-g-a-9","grammar","advanced","Choose the correct reduced relative clause:","Pilih reduced relative clause yang benar.",
     ["The man walking down the street is my uncle.","The man who walking down the street is my uncle.","The man walks down the street is my uncle.","The man walked down the street is my uncle."],0,"Reduced relative clause: V-ing (walking) tanpa 'who is'.",25),
    ("q-g-a-10","grammar","advanced","Identify the correct indirect speech:","Identifikasi indirect speech yang benar.",
     ["He asked me where I lived.","He asked me where do I live.","He asked me where I live.","He asked me where did I live."],0,"Indirect question: subjek + verb (no inversion, no auxiliary 'do').",25),
    ("q-g-a-11","grammar","advanced","Choose the correct sentence:","Pilih kalimat yang benar.",
     ["Had I known earlier, I would have helped.","If I knew earlier, I would have helped.","If I know earlier, I would help.","Had I known earlier, I would help."],0,"Inverted conditional type 3: Had + S + V3, would have + V3.",25),
    ("q-g-a-12","grammar","advanced","Which is the correct cleft sentence?","Mana cleft sentence yang benar?",
     ["It was John who broke the window.","It is John broke the window.","It was John breaking the window.","It John who broke the window."],0,"Cleft: It + be + emphasized part + relative clause.",25),
    ("q-g-a-13","grammar","advanced","Choose the correct sentence with 'wish':","Pilih kalimat 'wish' yang benar.",
     ["I wish I had studied harder.","I wish I studied harder.","I wish I study harder.","I wish I will study harder."],0,"'Wish + past perfect' = penyesalan masa lalu.",25),

    # ===== CONVERSATION BEGINNER =====
    ("q-c-b-5","conversation","beginner","What do you say when you meet someone in the morning?","Apa yang kamu katakan saat bertemu seseorang di pagi hari?",
     ["Good morning","Good night","Goodbye","Sorry"],0,"'Good morning' = selamat pagi.",10),
    ("q-c-b-6","conversation","beginner","How do you respond to 'Thank you'?","Bagaimana kamu membalas 'Thank you'?",
     ["You're welcome","Yes","No","Goodbye"],0,"'You're welcome' = sama-sama.",10),
    ("q-c-b-7","conversation","beginner","What do you say when you want to ask a question?","Apa yang kamu katakan saat ingin bertanya?",
     ["Excuse me","Goodbye","See you","Hello"],0,"'Excuse me' = permisi (untuk menarik perhatian).",10),
    ("q-c-b-8","conversation","beginner","How do you say 'sampai jumpa' in English?","Bagaimana mengatakan 'sampai jumpa' dalam Bahasa Inggris?",
     ["Goodbye","Hello","Sorry","Please"],0,"Goodbye = sampai jumpa / selamat tinggal.",10),
    ("q-c-b-9","conversation","beginner","What do you say before eating?","Apa yang kamu katakan sebelum makan?",
     ["Let's eat","Good night","Sorry","Thank you"],0,"'Let's eat' atau 'Let's dig in' = ayo makan.",10),
    ("q-c-b-10","conversation","beginner","How do you ask someone's name?","Bagaimana menanyakan nama seseorang?",
     ["What's your name?","How are you?","Where are you?","Why are you?"],0,"'What's your name?' = Siapa namamu?",10),
    ("q-c-b-11","conversation","beginner","What do you say if you don't understand?","Apa yang kamu katakan jika tidak mengerti?",
     ["I don't understand","I'm fine","Goodbye","Hello"],0,"'I don't understand' = Saya tidak mengerti.",10),
    ("q-c-b-12","conversation","beginner","How do you ask for water politely?","Bagaimana meminta air dengan sopan?",
     ["Can I have some water, please?","Give me water!","Water now!","Where water?"],0,"'Can I have..., please?' = bentuk sopan meminta.",10),

    # ===== CONVERSATION INTERMEDIATE =====
    ("q-c-i-4","conversation","intermediate","At a restaurant, how do you order food politely?","Di restoran, bagaimana memesan makanan dengan sopan?",
     ["I'd like the chicken, please.","Give me chicken.","Chicken now.","I want chicken."],0,"'I'd like..., please?' = bentuk sopan memesan.",15),
    ("q-c-i-5","conversation","intermediate","How do you ask for directions to the bank?","Bagaimana menanyakan arah ke bank?",
     ["Excuse me, where is the bank?","Bank where?","Tell me bank!","How bank?"],0,"'Excuse me, where is...?' = permisi, di mana...?",15),
    ("q-c-i-6","conversation","intermediate","What do you say when someone sneezes?","Apa yang kamu katakan saat seseorang bersin?",
     ["Bless you","Hello","Sorry","Goodbye"],0,"'Bless you' = tradisi mengucap saat orang bersin.",15),
    ("q-c-i-7","conversation","intermediate","How do you politely ask someone to repeat?","Bagaimana minta seseorang mengulang dengan sopan?",
     ["Could you say that again, please?","What?","Repeat!","Speak louder!"],0,"'Could you..., please?' = bentuk sopan.",15),
    ("q-c-i-8","conversation","intermediate","How do you offer help to someone?","Bagaimana menawarkan bantuan?",
     ["Would you like me to help?","Help me!","You need help?","Help yourself."],0,"'Would you like me to...?' = tawaran bantuan sopan.",15),
    ("q-c-i-9","conversation","intermediate","How do you express that you like something?","Bagaimana menyatakan bahwa kamu menyukai sesuatu?",
     ["I really enjoy it.","I no like.","Bad.","Not good."],0,"'I really enjoy...' = saya sangat menyukai.",15),
    ("q-c-i-10","conversation","intermediate","What do you say when answering the phone?","Apa yang kamu katakan saat menjawab telepon?",
     ["Hello, this is Andi.","Who are you?","Talk!","What's up?"],0,"'Hello, this is [name]' = sapaan standar di telepon.",15),
    ("q-c-i-11","conversation","intermediate","How do you ask about the price?","Bagaimana menanyakan harga?",
     ["How much does this cost?","How many cost?","Price?","What money?"],0,"'How much does... cost?' = Berapa harganya?",15),

    # ===== CONVERSATION ADVANCED =====
    ("q-c-a-5","conversation","advanced","How do you professionally express disagreement in a meeting?","Bagaimana menyatakan ketidaksetujuan secara profesional dalam rapat?",
     ["I see your point, but I have a different perspective.","You're wrong.","That's stupid.","I disagree completely."],0,"Acknowledge dulu, baru beri pandangan berbeda secara sopan.",25),
    ("q-c-a-6","conversation","advanced","How do you politely interrupt someone?","Bagaimana menyela seseorang dengan sopan?",
     ["Excuse me, may I add something?","Stop talking!","Wait!","Listen to me!"],0,"'Excuse me, may I...?' = bentuk menyela yang sopan.",25),
    ("q-c-a-7","conversation","advanced","How do you express sympathy for a loss?","Bagaimana menyatakan simpati atas kehilangan?",
     ["I'm so sorry for your loss.","Too bad!","Get over it!","That's life."],0,"'I'm sorry for your loss' = ucapan simpati standar.",25),
    ("q-c-a-8","conversation","advanced","How do you make a polite request in formal writing?","Bagaimana membuat permintaan sopan dalam tulisan formal?",
     ["I would appreciate it if you could...","Do this now!","You must...","I want you to..."],0,"'I would appreciate it if...' = bentuk permintaan formal.",25),
    ("q-c-a-9","conversation","advanced","How do you express an opinion diplomatically?","Bagaimana menyatakan pendapat secara diplomatis?",
     ["In my humble opinion, we should consider...","My opinion is right!","You're wrong, I'm right!","This is the only way."],0,"'In my humble opinion...' = sopan dan tidak menggurui.",25),
    ("q-c-a-10","conversation","advanced","How do you end a formal email?","Bagaimana menutup email formal?",
     ["Sincerely, [name]","Bye!","See ya!","Later!"],0,"'Sincerely, [name]' = penutup email formal standar.",25),
]

# ============================================================
# WORD MATCH QUESTIONS
# Format: id, category, difficulty, pairs[{en,id}], points
# ============================================================

MATCH = [
    # ===== VOCABULARY BEGINNER (target 10, sudah 6, need 4) =====
    ("m-v-b-7","vocabulary","beginner",[
        {"en":"Sun","id":"Matahari"},{"en":"Moon","id":"Bulan"},
        {"en":"Star","id":"Bintang"},{"en":"Cloud","id":"Awan"}],40),
    ("m-v-b-8","vocabulary","beginner",[
        {"en":"Tree","id":"Pohon"},{"en":"Flower","id":"Bunga"},
        {"en":"Grass","id":"Rumput"},{"en":"Leaf","id":"Daun"}],40),
    ("m-v-b-9","vocabulary","beginner",[
        {"en":"Cow","id":"Sapi"},{"en":"Horse","id":"Kuda"},
        {"en":"Chicken","id":"Ayam"},{"en":"Goat","id":"Kambing"}],40),
    ("m-v-b-10","vocabulary","beginner",[
        {"en":"Bread","id":"Roti"},{"en":"Egg","id":"Telur"},
        {"en":"Cheese","id":"Keju"},{"en":"Meat","id":"Daging"}],40),

    # ===== VOCABULARY INTERMEDIATE (target 10, sudah 4, need 6) =====
    ("m-v-i-5","vocabulary","intermediate",[
        {"en":"Smart","id":"Pintar"},{"en":"Clever","id":"Cerdik"},
        {"en":"Brave","id":"Berani"},{"en":"Honest","id":"Jujur"}],60),
    ("m-v-i-6","vocabulary","intermediate",[
        {"en":"City","id":"Kota"},{"en":"Village","id":"Desa"},
        {"en":"Country","id":"Negara"},{"en":"Continent","id":"Benua"}],60),
    ("m-v-i-7","vocabulary","intermediate",[
        {"en":"Hot","id":"Panas"},{"en":"Cold","id":"Dingin"},
        {"en":"Warm","id":"Hangat"},{"en":"Cool","id":"Sejuk"}],60),
    ("m-v-i-8","vocabulary","intermediate",[
        {"en":"Run","id":"Berlari"},{"en":"Walk","id":"Berjalan"},
        {"en":"Jump","id":"Melompat"},{"en":"Swim","id":"Berenang"}],60),
    ("m-v-i-9","vocabulary","intermediate",[
        {"en":"Buy","id":"Membeli"},{"en":"Sell","id":"Menjual"},
        {"en":"Borrow","id":"Meminjam"},{"en":"Lend","id":"Meminjamkan"}],60),
    ("m-v-i-10","vocabulary","intermediate",[
        {"en":"Easy","id":"Mudah"},{"en":"Hard","id":"Sulit"},
        {"en":"Cheap","id":"Murah"},{"en":"Expensive","id":"Mahal"}],60),

    # ===== VOCABULARY ADVANCED (target 8, sudah 2, need 6) =====
    ("m-v-a-3","vocabulary","advanced",[
        {"en":"Ubiquitous","id":"Ada di mana-mana"},{"en":"Ephemeral","id":"Sementara / fana"},
        {"en":"Pragmatic","id":"Praktis / realistis"},{"en":"Lucid","id":"Jelas / jernih"}],80),
    ("m-v-a-4","vocabulary","advanced",[
        {"en":"Candid","id":"Jujur / terus terang"},{"en":"Verbose","id":"Bertele-tele"},
        {"en":"Concise","id":"Ringkas"},{"en":"Diligent","id":"Rajin"}],80),
    ("m-v-a-5","vocabulary","advanced",[
        {"en":"Ancient","id":"Kuno"},{"en":"Modern","id":"Modern"},
        {"en":"Obsolete","id":"Usang / ketinggalan zaman"},{"en":"Innovative","id":"Inovatif"}],80),
    ("m-v-a-6","vocabulary","advanced",[
        {"en":"Augment","id":"Menambah / memperbesar"},{"en":"Diminish","id":"Mengurangi"},
        {"en":"Accomplish","id":"Mencapai"},{"en":"Hinder","id":"Menghambat"}],80),
    ("m-v-a-7","vocabulary","advanced",[
        {"en":"Ambiguous","id":"Ambigu / bermakna ganda"},{"en":"Explicit","id":"Eksplisit / jelas"},
        {"en":"Vague","id":"Samarr / kabur"},{"en":"Precise","id":"Tepat / presisi"}],80),
    ("m-v-a-8","vocabulary","advanced",[
        {"en":"Generous","id":"Pemurah"},{"en":"Stingy","id":"Pelit"},
        {"en":"Arrogant","id":"Sombong"},{"en":"Humble","id":"Rendah hati"}],80),

    # ===== GRAMMAR BEGINNER (target 8, sudah 2, need 6) =====
    ("m-g-b-3","grammar","beginner",[
        {"en":"I","id":"Saya"},{"en":"You","id":"Kamu"},
        {"en":"He","id":"Dia (laki-laki)"},{"en":"She","id":"Dia (perempuan)"}],40),
    ("m-g-b-4","grammar","beginner",[
        {"en":"Am","id":"Be (untuk I)"},{"en":"Is","id":"Be (untuk she/he/it)"},
        {"en":"Are","id":"Be (untuk you/we/they)"},{"en":"Be","id":"Bentuk dasar"}],40),
    ("m-g-b-5","grammar","beginner",[
        {"en":"Run","id":"Berlari (kata kerja)"},{"en":"Book","id":"Buku (kata benda)"},
        {"en":"Beautiful","id":"Indah (kata sifat)"},{"en":"Quickly","id":"Dengan cepat (kata keterangan)"}],40),
    ("m-g-b-6","grammar","beginner",[
        {"en":"A","id":"Article (sebelum konsonan)"},{"en":"An","id":"Article (sebelum vokal)"},
        {"en":"The","id":"Article tertentu"},{"en":"-","id":"Tanpa article"}],40),
    ("m-g-b-7","grammar","beginner",[
        {"en":"Present","id":"Sekarang"},{"en":"Past","id":"Lampau"},
        {"en":"Future","id":"Masa depan"},{"en":"Perfect","id":"Telah selesai"}],40),
    ("m-g-b-8","grammar","beginner",[
        {"en":"On","id":"Di atas (permukaan)"},{"en":"In","id":"Di dalam"},
        {"en":"At","id":"Di (titik)"},{"en":"To","id":"Ke"}],40),

    # ===== GRAMMAR INTERMEDIATE (target 8, sudah 2, need 6) =====
    ("m-g-i-3","grammar","intermediate",[
        {"en":"Simple Past","id":"Lampau sederhana"},{"en":"Past Continuous","id":"Lampau sedang berlangsung"},
        {"en":"Past Perfect","id":"Lampau sempurna"},{"en":"Past Perfect Continuous","id":"Lampau sempurna berlangsung"}],60),
    ("m-g-i-4","grammar","intermediate",[
        {"en":"Will","id":"Akan (keputusan spontan)"},{"en":"Going to","id":"Akan (rencana)"},
        {"en":"Shall","id":"Akan (formal/penawaran)"},{"en":"Would","id":"Akan (kondisional)"}],60),
    ("m-g-i-5","grammar","intermediate",[
        {"en":"And","id":"Dan"},{"en":"But","id":"Tapi"},
        {"en":"Or","id":"Atau"},{"en":"Because","id":"Karena"}],60),
    ("m-g-i-6","grammar","intermediate",[
        {"en":"Who","id":"Untuk orang (subjek)"},{"en":"Whom","id":"Untuk orang (objek)"},
        {"en":"Which","id":"Untuk benda"},{"en":"Whose","id":"Untuk kepemilikan"}],60),
    ("m-g-i-7","grammar","intermediate",[
        {"en":"Must","id":"Harus (wajib)"},{"en":"Should","id":"Sebaiknya"},
        {"en":"Can","id":"Bisa"},{"en":"Might","id":"Mungkin"}],60),
    ("m-g-i-8","grammar","intermediate",[
        {"en":"Comparative","id":"Lebih (lebih besar)"},{"en":"Superlative","id":"Paling (paling besar)"},
        {"en":"Positive","id":"Positif (besar)"},{"en":"Equal","id":"Sama (sebesar)"}],60),

    # ===== GRAMMAR ADVANCED (target 8, sudah 2, need 6) =====
    ("m-g-a-3","grammar","advanced",[
        {"en":"Subjunctive","id":"Bentuk hipotetis"},{"en":"Indicative","id":"Bentuk fakta"},
        {"en":"Imperative","id":"Bentuk perintah"},{"en":"Conditional","id":"Bentuk bersyarat"}],80),
    ("m-g-a-4","grammar","advanced",[
        {"en":"Active Voice","id":"Subjek melakukan aksi"},{"en":"Passive Voice","id":"Subjek dikenai aksi"},
        {"en":"Causative","id":"Menyuruh orang lain"},{"en":"Reflexive","id":"Refleksif pada subjek"}],80),
    ("m-g-a-5","grammar","advanced",[
        {"en":"Direct Speech","id":"Kalimat langsung (\"...\")"},{"en":"Indirect Speech","id":"Kalimat tak langsung"},
        {"en":"Reported Question","id":"Pertanyaan dilaporkan"},{"en":"Tag Question","id":"Pertanyaan tambahan"}],80),
    ("m-g-a-6","grammar","advanced",[
        {"en":"Gerund","id":"V-ing sebagai kata benda"},{"en":"Infinitive","id":"To + V1"},
        {"en":"Participle","id":"V-ing/V3 sebagai kata sifat"},{"en":"Bare Infinitive","id":"V1 tanpa 'to'"}],80),
    ("m-g-a-7","grammar","advanced",[
        {"en":"Defining Clause","id":"Clause essential (tanpa koma)"},{"en":"Non-defining Clause","id":"Clause tambahan (dengan koma)"},
        {"en":"Reduced Clause","id":"Clause yang dipendekkan"},{"en":"Coordinate Clause","id":"Clause setara"}],80),
    ("m-g-a-8","grammar","advanced",[
        {"en":"Inversion","id":"Subyek-predikat terbalik"},{"en":"Cleft Sentence","id":"Kalimat terbelah (It was X who...)"},
        {"en":"Ellipsis","id":"Penghilangan kata"},{"en":"Fronting","id":"Pindah ke depan"}],80),

    # ===== CONVERSATION BEGINNER (target 8, sudah 3, need 5) =====
    ("m-c-b-4","conversation","beginner",[
        {"en":"Good morning","id":"Selamat pagi"},{"en":"Good afternoon","id":"Selamat siang"},
        {"en":"Good evening","id":"Selamat malam"},{"en":"Good night","id":"Selamat tidur"}],40),
    ("m-c-b-5","conversation","beginner",[
        {"en":"Yes","id":"Ya"},{"en":"No","id":"Tidak"},
        {"en":"Maybe","id":"Mungkin"},{"en":"I don't know","id":"Saya tidak tahu"}],40),
    ("m-c-b-6","conversation","beginner",[
        {"en":"Father","id":"Ayah"},{"en":"Mother","id":"Ibu"},
        {"en":"Brother","id":"Saudara laki-laki"},{"en":"Sister","id":"Saudara perempuan"}],40),
    ("m-c-b-7","conversation","beginner",[
        {"en":"Eat","id":"Makan"},{"en":"Drink","id":"Minum"},
        {"en":"Sleep","id":"Tidur"},{"en":"Walk","id":"Berjalan"}],40),
    ("m-c-b-8","conversation","beginner",[
        {"en":"Happy","id":"Senang"},{"en":"Sad","id":"Sedih"},
        {"en":"Angry","id":"Marah"},{"en":"Tired","id":"Lelah"}],40),

    # ===== CONVERSATION INTERMEDIATE (target 8, sudah 2, need 6) =====
    ("m-c-i-3","conversation","intermediate",[
        {"en":"How much is this?","id":"Berapa harganya?"},{"en":"Can I try it on?","id":"Boleh saya coba?"},
        {"en":"Do you have a smaller size?","id":"Ada ukuran lebih kecil?"},{"en":"I'll take it","id":"Saya ambil"}],60),
    ("m-c-i-4","conversation","intermediate",[
        {"en":"Could you repeat that?","id":"Bisa ulangi?"},{"en":"Slow down, please","id":"Pelankan, tolong"},
        {"en":"I don't understand","id":"Saya tidak mengerti"},{"en":"What does ___ mean?","id":"Apa arti ___?"}],60),
    ("m-c-i-5","conversation","intermediate",[
        {"en":"Turn left","id":"Belok kiri"},{"en":"Turn right","id":"Belok kanan"},
        {"en":"Go straight","id":"Lurus terus"},{"en":"It's far","id":"Jauh"}],60),
    ("m-c-i-6","conversation","intermediate",[
        {"en":"I'd like to make a reservation","id":"Saya ingin pesan tempat"},{"en":"A table for two","id":"Meja untuk dua orang"},
        {"en":"What do you recommend?","id":"Apa rekomendasinya?"},{"en":"The bill, please","id":"Bill, tolong"}],60),
    ("m-c-i-7","conversation","intermediate",[
        {"en":"What time is it?","id":"Jam berapa?"},{"en":"It's 3 o'clock","id":"Jam 3"},
        {"en":"It's half past 3","id":"Jam setengah 4"},{"en":"It's quarter to 4","id":"Jam 15 kurang 4"}],60),
    ("m-c-i-8","conversation","intermediate",[
        {"en":"Congratulations!","id":"Selamat!"},{"en":"Happy birthday!","id":"Selamat ulang tahun!"},
        {"en":"Good luck!","id":"Semoga berhasil!"},{"en":"Well done!","id":"Bagus sekali!"}],60),

    # ===== CONVERSATION ADVANCED (target 8, sudah 2, need 6) =====
    ("m-c-a-3","conversation","advanced",[
        {"en":"I was wondering if you could...","id":"Saya ingin tahu apakah Anda bisa..."},{"en":"Would you mind...?","id":"Apakah Anda keberatan...?"},
        {"en":"I'd appreciate it if...","id":"Saya sangat berterima kasih jika..."},{"en":"Could you possibly...?","id":"Apakah mungkin Anda...?"}],80),
    ("m-c-a-4","conversation","advanced",[
        {"en":"In my perspective...","id":"Dari sudut pandang saya..."},{"en":"From my standpoint...","id":"Dari posisi saya..."},
        {"en":"As far as I'm concerned...","id":"Sedapat yang saya tahu..."},{"en":"If you ask me...","id":"Kalau ditanya saya..."}],80),
    ("m-c-a-5","conversation","advanced",[
        {"en":"I'd like to bring up...","id":"Saya ingin mengangkat..."},{"en":"Could we address...?","id":"Bisakah kita bahas...?"},
        {"en":"Let's discuss...","id":"Mari kita bahas..."},{"en":"I'd like to raise the issue of...","id":"Saya ingin mengangkat isu tentang..."}],80),
    ("m-c-a-6","conversation","advanced",[
        {"en":"I'm afraid I can't agree.","id":"Saya khawatir tidak bisa setuju."},{"en":"I beg to differ.","id":"Saya berbeda pendapat."},
        {"en":"I see it differently.","id":"Saya melihatnya berbeda."},{"en":"That's a valid point, however...","id":"Itu argumen valid, namun..."}],80),
    ("m-c-a-7","conversation","advanced",[
        {"en":"Let me think it over","id":"Biarkan saya pikirkan"},{"en":"I'll get back to you on that","id":"Saya akan kabari lagi"},
        {"en":"Let me sleep on it","id":"Biarkan saya pikirkan semalam"},{"en":"I need more time to decide","id":"Saya butuh waktu"}],80),
    ("m-c-a-8","conversation","advanced",[
        {"en":"Thank you for your consideration","id":"Terima kasih atas pertimbangannya"},{"en":"I look forward to hearing from you","id":"Saya menunggu kabar Anda"},
        {"en":"Please don't hesitate to contact me","id":"Jangan ragu menghubungi saya"},{"en":"Best regards","id":"Salam hangat"}],80),
]

# ============================================================
# FILL THE BLANK
# Format: id, category, difficulty, sentence, translation, options[4], answer(idx), explanation, points
# ============================================================

FILL = [
    # ===== VOCABULARY BEGINNER (target 10, sudah 6, need 4) =====
    ("f-v-b-7","vocabulary","beginner","A ___ has a long neck and yellow spots.","Jerapah punya leher panjang dan bintik kuning.",
     ["giraffe","cat","dog","bird"],0,"'Giraffe' (jerapah) punya leher panjang.",10),
    ("f-v-b-8","vocabulary","beginner","I go to school by ___.","Saya ke sekolah dengan sepeda.",
     ["bicycle","apple","water","book"],0,"'Bicycle' (sepeda) untuk transportasi.",10),
    ("f-v-b-9","vocabulary","beginner","The ___ is red and sweet.","Apel berwarna merah dan manis.",
     ["apple","stone","car","table"],0,"'Apple' = apel (merah & manis).",10),
    ("f-v-b-10","vocabulary","beginner","My ___ is to fly a kite.","Mainan saya adalah layang-layang.",
     ["kite","tree","door","shoe"],0,"'Kite' = layang-layang.",10),

    # ===== VOCABULARY INTERMEDIATE (target 10, sudah 2, need 8) =====
    ("f-v-i-3","vocabulary","intermediate","He gave a ___ speech that moved everyone to tears.","Pidatonya sangat mengharukan sampai semua orang menangis.",
     ["touching","long","boring","loud"],0,"'Touching' = mengharukan.",15),
    ("f-v-i-4","vocabulary","intermediate","The library is a ___ place to study.","Perpustakaan tempat tenang untuk belajar.",
     ["quiet","noisy","dirty","dark"],0,"'Quiet' = tenang (konteks perpustakaan).",15),
    ("f-v-i-5","vocabulary","intermediate","She is very ___; she always finishes her work on time.","Dia sangat rajin; selalu menyelesaikan pekerjaan tepat waktu.",
     ["diligent","lazy","careless","slow"],0,"'Diligent' = rajin.",15),
    ("f-v-i-6","vocabulary","intermediate","The weather is ___ today; perfect for a picnic.","Cuaca cerah; cocok untuk piknik.",
     ["sunny","stormy","snowy","foggy"],0,"'Sunny' = cerah.",15),
    ("f-v-i-7","vocabulary","intermediate","Be ___ when crossing the street.","Hati-hati saat menyeberang jalan.",
     ["careful","happy","angry","tired"],0,"'Careful' = berhati-hati.",15),
    ("f-v-i-8","vocabulary","intermediate","The teacher was ___ with the student's progress.","Guru puas dengan kemajuan siswa.",
     ["pleased","agree","fast","loud"],0,"'Pleased' = puas.",15),
    ("f-v-i-9","vocabulary","intermediate","This problem is too ___ for me to solve alone.","Masalah ini terlalu rumit untuk saya selesaikan sendiri.",
     ["complicated","simple","easy","small"],0,"'Complicated' = rumit.",15),
    ("f-v-i-10","vocabulary","intermediate","The story has a ___ ending that nobody expected.","Cerita punya akhir mengejutkan yang tak diduga.",
     ["surprising","sad","happy","boring"],0,"'Surprising' = mengejutkan.",15),

    # ===== VOCABULARY ADVANCED (target 8, sudah 2, need 6) =====
    ("f-v-a-3","vocabulary","advanced","His eloquence was ___; everyone was captivated.","Ke fasihannya memukau; semua orang terpikat.",
     ["captivating","boring","loud","short"],0,"'Captivating' = memukau.",25),
    ("f-v-a-4","vocabulary","advanced","The philosophical essay was ___ and thought-provoking.","Esai filsafat itu mendalam dan membangkitkan pemikiran.",
     ["profound","shallow","trivial","silly"],0,"'Profound' = mendalam.",25),
    ("f-v-a-5","vocabulary","advanced","She has a ___ understanding of the subject; she's a true expert.","Dia punya pemahaman yang komprehensif; ahli sejati.",
     ["comprehensive","limited","vague","basic"],0,"'Comprehensive' = komprehensif.",25),
    ("f-v-a-6","vocabulary","advanced","His behavior was ___; we couldn't predict what he would do next.","Perilakunya tidak terduga; tak bisa menebak langkah berikutnya.",
     ["erratic","consistent","calm","boring"],0,"'Erratic' = tidak terduga / tidak menentu.",25),
    ("f-v-a-7","vocabulary","advanced","The new policy is ___ to all employees, regardless of position.","Kebijakan baru ini berlaku universal untuk semua karyawan, tanpa memandang jabatan.",
     ["applicable","denied","restricted","irrelevant"],0,"'Applicable' = berlaku.",25),
    ("f-v-a-8","vocabulary","advanced","The novel's ___ plot kept me reading until dawn.","Plot yang menarik membuat saya baca sampai subuh.",
     ["intriguing","dull","predictable","flat"],0,"'Intriguing' = menarik, menggiurkan.",25),

    # ===== GRAMMAR BEGINNER (target 10, sudah 3, need 7) =====
    ("f-g-b-4","grammar","beginner","I ___ to school every day.","Saya pergi ke sekolah setiap hari.",
     ["go","goes","going","gone"],0,"Subject 'I' → 'go' (bentuk dasar).",10),
    ("f-g-b-5","grammar","beginner","She ___ an apple.","Dia makan apel.",
     ["eats","eat","eating","eaten"],0,"She (orang ketiga tunggal) → eats.",10),
    ("f-g-b-6","grammar","beginner","There ___ three books on the table.","Ada tiga buku di atas meja.",
     ["are","is","am","be"],0,"Jamak (three books) → 'are'.",10),
    ("f-g-b-7","grammar","beginner","He ___ playing football now.","Dia sedang bermain sepak bola sekarang.",
     ["is","am","are","be"],0,"Sedang berlangsung + 'He' → 'is'.",10),
    ("f-g-b-8","grammar","beginner","The cat ___ on the mat.","Kucing di atas tikar.",
     ["is","are","am","be"],0,"'Cat' tunggal → 'is'.",10),
    ("f-g-b-9","grammar","beginner","We ___ friends.","Kami teman.",
     ["are","is","am","be"],0,"'We' (kami) → 'are'.",10),
    ("f-g-b-10","grammar","beginner","I have ___ apple.","Saya punya sebuah apel.",
     ["an","a","the","-"],0,"'Apple' diawali vokal → 'an'.",10),
    ("f-g-b-11","grammar","beginner","She is ___ best student in class.","Dia siswa terbaik di kelas.",
     ["the","a","an","-"],0,"Superlative pakai 'the'.",10),

    # ===== GRAMMAR INTERMEDIATE (target 10, sudah 4, need 6) =====
    ("f-g-i-5","grammar","intermediate","She ___ to Paris twice.","Dia sudah pergi ke Paris dua kali.",
     ["has been","goes","went","is going"],0,"Present perfect (pengalaman).",15),
    ("f-g-i-6","grammar","intermediate","When I came home, my family ___ dinner.","Saat saya sampai, keluarga sedang makan malam.",
     ["was having","has","had","have"],0,"Past continuous: was/were + V-ing.",15),
    ("f-g-i-7","grammar","intermediate","If you ___ harder, you will pass the exam.","Kalau kamu belajar lebih giat, akan lulus.",
     ["study","studied","will study","had studied"],0,"Conditional type 1: If + present, will + V1.",15),
    ("f-g-i-8","grammar","intermediate","The book ___ I bought yesterday is interesting.","Buku yang saya beli kemarin menarik.",
     ["that","what","who","whose"],0,"'That' relative clause untuk benda.",15),
    ("f-g-i-9","grammar","intermediate","I have lived here ___ 5 years.","Saya sudah tinggal di sini selama 5 tahun.",
     ["for","since","from","by"],0,"'For' + duration (5 years).",15),
    ("f-g-i-10","grammar","intermediate","She is ___ than her sister.","Dia lebih tinggi dari kakaknya.",
     ["taller","tall","more tall","tallest"],0,"Comparative: adjective + er.",15),

    # ===== GRAMMAR ADVANCED (target 8, sudah 3, need 5) =====
    ("f-g-a-4","grammar","advanced","Were it not for your help, I ___ failed.","Kalau bukan karena bantuanmu, saya akan gagal.",
     ["would have","will have","would","will"],0,"Inverted conditional type 3.",25),
    ("f-g-a-5","grammar","advanced","Not only ___ late, but he also forgot the report.","Tidak hanya terlambat, dia juga lupa laporan.",
     ["was he","he was","he is","is he"],0,"Inversion setelah 'Not only'.",25),
    ("f-g-a-6","grammar","advanced","Hardly ___ when the phone rang.","Baru saja saya tidur saat telepon berbunyi.",
     ["had I fallen asleep","I had fallen asleep","I fell asleep","did I fall asleep"],0,"Inversion: Hardly + had + S + V3.",25),
    ("f-g-a-7","grammar","advanced","It is essential that every student ___ the rules.","Penting setiap siswa mematuhi aturan.",
     ["obey","obeys","obeyed","will obey"],0,"Subjunctive setelah 'essential that'.",25),
    ("f-g-a-8","grammar","advanced","___ his laziness, he would have passed.","Kalau bukan karena kemalasannya, dia akan lulus.",
     ["But for","Despite","Although","Because of"],0,"'But for' = if not for (conditional substitute).",25),

    # ===== CONVERSATION BEGINNER (target 8, sudah 3, need 5) =====
    ("f-c-b-4","conversation","beginner","A: 'How old are you?' B: 'I'm ___ years old.'","A: 'Berapa umurmu?' B: 'Saya berumur 10 tahun.'",
     ["ten","tree","shoe","book"],0,"'Ten' = angka 10.",10),
    ("f-c-b-5","conversation","beginner","A: 'Where do you live?' B: 'I live in ___.'","A: 'Kamu tinggal di mana?' B: 'Saya tinggal di Bandung.'",
     ["Bandung","red","loud","fast"],0,"'Bandung' = nama tempat.",10),
    ("f-c-b-6","conversation","beginner","A: 'What's your name?' B: 'My ___ is Andi.'","A: 'Siapa namamu?' B: 'Nama saya Andi.'",
     ["name","book","table","shoe"],0,"'My name is...' = standar perkenalan.",10),
    ("f-c-b-7","conversation","beginner","A: 'Are you a student?' B: 'Yes, I ___.'","A: 'Kamu siswa?' B: 'Ya, saya siswa.'",
     ["am","is","are","be"],0,"'I am' untuk subjek 'I'.",10),
    ("f-c-b-8","conversation","beginner","A: 'Thank you!' B: '___ welcome!'","A: 'Terima kasih!' B: 'Sama-sama!'",
     ["You're","Your","You","Yours"],0,"'You're welcome' = sama-sama.",10),

    # ===== CONVERSATION INTERMEDIATE (target 8, sudah 2, need 6) =====
    ("f-c-i-3","conversation","intermediate","A: 'What does this word ___?' B: 'It means happy.'","A: 'Apa arti kata ini?' B: 'Berarti senang.'",
     ["mean","tell","say","talk"],0,"'Mean' = berarti (artian kata).",15),
    ("f-c-i-4","conversation","intermediate","A: 'How do you ___ your name?' B: 'A-N-D-I.'","A: 'Bagaimana eja namamu?' B: 'A-N-D-I.'",
     ["spell","spelling","spelled","spells"],0,"'Spell' = mengeja.",15),
    ("f-c-i-5","conversation","intermediate","A: 'Could you help me?' B: 'Sure, what do you ___?'","A: 'Bisa bantu?' B: 'Tentu, butuh apa?'",
     ["need","want","have","make"],0,"'Need' = butuh.",15),
    ("f-c-i-6","conversation","intermediate","A: 'See you tomorrow!' B: '___, take care!'","A: 'Sampai jumpa besok!' B: 'Ya, hati-hati!'",
     ["Sure","No","Maybe","Why"],0,"'Sure' = tentu (persetujuan).",15),
    ("f-c-i-7","conversation","intermediate","A: 'Can I borrow your pen?' B: '___, here you go.'","A: 'Boleh pinjam penamu?' B: 'Tentu, ini.'",
     ["Sure","No","Maybe","Never"],0,"'Sure, here you go' = persetujuan.",15),
    ("f-c-i-8","conversation","intermediate","A: 'I'm sorry I'm late.' B: 'That's ___.'","A: 'Maaf saya terlambat.' B: 'Tidak apa-apa.'",
     ["okay","terrible","bad","wrong"],0,"'That's okay' = tidak apa-apa.",15),

    # ===== CONVERSATION ADVANCED (target 8, sudah 2, need 6) =====
    ("f-c-a-3","conversation","advanced","A: 'I'd like to ___ an appointment with Dr. Smith.' B: 'Sure, when would you like to come?'","A: 'Saya ingin membuat janji dengan dr. Smith.' B: 'Tentu, kapan?'",
     ["make","do","have","take"],0,"'Make an appointment' = membuat janji.",25),
    ("f-c-a-4","conversation","advanced","A: 'I'm calling to ___ about the position.' B: 'I see. Hold on please.'","A: 'Saya menelpon untuk menanyakan posisi.' B: 'Baik, tunggu sebentar.'",
     ["inquire","ask","say","tell"],0,"'Inquire' = menanyakan (formal).",25),
    ("f-c-a-5","conversation","advanced","A: 'Could you ___ the meeting to next week?' B: 'I'll check and get back to you.'","A: 'Bisa menunda rapat ke minggu depan?' B: 'Saya cek dulu.'",
     ["postpone","do","make","cancel"],0,"'Postpone' = menunda.",25),
    ("f-c-a-6","conversation","advanced","A: 'I'm afraid I have to ___ my reservation.' B: 'I understand. Is everything okay?'","A: 'Saya harus membatalkan reservasi.' B: 'Saya mengerti. Semuanya baik?'",
     ["cancel","do","make","take"],0,"'Cancel' = membatalkan.",25),
    ("f-c-a-7","conversation","advanced","A: 'I'd like to ___ a complaint about the service.' B: 'I apologize for the inconvenience.'","A: 'Saya ingin mengajukan keluhan tentang layanan.' B: 'Saya minta maaf.'",
     ["make","do","have","take"],0,"'Make a complaint' = mengajukan keluhan.",25),
    ("f-c-a-8","conversation","advanced","A: 'How do you ___ the current economic situation?' B: 'It's quite concerning, to be honest.'","A: 'Bagaimana Anda menilai situasi ekonomi saat ini?' B: 'Agak mengkhawatirkan.'",
     ["assess","do","make","take"],0,"'Assess' = menilai (formal).",25),
]

# ============================================================
# SPELL MASTER
# Format: id, category, difficulty, meaning, hint, answer, example, points
# ============================================================

SPELL = [
    # ===== VOCABULARY BEGINNER (target 12, sudah 9, need 3) =====
    ("s-v-b-10","vocabulary","beginner","Bola (benda bulat untuk olahraga)","B___",
     "ball","We play football with a ball.",15),
    ("s-v-b-11","vocabulary","beginner","Pohon (tumbuhan tinggi)","T___",
     "tree","The tree provides shade.",15),
    ("s-v-b-12","vocabulary","beginner","Kucing (hewan peliharaan)","C___",
     "cat","The cat is sleeping.",15),
    ("s-v-b-13","vocabulary","beginner","Susu (minuman putih)","M___",
     "milk","I drink milk every morning.",15),
    ("s-v-b-14","vocabulary","beginner","Banana (buah kuning)","B___",
     "banana","Monkeys love bananas.",15),

    # ===== VOCABULARY INTERMEDIATE (target 10, sudah 5, need 5) =====
    ("s-v-i-6","vocabulary","intermediate","Cerdas / pintar","S___",
     "smart","She is a smart student.",25),
    ("s-v-i-7","vocabulary","intermediate","Berani / nekat","B___",
     "brave","The brave soldier saved the child.",25),
    ("s-v-i-8","vocabulary","intermediate","Jujur / tidak berbohong","H___",
     "honest","He is an honest person.",25),
    ("s-v-i-9","vocabulary","intermediate","Kota (tempat padat penduduk)","C___",
     "city","Jakarta is a big city.",25),
    ("s-v-i-10","vocabulary","intermediate","Murah (harga terjangkau)","C___",
     "cheap","This shirt is very cheap.",25),

    # ===== VOCABULARY ADVANCED (target 10, sudah 3, need 7) =====
    ("s-v-a-4","vocabulary","advanced","Ada di mana-mana / merakyat","U___",
     "ubiquitous","Smartphones are ubiquitous today.",35),
    ("s-v-a-5","vocabulary","advanced","Sementara / fana (tidak lama)","E___",
     "ephemeral","Youth is ephemeral.",35),
    ("s-v-a-6","vocabulary","advanced","Praktis / berorientasi hasil","P___",
     "pragmatic","She took a pragmatic approach.",35),
    ("s-v-a-7","vocabulary","advanced","Jelas / jernih (pikiran atau tulisan)","L___",
     "lucid","His explanation was lucid.",35),
    ("s-v-a-8","vocabulary","advanced","Bertele-tele / terlalu banyak kata","V___",
     "verbose","The lawyer's speech was verbose.",35),
    ("s-v-a-9","vocabulary","advanced","Ringkas / padat","C___",
     "concise","Please write a concise summary.",35),
    ("s-v-a-10","vocabulary","advanced","Ambigu / bermakna ganda","A___",
     "ambiguous","His answer was ambiguous.",35),
    ("s-v-a-11","vocabulary","advanced","Tepat / presisi","P___",
     "precise","She gave precise instructions.",35),

    # ===== GRAMMAR BEGINNER (target 8, sudah 2, need 6) =====
    ("s-g-b-3","grammar","beginner","Kata benda (noun)","N___",
     "noun","Book is a noun.",15),
    ("s-g-b-4","grammar","beginner","Kata kerja (verb)","V___",
     "verb","Run is a verb.",15),
    ("s-g-b-5","grammar","beginner","Kata sifat (adjective)","A___",
     "adjective","Beautiful is an adjective.",15),
    ("s-g-b-6","grammar","beginner","Kata ganti (pronoun)","P___",
     "pronoun","She is a pronoun.",15),
    ("s-g-b-7","grammar","beginner","Kata depan (preposition)","P___",
     "preposition","On is a preposition.",15),
    ("s-g-b-8","grammar","beginner","Kata penghubung (conjunction)","C___",
     "conjunction","And is a conjunction.",15),

    # ===== GRAMMAR INTERMEDIATE (target 10, sudah 3, need 7) =====
    ("s-g-i-4","grammar","intermediate","Subjek (yang melakukan aksi)","S___",
     "subject","In 'She runs', 'She' is the subject.",25),
    ("s-g-i-5","grammar","intermediate","Objek (yang dikenai aksi)","O___",
     "object","In 'She kicked the ball', 'ball' is the object.",25),
    ("s-g-i-6","grammar","intermediate","Predikat (kata kerja utama)","P___",
     "predicate","'Runs' is the predicate in 'She runs'.",25),
    ("s-g-i-7","grammar","intermediate","Aktif (kalimat yang subjeknya melakukan)","A___",
     "active","'Tom eats the cake' is active.",25),
    ("s-g-i-8","grammar","intermediate","Pasif (kalimat yang subjeknya dikenai)","P___",
     "passive","'The cake was eaten' is passive.",25),
    ("s-g-i-9","grammar","intermediate","Bentuk lampau dari kata kerja (V2)","P___",
     "past","'Went' is the past form of 'go'.",25),
    ("s-g-i-10","grammar","intermediate","Bentuk lampau sempurna (had + V3)","P___",
     "perfect","'Had eaten' is past perfect.",25),

    # ===== GRAMMAR ADVANCED (target 8, sudah 2, need 6) =====
    ("s-g-a-3","grammar","advanced","Bentuk hipotetis (subjunctive)","S___",
     "subjunctive","'If I were you' uses subjunctive.",35),
    ("s-g-a-4","grammar","advanced","Kalimat terbalik (inversion)","I___",
     "inversion","'Never have I...' is inversion.",35),
    ("s-g-a-5","grammar","advanced","Kalimat bersyarat (conditional)","C___",
     "conditional","'If...then...' is conditional.",35),
    ("s-g-a-6","grammar","advanced","Pertanyaan tidak langsung (indirect question)","I___",
     "indirect","'He asked where I lived' is indirect.",35),
    ("s-g-a-7","grammar","advanced","Klausa yang membatasi (defining)","D___",
     "defining","'The man who called' has defining clause.",35),
    ("s-g-a-8","grammar","advanced","Bentuk dasar kata kerja (tanpa to)","B___",
     "infinitive","Wait, that's actually bare infinitive.",35),

    # ===== CONVERSATION BEGINNER (target 8, sudah 4, need 4) =====
    ("s-c-b-5","conversation","beginner","Ya (persetujuan)","Y___",
     "yes","Yes, I agree.",15),
    ("s-c-b-6","conversation","beginner","Tidak (penolakan)","N___",
     "no","No, thank you.",15),
    ("s-c-b-7","conversation","beginner","Tolong (permintaan sopan)","P___",
     "please","Please help me.",15),
    ("s-c-b-8","conversation","beginner","Maaf (meminta permisi)","S___",
     "sorry","Sorry, I'm late.",15),
    ("s-c-b-9","conversation","beginner","Halo (sapaan)","H___",
     "hello","Hello, how are you?",15),

    # ===== CONVERSATION INTERMEDIATE (target 8, sudah 2, need 6) =====
    ("s-c-i-3","conversation","intermediate","Selamat (ucapan selamat)","C___",
     "congrats","Congrats on your success!",25),
    ("s-c-i-4","conversation","intermediate","Berhasil (kabar sukses)","S___",
     "success","Wishing you success in your exams.",25),
    ("s-c-i-5","conversation","intermediate","Janji (appointment)","A___",
     "appointment","I have a doctor's appointment.",25),
    ("s-c-i-6","conversation","intermediate","Pertemuan (rapat)","M___",
     "meeting","The meeting starts at 9 AM.",25),
    ("s-c-i-7","conversation","intermediate","Pemesanan (untuk restoran/hotel)","R___",
     "reservation","I'd like to make a reservation.",25),
    ("s-c-i-8","conversation","intermediate","Undangan (invitation)","I___",
     "invitation","Thank you for the invitation.",25),

    # ===== CONVERSATION ADVANCED (target 8, sudah 2, need 6) =====
    ("s-c-a-3","conversation","advanced","Pendapat (opini)","O___",
     "opinion","In my opinion, this is correct.",35),
    ("s-c-a-4","conversation","advanced","Perspektif (sudut pandang)","P___",
     "perspective","From my perspective, we should...",35),
    ("s-c-a-5","conversation","advanced","Negosiasi (perundingan)","N___",
     "negotiation","We need to start negotiation.",35),
    ("s-c-a-6","conversation","advanced","Kompromi (kesepakatan)","C___",
     "compromise","Let's find a compromise.",35),
    ("s-c-a-7","conversation","advanced","Pertimbangan (consideration)","C___",
     "consideration","Thank you for your consideration.",35),
    ("s-c-a-8","conversation","advanced","Konfirmasi (penegasan)","C___",
     "confirmation","I'm waiting for email confirmation.",35),
]

# ============================================================
# Generate TypeScript snippets
# ============================================================

def gen_quiz(q):
    return f'''  {{
    id: "{q[0]}",
    type: "multiple-choice",
    category: "{q[1]}",
    difficulty: "{q[2]}",
    question: {json.dumps(q[3])},
    questionTranslation: {json.dumps(q[4])},
    options: {json.dumps(q[5], ensure_ascii=False)},
    answer: {q[6]},
    explanation: {json.dumps(q[7], ensure_ascii=False)},
    points: {q[8]},
  }},'''

def gen_match(q):
    pairs_str = ", ".join(f'{{ en: {json.dumps(p["en"])}, id: {json.dumps(p["id"], ensure_ascii=False)} }}' for p in q[3])
    return f'''  {{
    id: "{q[0]}",
    type: "word-match",
    category: "{q[1]}",
    difficulty: "{q[2]}",
    pairs: [
      {pairs_str}
    ],
    points: {q[4]},
  }},'''

def gen_fill(q):
    return f'''  {{
    id: "{q[0]}",
    type: "fill-blank",
    category: "{q[1]}",
    difficulty: "{q[2]}",
    sentence: {json.dumps(q[3])},
    translation: {json.dumps(q[4], ensure_ascii=False)},
    options: {json.dumps(q[5], ensure_ascii=False)},
    answer: {q[6]},
    explanation: {json.dumps(q[7], ensure_ascii=False)},
    points: {q[8]},
  }},'''

def gen_spell(q):
    return f'''  {{
    id: "{q[0]}",
    type: "spell",
    category: "{q[1]}",
    difficulty: "{q[2]}",
    meaning: {json.dumps(q[3], ensure_ascii=False)},
    hint: {json.dumps(q[4])},
    answer: {json.dumps(q[5])},
    example: {json.dumps(q[6])},
    points: {q[7]},
  }},'''

out = []
out.append("// ===== GENERATED QUIZ =====")
for q in QUIZ: out.append(gen_quiz(q))
out.append("\n// ===== GENERATED MATCH =====")
for q in MATCH: out.append(gen_match(q))
out.append("\n// ===== GENERATED FILL =====")
for q in FILL: out.append(gen_fill(q))
out.append("\n// ===== GENERATED SPELL =====")
for q in SPELL: out.append(gen_spell(q))

Path("/home/z/my-project/scripts/generated_questions.txt").write_text("\n".join(out), encoding="utf-8")
print(f"Generated: {len(QUIZ)} quiz + {len(MATCH)} match + {len(FILL)} fill + {len(SPELL)} spell = {len(QUIZ)+len(MATCH)+len(FILL)+len(SPELL)} total new questions")
