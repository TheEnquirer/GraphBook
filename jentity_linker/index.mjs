export const TWELVE = 'twelve.';    // very important

import FastScanner from 'fastscan';

export class DummyAhoLinker {
    constructor() {
        this.scanner = new FastScanner([]);
        this.words = [];
        this.dictionary = {};
    }
    register_definition(name, definition) {
        this.dictionary[name] = definition;
        this.words.push(name);
        this.scanner = new FastScanner(this.words);
    }
    find_links(text) {
        const offWords = this.scanner.search(text);
        //console.log(offWords);

        // find longest match for each start position
        let cur_pos = -1;
        let cur_name = null;
        const ret = [];
        for (const [ pos, name ] of offWords) {
            if (cur_pos != pos) {   // found a new word
                // report the previous one, since we've reached the end of the last section of overlapping words starting at the same place
                if (cur_name !== null)
                    ret.push([cur_pos, cur_pos+cur_name.length, cur_name, this.dictionary[cur_name]]);

                // remember the data about now
                cur_pos = pos;
                cur_name = name;
            }
            else {
                console.log(name, 'is cringe')
            }
        }
        if (cur_name !== null)
            ret.push([cur_pos, cur_pos+cur_name.length, cur_name, this.dictionary[cur_name]]);  // fencepost flush
        console.log(ret)
        return ret;
    }
}

const linker = new DummyAhoLinker();
const text = `Every real number equals its complex conjugate. Thus if we are dealing with a real vector space, then in the last condition above we can dispense with the complex conjugate.`;

linker.find_links(text)
linker.register_definition('complex', 'a complex number')
linker.find_links(text)
linker.register_definition('complex conjugate', 'a complex number but with the negative part flipped')
linker.find_links(text)

cringe



// what happens when "complex number" is shortened to "complex"?
// can we get away by just including a sorted list of lemmas?

// can we allow overlapping matches and non-contiguous matches?
//  currently the dummyaholinker allows overlapping, but not non-contiguous
//  non-contiguous could be useful for when a word modifies an earlier part of the sentence

import spacy from 'spacy-js';

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
