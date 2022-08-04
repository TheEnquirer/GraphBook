import FastScanner from 'fastscan';
import { nanoid } from 'nanoid';
import { List } from 'immutable';

import nlp from 'compromise';
import { stemmer } from 'stemmer';

import { useMemo } from 'react';

export const TWELVE = 'twelve.';    // very important

export class DummyAhoLinker {
    constructor() {
        this.scanner = new FastScanner([]);
        this.words = [];
        this.dictionary = {};
    }
    register_definitions(names_and_defs) {
        for (const [name, def] of names_and_defs) {
            this.dictionary[name] = def;
            this.words.push(name);
        }
        this.scanner = new FastScanner(this.words);
    }
    find_links(text) {
        return this.scanner.search(text)
            // replace previous if idx is the same, append if it isn't
            .reduce((a, c) => a.size > 0 && a.last()[0] == c[0] ? a.set(a.size-1, c) : a.push(c), List())
            // map to the output format of [begin_inc, end_exc, name, definition]
            .map(([idx, name]) => [idx, idx+name.length, name, this.dictionary[name]]);
    }
}

//const linker = new DummyAhoLinker();
//const text = `Every real number equals its complex conjugate. Thus if we are dealing with a real vector space, then in the last condition above we can dispense with the complex conjugate.`;
//console.log(linker.find_links(text))
//linker.register_definition('complex', 'a complex number')
//console.log(linker.find_links(text))
//linker.register_definition('complex conjugate', 'a complex number but with the negative part flipped')
//console.log(linker.find_links(text))



// what happens when "complex number" is shortened to "complex"?
// can we get away by just including a sorted list of lemmas?

// can we allow overlapping matches and non-contiguous matches?
//  currently the dummyaholinker allows overlapping, but not non-contiguous
//  non-contiguous could be useful for when a word modifies an earlier part of the sentence

// ideating
// hash-trie of lematized words that refer to other words? for quick search
// eg. "commutativity of scalar addition" -> { addition: { scalar: commutativity: Symbol } }
//
// but how to deal with associativity?
// commutativity of (scalar addition) vs smt else??
// (conjugate symmetry) of (inner products), vs conjugate (symmetry of inner products)
//
// maybe i'll need to store serialized keys as trees... but lets see whether we can even do lemmatization, POS, and referencing first

// looks like spacy has dependency parsing ... but the js package still runs nlp in python ... figures
//
//
// options for nlp libs
// - spacy: js integration is scuffed, certainly need a python server somewhere; spacy-js seems broken so lets try spacy-nlp
// - wink-nlp: js first, but it certainly isn't as complete as spacy and may not have dependencies... i suspect wink won't be able to get us dependencies
// - compromise (https://github.com/spencermountain/compromise): browser first, similar limitations to wink (but it looks like an even smaller ecosystem). compromise has a limited wordlist so it probably won't be able to lemmatize textbooks which have obscure words

//  okay, lets go for wink. i think we can get away with not using dependency parsing 
//  options to look into   
//  - stemming vs lemmatization
//      stemming is rule-based and thus should work on out-of-dict words. it's also faster. only downside is that stems may not be actual words, but that's okay because we're probably gonna shuffle the lemattized words anyways?
//  - stop word removal
//      we might not need this if we have templated noun chunks

//export class LessDummyAhoLinker {
//    constructor() {
//        console.log("this isn't implemented")
//        this.dictionary = {};
//        this.words = [];
//        this.scanner = nlp.compile(this.words);
//    }
//    register_definitions(names_and_defs) {
//        for (const [name, def] of names_and_defs) {
//            this.dictionary[name] = def;
//            this.words.push(nlp(name).compute('root').json()[0].terms.map(t => t.root || t.normal).join(' '));
//        }
//        //console.log(this.words);
//        this.scanner = nlp.compile(this.words);
//    }
//    find_links(text) {
//        const doc = nlp(text)
//        doc.compute('root')
//        let m = doc.lookup(this.words, {form:'root'})
//        return m.json();    // not sure how to get indicies out
//    }
//}

// ALSO TODO is returning indicies really the best interface like... maybe return a map function to go from found samples to spans or smt

export class SlowStemSaladLinker {
    // assumptions
    // definitions have few words 
    // definitions will always be more fully qualified than their references
    // no deletion bc sequentially indexed thingies
    constructor() {
        console.log("hewooooooooooooooooorlddd")
        this.dictionary = [];
        this.stems = [];
        this.stem_postings = {};
        //this.dictionary = {};   // nanoid -> definition
        //this.stems = {};        // nanoid -> stems list
        // TODO: some kind of fast query subset overlap DS? or bloom filter
    }
    register_definitions(names_and_defs) {
        for (const [name, def] of names_and_defs) {
            const id = this.dictionary.length;
            this.dictionary.push(def);

            const stems = name.split(/\s+/).map(stemmer);
            //const stems = nlp(name).terms().out('array').map(stemmer)
            this.stems.push(stems);

            for (const stem of stems) {
                if (!this.stem_postings.hasOwnProperty(stem))
                    this.stem_postings[stem] = [];
                this.stem_postings[stem].push(stem);
            }
        }
    }
    find_links(text) {

        //const terms = nlp(text).terms().out('array');
        //const stems = terms.map(stemmer);

        console.log(nlp(text).json().map(j => j.terms.map(t => `${t.normal} ${t.tags}`)))

        const terms = nlp(text).match('(#Adjective|#Possessive)* #Noun+').json({ offset: true })
        //const terms = nlp(text).nouns().parse()[0];
        //console.log(terms.determiner, terms.adjectives, terms.root)
        //const terms = nlp(text).match('#Adjective #Noun').out('array');

        //const got = nlp(text)
        //    .match()
        //    .out('array');
        return terms;

        //console.log(nlp(text).chunks().out('array'))
        //console.log(nlp(text).terms().out('array'))
        //console.log(nlp(text).nouns().out('array'))
        //return this.scanner.search(text)
        //    // replace previous if idx is the same, append if it isn't
        //    .reduce((a, c) => a.size > 0 && a.last()[0] == c[0] ? a.set(a.size-1, c) : a.push(c), List())
        //    // map to the output format of [begin_inc, end_exc, name, definition]
        //    .map(([idx, name]) => [idx, idx+name.length, name, this.dictionary[name]]);
    }
}

const linker = new SlowStemSaladLinker();
const text = `Every real number equals its complex conjugate. Thus if we are dealing with a real vector space, then in the last condition above we can dispense with the complex conjugation, since the conjugation of a number that isn't complex does nothing.`;
console.log(linker.find_links(text))
linker.register_definitions([['complex', 'a complex number']])
console.log(linker.find_links(text))
linker.register_definitions([['complex conjugate', 'a complex number but with the negative part flipped']])
console.log(linker.find_links(text))

console.log(stemmer('conjugate'), stemmer('conjugated'), stemmer('conjugation'))

// consider looking into natural (https://www.npmjs.com/package/natural), which has both stemming and POS, but is for node. there's probably others, but compromise is really pretty :)




//class Linker {
//    constructor() {
//        this.dictionary = {};
//        this.match_trie = {};
//    }
//    async parse_text(text) {
//        // TODO
//    }
//    async register_definition(name, definition) {
//        const sem = parse_text(name);
//        this.dictionary[name] = definition;
//
//        for (const tok of sem) {    // or smt TODO
//            this.match_trie[tok] = 3;   // TOOD
//        }
//    }
//}
//
//const linker = new Linker();
//const text = `Every real number equals its com- plex conjugate. Thus if we are dealing with a real vector space, then in the last condition above we can dispense with the complex conjugate.`;
//
//import spacyNLP from 'spacy-nlp';
//// default port 6466
//// start the server with the python client that exposes spacyIO (or use an existing socketIO server at IOPORT)
//var serverPromise = spacyNLP.server({ port: process.env.IOPORT });
//// Loading spacy may take up to 15s
//
////(async function() {
////    const nlp = spacy.load('en_core_web_sm');
////    const doc = await nlp('This is a text about Facebook.');
////    for (let ent of doc.ents) {
////        console.log(ent.text, ent.label);
////    }
////    for (let token of doc) {
////        console.log(token.text, token.pos, token.head.text);
////    }
////})();
