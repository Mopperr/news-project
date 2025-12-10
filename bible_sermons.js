// Bible Sermon Teachings - Paired with verses for spiritual understanding and application
// Each sermon provides context, meaning, and practical application for the corresponding verse

const bibleSermons = [
    {
        verse: "For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future. - Jeremiah 29:11",
        sermon: {
            context: "Written to Jewish exiles in Babylon during their darkest hour",
            meaning: "God has not abandoned His people despite their circumstances. His plans are purposeful and good.",
            application: "When facing uncertainty, remember God's sovereignty. Your current situation is not your final destination.",
            prayer: "Lord, help me trust Your plans even when I cannot see the path ahead. Give me peace in Your perfect timing."
        }
    },
    {
        verse: "The LORD is my shepherd, I lack nothing. - Psalm 23:1",
        sermon: {
            context: "David, a shepherd himself, describes God's care in terms he deeply understood",
            meaning: "As a shepherd provides for sheep, God provides everything we need - protection, guidance, sustenance.",
            application: "Rest in God's provision. Stop striving in your own strength and let Him lead you to green pastures.",
            prayer: "Good Shepherd, teach me to trust Your leadership and find rest in Your care."
        }
    },
    {
        verse: "Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go. - Joshua 1:9",
        sermon: {
            context: "God's command to Joshua as he prepared to lead Israel into the Promised Land after Moses' death",
            meaning: "Courage comes from God's presence, not our circumstances. He goes with us into every battle.",
            application: "Face your 'giants' with confidence - not in yourself, but in God's unfailing presence.",
            prayer: "Lord, give me courage to step forward in faith, knowing You are always with me."
        }
    },
    {
        verse: "I can do all this through him who gives me strength. - Philippians 4:13",
        sermon: {
            context: "Paul wrote from prison, content despite hardship, relying on Christ's strength",
            meaning: "Not a promise to succeed at everything, but to endure all circumstances through Christ's power.",
            application: "When you feel weak, remember Christ's strength is sufficient. Depend on Him, not yourself.",
            prayer: "Jesus, be my strength when I am weak. Help me accomplish Your will through Your power."
        }
    },
    {
        verse: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life. - John 3:16",
        sermon: {
            context: "Jesus explaining salvation to Nicodemus, a religious leader seeking truth",
            meaning: "God's love is demonstrated through sacrifice. Eternal life is a gift received through faith.",
            application: "Accept this gift by faith. Salvation is not earned through works but received through believing in Yeshua.",
            prayer: "Father, thank You for loving me so much that You sent Your Son. I believe in Him for my salvation."
        }
    },
    {
        verse: "Trust in the LORD with all your heart and lean not on your own understanding. - Proverbs 3:5",
        sermon: {
            context: "Solomon's wisdom teaching about the path to peace and success",
            meaning: "Our understanding is limited; God's is infinite. Complete trust means abandoning reliance on our own wisdom.",
            application: "When decisions overwhelm you, surrender your need to understand everything. Trust God's wisdom over your logic.",
            prayer: "Lord, I surrender my need to understand. Help me trust Your wisdom completely."
        }
    },
    {
        verse: "The LORD is close to the brokenhearted and saves those who are crushed in spirit. - Psalm 34:18",
        sermon: {
            context: "David's psalm of praise after being delivered from fear and enemies",
            meaning: "God doesn't distance Himself from suffering - He draws near to those who hurt most deeply.",
            application: "In your darkest moments, God is closest. Pour out your broken heart to Him; He is listening.",
            prayer: "Father, I bring my broken heart to You. Please heal my crushed spirit and restore my joy."
        }
    },
    {
        verse: "Cast all your anxiety on him because he cares for you. - 1 Peter 5:7",
        sermon: {
            context: "Peter writing to persecuted Christians, encouraging them to trust God amid suffering",
            meaning: "Anxiety is a burden we're commanded to release, not carry. God genuinely cares about our concerns.",
            application: "Stop carrying what God wants to carry for you. Name your anxieties and intentionally give them to Him in prayer.",
            prayer: "Lord, I cast my worries upon You. Take this burden I've been carrying and replace it with Your peace."
        }
    },
    {
        verse: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose. - Romans 8:28",
        sermon: {
            context: "Paul explaining how suffering fits into God's redemptive plan",
            meaning: "God can take even evil and use it for good in the lives of His children. Nothing is wasted.",
            application: "Your trials have purpose. God is weaving even painful circumstances into something beautiful.",
            prayer: "Father, help me see Your hand working in my circumstances, even when I don't understand."
        }
    },
    {
        verse: "The righteous cry out, and the LORD hears them; he delivers them from all their troubles. - Psalm 34:17",
        sermon: {
            context: "David testifying to God's faithfulness in answering prayer",
            meaning: "God not only hears but actively responds to deliver His people from trouble.",
            application: "Your prayers are not falling on deaf ears. Keep crying out - deliverance is coming.",
            prayer: "Lord, I cry out to You. Thank You for hearing me and promising deliverance."
        }
    }
];

// Function to get sermon for a specific verse
function getSermonForVerse(verseText) {
    const sermon = bibleSermons.find(s => s.verse === verseText);
    if (sermon) return sermon.sermon;
    
    // Generate contextual sermon for verses without specific sermons
    return generateGenericSermon(verseText);
}

// Generate contextual sermon based on verse content
function generateGenericSermon(verseText) {
    const verse = verseText.toLowerCase();
    const parts = verseText.split(' - ');
    const reference = parts[1] || 'Scripture';
    
    // Identify verse themes
    const themes = {
        trust: /trust|faith|believe|confidence/i,
        strength: /strength|power|mighty|strong/i,
        fear: /fear|afraid|terror|anxious/i,
        love: /love|beloved|cherish|compassion/i,
        peace: /peace|rest|calm|still/i,
        guidance: /guide|lead|path|way|direct/i,
        protection: /protect|shield|refuge|fortress/i,
        salvation: /save|salvation|redeem|deliver/i,
        prayer: /pray|prayer|ask|seek/i,
        praise: /praise|worship|glory|honor/i,
        wisdom: /wisdom|wise|understand|knowledge/i,
        hope: /hope|future|promise/i,
        victory: /victory|overcome|conquer/i,
        joy: /joy|rejoice|glad|happy/i,
        israel: /israel|jerusalem|zion|jacob/i
    };
    
    let context = "God's Word speaks powerfully to His people in every generation";
    let meaning = "This verse reveals God's character and His desire for relationship with His people";
    let application = "Apply this truth to your life today by meditating on God's Word and seeking His face";
    let prayer = "Lord, help me understand and live out this truth in my daily walk with You";
    
    // Customize based on theme
    if (themes.trust.test(verse)) {
        context = "Throughout Scripture, God calls His people to trust Him completely";
        meaning = "Faith is not blind belief but confident trust in a God who has proven Himself faithful";
        application = "When circumstances shake you, anchor your trust in God's unchanging character, not your changing feelings";
        prayer = "Father, increase my faith. Help me trust You when I cannot see the way forward";
    } else if (themes.strength.test(verse)) {
        context = "God's strength is made perfect in our weakness";
        meaning = "Divine power flows through yielded vessels. Our weakness becomes the canvas for His strength";
        application = "Stop relying on your own strength. Surrender your weakness to God and watch His power work through you";
        prayer = "Lord, I am weak but You are strong. Be my strength in every situation I face today";
    } else if (themes.fear.test(verse)) {
        context = "Fear is a natural human response, but God commands us to replace fear with faith";
        meaning = "God's presence and promises are the antidote to fear. Where He is, fear cannot remain";
        application = "When fear grips you, declare God's promises aloud. His perfect love casts out all fear";
        prayer = "Father, replace my fear with Your perfect peace. Help me trust Your presence over my circumstances";
    } else if (themes.love.test(verse)) {
        context = "God's love is the foundation of all Scripture and the source of our ability to love";
        meaning = "Divine love is not based on our performance but on God's unchanging nature. He is love";
        application = "Receive God's unconditional love today. Let it transform how you see yourself and love others";
        prayer = "Thank You for loving me unconditionally. Help me love others with Your sacrificial love";
    } else if (themes.peace.test(verse)) {
        context = "True peace is not absence of trouble but God's presence in the midst of trouble";
        meaning = "The Prince of Peace offers a peace the world cannot give or take away";
        application = "In chaos, turn to God. His peace guards your heart and mind beyond human understanding";
        prayer = "Lord, flood my soul with Your peace. Help me rest in You regardless of my circumstances";
    } else if (themes.salvation.test(verse)) {
        context = "Salvation is the central message of Scripture - God rescuing humanity through Yeshua";
        meaning = "We cannot save ourselves. Salvation is God's gift received by faith in Yeshua the Messiah";
        application = "If you haven't accepted Yeshua, do so today. If you have, share this good news with others";
        prayer = "Thank You for salvation through Yeshua. Help me live in the freedom You purchased for me";
    } else if (themes.israel.test(verse)) {
        context = "Israel is God's chosen people through whom He revealed Himself and sent the Messiah";
        meaning = "God's promises to Israel are eternal. Supporting Israel aligns us with God's prophetic purposes";
        application = "Pray for the peace of Jerusalem. Bless Israel as God commanded. Stand with His chosen people";
        prayer = "Father, bless Israel. Protect Your people. Hasten the day when all Israel recognizes Yeshua as Messiah";
    } else if (themes.guidance.test(verse)) {
        context = "God promises to guide His children in the way they should go";
        meaning = "Divine guidance comes through His Word, His Spirit, and His providence working together";
        application = "Seek God's direction through prayer and Scripture. He will make your path clear";
        prayer = "Lord, guide my steps today. Show me Your will and give me courage to follow";
    } else if (themes.protection.test(verse)) {
        context = "God is our refuge and fortress, a very present help in trouble";
        meaning = "No weapon formed against God's children can prosper. His protection is sure";
        application = "Run to God when threatened. He is your shield and defender. Trust His protective care";
        prayer = "Father, be my refuge today. Protect me from all evil and surround me with Your angels";
    } else if (themes.hope.test(verse)) {
        context = "Biblical hope is not wishful thinking but confident expectation based on God's promises";
        meaning = "Our hope is anchored in God's faithfulness, not our circumstances";
        application = "When discouraged, rehearse God's promises. Hope in Him never disappoints";
        prayer = "Lord, renew my hope. Help me anchor my expectations in Your unfailing promises";
    }
    
    return { context, meaning, application, prayer };
}

// Function to get random sermons for sidebar display
function getRandomSermons(count = 10) {
    const shuffled = [...bibleSermons].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}
