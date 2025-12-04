// 50 Bible Verses about God's Strength, Protection, and Watchfulness over Israel

const bibleVerses = [
    "The LORD will keep you from all harm—he will watch over your life; the LORD will watch over your coming and going both now and forevermore. - Psalm 121:7-8",
    "For I will defend this city to save it, for my own sake and for the sake of my servant David. - Isaiah 37:35",
    "He who watches over Israel will neither slumber nor sleep. - Psalm 121:4",
    "I will bless those who bless you, and whoever curses you I will curse; and all peoples on earth will be blessed through you. - Genesis 12:3",
    "The LORD is your keeper; the LORD is your shade on your right hand. - Psalm 121:5",
    "For the eyes of the LORD range throughout the earth to strengthen those whose hearts are fully committed to him. - 2 Chronicles 16:9",
    "The LORD your God is with you, the Mighty Warrior who saves. He will take great delight in you; in his love he will no longer rebuke you, but will rejoice over you with singing. - Zephaniah 3:17",
    "But you, Israel, my servant, Jacob, whom I have chosen, you descendants of Abraham my friend, I took you from the ends of the earth, from its farthest corners I called you. I said, 'You are my servant'; I have chosen you and have not rejected you. - Isaiah 41:8-9",
    "The LORD will reign over them in Mount Zion from that day and forever. - Micah 4:7",
    "No weapon forged against you will prevail, and you will refute every tongue that accuses you. This is the heritage of the servants of the LORD. - Isaiah 54:17",
    "For the LORD has chosen Zion, he has desired it for his dwelling. - Psalm 132:13",
    "Pray for the peace of Jerusalem: May those who love you be secure. - Psalm 122:6",
    "See, I have engraved you on the palms of my hands; your walls are ever before me. - Isaiah 49:16",
    "The LORD your God is in your midst, a mighty one who will save; he will rejoice over you with gladness; he will quiet you by his love; he will exult over you with loud singing. - Zephaniah 3:17",
    "For you are a people holy to the LORD your God. The LORD your God has chosen you out of all the peoples on the face of the earth to be his people, his treasured possession. - Deuteronomy 7:6",
    "The eternal God is your refuge, and underneath are the everlasting arms. - Deuteronomy 33:27",
    "The LORD will fight for you; you need only to be still. - Exodus 14:14",
    "Fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you, I will help you, I will uphold you with my righteous right hand. - Isaiah 41:10",
    "But now, this is what the LORD says—he who created you, Jacob, he who formed you, Israel: Do not fear, for I have redeemed you; I have summoned you by name; you are mine. - Isaiah 43:1",
    "I will make you into a great nation, and I will bless you; I will make your name great, and you will be a blessing. - Genesis 12:2",
    "The LORD is my rock, my fortress and my deliverer; my God is my rock, in whom I take refuge, my shield and the horn of my salvation, my stronghold. - Psalm 18:2",
    "God is our refuge and strength, an ever-present help in trouble. - Psalm 46:1",
    "The LORD is my light and my salvation—whom shall I fear? The LORD is the stronghold of my life—of whom shall I be afraid? - Psalm 27:1",
    "When you pass through the waters, I will be with you; and when you pass through the rivers, they will not sweep over you. - Isaiah 43:2",
    "The LORD Almighty is with us; the God of Jacob is our fortress. - Psalm 46:7",
    "This is what the LORD says: Restrain your voice from weeping and your eyes from tears, for your work will be rewarded. They will return from the land of the enemy. So there is hope for your descendants. - Jeremiah 31:16-17",
    "Comfort, comfort my people, says your God. Speak tenderly to Jerusalem, and proclaim to her that her hard service has been completed. - Isaiah 40:1-2",
    "For the LORD loves the just and will not forsake his faithful ones. Wrongdoers will be completely destroyed; the offspring of the wicked will perish. - Psalm 37:28",
    "The LORD will keep you from all evil; he will keep your life. - Psalm 121:7",
    "The angel of the LORD encamps around those who fear him, and he delivers them. - Psalm 34:7",
    "Even to your old age and gray hairs I am he, I am he who will sustain you. I have made you and I will carry you; I will sustain you and I will rescue you. - Isaiah 46:4",
    "The LORD will guide you always; he will satisfy your needs in a sun-scorched land and will strengthen your frame. - Isaiah 58:11",
    "For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future. - Jeremiah 29:11",
    "But the Lord is faithful, and he will strengthen you and protect you from the evil one. - 2 Thessalonians 3:3",
    "The name of the LORD is a fortified tower; the righteous run to it and are safe. - Proverbs 18:10",
    "The LORD is good, a refuge in times of trouble. He cares for those who trust in him. - Nahum 1:7",
    "My help comes from the LORD, the Maker of heaven and earth. - Psalm 121:2",
    "Cast your cares on the LORD and he will sustain you; he will never let the righteous be shaken. - Psalm 55:22",
    "The LORD himself goes before you and will be with you; he will never leave you nor forsake you. Do not be afraid; do not be discouraged. - Deuteronomy 31:8",
    "You will not fear the terror of night, nor the arrow that flies by day, nor the pestilence that stalks in the darkness, nor the plague that destroys at midday. - Psalm 91:5-6",
    "A thousand may fall at your side, ten thousand at your right hand, but it will not come near you. - Psalm 91:7",
    "For he will command his angels concerning you to guard you in all your ways. - Psalm 91:11",
    "Because he loves me, says the LORD, I will rescue him; I will protect him, for he acknowledges my name. - Psalm 91:14",
    "The LORD is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul. - Psalm 23:1-3",
    "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me. - Psalm 23:4",
    "In peace I will lie down and sleep, for you alone, LORD, make me dwell in safety. - Psalm 4:8",
    "You are my hiding place; you will protect me from trouble and surround me with songs of deliverance. - Psalm 32:7",
    "The LORD watches over you—the LORD is your shade at your right hand. - Psalm 121:5",
    "For great is his love toward us, and the faithfulness of the LORD endures forever. Praise the LORD. - Psalm 117:2",
    "Nations will come to your light, and kings to the brightness of your dawn. Lift up your eyes and look about you: All assemble and come to you. - Isaiah 60:3-4"
];

// Initialize breaking news rotation
let currentVerseIndex = 0;

function rotateBibleVerses() {
    const breakingNewsText = document.getElementById('breakingNewsText');
    if (!breakingNewsText) return;

    // Fade out
    breakingNewsText.style.opacity = '0';
    
    setTimeout(() => {
        // Update text
        breakingNewsText.textContent = bibleVerses[currentVerseIndex];
        currentVerseIndex = (currentVerseIndex + 1) % bibleVerses.length;
        
        // Fade in
        breakingNewsText.style.opacity = '1';
    }, 500);
}

// Start rotation when page loads
document.addEventListener('DOMContentLoaded', () => {
    const breakingNewsText = document.getElementById('breakingNewsText');
    if (breakingNewsText) {
        breakingNewsText.style.transition = 'opacity 0.5s ease-in-out';
        
        // Set first verse immediately
        breakingNewsText.textContent = bibleVerses[0];
        currentVerseIndex = 1;
        
        // Rotate every 10 seconds
        setInterval(rotateBibleVerses, 10000);
    }
});
