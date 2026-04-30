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
        const damage = Math.max(1, attack.damage + self.attack - enemy.defense);
        enemy.hp -= damage;
        log += ` ${damage} damage!`;
    }

    // Récupération
    if (attack.category === 'recovery' && attack.damage > 0) {
        self.hp = Math.min(self.hp + attack.damage, 100);
        log += ` Recovered ${attack.damage} HP!`;
    }

    // Gestion de l'effet (Correction ici)
    if (attack.effect) {
        // Gère si effect est une string "burn" ou un objet { slug: "burn" }
        const effectSlug = typeof attack.effect === 'string' ? attack.effect : attack.effect.slug;
        const effectChance = attack.effect.chance || 1.0;

        const effect = await Effect.findOne({ slug: effectSlug });

        if (effect) {
            const roll = Math.random();
            if (roll < effectChance) {
                let isBeneficial = (effect.type === 'buff' || effect.type === 'recovery');
                let target = isBeneficial ? self : enemy;

                if (effectSlug === 'hp_drain') {
                    const drain = effect.mechanics.drainPerTurn;
                    enemy.hp = Math.max(0, enemy.hp - drain);
                    self.hp = Math.min(100, self.hp + drain);
                    log += ` Drained ${drain} HP!`;
                }

                const effectResult = applyEffectToCharacter(effect, target);

                if (isBeneficial) self = effectResult.character;
                else enemy = effectResult.character;

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

function applyEffectToCharacter(effect, character) {
    let log = `${effect.name} applied!`;
    const mech = effect.mechanics;

    if (!character.status) character.status = [];

    if (mech.immuneEnemies?.includes(character.type)) {
        return { character, log: `${character.name} is immune to ${effect.name}!` };
    }

    Object.keys(mech).forEach(key => {
        const val = mech[key];
        if (val === null || val === false) return;

        switch (key) {
            case 'curesAllStatus':
                character.status = [];
                character.immobilized = false;
                break;
            case 'curesStatus':
                character.status = character.status.filter(s => !val.includes(s.slug));
                break;
            case 'setHpTo':
                character.hp = val;
                break;
            case 'swapHpFp':
                [character.hp, character.fp] = [character.fp, character.hp];
                break;
            case 'damageAmount':
                if (mech.instantEffect) character.hp = Math.max(0, character.hp - val);
                break;
        }
    });

    if (!mech.instantEffect) {
        const existingIndex = character.status.findIndex(s => s.slug === effect.slug);

        if (existingIndex !== -1 && !mech.stackable) {
            character.status[existingIndex].duration = mech.duration || 3;
            return { character, log: `${effect.name} refreshed!` };
        }

        if (mech.attackMultiplier) character.attack *= mech.attackMultiplier;
        if (mech.attackIncrease) character.attack += mech.attackIncrease;
        if (mech.attackReduction) character.attack = Math.max(0, character.attack - mech.attackReduction);

        if (mech.defenseMultiplier) character.defense *= mech.defenseMultiplier;
        if (mech.speedMultiplier) character.speed *= mech.speedMultiplier;

        if (mech.immobilized) character.immobilized = true;
        if (mech.noDamage) character.invincible = true;
        if (mech.skipTurn) character.skipNextTurn = true;
        if (mech.extraTurn) character.hasExtraTurn = true;
        if (mech.nextAttackCritical) character.nextHitCritical = true;

        character.status.push({
            slug: effect.slug,
            name: effect.name,
            duration: mech.duration,
            mechanics: {
                damagePerTurn: mech.damagePerTurn,
                healPerTurn: mech.healPerTurn,
                fpHealPerTurn: mech.fpHealPerTurn,
                drainPerTurn: mech.drainPerTurn,
                missChance: mech.missChance,
                targetMissChance: mech.targetMissChance,
                reflectDamage: mech.reflectDamage,
                reflectDamagePercent: mech.reflectDamagePercent,
                fpCostMultiplier: mech.fpCostMultiplier,
                damageMultiplier: mech.damageMultiplier,
                damageReduction: mech.damageReduction,
                ...mech
            }
        });

        log = `${character.name} is affected by ${effect.name}!`;
    }

    return { character, log };
}



module.exports = router;
