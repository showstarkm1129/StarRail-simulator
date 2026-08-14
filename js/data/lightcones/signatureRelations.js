// signatureRelations.js — キャラクターとモチーフ光円錐の明示的な対応データ。
//
// 光円錐IDを唯一の基準にする。運命・効果・実装時期から推測してはいけない。
// ショップ配布や「絵に描かれているだけ」の光円錐は含めず、公式の限定/恒常★5として
// 対応が明確なものだけを登録する。

export const SIGNATURE_CHARACTERS_BY_LIGHTCONE = Object.freeze({
    'A Grounded Ascent': ['sunday'],
    'A Star That Lights the Night': ['himeko_nova'],
    'A Thankless Coronation': ['saber'],
    'Along the Passing Shore': ['acheron'],
    'An Instant Before A Gaze': ['argenti'],
    'Baptism of Pure Thought': ['dr_ratio'],
    'Before Dawn': ['jing_yuan'],
    'Brighter Than the Sun': ['dan_heng_imbibitor_lunae'],
    'But the Battle Isn\'t Over': ['bronya'],
    'Dance at Sunset': ['yunli'],
    'Dazzled by a Flowery World': ['sparxie'],
    'Earthly Escapade': ['sparkle'],
    'Echoes of the Coffin': ['luocha'],
    'Epoch Etched in Golden Blood': ['cerydra'],
    'Flame of Blood, Blaze My Path': ['mydei'],
    'Flickering Stars': ['rin_tohsaka'],
    'Flowing Nightglow': ['robin'],
    'I Am As You Behold': ['gilgamesh'],
    'I Shall Be My Own Sword': ['jingliu'],
    'I Venture Forth to Hunt': ['feixiao'],
    'If Time Were a Flower': ['tribbie'],
    'In the Name of the World': ['welt'],
    'In the Night': ['seele'],
    'Incessant Rain': ['silver_wolf'],
    'Inherently Unjust Destiny': ['aventurine'],
    'Into the Unreachable Veil': ['the_herta'],
    'Lies Dance on the Breeze': ['cipher'],
    'Life Should Be Cast to Flames': ['anaxa'],
    'Long May Rainbows Adorn the Sky': ['hyacine'],
    'Long Road Leads Home': ['fugue'],
    'Make Farewells More Beautiful': ['castorice'],
    'Moment of Victory': ['gepard'],
    'Never Forget Her Flame': ['the_dahlia'],
    'Night of Fright': ['huohuo'],
    'Night on the Milky Way': ['himeko'],
    'Ninjutsu Inscription: Dazzling Evilbreaker': ['rappa'],
    'Past Self in Mirror': ['ruan_mei'],
    'Patience Is All You Need': ['kafka'],
    'Reforged in Hellfire': ['mortenax_blade'],
    'Reforged Remembrance': ['black_swan'],
    'Sailing Towards a Second Life': ['boothill'],
    'Scent Alone Stays True': ['lingsha'],
    'She Already Shut Her Eyes': ['fu_xuan'],
    'Sleep Like the Dead': ['yanqing'],
    'Something Irreplaceable': ['clara'],
    'The Finale of a Lie': ['ashveil'],
    'The Hell Where Ideals Burn': ['archer'],
    'The Unreachable Side': ['blade'],
    'This Love, Forever': ['cyrene'],
    'Those Many Springs': ['jiaoqiu'],
    'Though Worlds Apart': ['dan_heng_permansor_terrae'],
    'Thus Burns the Dawn': ['phainon'],
    'Time Waits for No One': ['bailu'],
    'Time Woven Into Gold': ['aglaea'],
    'To Evernight\'s Stars': ['evernight'],
    'Until the Flowers Bloom Again': ['evanescia'],
    'Welcome to the Cosmic City': ['silver_wolf_lv_999'],
    'When She Decided To See': ['yao_guang'],
    'Whereabouts Should Dreams Rest': ['firefly'],
    'Why Does the Ocean Sing': ['hysilens'],
    'Worrisome, Blissful': ['topaz_numby'],
    'Yet Hope Is Priceless': ['jade'],
});

const LIGHTCONE_BY_CHARACTER = Object.freeze(Object.fromEntries(
    Object.entries(SIGNATURE_CHARACTERS_BY_LIGHTCONE).flatMap(([lightconeId, characterIds]) => (
        characterIds.map(characterId => [characterId, lightconeId])
    )),
));

export function signatureCharacterIdsForLightcone(lightconeId) {
    return [...(SIGNATURE_CHARACTERS_BY_LIGHTCONE[lightconeId] || [])];
}

export function signatureLightconeIdForCharacter(characterId) {
    return LIGHTCONE_BY_CHARACTER[characterId] || null;
}

export function signatureLightconeForCharacter(characterId, superimpose = 1) {
    const id = signatureLightconeIdForCharacter(characterId);
    return id ? { id, superimpose } : null;
}

