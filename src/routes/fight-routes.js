const express = require('express');
const router = express.Router();
const Attacks = require('../dao/mongoose/models/attack-model');
const Items  = require('../dao/mongoose/models/item-model');
const Character = require('../dao/mongoose/models/character-model');
const Effect = require('../dao/mongoose/models/effect-model');
const attackService = require('../services/attacks-services');

router.post('/', async (req, res) => {
    try {
        const { self, enemy, attackSlug, itemSlug } = req.body;

        if (!self || !enemy || !attackSlug) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        let selfUpdated = JSON.parse(JSON.stringify(self));
        let enemyUpdated = JSON.parse(JSON.stringify(enemy));
        let battleLog = [];

        const attack = await Attacks.findOne({ slug: attackSlug });
        if (!attack) {
            return res.status(404).json({ error: 'Attack not found' });
        }

        const attackResult = await applyAttack(attack, selfUpdated, enemyUpdated);
        battleLog.push(attackResult.log);
        enemyUpdated = attackResult.enemy;

        if (itemSlug) {
            const item = await Items.findOne({ slug: itemSlug });
            if (!item) {
                return res.status(404).json({ error: 'Item not found' });
            }

            const itemResult = await applyItem(item, selfUpdated, enemyUpdated);
            battleLog.push(itemResult.log);
            selfUpdated = itemResult.self;
            enemyUpdated = itemResult.enemy;
        }

        res.json({
            self: selfUpdated,
            enemy: enemyUpdated,
            log: battleLog
        });

    } catch (error) {
        console.error('Fight error:', error);
        res.status(500).json({ error: error.message });
    }
});

async function applyAttack(attack, self, enemy) {
    let log = `${self.name} uses ${attack.name}!`;

    if (self.fp < attack.fpCost) {
        return {
            log: `Not enough FP!`,
            self,
            enemy
        };
    }

    self.fp -= attack.fpCost;

    // Dégâts
    if (attack.damage > 0) {
        const damage = Math.max(1, attack.damage - enemy.defense);
        enemy.hp -= damage + self.attack - enemy.defense;
        log += ` ${damage} damage!`;
    }

    // Récupération
    if (attack.category === 'recovery' && attack.damage > 0) {
        self.hp = Math.min(self.hp + attack.damage, 100);
        log += ` Recovered ${attack.damage} HP!`;
    }

    // Effet
    if (attack.effect && attack.effect.slug) {
        const effect = await Effect.findOne({ slug: attack.effect.slug });
        if (effect) {
            const roll = Math.random();
            if (roll < (attack.effect.chance || 1.0)) {
                const effectResult = applyEffectToCharacter(effect, enemy, true);
                enemy = effectResult.character;
                log += ` ${effectResult.log}`;
            }
        }
    }

    enemy.hp = Math.max(0, enemy.hp);
    self.fp = Math.max(0, self.fp);

    return { log, self, enemy };
}

async function applyItem(item, self, enemy) {
    let log = `${self.name} uses ${item.name}!`;

    if (item.category === 'recovery') {
        if (item.hp > 0) {
            self.hp = Math.min(self.hp + item.hp, 100);
            log += ` Recovered ${item.hp} HP!`;
        }
        if (item.fp > 0) {
            self.fp = Math.min(self.fp + item.fp, 100);
            log += ` Recovered ${item.fp} FP!`;
        }
    }

    if (item.category === 'attack' && item.damage > 0) {
        const damage = Math.max(1, item.damage - enemy.defense);
        enemy.hp -= damage;
        log += ` ${damage} damage!`;
    }

    // Buff/Debuff
    if (item.effect && item.effect.slug) {
        const effect = await Effect.findOne({ slug: item.effect.slug });
        if (effect) {
            const roll = Math.random();
            if (roll < (item.effect.chance || 1.0)) {
                const target = item.category === 'debuff' ? enemy : self;
                const effectResult = applyEffectToCharacter(
                    effect,
                    target,
                    item.category === 'debuff'
                );
                if (item.category === 'debuff') {
                    enemy = effectResult.character;
                } else {
                    self = effectResult.character;
                }
                log += ` ${effectResult.log}`;
            }
        }
    }

    enemy.hp = Math.max(0, enemy.hp);
    self.hp = Math.max(0, self.hp);

    return { log, self, enemy };
}

function applyEffectToCharacter(effect, character, isDebuff) {
    let log = `${effect.name} applied!`;

    if (!character.status) {
        character.status = [];
    }

    // À implémenter selon les mechanics de l'effet
    if (effect.mechanics.damagePerTurn) {
        character.status.push({
            type: effect.slug,
            damagePerTurn: effect.mechanics.damagePerTurn
        });
        log = `${character.name} is ${effect.name}!`;
    }

    if (effect.mechanics.immobilized) {
        character.immobilized = true;
        log = `${character.name} is immobilized!`;
    }

    return { character, log };
}



module.exports = router;
