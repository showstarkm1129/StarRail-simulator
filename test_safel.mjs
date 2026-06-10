import { Registry } from './js/build/registry.js';
import './js/data/characters/_index.js';

const safel = Registry.character.get('safel');
if (safel) {
    console.log("Successfully loaded Safel!");
    console.log(`HP: ${safel.base.hp}, ATK: ${safel.base.atk}, DEF: ${safel.base.def}`);
    console.log(`Skill levels count: ${safel.skills.skill.levels.length}`);
    console.log(`Party Effects count: ${safel.partyEffects.length}`);
} else {
    console.log("Failed to load Safel.");
}
