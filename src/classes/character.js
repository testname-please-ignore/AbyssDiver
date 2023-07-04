"use strict";
/* global assert, AgeEvent */

/* exported Character */
class Character {
    /**
     * Creates a new Character object.
     * @param {string} name The character's name.
     * @param {number} cost The cost to recruit the character, or -1 for unrecruitable characters (like the main
     *     characters and the golem).
     * @param {number} carry The carry capacity of the character.
     * @param {number|undefined} affec The affection of the character towards the main character. Only required for
     *     companions.
     * @param {boolean} swap Whether the character has been body-swapped.
     * @param {string} image The path to the image of the character.
     * @param {string} imageIcon The path to the image of the character's icon.
     * @param {[Curse]} curses The curses this character has taken.
     * @param {'male' | 'female'} mindSex The gender identity of this character.
     * @param {'male' | 'female'} osex The original sex of this character's body (as determined by its genitals).
     * @param {number} obreasts The original breast size of this character's body.
     * @param {number} desiredBreasts The breast size this character would like most.
     * @param {number} openis The original size of this character's body's penis, or 0 if it has no penis.
     * @param {number} ogender The original apparent gender of this body, as a number between 1 (completely male
     * expression) and 6 (completely female expression).
     * @param {number} fit How fit this character is, as a number from 0 (weakling) to 10 (peak human performance).
     * @param {number} oheight The original height of this character's body, in cm.
     * @param {number} comfortableHeight The height at which this character feels most comfortable.
     * @param {number} age The chronological age of this character at the beginning of the game.
     * @param {string} appDesc A description of what makes this character's body special. Used when MC gains a
     * companion's body to determine how it affects them (narratively).
     * @param {'darkness'|'spiders'|'wolves'|'snakes'|'insects'|'slime'|'desperation'|'rot'|'unknown'} fear What this
     * character fears most. 'unknown' is an unknown fear, although its event also fits with fear of the unknown.
     * @param {string} ohair The original color of this character's body's hair.
     * @param {string} oskinColor The original color of this character's body's skin.
     * @param {string} oskinType The original texture of this character's body's skin.
     * @param {string} oears The original shape of this character's body's ears.
     * @param {string} oeyeColor The original color of this character's body's eyes.
     * @param {string} oblood The original color of this character's blood.
     * @param {number} pregnantT The day in which this character has been impregnated.
     * @param {number} due The day in which this character's pregnancy is due.
     * @param {number} lastBirth The day on which this character's last birth occurred.
     * @param {boolean} switched Whether this character has switched bodies.
     * @param {[CharEvent]} events The list of events that affected this character.
     */
    constructor({name, cost=-1, carry, affec=0, swap=false,
                    image, imageIcon, curses=[], mindSex='male',
                    osex=mindSex, obreasts, desiredBreasts=obreasts,
                    openis, ogender, fit, oheight,
                    comfortableHeight, age, appDesc = '', fear,
                    ohair, oskinColor, oskinType='', oears='normal human', oeyeColor,
                    oblood='red', pregnantT=setup.never, due=setup.never,
                    lastBirth=setup.never, switched=false, events=[]}) {
        if ([name, carry, image, imageIcon, obreasts, openis, ogender, fit, oheight, comfortableHeight,
             age, appDesc, fear, ohair, oskinColor, oeyeColor].includes(undefined)) {
            console.error(`Character constructor called without all required arguments.`);
        }

        assert(typeof name === 'string' && name.length > 0,
               'name must be a non-empty string');
        this.name = name;
        assert(typeof cost === 'number' && cost > -2,
               'cost must be a nonnegative number, or -1 for un-buyable companions');
        this.cost = cost;
        assert(typeof carry === 'number' && carry > 0,
               'carry must be a positive number');
        this.carry = carry;
        assert(typeof affec === 'number' || affec === undefined,
               'affection must be a number');
        this.affec = affec;
        assert(typeof swap === 'boolean',
               'swap must be a boolean');
        this.swap = swap;
        assert( typeof image === 'string',
                'image must be a string');
        this.image = image;
        assert( typeof imageIcon === 'string',
                'imageIcon must be a string');
        this._imageIcon = imageIcon;
        assert(Array.isArray(curses),
               "curses must be an array of curses");
        this.curses = curses;
        assert(['male', 'female'].includes(mindSex),
               'mindSex must be "male" or "female"');
        this.mindSex = mindSex;
        assert(['male', 'female'].includes(osex),
               'osex must be "male" or "female"');
        this.osex = osex;
        assert(typeof obreasts === 'number' && obreasts >= 0,
               'obreasts must be a nonnegative number');
        this.obreasts = obreasts;
        assert(typeof desiredBreasts === 'number' && desiredBreasts >= 0,
               'desiredBreasts must be a nonnegative number');
        this.desiredBreasts = desiredBreasts;
        assert(typeof openis === 'number' && obreasts >= 0,
               'openis must be a nonnegative number');
        this.openis = openis;
        assert(typeof ogender === 'number' && ogender >= 1 && ogender <= 6,
               'ogender must be a number between 1 and 6');
        this.ogender = ogender;
        assert(typeof fit === 'number',
               'fit must be a number between 0 and 10');
        this.fit = fit;
        assert(typeof oheight === 'number' && oheight > 0,
               'oheight must be a positive number');
        this.oheight = oheight;
        assert(typeof comfortableHeight === 'number' && comfortableHeight > 0,
               'comfortableHeight must be a positive number');
        this.comfortableHeight = comfortableHeight;
        assert(typeof age === 'number' && age > 0,
               'age must be a positive number');
        this.age = age;
        assert(typeof appDesc === 'string',
               'appDesc must be a string');
        this.appDesc = appDesc;
        assert(['darkness', 'spiders', 'wolves', 'snakes', 'insects',
                'slime', 'desperation', 'rot', 'unknown'].includes(fear),
               "fear must be one of the implemented fears: 'darkness', 'spiders', 'wolves', 'snakes', 'insects', \
        'slime', 'desperation', 'rot', 'unknown'");
        this.fear = fear;
        assert(typeof ohair === 'string',
               'ohair must be a string');
        this.ohair = ohair;
        assert(typeof oskinColor === 'string',
               'oskincolor must be a string');
        this.oskinColor = oskinColor;
        assert(typeof oskinType === 'string',
               'oskinType must be a string');
        this.oskinType = oskinType;
        assert(typeof oears === 'string',
               'oears must be a string');
        this.oears = oears;
        assert(typeof oeyeColor === 'string',
               'oeyecolor must be a string');
        this.oeyeColor = oeyeColor;
        assert(typeof oblood === 'string',
               'oblood must be a string');
        this.oblood = oblood;
        assert(Array.isArray(events),
               "events must be an array of events");
        this.events = events;
        assert(typeof pregnantT === 'number',
               'pregnantT must be a number');
        this.pregnantT = pregnantT;
        assert(typeof due === 'number',
               'due must be a number');
        this.due = due;
        assert(typeof lastBirth === 'number',
               'lastBirth must be a number')
        this.lastBirth = lastBirth;
        assert(typeof switched === 'boolean',
               'switched must be a boolean')
        this.switched = switched;
    }

    /**
     * Returns the internal state of this Character, from which another character can be built.
     * @returns {{mindSex: ("male"|"female"), oears: string, fit: number, comfortableHeight: number, imageIcon: string, oheight: number, ohair: string, pregnantT: number, events: CharEvent[], fear: ("darkness"|"spiders"|"wolves"|"snakes"|"insects"|"slime"|"desperation"|"rot"|"unknown"), image: string, cost: number, osex: ("male"|"female"), swap: boolean, ogender: number, oblood: string, lastBirth: number, oskinColor: string, oeyeColor: string, desiredBreasts: number, due: number, curses: Curse[], openis: number, appDesc: string, oskinType: string, name: string, affec: (number|undefined), switched: boolean, carry: number, obreasts: number, age: number}}
     */
    _internalState() {
        return {
            name: this.name, cost: this.cost, carry: this.carry, affec: this.affec, swap: this.swap,
            image: this.image, imageIcon: this._imageIcon, curses: this.curses.map(c => c),
            mindSex: this.mindSex, osex: this.osex, obreasts: this.obreasts,
            desiredBreasts: this.desiredBreasts, openis: this.openis, ogender: this.ogender,
            fit: this.fit, oheight: this.oheight, comfortableHeight: this.comfortableHeight,
            age: this.age, appDesc: this.appDesc, fear: this.fear, ohair: this.ohair,
            oskinColor: this.oskinColor, oskinType: this.oskinType, oears: this.oears,
            oeyeColor: this.oeyeColor, oblood: this.oblood, pregnantT: this.pregnantT, due: this.due,
            lastBirth: this.lastBirth, switched: this.switched, events: this.events.map(e => e)
        };
    }

    /**
     * Clones this character.
     * @returns {Character} A (non-deep) copy of this character.
     */
    clone() {
        return new Character(this._internalState());
    }

    /**
     * Creates a sugarcube revivable json object from which this Character can be revived.
     * @returns {[]} The revivable JSON.
     */
    toJSON() {
        return JSON.reviveWrapper(`new Character($ReviveData$)`, this.internalState())
    }

    /**
     * returns whether this character is pregnant.
     * @returns {boolean} true iff this character is pregnant.
     */
    get isPregnant() {
        if (this.womb === 0) this.setNotPregnant();
        return this.pregnantT <= State.variables.time
    }

    // I could use a setter for setConsideredPregnant and setNotPregnant instead, but I don't want to confuse people
    // with the somewhat unintuitive behavior that setting pregnant = true would cause a pregnancy to start two weeks
    // ago, and that setting it to true when it's already set resets the pregnancy. Calling the function explicitly
    // makes it clearer that it has side effects.
    /**
     * Makes this character pregnant from two weeks ago.
     */
    setConsideredPregnant() {
        if (this.womn === 0) {
            console.error('Can\'t make a character without wombs pregnant.');
            return;
        }
        this.pregnantT = State.variables.time - 14;
        this.due = this.pregnantT + 280 + random(-7, 7);
    }

    /**
     * Makes this character not pregnant.
     */
    setNotPregnant() {
        this.pregnantT = setup.never;
        this.due = setup.never;
    }

    /**
     * Gets the due date of this character
     * @returns {number} The day in which this character is due.
     */
    get dueDate() {
        if (this.womb === 0) this.setNotPregnant();
        return this.due;
    }

    /**
     * Gets the number of days this character has been pregnant.
     * @returns {number} The number of days elapsed since fertilisation.
     */
    get daysConsideredPregnant() {
        if (this.womb === 0) this.setNotPregnant();
        return Math.max(State.variables.time - this.pregnantT, 0);
    }

    /**
     * Gets the number of days left until this character's pregnancy is due.
     * @returns {number} The number of days left in this character's pregnancy
     */
    get daysUntilDue() {
        if (!this.isPregnant) return setup.never;
        return Math.max(this.dueDate - State.variables.time, 0);
    }

    /**
     * Returns the character's current age as it would be without age-reducing curses.
     * Includes time spent in the abyss and the effects of the fountain of youth.
     * @returns {number} The character's biological age.
     */
    get realAge() {
        let daysElapsed = State.variables.time;
        // Not fond of relying on object identity given twine's propensity for copying objects, but we don't have another
        // identifying feature (name does not work because user could choose a name already used by a companion)
        if (this === State.variables.mc && State.variables.eternalYouth < State.variables.time) {
            daysElapsed = State.variables.eternalYouth;
        }
        return (this.age * AgeEvent.aYear + daysElapsed * AgeEvent.aDay) / AgeEvent.aYear;
    }

    /**
     * Returns the character's apparent age.
     * @returns {number} The character's apparent age, including age-reducing effects.
     */
    get appAge() {
        let eternalYouthTime = State.variables.eternalYouth * AgeEvent.aDay;
        let curAge = this.age * AgeEvent.aYear;
        let unitsElapsed = 0;
        for (let event of this.events) {
            if (unitsElapsed < eternalYouthTime) {
                let unitsSinceLastEvent = Math.min(event.time * AgeEvent.aDay, eternalYouthTime) - unitsElapsed;
                curAge += unitsSinceLastEvent;
            }
            curAge = event.age(curAge);
            unitsElapsed = event.time * AgeEvent.aDay;
        }
        curAge = Math.max(curAge, settings.appAgeControl * AgeEvent.aYear);
        return curAge / AgeEvent.aYear;
    }

    /**
     * Returns the gender expression of this character as a number between 1 (folly masculine) and 6 (fully feminine)
     * @returns {number} The gender expression of this character.
     */
    get gender() {
        let gender = this.ogender;
        for (let event of this.events) {
            gender = event.changeGender(this, gender);
        }

        if (this.daysConsideredPregnant >= 90 && this.daysUntilDue > 0) {
            gender += 1;
        }

        return Math.clamp(gender, 1, 6)
    }

    /**
     * Returns the base size of this character's penis. For internal use only.
     * When writing events involving this character use penisCor instead.
     * @returns {number} The character's penis' base size.
     */
    get penis() {
        let penis = this.openis;
        for (let event of this.events) {
            penis = event.changePenis(this, penis);
        }
        // if (this.events.find(e => e.name === 'Sex Switcheroo') !== undefined) {
        //     if (this.osex === 'male') {
        //         penis = 0;
        //     } else {
        //         penis = Math.max(_handle.obreasts * 2, 1);
        //     }
        // }
        // if (this.events.find(e => e.name === 'Futa Fun') && this.osex === 'female') {
        //     penis = Math.max(_handle.obreasts * 2, 1);
        // }
        // if (this.events.find(e => e.name === 'Null') !== undefined) {
        //     penis = 0;
        // }
        let assetChange = 0;
        for (let event of this.events) {
            assetChange = event.growAsset(assetChange);
        }
        return penis + assetChange;
    }

    /**
     * Returns the size of this character's penis.
     * @returns {number} The character's penis' size, or 0 if they don't have one.
     */
    get penisCor() {
        let penis = this.penis;
        if (penis > 0) {
            let fullyGrownAge = 18 - (this.gender - 1) / 5; /* 1 year lower for fully feminine characters. */
            if (this.appAge < fullyGrownAge) {
                penis = Math.max(penis * (1 - (fullyGrownAge - this.appAge) / 12), 1);
            }
        }
        for (let event of this.events) {
            penis = event.miniOrGigantify(penis);
        }
        return penis;
    }

    /**
     * Returns the number of this character's vaginas.
     * @returns {number} The number of vaginas this character has.
     */
    get vagina() {
        let vag = this.osex === 'male' ? 0 : 1;
        for (let event of this.events) {
            vag = event.changeVagina(this, vag);
        }
        return vag;
    }

    /**
     * Returns whether this character has two penises.
     * @returns {boolean} true iff this character has a double penis.
     */
    get doublePenis() {
        return this.events.reduce((v, e) => e.doublePenis(this, v), false);
    }

    /**
     * Returns the sex of this character's body.
     * @returns {'doll-like' | 'futa' | 'male' | 'female'} The sex of this character's body.
     */
    get sex() {
        let penis = this.penis
        let vagina = this.vagina
        let breasts = this.breasts

        if (penis === 0 && vagina === 0) return 'doll-like';
        if (penis > 0 && (breasts > 0 || vagina > 0)) return 'futa';
        if (penis > 0) return 'male';
        if (vagina > 0) return 'female';
        // This can only happen if penis or vagina are < 0 somehow
        console.error('character has impossible genitals:');
        console.error(this);
        return 'futa'
    }

    /**
     * Returns the number of wombs this character has.
     * @returns {number} The number of wombs in this character's body.
     */
    get womb() {
        let wombs = this.vagina;
        let extraWombLocations = []
        for (let event of this.events) {
            [wombs, extraWombLocations] = event.changeWomb(this, wombs, extraWombLocations);
        }
        return wombs;
    }

    /**
     * Returns the location of this character's first additional womb.
     * @returns {'vagina' | 'urethra' | 'anus' | 'throat'}
     * @deprecated use extraWombs instead
     */
    get womb1() {
        let wombs = this.vagina;
        let extraWombLocations = []
        for (let event of this.events) {
            [wombs, extraWombLocations] = event.changeWomb(this, wombs, extraWombLocations);
        }
        return extraWombLocations[0] || '';
    }

    /**
     * Returns the location of this character's second additional womb.
     * @returns {'vagina' | 'urethra' | 'anus' | 'throat'}
     * @deprecated use extraWombs instead
     */
    get womb2() {
        let wombs = this.vagina;
        let extraWombLocations = []
        for (let event of this.events) {
            [wombs, extraWombLocations] = event.changeWomb(this, wombs, extraWombLocations);
        }
        return extraWombLocations[1] || '';
    }

    /**
     * Returns the locations of this character's additional wombs.
     * @returns {['vagina' | 'urethra' | 'anus' | 'throat']}
     */
    get extraWombs() {
        let wombs = this.vagina;
        let extraWombLocations = []
        for (let event of this.events) {
            [wombs, extraWombLocations] = event.changeWomb(this, wombs, extraWombLocations);
        }
        return extraWombLocations;
    }

    /**
     * Returns the lactation amount of this character. Between 0 and 2.
     * @returns {number}
     */
    get lactation() {
        let lactation = 0;
        for (let event of this.events) {
            lactation = event.changeLactation(this, lactation);
        }

        /* Boost lactation in the last stages of pregnancy. */
        if (this.isPregnant) {
            if (this.daysConsideredPregnant > 240) lactation += 1
            if (this.daysConsideredPregnant > 270) lactation += 1
        } else if (this === State.variables.mc) {
            /* Boost lactation after giving birth until the next menstruation cycle. */
            if (State.variables.menCycleFlag && State.variables.menCycleT - State.variables.time > 0) {
                lactation += 1;
            }
            if (State.variables.menCycleFlag && State.variables.menCycleT - State.variables.time > 30) {
                lactation += 1;
            }
        } else if (this.lastBirth < State.variables.time) {
            /* Boost lactation for a while after giving birth. */
            if (State.variables.time - this.lastBirth < 60) {
                lactation += 1;
            }
            if (State.variables.time - this.lastBirth < 30) {
                lactation += 1;
            }
        }

        /* Maximize Lily's lactation if you're breastfeeding from her. */
        if (this === State.variables.companionLily && State.variables.LilyConvoLac) {
            lactation += 2;
        }

        // Can't lactate without nipples
        if (this.sex === 'doll-like') {
            lactation = 0;
        }

        lactation = Math.min(lactation, 2)

        return lactation;
    }

    /**
     * Returns the base size of this character's breasts. For internal use only.
     * When writing events involving this character use breastsCor instead.
     * @returns {number}
     */
    get breasts() {
        let breasts = this.obreasts;
        for (let event of this.events) {
            breasts = event.changeBreasts(this, breasts);
        }
        return breasts;
    }

    /**
     * Returns the size of this character's breasts.
     * @returns {number} The size of this character's breasts in cups, or 0 for flat chests.
     */
    get breastsCor() {
        // If the character doesn't have a penis, expansion affects breasts even if they didn't used to have any
        let breastsGrowAnyway = this.penis === 0;
        let breastSize = this.breasts;
        let fullyGrownAge = 18 - (this.gender - 1) / 5; /* 1 year lower for fully feminine characters. */
        if (this.appAge < fullyGrownAge) {
            breastSize = breastSize * Math.max(1 - (fullyGrownAge - this.appAge) / 10, 0);
        }

        let assetChange = 0;
        for (let event of this.events) {
            assetChange = event.growAsset(assetChange);
        }

        if (breastSize > 0 || breastsGrowAnyway) {
            breastSize += assetChange;
        }

        if (this.daysConsideredPregnant >= 90) breastSize += 0.5;
        if (this.daysConsideredPregnant >= 120) breastSize += 0.5;

        // Not fond of relying on object identity given twine's propensity for copying objects, but we don't have another
        // identifying feature (name does not work because user could choose a name already used by a companion)
        if (this === State.variables.mc && !this.isPregnant) {
            if(State.variables.menCycleFlag) {
                /* Boost breast size after day 20 of the menstruation cycle. */
                if (State.variables.time - State.variables.menCycleT - State.variables.menCycleVar > 20) {
                    breastSize += 0.5;
                }
                /* Boost breast size after giving birth until the next menstruation cycle. */
                if (State.variables.menCycleT - State.variables.time > 0) {
                    breastSize += 0.5;
                }
                if (State.variables.menCycleT - State.variables.time > 30) {
                    breastSize += 0.5;
                }
            }
        } else if (!this.isPregnant && this.lastBirth < State.variables.time) {
            /* Boost breast size for a while after giving birth. */
            if (State.variables.time - this.lastBirth < 60) {
                breastSize += 0.5;
            }
            if (State.variables.time - this.lastBirth < 30) {
                breastSize += 0.5;
            }
        }

        breastSize += this.lactation;

        if (this.curses.find(c => c.name === 'Double Pepperoni')) {
            /* You can't look entirely flat with such puffy nipples. */
            breastSize = Math.max(breastSize, 1);
        }

        return breastSize;
    }

    /**
     * Returns the cup size of this character's breasts as a string.
     * @returns {string} The cup size of this character's breasts, or 'flat' for flat-chested characters (typically men).
     */
    get breastsLabel() {
        let size = this.breastsCor;
        if (size < 1) return 'flat';
        if (size < 2) return 'AA';
        if (size >= 20) return 'S';
        if (!isFinite(size)) return 'immeasurable';
        // A is the character at code point 64. The following code points contain the rest of the alphabet, in order.
        // Look up an ASCII table for more information (this is unicode not ascii, but the first 128 code points are
        // copied from ascii for compatibility).
        return String.fromCodePoint(63 + Math.floor(size));
    }

    /**
     * Returns the height of this character.
     * @returns {number} The height of this character in cm.
     */
    get height() {
        let height = this.oheight;
        let direction = 0;
        for (let event of this.events) {
            direction = event.changeHeightDirection(direction);
            height = event.changeHeight(height, direction);
        }
        for (let event of this.events) {
            height = event.miniOrGigantify(height);
        }

        /* Change in height with genderlevel changes and height increases/decreases; it is modeled such that */
        /* 5 cm is always 5 cm with respect to your starting height and irrespective of starting gender.     */
        let adultHeight = this.oheight * (1 - 0.01525 * ((this.gender - 1) - (this.osex === 'female' ? 5 : 0))) +
                          (height - this.oheight) * (1 - 0.01525 * (this.osex === 'female' ? 5 : 0))

        let size_factor = 18 - this.appAge;

        if (size_factor < 0.2 * (this.gender - 1)) {
            return adultHeight;
        }
        if (size_factor <= 6) {
            /* Puberty phase: It shifts for females as theirs ends earlier; for simplicity */
            /* I assumed the start is the same regardless although this is not entirely    */
            /* correct. I used a polynomial here to simulate the 'reverse growth spurt'.   */
            let gendered_factor = size_factor - 0.2 * (this.gender - 1);
            return adultHeight * (1 -
                                  ( 4.70611e-3 - 8.1433e-4 * (this.gender - 1)) * gendered_factor -
                                  ( 1.1049e-4  - 1.140e-5  * (this.gender - 1)) * gendered_factor**2 -
                                  ( 1.6698e-3  - 1.3722e-4 * (this.gender - 1)) * gendered_factor**3 -
                                  (-1.7701e-4  + 2.114e-5  * (this.gender - 1)) * gendered_factor**4);
        }
        if (size_factor <= 15) {
            /* The second phase of linear growth or decline, it's a decent approximation without making things too     */
            /* complicated. It ends at age 3 (originally 4, but changed it to not break the rest of the code). The     */
            /* calculation for the puberty growth spurt is in here to provide a starting point for the linear decline. */
            let gendered_factor = 6 - 0.2 * (this.gender - 1);
            return adultHeight * (1 -
                                  ( 4.70611e-3 - 8.1433e-4 * (this.gender - 1)) * gendered_factor -
                                  ( 1.1049e-4  - 1.140e-5  * (this.gender - 1)) * gendered_factor**2 -
                                  ( 1.6698e-3  - 1.3722e-4 * (this.gender - 1)) * gendered_factor**3 -
                                  (-1.7701e-4  + 2.114e-5  * (this.gender - 1)) * gendered_factor**4 -
                                  (0.033 + 0.0009 * (this.gender - 1)) * (size_factor - 6));
        }
        console.error('Found character aged less than 3:');
        console.error(this);
        return height;
    }

    /**
     * Returns the height of this character. Identical to height, but retained for backwards-compatibility.
     * @returns {number} The height of this character in cm
     * @deprecated Use height instead
     */
    get heightCor() {
        return this.height;
    }

    /**
     * Returns whether this character has a size handicap that increases travel times.
     * Only has an effect on the main character.
     * @returns {boolean} true iff this character is handicapped.
     */
    get hasSizeHandicap() {
        let handicapped = false;
        for (let event of this.events) {
            handicapped = event.addSizeHandicap(handicapped);
        }
        return handicapped;
    }

    /**
     * Returns the strength of the character's libido.
     * @returns {number} The strength of this character's libido.
     */
    get libido() {
        let libido = 2;
        for (let event of this.events) {
            libido = event.changeLibido(libido);
        }

        // Not fond of relying on object identity given twine's propensity for copying objects, but we don't have another
        // identifying feature (name does not work because user could choose a name already used by a companion)
        if (this === State.variables.mc) {
            if (State.variables.lastFlan !== undefined &&
                State.variables.time === State.variables.lastFlan) {
                libido++;
            }
            if (State.variables.menCycleFlag) {
                /* Libido boost around 14 days into the cycle. */
                if (13 <= State.variables.timetime - State.variables.menCycleT
                    && State.variables.time - State.variables.menCycleT <= 15) {
                    libido++;
                }
                /* Libido penalty around 22 days into the cycle. */
                if (20 <= State.variables.timetime - State.variables.menCycleT
                    && State.variables.time - State.variables.menCycleT <= 24) {
                    libido--;
                }
            }
            if (this.curses.some(c => c.name === 'Heat/Rut')
                && State.variables.time - State.variables.heatCycleT === 14) {
                libido += 2;
            }
            if (this.curses.some(c => c.name === 'The Maxim')) {
                let activity = Math.random() * 2; // TODO: this should be tested daily, not on every use I think
                if (libido < 2 && activity > 1) {
                    libido += 3;
                }
                if (libido < 4 && activity > 2) {
                    libido += 2;
                }
            }
        }
        return libido;
    }

    /**
     * Returns the amount by which this character's standards are lowered.
     * @returns {number} The amount by which this character's standards are lowered.
     */
    get loweredStandards() {
        let lowering = 0;
        for (let event of this.events) {
            lowering = event.lowerStandards(lowering);
        }
        return lowering;
    }

    /**
     * Returns the submission/dominance value of this character.
     * @returns {number} The degree of sub/dom-ness of this character.
     */
    get subdom() {
        let subdom = 0;
        for (let event of this.events) {
            subdom = event.changeSubDom(subdom);
        }
        return subdom;
    }

    /**
     * Returns the apparent gender of this character.
     * @returns {number} The apparent gender of this character.
     */
    get appGender() {
        let scaleFactor = this.events.reduce((v, e) => e.miniOrGigantify(v), 1);
        let unscaledPenis = this.penisCor / scaleFactor;

        let appGender = 2 * (this.gender - 1)
                        - 0.25 * (unscaledPenis - 4)
                        + 0.5 * (this.breastsCor - 3)
                        - (this.fit > 7 ? 1 : 0);
        if (this === State.variables.mc) {
            appGender += 0.5 * State.variables.colwear + 0.25 * State.variables.scent + 0.5 * State.variables.slwear
            if (State.variables.dollevent2) appGender++;
        }
        return appGender;
    }

    /**
     * Returns a description of this character's hair.
     * @returns {string} A description of this character's hair.
     */
    get hair() {
        let hair = this.ohair;
        return this.events.reduce((v, e) => e.changeHair(v), hair);
    }

    /**
     * Returns a description of this character's ears.
     * @returns {string} A description of this character's ears.
     */
    get ears() {
        let ears = this.oears;
        return this.events.reduce((v, e) => e.changeEars(v), ears);
    }

    /**
     * Returns the quantity of this character's body hair.
     * @returns {number} The level of this character's body hair.
     */
    get bodyHair() {
        let bodyHair = 1;
        return this.events.reduce((v, e) => e.changeBodyHair(v), bodyHair);
    }

    /**
     * Returns a description of this character's skin texture.
     * @returns {string} A description of this character's skin texture
     */
    get skinType() {
        let skinType = this.oskinType;
        return this.events.reduce((v, e) => e.changeSkinType(v), skinType);
    }

    /**
     * Returns the color of this character's skin.
     * @returns {string} The color of this character's skin.
     */
    get skinColor() {
        let skinColor = this.oskinColor;
        return this.events.reduce((v, e) => e.changeSkinColor(v), skinColor);
    }

    /**
     * Returns the color of this character's eyes.
     * @returns {string} The color of this character's eyes.
     */
    get eyeColor() {
        let eyeColor = this.oeyeColor;
        return this.events.reduce((v, e) => e.changeEyeColor(v), eyeColor);
    }

    /**
     * Returns a list of this character's tails.
     * @returns {[string]} A list of strings, each describing one tail this character has.
     */
    get tail() {
        let tails = [];
        return this.events.reduce((v, e) => e.changeTails(v), tails);
    }

    /**
     * Returns a description of this character.
     * @returns {string} A description of this character.
     */
    get desc() {
        let desc = '';
        return this.events.reduce((v, e) => e.changeDesc(v), desc);
    }

    /**
     * Returns the color of this character's blood.
     * @returns {string} The color of this character's blood.
     */
    get blood() {
        let blood = this.oblood;
        return this.events.reduce((v, e) => e.changeBlood(v), blood);
    }

    /**
     * Returns the pitch of this character's voice (used to determine text color in conversations).
     * @returns {number} The pitch of this character's voice.
     */
    get genderVoice() {
        if (this === State.variables.mc && State.variables.colwear) {
            return 99;
        }
        return this.gender;
    }

    /**
     * Returns part of the CSS used to style conversations involving this character.
     * @returns {string} A CSS string.
     */
    get style() {
        return 'border: 2px solid rgb(1, 0, 0);'
    }

    /**
     * Returns part of the CSS used to style conversations involving this character.
     * @returns {string} A CSS string.
     */
    get style1() {
        let r, g, b, a;
        switch (this.gender) {
            case 1:
                r = 40;
                g = 40;
                b = 255;
                break;
            case 2:
                r = 80;
                g = 80;
                b = 240;
                break;
            case 3:
                r = 120;
                g = 100;
                b = 230;
                break;
            case 4:
                r = 165;
                g = 120;
                b = 220;
                break;
            case 5:
                r = 210;
                g = 140;
                b = 210;
                break;
            case 6:
                r = 255;
                g = 160;
                b = 200;
                break;
            default:
                console.error(`${this.name} has invalid gender:`)
                console.error(this);
                r = 255;
                g = 0;
                b = 0;
        }
        let appAge = this.appAge;
        if (appAge > 18) a = 1;
        else if (appAge > 15) a = 0.8;
        else if (appAge > 12) a = 0.6;
        else if (appAge > 9) a = 0.4;
        else a = 0.2;

        return `box-shadow: 0 0 10px 2px rgba(${r}, ${g}, ${b}, ${a});
        background-color: black;`
    }

    /**
     * Returns the path of the image used in icons representing this character.
     * @returns {string} The path to the image containing this character's icon.
     */
    get imageIcon() {
        let transformed = this.events.reduce((v, e) => e.changeImageIcon(v), '');
        if (transformed !== '') return transformed;

        if (this === State.variables.mc || this === State.variables.companionTwin) {
            let image = this.appGender <= 5 ? 'M' : 'F';
            return `Player Icons/player${image}.png`;
        }
        return this._imageIcon;
    }

    /**
     * Returns the lewdness of this character. Only meaningful for the main character.
     * @returns {number} The lewdness of this character.
     */
    get lewdness() {
        let lewdness = (this.libido - 2) * 3 + this.loweredStandards;
        let hasLuminous = false;
        if (this === State.variables.mc) {
            hasLuminous = State.variables.luminousWear;
            lewdness += State.variables.crumbleFluid / 10;
            lewdness += State.variables.algalSize;
            lewdness += State.variables.foodL6;
        }
        if (!hasLuminous) {
            if (this.breastsCor > 5) lewdness++;
            if (this.breastsCor > 7) lewdness++;
            if (this.breastsCor > 9) lewdness++;
            if (this.penis > 6) lewdness++;
            if (this.penis > 10) lewdness++;
        }
        return this.events.reduce((v, e) => e.changeLewdness(v, this), lewdness);
    }

    /**
     * Returns the number of horns on this character.
     * @returns {number} The number of horns this character has.
     */
    get horns() {
        return this.events.reduce((v, e) => e.addHorns(v), 0);
    }

    /**
     * Returns the inhumanity level of this character.
     * @returns {number} The inhumanity of this character.
     */
    get inhuman() {
        let inhuman = 0;
        if (this.ears !== 'normal human') inhuman++;
        if (this.skinType !== '' && this.skinType !== 'hairless, smooth') inhuman += 4;
        if (this.blood !== 'red') inhuman += 2;
        if (this.horns > 0) inhuman += 2;
        if (this.horns > 1) inhuman += 1;
        inhuman += this.tail.length * 2;
        inhuman = this.events.reduce((v, e) => e.inhumanise(v), inhuman);
        if (this === State.variables.mc && State.variables.LuminousWear) inhuman /= 4;
        return inhuman;
    }

    /**
     * Returns the level of conversation handicap of this character.
     * 0: no handicap
     * 1: small handicap
     * 2: large handicap
     * Only meaningful for the main character.
     * @returns {number} The level of conversation handicap of this character.
     */
    get conversationHandicap() {
        if (this.curses.some(c => c.name === 'Deafening Silence')) return 2;
        if (this.curses.some(c => c.name === 'Beastly')) return 1;
        if (this.curses.some(c => c.name === 'Taciturn Turnaround')) return 1;
        return 0;
    }

    /**
     * Returns the penalty to the threat of this character.
     * @returns {number} The penalty or bonus to this character's threat.
     */
    get threatHandicap() {
        let handicap = 0;
        let eyes = this.eyeCount;
        if (eyes < 2) {
            if (this !== State.variables.mc || !State.variables.BionicEye) {
                handicap -= 3;
                if (this === State.variables.mc && State.variables.BDwear) {
                    handicap += 1;
                }
            }
        }
        if (eyes < 1) {
            if (this !== State.variables.mc || !State.variables.BionicEye) {
                handicap -= 5;
                if (this === State.variables.mc && State.variables.BDwear) {
                    handicap += 3;
                }
            }
        }
        handicap = this.events.reduce((v, e) => e.changeThreatHandicap(v), handicap)

        let height = this.height
        if (height > 185) {
            handicap += Math.min(Math.floor(((height - 170) / 170 - 1) * 10), 7);
        } else if (height < 155) {
            handicap += Math.max(Math.floor(((height - 170) / height - 1) * 10), -7);
        }

        if (this.name === 'Khemia' && State.variables.convo.khemiaAegis === 1) handicap += 5;

        if (this === State.variables.mc) {
            if (State.variables.BDwear) handicap += 1;
            if (State.variables.BionicArm) handicap += 8;
            if (State.variables.AegisWear) handicap += 5;
        }

        let trueFitness = this.curses.some(c => c.name === 'Weakling') ? 0 : this.fit;
        handicap += trueFitness / 4 - 1.25

        let arms = this.armCount;
        let legs = this.legCount;
        let armsLegsLost = ''
        if (arms < 2) armsLegsLost += 'A';
        if (arms < 1) armsLegsLost += 'A';
        if (this !== State.variables.mc || !State.variables.DaedalusEquip) {
            if (legs < 2) armsLegsLost += 'L';
            if (legs < 1) armsLegsLost += 'L';
        }

        switch (armsLegsLost) {
            case '':
                break;
            case 'A':
                handicap -= 2;
                break;
            case 'AA':
                handicap -= 7;
                break;
            case 'L':
                handicap -= 3;
                break;
            case 'AL':
                handicap -= 7;
                break;
            case 'LL':
                handicap -= 7;
                break;
            case 'ALL':
                handicap -= 8;
                break;
            case 'AAL':
                handicap -= 9;
                break;
            case 'AALL':
                handicap -= 10;
                break;
        }
        if (arms > 2) handicap -= 2 * (arms - 2);

        if (this === State.variables.mc) {
            if (State.variables.menstruating) {
                handicap -= 2;
            }

            if (this.isPregnant) {
                if (this.daysConsideredPregnant >= 240) {
                    handicap -= 4;
                } else if (this.daysConsideredPregnant >= 180) {
                    handicap -= 3;
                } else if (this.daysConsideredPregnant >= 120) {
                    handicap -= 2;
                } else if (this.daysConsideredPregnant > 90) {
                    // nothing
                } else if (this.daysConsideredPregnant >= 45) {
                    handicap -= 1;
                }
            }
            if (State.variables.MaximCycleT_flag) {
                if (State.variables.MaximCycleT - State.variables.time >= 28) {
                    handicap -= 2;
                } else if (State.variables.MaximCycleT - State.variables.time >= 14) {
                    handicap -= 1;
                }
            }
        }
        return Math.max(-10, handicap);
    }

    /**
     * Returns the penalty to the movement of this character.
     * @returns {number} The penalty or bonus to this character's movement.
     */
    get movementHandicap() {
        let handicap = 0;
        let eyes = this.eyeCount;
        if (eyes < 2) {
            if (this !== State.variables.mc || !State.variables.BionicEye) {
                handicap -= 1;
            }
        }
        if (eyes < 1) {
            if (this !== State.variables.mc || !State.variables.BionicEye) {
                handicap -= 4;
                if (this === State.variables.mc && State.variables.BDwear) {
                    handicap += 3;
                }
            }
        }
        handicap = this.events.reduce((v, e) => e.changeMovementHandicap(v), handicap)

        if (this === State.variables.mc) {
            if (State.variables.BionicArm) handicap += 3;
        }

        let trueFitness = this.curses.some(c => c.name === 'Weakling') ? 0 : this.fit;
        handicap += trueFitness / 4 - 1.25

        let arms = this.armCount;
        let legs = this.legCount;
        let armsLegsLost = ''
        if (arms < 2) armsLegsLost += 'A';
        if (arms < 1) armsLegsLost += 'A';
        if (this !== State.variables.mc || !State.variables.DaedalusEquip) {
            if (legs < 2) armsLegsLost += 'L';
            if (legs < 1) armsLegsLost += 'L';
        }

        switch (armsLegsLost) {
            case '':
                break;
            case 'A':
                handicap -= 1;
                break;
            case 'AA':
                handicap -= 3;
                break;
            case 'L':
                handicap -= 5;
                break;
            case 'AL':
                handicap -= 8;
                break;
            case 'LL':
                handicap -= 9;
                break;
            case 'ALL':
                handicap -= 10;
                break;
            case 'AAL':
                handicap -= 9;
                break;
            case 'AALL':
                handicap -= 10;
                break;
        }
        if (arms > 2) handicap -= (arms - 2);

        if (this === State.variables.mc) {
            if (this.isPregnant) {
                if (this.daysConsideredPregnant >= 240) {
                    handicap -= 5;
                } else if (this.daysConsideredPregnant >= 180) {
                    handicap -= 3;
                } else if (this.daysConsideredPregnant >= 120) {
                    handicap -= 2;
                } else if (this.daysConsideredPregnant > 90) {
                    // nothing
                } else if (this.daysConsideredPregnant >= 45) {
                    handicap -= 4;
                } else if (this.daysConsideredPregnant >= 35) {
                    handicap -= 2;
                }
            }
            if (State.variables.MaximCycleT_flag) {
                if (State.variables.MaximCycleT - State.variables.time >= 28) {
                    handicap -= 3;
                } else if (State.variables.MaximCycleT - State.variables.time >= 14) {
                    handicap -= 2;
                }
            }

            if (State.variables.DaedalusEquip) {
                handicap = Math.max(0, handicap);
            }
        }
        return Math.max(-10, handicap);
    }

    /**
     * Returns the penalty to the carry capacity of this character.
     * @returns {number} The penalty or bonus to this character's carry capacity.
     */
    get carryHandicap() {
        let handicap = 0;
        handicap = this.events.reduce((v, e) => e.changeCarryHandicap(v), handicap)

        if (this === State.variables.mc) {
            if (State.variables.BionicArm) handicap += 100;
        }

        let arms = this.armCount;
        let legs = this.legCount;
        let armsLegsLost = ''
        if (arms < 2) armsLegsLost += 'A';
        if (arms < 1) armsLegsLost += 'A';
        if (this !== State.variables.mc || !State.variables.DaedalusEquip) {
            if (legs < 2) armsLegsLost += 'L';
            if (legs < 1) armsLegsLost += 'L';
        }

        switch (armsLegsLost) {
            case '':
                break;
            case 'A':
                handicap -= 2;
                break;
            case 'AA':
                handicap -= 7;
                break;
            case 'L':
                handicap -= 3;
                break;
            case 'AL':
                handicap -= 7;
                break;
            case 'LL':
                handicap -= 7;
                break;
            case 'ALL':
                handicap -= 9;
                break;
            case 'AAL':
                handicap -= 10;
                break;
            case 'AALL':
                handicap -= 10;
                break;
        }
        if (arms > 2) handicap -= (arms - 2);

        if (this === State.variables.mc) {
            if (this.isPregnant) {
                if (this.daysConsideredPregnant >= 240) {
                    handicap -= 5;
                } else if (this.daysConsideredPregnant >= 180) {
                    handicap -= 3;
                } else if (this.daysConsideredPregnant >= 120) {
                    handicap -= 2;
                } else if (this.daysConsideredPregnant > 90) {
                    // nothing
                } else if (this.daysConsideredPregnant >= 45) {
                    handicap -= 3;
                } else if (this.daysConsideredPregnant >= 35) {
                    handicap -= 2;
                }
            }
            if (State.variables.MaximCycleT_flag) {
                if (State.variables.MaximCycleT - State.variables.time >= 28) {
                    handicap -= 3;
                } else if (State.variables.MaximCycleT - State.variables.time >= 14) {
                    handicap -= 2;
                }
            }
        }
        return Math.max(-10, handicap);
    }

    /**
     * Returns the number of eyes this character has.
     * @returns {number} The number of eyes on this character.
     */
    get eyeCount() {
        let eyes = this.events.reduce((v, e) => e.removeEye(v), 2);
        if (this === State.variables.mc && State.variables.BionicEye && eyes < 2) eyes++;
        return eyes;
    }

    /**
     * Returns the number of arms this character has.
     * @returns {number} The number of arms on this character.
     */
    get armCount() {
        let arms = this.events.reduce((v, e) => e.removeArm(v), 2);
        if (this === State.variables.mc && State.variables.BionicArm && arms < 2) arms++;
        return arms;
    }

    /**
     * Returns the number of legs this character has.
     * @returns {number} The number of legs on this character.
     */
    get legCount() {
        return this.events.reduce((v, e) => e.removeLeg(v), 2);
    }
}
